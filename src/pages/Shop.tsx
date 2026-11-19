import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, categoryById, products, productsOf } from '../data/products';
import ProductCard from '../components/ProductCard';

type Sort = 'linea' | 'asc' | 'desc' | 'nombre';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const linea = categoryById(params.get('linea') ?? '')?.id ?? null;
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('linea');

  const list = useMemo(() => {
    const needle = norm(q.trim());
    let out = products.filter((p) => (!linea || p.category === linea) && (!needle || norm(`${p.name} ${p.model} ${p.kind}`).includes(needle)));
    if (sort === 'asc') out = [...out].sort((a, b) => a.power - b.power);
    if (sort === 'desc') out = [...out].sort((a, b) => b.power - a.power);
    if (sort === 'nombre') out = [...out].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return out;
  }, [linea, q, sort]);

  const setLinea = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set('linea', id);
    else next.delete('linea');
    setParams(next, { replace: true });
  };

  const cat = linea ? categoryById(linea) : null;

  // En teléfono los filtros van en una fila deslizable: la línea activa debe quedar a la vista.
  const tabs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = tabs.current;
    const active = row?.querySelector<HTMLElement>('.is-active');
    if (!row || !active) return;
    row.scrollTo({ left: active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2, behavior: 'auto' });
  }, [linea]);

  return (
    <div className="shop">
      <section className="shop__head">
        <div className="wrap">
          <h1 className="display display--md">{cat ? cat.name : 'Tienda'}</h1>
          <p className="lead">{cat ? cat.blurb : `${products.length} equipos AKX. Entra a cualquiera para girarlo en 3D y leer su ficha técnica.`}</p>
          <div className="tabs tabs--wrap" role="tablist" aria-label="Línea de producto" ref={tabs}>
            <button type="button" role="tab" aria-selected={!linea} className={!linea ? 'is-active' : ''} onClick={() => setLinea(null)}>
              Todo <small>{products.length}</small>
            </button>
            {categories.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={linea === c.id} className={linea === c.id ? 'is-active' : ''} onClick={() => setLinea(c.id)}>
                {c.short} <small>{productsOf(c.id).length}</small>
              </button>
            ))}
          </div>
          <div className="shop__tools">
            <label className="field field--search">
              <span className="sr">Buscar equipo</span>
              <input type="search" placeholder="Buscar equipo" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <label className="field field--inline">
              <span>Ordenar</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="linea">Por línea</option>
                <option value="asc">Menor potencia</option>
                <option value="desc">Mayor potencia</option>
                <option value="nombre">Nombre</option>
              </select>
            </label>
          </div>
        </div>
      </section>
      <section className="shop__grid">
        <div className="wrap">
          {list.length ? (
            <div className="grid">
              {list.map((p, i) => (
                <ProductCard key={p.slug} product={p} eager={i < 4} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>Ningún equipo coincide con “{q}”.</p>
              <button
                type="button"
                className="btn btn--line"
                onClick={() => {
                  setQ('');
                  setLinea(null);
                }}
              >
                Ver todos los equipos
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
