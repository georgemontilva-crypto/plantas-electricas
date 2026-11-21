import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { assets, categoryById, productBySlug, products } from '../data/products';
import { useQuote } from '../lib/quote';
import { whatsappLink } from '../config/site';
import { despiece } from '../data/despiece';
import ProductCard from '../components/ProductCard';
import NotFound from './NotFound';

const ProductStage = lazy(() => import('../three/ProductStage'));
const Despiece = lazy(() => import('../components/Despiece'));

export default function ProductPage() {
  const { slug = '' } = useParams();
  const product = productBySlug(slug);
  const { add, has } = useQuote();
  const [view, setView] = useState(0);

  useEffect(() => {
    setView(0);
    if (product) document.title = `${product.name} — AKX`;
    return () => {
      document.title = 'AKX — Plantas eléctricas, estaciones portátiles y energía solar';
    };
  }, [product]);

  if (!product) return <NotFound />;

  const asset = assets[product.slug];
  const cat = categoryById(product.category)!;
  const gallery = asset.gallery;
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const wa = whatsappLink(`Hola, quiero información del ${product.name} (${product.model}).`);
  const inQuote = has(product.slug);
  const is3d = asset.mode !== 'photo';
  const hint =
    asset.mode === 'photo'
      ? ''
      : asset.mode === 'panel'
        ? 'Modelo 3D. Arrástralo para girarlo completo.'
        : asset.mode === 'extrude'
          ? 'Modelo 3D armado con la foto y las medidas reales del equipo.'
          : 'Vista 3D en relieve generada desde la foto del equipo.';

  return (
    <div className="product">
      <section className="product__top">
        <div className="wrap product__grid">
          <div className="product__media">
            <div className="viewer">
              {view === 0 ? (
                <Suspense fallback={null}>
                  <ProductStage slug={product.slug} alt={product.name} />
                </Suspense>
              ) : (
                <div className="viewer__photo">
                  <img src={`/products/${gallery[view - 1].file}`} alt={`${product.name}, vista ${view + 1}`} />
                </div>
              )}
              {(is3d || view > 0) && <span className="viewer__badge">{view === 0 ? '3D' : 'Foto'}</span>}
            </div>
            {hint && <p className="viewer__note">{hint}</p>}
            {gallery.length > 0 && (
              <div className="thumbs" role="tablist" aria-label="Vistas del equipo">
                <button type="button" role="tab" aria-selected={view === 0} className={`thumbs__3d ${view === 0 ? 'is-active' : ''}`} onClick={() => setView(0)}>
                  {is3d ? '3D' : 'Foto'}
                </button>
                {gallery.map((g, i) => (
                  <button key={g.file} type="button" role="tab" aria-selected={view === i + 1} className={view === i + 1 ? 'is-active' : ''} onClick={() => setView(i + 1)}>
                    <img src={`/products/${g.file.replace('.webp', '-th.webp')}`} alt={`Vista ${i + 2}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product__info">
            <nav className="crumbs" aria-label="Ruta">
              <Link to="/tienda">Tienda</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/tienda?linea=${cat.id}`}>{cat.name}</Link>
            </nav>
            <p className="product__model">{product.model}</p>
            <h1 className="display display--sm">{product.name}</h1>
            <p className="product__kind">{product.kind}</p>
            <p className="product__tagline">{product.tagline}</p>
            <p className="product__desc">{product.description}</p>

            <dl className="stats">
              {product.stats.map((s) => (
                <div key={s.label}>
                  <dd>
                    {s.value}
                    {s.unit ? <small> {s.unit}</small> : null}
                  </dd>
                  <dt>{s.label}</dt>
                </div>
              ))}
            </dl>

            <div className="product__cta">
              <button type="button" className="btn btn--green" onClick={() => add(product.slug)}>
                {inQuote ? 'Sumar otro a la cotización' : 'Agregar a la cotización'}
              </button>
              {wa ? (
                <a className="btn btn--line" href={wa} target="_blank" rel="noreferrer">
                  Consultar por WhatsApp
                </a>
              ) : (
                <Link className="btn btn--line" to="/contacto">
                  Hablar con un asesor
                </Link>
              )}
            </div>
            <p className="product__price">Precio y disponibilidad por cotización.</p>

            <ul className="features">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            {(product.uses || product.certs) && (
              <div className="chips">
                {product.uses?.map((u) => (
                  <span key={u} className="chip">
                    {u}
                  </span>
                ))}
                {product.certs?.map((c) => (
                  <span key={c} className="chip chip--cert">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {despiece[product.slug] && (
        <Suspense fallback={null}>
          <Despiece slug={product.slug} nombre={product.name} />
        </Suspense>
      )}

      <section className="section section--light product__specs">
        <div className="wrap">
          <h2 className="title">Ficha técnica</h2>
          <div className="specs">
            {product.specs.map((g) => (
              <table className="spec" key={g.title}>
                <caption className="spec__title">{g.title}</caption>
                <tbody>
                  {g.rows.map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
          {product.note && <p className="product__note">Nota: {product.note}</p>}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--dark">
          <div className="wrap">
            <h2 className="title">Más {cat.name.toLowerCase()}</h2>
            <div className="grid">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
