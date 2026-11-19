import { Link } from 'react-router-dom';
import Logo from './Logo';
import { categories } from '../data/products';
import { site, whatsappLink } from '../config/site';

export default function Footer() {
  const wa = whatsappLink('Hola, quiero información sobre los equipos AKX.');
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>Plantas eléctricas, estaciones portátiles, inversores, baterías de litio y paneles solares.</p>
        </div>
        <div>
          <h3>Líneas</h3>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/tienda?linea=${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Sitio</h3>
          <ul>
            <li>
              <Link to="/tienda">Tienda</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto y cotizaciones</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <ul>
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
            )}
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
              </li>
            )}
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            )}
            <li>
              <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noreferrer">
                Instagram @{site.instagram}
              </a>
            </li>
            {site.address && <li>{site.address}</li>}
          </ul>
        </div>
      </div>
      <div className="wrap footer__base">
        <span>
          © {new Date().getFullYear()} {site.legalName}
        </span>
        <span>Las especificaciones provienen de las fichas técnicas del fabricante y pueden cambiar sin previo aviso.</span>
      </div>
    </footer>
  );
}
