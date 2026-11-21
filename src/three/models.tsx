import { useEffect, useMemo, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import type { ProductAsset } from '../data/products';

/** Tamaño en unidades de escena para una imagen de proporción dada. */
function fit(aspect: number, maxW = 2.9, maxH = 2.25): [number, number] {
  let h = maxH;
  let w = h * aspect;
  if (w > maxW) {
    w = maxW;
    h = w / aspect;
  }
  return [w, h];
}

function usePhoto(url: string) {
  const tex = useLoader(THREE.TextureLoader, url);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  }, [tex]);
  return tex;
}

/* ─────────── Extrusión: foto frontal + contorno + fondo real ─────────── */

/** Sólido extruido del equipo: geometría, materiales y medidas en unidades de escena. */
export function useExtrudeSolid(url: string, asset: ProductAsset) {
  const tex = usePhoto(url);
  const [W, H] = fit(asset.w / asset.h);
  const dims = asset.dims ?? [1, 1, 0.3];
  // Caja real de la silueta dentro de la foto (la foto puede traer margen o sombra)
  const box = useMemo(() => {
    const c = asset.contour ?? [];
    if (!c.length) return { cx: 0, cy: 0, w: W, h: H };
    const xs = c.map((q) => q[0]);
    const ys = c.map((q) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    return { cx: ((x0 + x1) / 2 - 0.5) * W, cy: (0.5 - (y0 + y1) / 2) * H, w: (x1 - x0) * W, h: (y1 - y0) * H };
  }, [asset, W, H]);
  const depth = Math.min(Math.max((box.w * dims[2]) / dims[0], 0.12), 1.5);

  const geometry = useMemo(() => {
    const pts = (asset.contour ?? []).map(([x, y]) => new THREE.Vector2((x - 0.5) * W, (0.5 - y) * H));
    const shape = new THREE.Shape(pts);
    const bevel = Math.min(0.022, depth * 0.12);
    const inset = 0.05;
    const uvOf = (x: number, y: number, k: number) => new THREE.Vector2((x * (1 - k)) / W + 0.5, (y * (1 - k)) / H + 0.5);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: depth - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelOffset: -bevel,
      bevelSegments: 3,
      steps: 1,
      UVGenerator: {
        generateTopUV(_g, v, a, b, c) {
          return [a, b, c].map((i) => uvOf(v[i * 3], v[i * 3 + 1], 0));
        },
        generateSideWallUV(_g, v, a, b, c, d) {
          return [a, b, c, d].map((i) => uvOf(v[i * 3], v[i * 3 + 1], inset));
        },
      },
    });
    geo.translate(0, 0, -(depth / 2 - bevel));
    return geo;
  }, [asset, W, H, depth]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const materials = useMemo(() => {
    const front = new THREE.MeshStandardMaterial({
      map: tex,
      color: new THREE.Color(0.62, 0.62, 0.62),
      emissive: new THREE.Color(1, 1, 1),
      emissiveMap: tex,
      emissiveIntensity: 0.42,
      roughness: 0.42,
      metalness: 0.05,
      envMapIntensity: 0.9,
    });
    const side = new THREE.MeshStandardMaterial({
      map: tex,
      color: new THREE.Color(0.86, 0.86, 0.86),
      emissive: new THREE.Color(1, 1, 1),
      emissiveMap: tex,
      emissiveIntensity: 0.1,
      roughness: 0.5,
      metalness: 0.1,
      envMapIntensity: 1.1,
    });
    return [front, side];
  }, [tex]);

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  return { geometry, materials, W, H, depth, box };
}

export function ExtrudeModel({ url, asset }: { url: string; asset: ProductAsset }) {
  const { geometry, materials } = useExtrudeSolid(url, asset);
  return <mesh geometry={geometry} material={materials} castShadow />;
}

/* ─────────── Relieve: foto en ¾ + mapa de profundidad ─────────── */

function useDepth(url: string) {
  const [data, setData] = useState<ImageData | null>(null);
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => {
      if (!alive) return;
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      setData(ctx.getImageData(0, 0, c.width, c.height));
    };
    img.src = url;
    return () => {
      alive = false;
    };
  }, [url]);
  return data;
}

export function ReliefModel({ url, depthUrl, asset }: { url: string; depthUrl: string; asset: ProductAsset }) {
  const tex = usePhoto(url);
  const depth = useDepth(depthUrl);
  const [W, H] = fit(asset.w / asset.h);

  const geos = useMemo(() => {
    if (!depth) return null;
    const { width: dw, height: dh, data } = depth;
    const long = 200;
    const nx = Math.max(2, Math.round(dw >= dh ? long : (long * dw) / dh));
    const ny = Math.max(2, Math.round(dh >= dw ? long : (long * dh) / dw));
    const zs = Math.min(W, H) * 0.27;
    // El mapa trae un zócalo en el borde de la silueta; se recorta para que el canto
    // no se estire como una pared al girar.
    const lift = (d: number) => Math.max(0, d - 0.2) / 0.8;
    const sample = (u: number, v: number) => {
      const x = Math.min(dw - 1, Math.max(0, u * (dw - 1)));
      const y = Math.min(dh - 1, Math.max(0, v * (dh - 1)));
      const x0 = Math.floor(x), y0 = Math.floor(y);
      const x1 = Math.min(dw - 1, x0 + 1), y1 = Math.min(dh - 1, y0 + 1);
      const fx = x - x0, fy = y - y0;
      const p = (xx: number, yy: number) => data[(yy * dw + xx) * 4] / 255;
      return (p(x0, y0) * (1 - fx) + p(x1, y0) * fx) * (1 - fy) + (p(x0, y1) * (1 - fx) + p(x1, y1) * fx) * fy;
    };
    const count = (nx + 1) * (ny + 1);
    const pos = new Float32Array(count * 3);
    const back = new Float32Array(count * 3);
    const uv = new Float32Array(count * 2);
    const inside = new Uint8Array(count);
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const k = j * (nx + 1) + i;
        const u = i / nx, v = j / ny;
        const d = sample(u, v);
        const z = lift(d) * zs;
        pos[k * 3] = (u - 0.5) * W;
        pos[k * 3 + 1] = (0.5 - v) * H;
        pos[k * 3 + 2] = z;
        back[k * 3] = pos[k * 3];
        back[k * 3 + 1] = pos[k * 3 + 1];
        back[k * 3 + 2] = -z * 0.45;
        uv[k * 2] = u;
        uv[k * 2 + 1] = 1 - v;
        inside[k] = d > 0.012 ? 1 : 0;
      }
    }
    const idx: number[] = [];
    const idxBack: number[] = [];
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
        if (inside[a] + inside[b] + inside[c] + inside[d] === 0) continue;
        idx.push(a, c, b, b, c, d);
        idxBack.push(a, b, c, b, d, c);
      }
    }
    const mk = (p: Float32Array, ix: number[]) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      g.setIndex(ix);
      g.computeVertexNormals();
      return g;
    };
    const front = mk(pos, idx);
    const rear = mk(back, idxBack);
    const offset = -zs * 0.45;
    front.translate(0, 0, offset);
    rear.translate(0, 0, offset);
    return { front, rear };
  }, [depth, W, H]);

  useEffect(
    () => () => {
      geos?.front.dispose();
      geos?.rear.dispose();
    },
    [geos],
  );

  if (!geos) return null;
  return (
    <group>
      <mesh geometry={geos.front} castShadow>
        <meshStandardMaterial
          map={tex}
          alphaTest={0.5}
          color={new THREE.Color(0.6, 0.6, 0.6)}
          emissive={new THREE.Color(1, 1, 1)}
          emissiveMap={tex}
          emissiveIntensity={0.45}
          roughness={0.5}
          metalness={0.08}
          envMapIntensity={0.8}
        />
      </mesh>
      <mesh geometry={geos.rear}>
        <meshStandardMaterial map={tex} alphaTest={0.5} color="#161616" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ─────────── Panel solar: modelo procedural ─────────── */

function panelTexture(cols: number, rows: number, aspect: number) {
  const cw = 1024;
  const ch = Math.round(cw / aspect);
  const c = document.createElement('canvas');
  c.width = cw;
  c.height = ch;
  const g = c.getContext('2d')!;
  g.fillStyle = '#2b3650';
  g.fillRect(0, 0, cw, ch);
  const m = cw * 0.022;
  const mid = cw * 0.016;
  const gap = cw * 0.005;
  const cellW = (cw - m * 2) / cols;
  const half = rows / 2;
  const cellH = (ch - m * 2 - mid) / rows;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const x = m + col * cellW + gap / 2;
      const y = m + r * cellH + (r >= half ? mid : 0) + gap / 2;
      const w = cellW - gap, h = cellH - gap;
      const grad = g.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, '#16233f');
      grad.addColorStop(0.5, '#0e1830');
      grad.addColorStop(1, '#1c2d55');
      g.fillStyle = grad;
      g.fillRect(x, y, w, h);
      g.strokeStyle = 'rgba(200,214,235,0.3)';
      g.lineWidth = 1;
      const bars = 10;
      for (let b = 1; b < bars; b++) {
        const bx = Math.round(x + (w * b) / bars) + 0.5;
        g.beginPath();
        g.moveTo(bx, y);
        g.lineTo(bx, y + h);
        g.stroke();
      }
    }
  }
  g.fillStyle = 'rgba(205,214,224,0.5)';
  g.fillRect(m, m + half * cellH + mid * 0.42, cw - m * 2, mid * 0.16);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function PanelModel({ asset }: { asset: ProductAsset }) {
  const dims = asset.dims ?? [1134, 2278, 35];
  const cfg = asset.panel ?? { cols: 6, rows: 24 };
  const H = 2.5;
  const W = (H * dims[0]) / dims[1];
  const T = Math.max((H * dims[2]) / dims[1], 0.03) * 1.5;
  const f = 0.022;
  const tex = useMemo(() => panelTexture(cfg.cols, cfg.rows, (W - f * 2) / (H - f * 2)), [cfg.cols, cfg.rows, W, H]);
  useEffect(() => () => tex.dispose(), [tex]);

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial color="#c4cad0" metalness={0.92} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0, T / 2 + 0.0015]}>
        <planeGeometry args={[W - f * 2, H - f * 2]} />
        <meshPhysicalMaterial map={tex} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.35} roughness={0.2} metalness={0.05} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[0, 0, -T / 2 - 0.0015]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W - f * 2, H - f * 2]} />
        <meshStandardMaterial color="#e9ecee" roughness={0.75} />
      </mesh>
      <mesh position={[0, H * 0.3, -T / 2 - 0.022]}>
        <boxGeometry args={[W * 0.2, H * 0.035, 0.04]} />
        <meshStandardMaterial color="#17191c" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ─────────── Foto: la imagen del equipo tal cual, sin relieve ─────────── */

export function PhotoModel({ url, asset }: { url: string; asset: ProductAsset }) {
  const tex = usePhoto(url);
  const [W, H] = fit(asset.w / asset.h);
  return (
    <mesh>
      <planeGeometry args={[W, H]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

export function ProductModel({ slug, asset }: { slug: string; asset: ProductAsset }) {
  const url = `/products/${slug}.webp`;
  if (asset.mode === 'photo') return <PhotoModel url={url} asset={asset} />;
  if (asset.mode === 'panel') return <PanelModel asset={asset} />;
  if (asset.mode === 'relief' && asset.depth) return <ReliefModel url={url} depthUrl={`/products/${asset.depth}`} asset={asset} />;
  return <ExtrudeModel url={url} asset={asset} />;
}

/** Altura aproximada del modelo, para colocar el piso. */
export function modelHeight(asset: ProductAsset): number {
  if (asset.mode === 'panel') return 2.5;
  return fit(asset.w / asset.h)[1];
}
