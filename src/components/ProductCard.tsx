import { useRef, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { assets, categoryById } from '../data/products';
import { useQuote } from '../lib/quote';
import ProductImage from './ProductImage';

export default function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { add, has } = useQuote();
  const ref = useRef<HTMLElement>(null);
  const cat = categoryById(product.category);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 22).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const main = product.stats[0];
  const inQuote = has(product.slug);

  return (
    <article className="card" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <Link to={`/producto/${product.slug}`} className="card__stage" aria-label={`${product.name}, ver ficha`}>
        <span className="card__line">{cat?.short}</span>
        <span className="card__figure">
          <ProductImage slug={product.slug} eager={eager} />
        </span>
        <span className="card__view">{assets[product.slug].mode === 'photo' ? 'Ver ficha' : 'Ver en 3D'}</span>
      </Link>
      <div className="card__body">
        <p className="card__model">{product.model}</p>
        <h3 className="card__name">
          <Link to={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="card__kind">{product.kind}</p>
        <div className="card__foot">
          <p className="card__stat">
            <b>
              {main.value}
              {main.unit ? <small> {main.unit}</small> : null}
            </b>
            <span>{main.label}</span>
          </p>
          <button type="button" className={`btn btn--small ${inQuote ? 'btn--line' : 'btn--green'}`} onClick={() => add(product.slug)}>
            {inQuote ? 'Sumar otro' : 'Cotizar'}
          </button>
        </div>
      </div>
    </article>
  );
}
