import { createContext, Suspense, useContext, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { assets } from '../data/products';
import { ORDEN, piezaEnProgreso, type PiezaId } from '../data/despiece';
import { useExtrudeSolid } from './models';

/* Despiece de planta diésel guiado por scroll.
   La cabina es el sólido real del producto (foto + medidas). Las piezas internas
   son una representación esquemática hecha con primitivas, a escala de la cabina. */

const GREEN = new THREE.Color('#A6DB40');
const EDGE = new THREE.Color('#aab0a9');
const DIM = new THREE.Color('#0d0f0d');

type Tone = 'main' | 'dark' | 'light';
type V3 = [number, number, number];

interface Mats {
  main: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  light: THREE.MeshStandardMaterial;
  edge: THREE.LineBasicMaterial;
  green: THREE.MeshBasicMaterial;
  red: THREE.MeshBasicMaterial;
  white: THREE.MeshBasicMaterial;
  base: Record<Tone, THREE.Color>;
}

type Accent = 'green' | 'red' | 'white';
const ALL_MATS = ['main', 'dark', 'light', 'edge', 'green', 'red', 'white'] as const;

interface Handle {
  group: THREE.Group;
  mats: Mats;
  out: THREE.Vector3;
  glow: number;
  /** 1 visible, 0 oculta: las demás piezas se desvanecen al acercar una */
  fade: number;
}

type Registry = MutableRefObject<Map<PiezaId, Handle>>;

const PartCtx = createContext<Mats | null>(null);

function makeMats(): Mats {
  const mk = (hex: string, metalness: number, roughness: number) =>
    new THREE.MeshStandardMaterial({ color: hex, metalness, roughness, envMapIntensity: 1 });
  return {
    main: mk('#565c56', 0.55, 0.48),
    dark: mk('#262a26', 0.5, 0.6),
    light: mk('#9aa19a', 0.75, 0.34),
    edge: new THREE.LineBasicMaterial({ color: EDGE, transparent: true, opacity: 0.7 }),
    green: new THREE.MeshBasicMaterial({ color: '#A6DB40' }),
    red: new THREE.MeshBasicMaterial({ color: '#e5402f' }),
    white: new THREE.MeshBasicMaterial({ color: '#dfe3df' }),
    base: { main: new THREE.Color('#565c56'), dark: new THREE.Color('#262a26'), light: new THREE.Color('#9aa19a') },
  };
}

interface Picking {
  /** true cuando la planta ya está abierta y las piezas se pueden tocar */
  open: MutableRefObject<boolean>;
  onPick: (id: PiezaId) => void;
}

const PickCtx = createContext<Picking | null>(null);

function Part({ id, out, registry, position, children }: { id: PiezaId; out: V3; registry: Registry; position: V3; children: ReactNode }) {
  const pick = useContext(PickCtx);
  const gl = useThree((st) => st.gl);
  const ref = useRef<THREE.Group>(null);
  const mats = useMemo(makeMats, []);
  useEffect(() => {
    const map = registry.current;
    if (ref.current) map.set(id, { group: ref.current, mats, out: new THREE.Vector3(...out), glow: 0, fade: 1 });
    return () => {
      map.delete(id);
    };
    // `out` es un literal estable por pieza
  }, [id, mats, registry, out[0], out[1], out[2]]);
  useEffect(
    () => () => {
      ALL_MATS.forEach((k) => mats[k].dispose());
    },
    [mats],
  );
  return (
    <group position={position}>
      <group
        ref={ref}
        onClick={(ev) => {
          if (!pick?.open.current) return;
          ev.stopPropagation();
          if (ev.delta > 8) return; // fue un arrastre, no un toque
          pick.onPick(id);
        }}
        onPointerOver={(ev) => {
          if (!pick?.open.current) return;
          ev.stopPropagation();
          gl.domElement.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          gl.domElement.style.cursor = '';
        }}
      >
        <PartCtx.Provider value={mats}>{children}</PartCtx.Provider>
      </group>
    </group>
  );
}

type Kind = 'box' | 'cyl' | 'cylX' | 'cylZ' | 'ringX';

/** Sólido con sus aristas dibujadas. cyl*: [radio, largo, radioOpuesto?]. ringX: [radio, grosor]. */
function Solid({
  kind = 'box',
  args,
  tone = 'main',
  position,
  rotation,
  accent,
}: {
  kind?: Kind;
  args: number[];
  tone?: Tone;
  position?: V3;
  rotation?: V3;
  /** detalle de color plano (pantalla, botón, borne), sin aristas */
  accent?: Accent;
}) {
  const mats = useContext(PartCtx)!;
  const key = args.map((n) => n.toFixed(4)).join(',');
  const [geo, edges] = useMemo(() => {
    let g: THREE.BufferGeometry;
    if (kind === 'box') g = new THREE.BoxGeometry(args[0], args[1], args[2]);
    else if (kind === 'ringX') {
      g = new THREE.TorusGeometry(args[0], args[1], 10, 44);
      g.rotateY(Math.PI / 2);
    } else {
      g = new THREE.CylinderGeometry(args[2] ?? args[0], args[0], args[1], 30);
      if (kind === 'cylX') g.rotateZ(Math.PI / 2);
      if (kind === 'cylZ') g.rotateX(Math.PI / 2);
    }
    return [g, kind === 'ringX' ? null : new THREE.EdgesGeometry(g, 30)] as const;
  }, [kind, key]);
  useEffect(
    () => () => {
      geo.dispose();
      edges?.dispose();
    },
    [geo, edges],
  );
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} material={accent ? mats[accent] : mats[tone]} />
      {edges && !accent && <lineSegments geometry={edges} material={mats.edge} raycast={noRaycast} />}
    </group>
  );
}

/** Aletas del radiador: líneas verticales en las dos caras. */
function Fins({ x, h, d, n = 26 }: { x: number; h: number; d: number; n?: number }) {
  const mats = useContext(PartCtx)!;
  const geo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 1; i < n; i++) {
      const z = -d / 2 + (d * i) / n;
      for (const sx of [-x, x]) pts.push(sx, -h / 2, z, sx, h / 2, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [x, h, d, n]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <lineSegments geometry={geo} material={mats.edge} raycast={noRaycast} />;
}

const noRaycast = () => null;

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

interface SceneProps {
  slug: string;
  progress: MutableRefObject<number>;
  drag: MutableRefObject<number>;
  /** pieza a la que la cámara debe acercarse, o null */
  zoom: MutableRefObject<PiezaId | null>;
  onPick: (id: PiezaId) => void;
}

const CAM_DIR = new THREE.Vector3(0, 1.9, 10.5).normalize();
const CAM_DIST = Math.hypot(1.9, 10.5);

function Scene({ slug, progress, drag, zoom, onPick }: SceneProps) {
  const asset = assets[slug];
  const { geometry, materials, depth: D, box } = useExtrudeSolid(`/products/${slug}.webp`, asset);
  // Las piezas se dimensionan con la caja real de la cabina, no con la foto completa
  const L = box.w;
  const H = box.h;
  const registry = useRef(new Map<PiezaId, Handle>());
  const rig = useRef<THREE.Group>(null);
  const canopy = useRef<THREE.Mesh>(null);
  const fan = useRef<THREE.Group>(null);
  const { viewport, size, camera } = useThree();
  const open = useRef(false);
  const picking = useMemo(() => ({ open, onPick }), [onPick]);
  const cam = useRef({ look: new THREE.Vector3(), dist: CAM_DIST, want: new THREE.Vector3(), tmp: new THREE.Vector3() });

  const narrow = size.width < 760;
  // En escritorio la tarjeta de datos ocupa ~420 px a la izquierda: el conjunto se ajusta y se centra en el resto
  const side = narrow ? 0 : Math.min(0.45, 420 / size.width);
  const fitScale = narrow ? Math.min(1, viewport.width / 5.2, viewport.height / 5.4) : Math.min(1, (viewport.width * (1 - side)) / 5.9);
  // Lleva cualquier cabina a un tamaño de escena parecido
  const norm = Math.min(2.9 / L, 1.5 / H);
  const shiftX = (viewport.width * side) / 2;
  const shiftY = narrow ? viewport.height * 0.13 : 0.1;

  useEffect(() => {
    materials.forEach((m) => {
      m.transparent = true;
    });
  }, [materials]);

  useFrame((_, dt) => {
    const p = progress.current;
    const lift = smooth(0.012, 0.125, p);
    const e = smooth(0.09, 0.235, p);
    const active = ORDEN[piezaEnProgreso(p, ORDEN.length)];
    const k = Math.min(1, dt * 6);

    const c = canopy.current;
    if (c) {
      const op = (1 - lift * 0.9) * (1 - smooth(0.55, 1, e));
      c.position.y = lift * H * 1.15;
      c.visible = op > 0.012;
      materials.forEach((m) => {
        m.opacity = op;
        m.depthWrite = op > 0.97;
      });
    }

    const focusing = e > 0.5 && active !== 'cabina';
    const zoomId = e > 0.6 ? zoom.current : null;
    registry.current.forEach((h, id) => {
      h.group.position.copy(h.out).multiplyScalar(e);
      // de cerca el verde baja para que se lean las formas de la pieza
      h.glow += ((focusing && id === active ? (zoomId ? 0.22 : 1) : 0) - h.glow) * k;
      // al acercar una pieza, las demás se desvanecen para no tapar la vista
      h.fade += ((zoomId && id !== zoomId ? 0 : 1) - h.fade) * Math.min(1, dt * 7);
      const solid = h.fade > 0.99;
      h.group.visible = h.fade > 0.03;
      ALL_MATS.forEach((n) => {
        if (n === 'edge') return;
        const m = h.mats[n];
        if (m.transparent === solid) {
          m.transparent = !solid;
          m.needsUpdate = true;
        }
        m.opacity = h.fade;
      });
      const dim = focusing ? 1 - h.glow : 0;
      (['main', 'dark', 'light'] as Tone[]).forEach((t) => {
        const m = h.mats[t];
        m.color.copy(h.mats.base[t]).lerp(DIM, dim * 0.45);
        m.emissive.copy(GREEN).multiplyScalar(h.glow * 0.2);
      });
      h.mats.edge.color.copy(EDGE).lerp(GREEN, h.glow);
      h.mats.edge.opacity = (0.7 - dim * 0.42 + h.glow * 0.3) * h.fade;
    });

    const r = rig.current;
    if (r) {
      const az = 0.52 - p * 1.05 + drag.current;
      r.rotation.y += (az - r.rotation.y) * Math.min(1, dt * 5);
      r.scale.setScalar(fitScale * norm * THREE.MathUtils.lerp(narrow ? 1.5 : 1.55, narrow ? 1 : 1.3, e));
    }
    if (fan.current) fan.current.rotation.x += dt * 2.4;

    // Cámara: vista general, o acercamiento a la pieza tocada
    open.current = e > 0.6;
    const cs = cam.current;
    const target = open.current && zoom.current ? registry.current.get(zoom.current) : undefined;
    let wantDist = CAM_DIST;
    cs.want.set(0, 0, 0);
    if (target && r) {
      target.group.getWorldPosition(cs.tmp);
      wantDist = Math.max(2.3, radius[zoom.current as PiezaId] * r.scale.x * (narrow ? 10 : 5.6));
      // el encuadre conserva el mismo desplazamiento que deja libre la tarjeta de datos
      cs.want.set(cs.tmp.x - shiftX * (wantDist / CAM_DIST), cs.tmp.y - shiftY * (wantDist / CAM_DIST), cs.tmp.z);
    }
    const ck = Math.min(1, dt * 4);
    cs.look.lerp(cs.want, ck);
    cs.dist += (wantDist - cs.dist) * ck;
    camera.position.copy(CAM_DIR).multiplyScalar(cs.dist).add(cs.look);
    camera.lookAt(cs.look);
  });

  // Medidas de cada conjunto, relativas a la cabina (L largo, H alto, D fondo)
  const bl = 0.34 * L, bh = 0.3 * H, bd = 0.42 * D; // bloque del motor
  const fr = 0.2 * H; // radio del ventilador
  // Radio aproximado de cada pieza, para decidir cuánto se acerca la cámara
  const radius: Record<PiezaId, number> = {
    cabina: 0.6 * L,
    motor: 0.27 * L,
    radiador: 0.36 * H,
    alternador: 0.2 * L,
    control: 0.13 * L,
    base: 0.52 * L,
    bateria: 0.09 * L,
    escape: 0.24 * L,
  };

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 7]} intensity={2} />
      <directionalLight position={[-6, 3, 2]} intensity={0.7} />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#060706']} />
        <Lightformer intensity={3} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 5, 1]} />
        <Lightformer intensity={2.2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 1.4, 1]} />
        <Lightformer intensity={2.4} position={[6, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[6, 1.6, 1]} />
        <Lightformer intensity={1.2} position={[0, 0.5, 7]} scale={[7, 3, 1]} />
      </Environment>

      <PickCtx.Provider value={picking}>
      <group position={[shiftX, shiftY, 0]}>
        <group ref={rig}>
          <group position={[-box.cx, -box.cy, 0]}>
            <mesh ref={canopy} geometry={geometry} material={materials} renderOrder={2} raycast={noRaycast} />
          </group>

          {/* Base y tanque */}
          <Part id="base" registry={registry} position={[0, -0.43 * H, 0]} out={[0, -0.36 * H, 0]}>
            <Solid args={[0.92 * L, 0.07 * H, 0.07 * D]} position={[0, 0, 0.38 * D]} tone="dark" />
            <Solid args={[0.92 * L, 0.07 * H, 0.07 * D]} position={[0, 0, -0.38 * D]} tone="dark" />
            {[-0.42, 0.42].map((x) => (
              <Solid key={x} args={[0.05 * L, 0.05 * H, 0.76 * D]} position={[x * L, 0, 0]} tone="dark" />
            ))}
            <Solid args={[0.6 * L, 0.075 * H, 0.64 * D]} position={[0.02 * L, 0, 0]} tone="light" />
            <Solid kind="cyl" args={[0.028 * D, 0.05 * H]} position={[0.26 * L, 0.055 * H, 0.2 * D]} tone="main" />
            <Solid kind="cyl" args={[0.036 * D, 0.014 * H]} position={[0.26 * L, 0.086 * H, 0.2 * D]} accent="green" />
          </Part>

          {/* Motor */}
          <Part id="motor" registry={registry} position={[0.02 * L, -0.06 * H, 0]} out={[0, 0.1 * H, 0]}>
            <Solid args={[bl, bh, bd]} />
            <Solid args={[bl * 0.86, bh * 0.3, bd * 0.7]} position={[0, -bh * 0.65, 0]} tone="dark" />
            <Solid args={[bl * 0.96, bh * 0.24, bd * 0.8]} position={[0, bh * 0.62, 0]} tone="light" />
            <Solid args={[bl * 0.9, bh * 0.16, bd * 0.5]} position={[0, bh * 0.82, 0]} tone="dark" />
            {[-0.33, -0.11, 0.11, 0.33].map((x) => (
              <Solid key={x} kind="cyl" args={[bd * 0.05, bh * 0.12]} position={[x * bl, bh * 0.96, 0]} tone="light" />
            ))}
            <Solid kind="cylX" args={[bd * 0.09, bl * 0.8]} position={[0, bh * 0.5, bd * 0.56]} tone="light" />
            <Solid kind="cylX" args={[bd * 0.2, bl * 0.3]} position={[-bl * 0.2, bh * 0.98, bd * 0.56]} tone="dark" />
            <Solid args={[bl * 0.8, bh * 0.12, bd * 0.14]} position={[0, bh * 0.5, -bd * 0.57]} tone="dark" />
            <Solid kind="cylX" args={[bh * 0.62, bl * 0.12]} position={[-bl * 0.56, 0, 0]} tone="dark" />
            <Solid kind="cylX" args={[bh * 0.24, bl * 0.05]} position={[bl * 0.53, -bh * 0.2, 0]} tone="light" />
            <Solid kind="cylX" args={[bh * 0.14, bl * 0.05]} position={[bl * 0.53, bh * 0.32, bd * 0.2]} tone="light" />
            <Solid kind="cyl" args={[bd * 0.09, bh * 0.32]} position={[bl * 0.2, -bh * 0.18, bd * 0.59]} tone="light" />
            <Solid kind="cylX" args={[bd * 0.1, bl * 0.26]} position={[-bl * 0.3, -bh * 0.25, -bd * 0.6]} tone="light" />
          </Part>

          {/* Radiador y ventilador */}
          <Part id="radiador" registry={registry} position={[0.38 * L, -0.04 * H, 0]} out={[0.34 * L, 0.05 * H, 0]}>
            <Solid args={[0.035 * L, 0.5 * H, 0.72 * D]} tone="dark" />
            <Fins x={0.0178 * L} h={0.5 * H} d={0.72 * D} />
            <Solid args={[0.05 * L, 0.06 * H, 0.74 * D]} position={[0, 0.28 * H, 0]} />
            <Solid args={[0.05 * L, 0.06 * H, 0.74 * D]} position={[0, -0.28 * H, 0]} />
            <Solid kind="cyl" args={[0.03 * D, 0.03 * H]} position={[0, 0.325 * H, 0.2 * D]} tone="light" />
            <Solid kind="ringX" args={[fr * 1.12, 0.014 * H]} position={[-0.04 * L, 0, 0]} />
            <group ref={fan} position={[-0.045 * L, 0, 0]}>
              <Solid kind="cylX" args={[fr * 0.22, 0.02 * L]} tone="light" />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <group key={i} rotation={[(i * Math.PI) / 3, 0, 0]}>
                  <Solid args={[0.005 * L, fr * 0.78, fr * 0.34]} position={[0, fr * 0.6, 0]} rotation={[0, 0.5, 0]} tone="light" />
                </group>
              ))}
            </group>
          </Part>

          {/* Alternador */}
          <Part id="alternador" registry={registry} position={[-0.3 * L, -0.1 * H, 0]} out={[-0.3 * L, 0.02 * H, 0]}>
            <Solid kind="cylX" args={[0.2 * H, 0.2 * L]} />
            {[-0.06, -0.03, 0, 0.03, 0.06].map((x) => (
              <Solid key={x} kind="cylX" args={[0.208 * H, 0.008 * L]} position={[x * L, 0, 0]} tone="dark" />
            ))}
            <Solid kind="cylX" args={[0.17 * H, 0.04 * L]} position={[-0.12 * L, 0, 0]} tone="dark" />
            <Solid kind="cylX" args={[0.21 * H, 0.03 * L]} position={[0.115 * L, 0, 0]} tone="dark" />
            <Solid args={[0.11 * L, 0.13 * H, 0.3 * D]} position={[0, 0.25 * H, 0]} tone="light" />
            <Solid args={[0.16 * L, 0.03 * H, 0.08 * D]} position={[0, -0.21 * H, 0.22 * D]} tone="dark" />
            <Solid args={[0.16 * L, 0.03 * H, 0.08 * D]} position={[0, -0.21 * H, -0.22 * D]} tone="dark" />
          </Part>

          {/* Tablero de control */}
          <Part id="control" registry={registry} position={[-0.36 * L, 0.2 * H, 0.36 * D]} out={[-0.2 * L, 0.42 * H, 0.75 * D]}>
            <Solid args={[0.16 * L, 0.3 * H, 0.1 * D]} tone="dark" />
            <Solid args={[0.085 * L, 0.1 * H, 0.012 * D]} position={[-0.02 * L, 0.06 * H, 0.052 * D]} accent="green" />
            {[-0.045, -0.02, 0.005].map((x) => (
              <Solid key={x} kind="cylZ" args={[0.012 * H, 0.02 * D]} position={[x * L, -0.07 * H, 0.055 * D]} accent="white" />
            ))}
            <Solid kind="cylZ" args={[0.024 * H, 0.03 * D]} position={[0.05 * L, -0.06 * H, 0.06 * D]} accent="red" />
            <Solid args={[0.03 * L, 0.05 * H, 0.014 * D]} position={[0.052 * L, 0.08 * H, 0.052 * D]} tone="light" />
          </Part>

          {/* Batería */}
          <Part id="bateria" registry={registry} position={[0.2 * L, -0.3 * H, 0.33 * D]} out={[0.12 * L, -0.12 * H, 0.95 * D]}>
            <Solid args={[0.11 * L, 0.11 * H, 0.14 * D]} tone="dark" />
            <Solid args={[0.112 * L, 0.02 * H, 0.142 * D]} position={[0, 0.05 * H, 0]} tone="main" />
            <Solid kind="cyl" args={[0.014 * D, 0.03 * H]} position={[-0.035 * L, 0.075 * H, 0]} accent="red" />
            <Solid kind="cyl" args={[0.014 * D, 0.03 * H]} position={[0.035 * L, 0.075 * H, 0]} accent="white" />
          </Part>

          {/* Escape */}
          <Part id="escape" registry={registry} position={[0, 0.3 * H, -0.22 * D]} out={[0, 0.48 * H, -0.5 * D]}>
            <Solid kind="cylX" args={[0.075 * H, 0.34 * L]} tone="light" />
            <Solid kind="cylX" args={[0.08 * H, 0.012 * L]} position={[-0.12 * L, 0, 0]} tone="main" />
            <Solid kind="cylX" args={[0.08 * H, 0.012 * L]} position={[0.12 * L, 0, 0]} tone="main" />
            <Solid kind="cyl" args={[0.024 * H, 0.13 * H]} position={[-0.06 * L, -0.11 * H, 0]} tone="main" />
            <Solid kind="cylX" args={[0.026 * H, 0.14 * L]} position={[0.24 * L, 0, 0]} tone="main" />
          </Part>
        </group>
      </group>
      </PickCtx.Provider>
    </>
  );
}

export default function ExplodedGenset({
  slug,
  progress,
  zoom,
  onPick,
}: {
  slug: string;
  progress: MutableRefObject<number>;
  zoom: MutableRefObject<PiezaId | null>;
  onPick: (id: PiezaId) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const drag = useRef(0);
  const small = useMemo(() => window.matchMedia('(max-width: 760px)').matches, []);

  // Arrastre horizontal: suma un giro manual al que trae el scroll
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let on = false;
    let x = 0;
    const down = (e: PointerEvent) => {
      on = true;
      x = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!on) return;
      drag.current = THREE.MathUtils.clamp(drag.current + (e.clientX - x) * 0.006, -1.4, 1.4);
      x = e.clientX;
    };
    const up = () => {
      on = false;
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <div ref={wrap} className="despiece__gl">
      <Canvas
        dpr={[1, small ? 1.5 : 1.75]}
        camera={{ fov: 30, position: [0, 1.9, 10.5], near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <Scene slug={slug} progress={progress} drag={drag} zoom={zoom} onPick={onPick} />
        </Suspense>
      </Canvas>
    </div>
  );
}
