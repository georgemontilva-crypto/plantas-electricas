import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuote, quoteText } from '../lib/quote';
import { productBySlug, assets } from '../data/products';
import { whatsappLink } from '../config/site';
import PanelArt from './PanelArt';

export default function QuoteDrawer() {
  const { items, open, setOpen, remove, setQty, clear, count } = useQuote();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    panel.current?.focus();
    document.body.classList.add('no-scroll');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open, setOpen]);

  const wa = whatsappLink(quoteText(items));

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button type="button" className="drawer__scrim" aria-label="Cerrar cotización" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Tu cotización" tabIndex={-1} ref={panel}>
        <header className="drawer__head">
          <h2>Tu cotización</h2>
          <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Cerrar">
            ✕
          </button>
        </header>
        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Todavía no agregas equipos.</p>
            <p className="muted">Suma los que te interesan desde la tienda y te enviamos precios y disponibilidad.</p>
            <Link className="btn btn--green" to="/tienda" onClick={() => setOpen(false)}>
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__list">
              {items.map((i) => {
                const p = productBySlug(i.slug);
                if (!p) return null;
                return (
                  <li key={i.slug}>
                    <Link to={`/producto/${p.slug}`} className="drawer__thumb" onClick={() => setOpen(false)}>
                      {assets[p.slug].mode === 'panel' ? <PanelArt slug={p.slug} /> : <img src={`/products/${p.slug}-sm.webp`} alt="" loading="lazy" />}
                    </Link>
                    <div className="drawer__info">
                      <Link to={`/producto/${p.slug}`} onClick={() => setOpen(false)}>
                        {p.name}
                      </Link>
                      <span className="muted">{p.model}</span>
                      <div className="qty">
                        <button type="button" onClick={() => setQty(i.slug, i.qty - 1)} aria-label={`Quitar una unidad de ${p.name}`} disabled={i.qty <= 1}>
                          −
                        </button>
                        <span aria-live="polite">{i.qty}</span>
                        <button type="button" onClick={() => setQty(i.slug, i.qty + 1)} aria-label={`Sumar una unidad de ${p.name}`}>
                          +
                        </button>
                        <button type="button" className="link" onClick={() => remove(i.slug)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <footer className="drawer__foot">
              <p className="muted">
                {count} {count === 1 ? 'equipo' : 'equipos'} en la lista. Te respondemos con precio y disponibilidad.
              </p>
              <Link className="btn btn--green btn--block" to="/contacto" onClick={() => setOpen(false)}>
                Pedir cotización
              </Link>
              {wa && (
                <a className="btn btn--line btn--block" href={wa} target="_blank" rel="noreferrer">
                  Enviar por WhatsApp
                </a>
              )}
              <button type="button" className="link" onClick={clear}>
                Vaciar lista
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
