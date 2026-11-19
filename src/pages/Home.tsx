import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, productBySlug, products, productsOf, type CategoryId } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';

const ProductStage = lazy(() => import('../three/ProductStage'));

const HERO: Record<CategoryId, string> = {
  plantas: 'akx-mini-13-5',
  estaciones: 'akx-pe2400',
  inversores: 'inversor-akx-max-pro-ii-6-5kw',
  baterias: 'bateria-akx-premium-15k-300ah',
  paneles: 'panel-solar-akx-670w',
};

const USOS = ['Hogar', 'Oficina', 'Comercio', 'Obras', 'Camping'] as const;
const USO_TEXTO: Record<(typeof USOS)[number], string> = {
  Hogar: 'Respaldo para iluminación, nevera, televisores, internet y electrodomésticos.',
  Oficina: 'Para computadores, impresoras, routers, servidores y equipos electrónicos.',
  Comercio: 'Continuidad operativa en pequeños y medianos negocios.',
  Obras: 'Energía para herramientas eléctricas y maquinaria en sitio.',
  Camping: 'Para actividades al aire libre, vehículos recreativos y caravanas.',
};

const FICHA: [string, string][] = [
  ['Estaciones portátiles', 'Más de 3500 ciclos de carga con celdas LiFePO4'],
  ['Baterías de 51.2 V', '6000 ciclos y 15 años de vida útil de diseño'],
  ['Inversor ZERO 3.0 kW', '0 ms de transferencia para servidores y telecomunicaciones'],
  ['Mini 13.5 Silenciosa', 'Tres combustibles: gasolina, GLP o gas natural'],
  ['Mini 9 y Mini 13.5', 'Tablero de transferencia automática (ATS) incluido'],
  ['Plantas diésel de 20 y 27.5 kVA', 'Cabina silenciosa, refrigeración por agua y alternador de tecnología Stanford'],
];

function Hero() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [ready, setReady] = useState(false);
  const cat = categories[index];
  const product = productBySlug(HERO[cat.id])!;

  useEffect(() => {
    if (!auto) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % categories.length), 9000);
    return () => window.clearTimeout(id);
  }, [auto, index]);

  const pick = (i: number) => {
    setAuto(false);
    setIndex(i);
  };

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`}>
      <div className="hero__bg" aria-hidden="true" />
      <div className="wrap hero__inner">
        <div className="hero__copy">
          <h1 className="display hero__title">
            <span>Energía</span>
            <span>que no</span>
            <span>se apaga</span>
          </h1>
          <p className="hero__lead">
            Plantas eléctricas, estaciones portátiles y energía solar AKX. Gira cada equipo, revisa su ficha técnica y pide tu cotización.
          </p>
          <div className="hero__cta">
            <Link className="btn btn--green" to="/tienda">
              Ver la tienda
            </Link>
            <Link className="btn btn--line" to="/contacto">
              Pedir cotización
            </Link>
          </div>
        </div>
      </div>
      <div className="hero__stage">
        <Suspense fallback={null}>
          <ProductStage slug={product.slug} variant="hero" alt={product.name} onReady={() => setReady(true)} />
        </Suspense>
      </div>
      <aside className="hero__caption" key={product.slug} aria-live="polite">
        <p className="hero__caption-model">{product.model}</p>
        <p className="hero__caption-name">{product.name}</p>
        <dl>
          {product.stats.slice(0, 2).map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                {s.value}
                {s.unit ? <small> {s.unit}</small> : null}
              </dd>
            </div>
          ))}
        </dl>
        <Link className="text-link" to={`/producto/${product.slug}`}>
          Ver ficha completa
        </Link>
      </aside>
      <div className="hero__lines" role="tablist" aria-label="Líneas de producto">
        {categories.map((c, i) => (
          <button key={c.id} type="button" role="tab" aria-selected={i === index} className={i === index ? 'is-active' : ''} onClick={() => pick(i)}>
            <span>{c.short}</span>
            <small>{productsOf(c.id).length} equipos</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function Lines() {
  return (
    <section className="section section--light lines">
      <div className="wrap">
        <header className="section__head">
          <h2 className="title">Cinco líneas, una sola marca</h2>
          <p className="lead">Del generador que respalda el negocio al panel que carga la batería: todo conversa entre sí.</p>
        </header>
        <ul className="lines__list">
          {categories.map((c) => {
            const list = productsOf(c.id);
            return (
              <li key={c.id}>
                <Link to={`/tienda?linea=${c.id}`} className="lines__row">
                  <span className="lines__count">{list.length} equipos</span>
                  <span className="lines__name">{c.name}</span>
                  <span className="lines__blurb">{c.blurb}</span>
                  <span className="lines__img" aria-hidden="true">
                    <ProductImage slug={HERO[c.id]} sizes="160px" />
                  </span>
                  <span className="lines__go">Ver línea</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Usos() {
  const [uso, setUso] = useState<(typeof USOS)[number]>('Hogar');
  const list = products.filter((p) => p.uses?.includes(uso));
  const picks = [
    ...new Map(
      (['plantas', 'estaciones', 'inversores', 'baterias'] as CategoryId[]).flatMap((id) => list.filter((p) => p.category === id).slice(0, 1)).map((p) => [p.slug, p]),
    ).values(),
  ];
  return (
    <section className="section section--dark usos">
      <div className="wrap">
        <header className="section__head">
          <h2 className="title">¿Qué necesitas mantener encendido?</h2>
          <div className="tabs" role="tablist" aria-label="Uso">
            {USOS.map((u) => (
              <button key={u} type="button" role="tab" aria-selected={u === uso} className={u === uso ? 'is-active' : ''} onClick={() => setUso(u)}>
                {u}
              </button>
            ))}
          </div>
          <p className="lead">{USO_TEXTO[uso]}</p>
        </header>
        <div className="grid">
          {picks.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <p className="usos__more">
          <Link className="text-link" to="/tienda">
            Ver los {products.length} equipos
          </Link>
        </p>
      </div>
    </section>
  );
}

function Ficha() {
  return (
    <section className="section section--light ficha">
      <div className="wrap ficha__grid">
        <header>
          <h2 className="title">Lo que dicen las fichas técnicas</h2>
          <p className="lead">Nada de promesas vagas. Estos son datos de las fichas de cada equipo, y cada producto tiene la suya completa en la tienda.</p>
        </header>
        <table className="spec spec--big">
          <caption className="spec__title">Datos de catálogo</caption>
          <tbody>
            {FICHA.map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="cta">
      <div className="wrap cta__inner">
        <h2 className="title">Cuéntanos qué equipos tienes y te decimos cuál AKX los mantiene encendidos</h2>
        <Link className="btn btn--black" to="/contacto">
          Pedir cotización
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Lines />
      <Usos />
      <Ficha />
      <Cta />
    </>
  );
}
