import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useQuote } from '../lib/quote';

const links = [
  { to: '/tienda', label: 'Tienda' },
  { to: '/tienda?linea=plantas', label: 'Plantas eléctricas' },
  { to: '/tienda?linea=estaciones', label: 'Estaciones portátiles' },
  { to: '/tienda?linea=inversores', label: 'Energía solar' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const { count, setOpen } = useQuote();
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  const loc = useLocation();

  useEffect(() => setMenu(false), [loc.pathname, loc.search]);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('no-scroll', menu);
    return () => document.body.classList.remove('no-scroll');
  }, [menu]);

  const active = (to: string) => loc.pathname + loc.search === to;

  return (
    <header className={`header ${solid || menu ? 'header--solid' : ''}`}>
      <div className="header__bar">
        <Link to="/" className="header__logo" aria-label="AKX, inicio">
          <Logo />
        </Link>
        <nav className={`header__nav ${menu ? 'is-open' : ''}`} aria-label="Principal">
          {links.map((l) =>
            l.to.includes('?') ? (
              <Link key={l.to} to={l.to} className={active(l.to) ? 'is-active' : ''}>
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.to} to={l.to} className={() => (active(l.to) ? 'is-active' : '')}>
                {l.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="header__actions">
          <button type="button" className="quote-btn" onClick={() => setOpen(true)} aria-label={`Abrir cotización, ${count} equipos`}>
            <span>Cotización</span>
            <b>{count}</b>
          </button>
          <button
            type="button"
            className={`burger ${menu ? 'is-open' : ''}`}
            aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <i />
            <i />
          </button>
        </div>
      </div>
    </header>
  );
}
