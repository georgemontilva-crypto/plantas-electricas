import { assets, imageOf } from '../data/products';
import PanelArt from './PanelArt';

export default function ProductImage({
  slug,
  alt = '',
  eager = false,
  sizes = '(max-width: 560px) 42vw, 280px',
}: {
  slug: string;
  alt?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const a = assets[slug];
  if (a.mode === 'panel') return <PanelArt slug={slug} />;
  // Versión de 560 px para tarjetas y listas; la de 1280 px solo cuando hace falta.
  return (
    <img
      src={`/products/${slug}-sm.webp`}
      srcSet={`/products/${slug}-sm.webp 560w, ${imageOf(slug)} 1280w`}
      sizes={sizes}
      alt={alt}
      width={a.w}
      height={a.h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}
