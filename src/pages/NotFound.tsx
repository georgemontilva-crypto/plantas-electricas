import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section section--dark notfound">
      <div className="wrap">
        <h1 className="display">Esta página no existe</h1>
        <p className="lead">El enlace cambió o el equipo ya no está en el catálogo.</p>
        <Link className="btn btn--green" to="/tienda">
          Ir a la tienda
        </Link>
      </div>
    </section>
  );
}
