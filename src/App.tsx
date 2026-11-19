import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import QuoteDrawer from './components/QuoteDrawer';
import Home from './pages/Home';

const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <ScrollTop />
      <Header />
      <main id="contenido">
        <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/producto/:slug" element={<ProductPage />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <QuoteDrawer />
    </>
  );
}
