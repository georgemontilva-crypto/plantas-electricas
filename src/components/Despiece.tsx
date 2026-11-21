import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { despiece, piezaEnProgreso, progresoDePieza, type PiezaId } from '../data/despiece';

const ExplodedGenset = lazy(() => import('../three/ExplodedGenset'));

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Sección fija que abre la planta pieza por pieza a medida que se baja la página. */
export default function Despiece({ slug, nombre }: { slug: string; nombre: string }) {
  const piezas = despiece[slug];
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  const gl = useMemo(webglAvailable, []);
  const total = piezas.length;

  // Acercamiento: la pieza a la que mira la cámara. `arrived` evita soltarlo
  // mientras el scroll todavía viaja hacia esa pieza.
  const zoom = useRef<PiezaId | null>(null);
  const arrived = useRef(false);
  const [zoomed, setZoomed] = useState<PiezaId | null>(null);
  const unzoom = useCallback(() => {
    zoom.current = null;
    arrived.current = false;
    setZoomed(null);
  }, []);

  useEffect(() => {
    if (!gl) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      progress.current = p;
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
      const i = piezaEnProgreso(p, total);
      setStep((prev) => (prev === i ? prev : i));
      if (zoom.current) {
        if (piezas[i].id === zoom.current) arrived.current = true;
        else if (arrived.current) unzoom(); // el usuario siguió bajando o subiendo
      }
    };
    let idle = 0;
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
      // si el scroll se detiene en otra pieza, se suelta el acercamiento
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (zoom.current && piezas[piezaEnProgreso(progress.current, total)].id !== zoom.current) unzoom();
      }, 450);
    };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(idle);
    };
  }, [gl, total, piezas, unzoom]);

  // En teléfono la barra de piezas se desliza: la pieza activa debe quedar a la vista
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const row = nav.current;
    const active = row?.querySelector<HTMLElement>('.is-active');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2, behavior: 'smooth' });
  }, [step]);

  const goTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + progresoDePieza(i, total) * span + 2, behavior: 'smooth' });
  };

  /** Toque sobre una pieza (en el 3D o con el botón): acerca la cámara; un segundo toque la aleja. */
  const pick = (id: PiezaId) => {
    if (id === 'cabina') return;
    if (zoom.current === id) {
      unzoom();
      return;
    }
    const i = piezas.findIndex((x) => x.id === id);
    if (i < 0) return;
    zoom.current = id;
    arrived.current = piezaEnProgreso(progress.current, total) === i;
    setZoomed(id);
    if (!arrived.current) goTo(i);
  };
  const pickRef = useRef(pick);
  pickRef.current = pick;
  const onPick = useCallback((id: PiezaId) => pickRef.current(id), []);

  // Sin WebGL: las mismas piezas como lista, sin animación
  if (!gl) {
    return (
      <section className="section section--dark despiece-lista">
        <div className="wrap">
          <h2 className="title">Por dentro</h2>
          <div className="despiece-lista__grid">
            {piezas.map((p) => (
              <article key={p.id}>
                <h3>{p.nombre}</h3>
                <p>{p.texto}</p>
                <dl>
                  {p.datos.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const pieza = piezas[step];

  return (
    <section className="despiece" ref={section} style={{ '--pasos': total } as CSSProperties} aria-label={`Despiece de ${nombre}`}>
      <div className="despiece__sticky">
        <Suspense fallback={null}>
          <ExplodedGenset slug={slug} progress={progress} zoom={zoom} onPick={onPick} />
        </Suspense>

        <div className="wrap despiece__ui">
          <header className="despiece__head">
            <h2 className="title">Por dentro</h2>
            <p>{nombre}, pieza por pieza. Baja para abrirla y toca una pieza para acercarla.</p>
          </header>

          <article className="despiece__card" key={pieza.id} aria-live="polite">
            <p className="despiece__count">
              Pieza {step + 1} de {total}
            </p>
            <h3>{pieza.nombre}</h3>
            <p className="despiece__text">{pieza.texto}</p>
            {pieza.datos.length > 0 && (
              <dl>
                {pieza.datos.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {pieza.id !== 'cabina' && (
              <button type="button" className="despiece__zoom" onClick={() => pick(pieza.id)} aria-pressed={zoomed === pieza.id}>
                {zoomed === pieza.id ? 'Alejar' : 'Acercar pieza'}
              </button>
            )}
          </article>
        </div>

        <p className="despiece__note">Representación esquemática. Los datos son de la ficha técnica.</p>

        <nav className="despiece__nav" aria-label="Piezas" ref={nav}>
          <i className="despiece__bar" ref={bar} aria-hidden="true" />
          {piezas.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={i === step ? 'is-active' : ''}
              aria-current={i === step ? 'step' : undefined}
              onClick={() => {
                unzoom();
                goTo(i);
              }}
            >
              {p.nombre.replace(/ (N490D|QC490D|184ES|184F|SmartGen HGM4020N|ComAp AMF8)$/, '').replace(' de combustible', '').replace(' de arranque', '').replace(' de escape', '').replace(' silenciosa', '').replace(' y ventilador', '')}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
