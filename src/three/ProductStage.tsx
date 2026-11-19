import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { assets, imageOf } from '../data/products';
import { ProductModel, modelHeight } from './models';

export const GREEN = '#A6DB40';

interface StageProps {
  slug: string;
  /** hero: sigue al cursor en toda la ventana y dibuja el anillo de energía más grande */
  variant?: 'viewer' | 'hero';
  className?: string;
  alt?: string;
  onReady?: () => void;
}

interface RigProps {
  mode: 'extrude' | 'relief' | 'panel';
  variant: 'viewer' | 'hero';
  children: ReactNode;
}

/** Giro con arrastre, inercia y un vaivén suave cuando nadie lo toca. */
function Rig({ mode, variant, children }: RigProps) {
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const state = useRef({ dragging: false, x: 0, y: 0, az: 0, pol: 0, taz: 0, tpol: 0, last: 0, hx: 0, hy: 0 });

  const limits = useMemo(() => {
    if (mode === 'panel') return { az: Infinity, pol: 0.5 };
    if (mode === 'extrude') return { az: 0.9, pol: 0.38 };
    return { az: 0.42, pol: 0.2 };
  }, [mode]);

  useEffect(() => {
    const el = gl.domElement;
    const s = state.current;
    const down = (e: PointerEvent) => {
      s.dragging = true;
      s.x = e.clientX;
      s.y = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const k = mode === 'relief' ? 0.0035 : 0.006;
      s.taz = THREE.MathUtils.clamp(s.taz + (e.clientX - s.x) * k, -limits.az, limits.az);
      s.tpol = THREE.MathUtils.clamp(s.tpol + (e.clientY - s.y) * k * 0.6, -limits.pol, limits.pol);
      s.x = e.clientX;
      s.y = e.clientY;
      s.last = performance.now();
    };
    const up = (e: PointerEvent) => {
      s.dragging = false;
      s.last = performance.now();
      el.style.cursor = 'grab';
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ya liberado */
      }
    };
    const hover = (e: PointerEvent) => {
      const r = variant === 'hero' ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight } : el.getBoundingClientRect();
      s.hx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      s.hy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    el.style.cursor = 'grab';
    el.style.touchAction = 'pan-y';
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    const hoverTarget: HTMLElement | Window = variant === 'hero' ? window : el;
    hoverTarget.addEventListener('pointermove', hover as EventListener);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      hoverTarget.removeEventListener('pointermove', hover as EventListener);
    };
  }, [gl, limits, mode, variant]);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const s = state.current;
    const t = clock.elapsedTime;
    const idle = !s.dragging && performance.now() - s.last > 2600;
    let az = s.taz;
    let pol = s.tpol;
    if (idle) {
      {
        const sway = mode === 'panel' ? 0.95 : mode === 'extrude' ? 0.55 : 0.3;
        const base = Math.sin(t * 0.45) * sway;
        s.taz += (base + s.hx * Math.min(limits.az, 1) * 0.35 - s.taz) * Math.min(1, dt * 0.9);
        s.tpol += (Math.sin(t * 0.33) * 0.05 + s.hy * limits.pol * 0.5 - s.tpol) * Math.min(1, dt * 0.9);
        az = s.taz;
        pol = s.tpol;
      }
    }
    const k = Math.min(1, dt * 7);
    s.az += (az - s.az) * k;
    s.pol += (pol - s.pol) * k;
    g.rotation.y = s.az;
    g.rotation.x = s.pol;
    g.position.y = Math.sin(t * 0.9) * 0.035;
  });

  return <group ref={group}>{children}</group>;
}

function EnergyFloor({ y, variant }: { y: number; variant: 'viewer' | 'hero' }) {
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const glow = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(166,219,64,0.42)');
    grad.addColorStop(0.35, 'rgba(166,219,64,0.14)');
    grad.addColorStop(1, 'rgba(166,219,64,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => glow.dispose(), [glow]);
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.25;
    if (ring2.current) ring2.current.rotation.z -= dt * 0.12;
  });
  const R = variant === 'hero' ? 2.5 : 2.1;
  return (
    <group position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[R * 1.7, 64]} />
        <meshBasicMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring} position={[0, 0, 0.002]}>
        <ringGeometry args={[R, R + 0.018, 128, 1, 0, Math.PI * 1.55]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} position={[0, 0, 0.002]}>
        <ringGeometry args={[R * 1.22, R * 1.22 + 0.006, 128, 1, 0, Math.PI * 1.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({ slug, variant, onReady }: { slug: string; variant: 'viewer' | 'hero'; onReady: () => void }) {
  const asset = assets[slug];
  const h = modelHeight(asset);
  const floorY = -h / 2 - 0.16;
  const { viewport, size } = useThree();
  // En el hero de escritorio el equipo se desplaza a la derecha para dejar aire al titular.
  const shiftX = variant === 'hero' && size.width > 860 ? viewport.width * 0.19 : 0;
  const shiftY = variant === 'hero' && size.width > 860 ? 0.12 : 0;
  // En pantallas angostas el modelo se reduce para que quepa completo al girar.
  const scale = THREE.MathUtils.clamp(viewport.width / 4.1, 0.5, 1);
  useEffect(() => {
    const id = requestAnimationFrame(() => onReady());
    return () => cancelAnimationFrame(id);
  }, [onReady, slug]);
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 6]} intensity={1.7} />
      <directionalLight position={[-5, 2, 3]} intensity={0.55} />
      <pointLight position={[0, -1.4, -3]} intensity={1.6} color={GREEN} distance={8} />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#050505']} />
        <Lightformer intensity={3.2} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[9, 5, 1]} />
        <Lightformer intensity={2.2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 1.2, 1]} />
        <Lightformer intensity={2.6} position={[6, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[6, 1.6, 1]} />
        <Lightformer intensity={1.4} position={[0, 0.5, 7]} scale={[7, 3, 1]} />
        <Lightformer intensity={1.6} color={GREEN} position={[0, -2.5, -6]} scale={[10, 1, 1]} />
      </Environment>
      <group position={[shiftX, shiftY, 0]} scale={scale}>
        <Rig mode={asset.mode} variant={variant}>
          <ProductModel slug={slug} asset={asset} />
        </Rig>
        <ContactShadows position={[0, floorY + 0.004, 0]} opacity={0.75} scale={8} blur={2.6} far={3.2} resolution={512} color="#000000" />
        <EnergyFloor y={floorY} variant={variant} />
      </group>
    </>
  );
}

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function ProductStage({ slug, variant = 'viewer', className = '', alt = '', onReady }: StageProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(() => !webglAvailable());
  const asset = assets[slug];

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleReady = useMemo(
    () => () => {
      setReady(true);
      onReady?.();
    },
    [onReady],
  );

  const poster = asset.mode !== 'panel' || failed;

  return (
    <div ref={wrap} className={`stage ${className} ${ready ? 'is-ready' : ''}`} data-ready={ready ? 'true' : 'false'}>
      {poster && <img className="stage__poster" src={imageOf(slug)} alt={alt} draggable={false} />}
      {!failed && (
        <Boundary onError={() => setFailed(true)}>
          <Canvas
            className="stage__canvas"
            dpr={[1, 1.75]}
            frameloop={visible ? 'always' : 'never'}
            camera={{ fov: 27, position: [0, 0.18, variant === 'hero' ? 8.4 : 7.5], near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.05;
            }}
          >
            <Suspense fallback={null}>
              <Scene key={slug} slug={slug} variant={variant} onReady={handleReady} />
            </Suspense>
          </Canvas>
        </Boundary>
      )}
      {!failed && <span className="stage__hint" aria-hidden="true">Arrastra para girar</span>}
    </div>
  );
}
