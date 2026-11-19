import { assets, imageOf } from '../data/products';
import PanelArt from './PanelArt';

export default function ProductImage({ slug, alt = '', eager = false }: { slug: string; alt?: string; eager?: boolean }) {
  const a = assets[slug];
  if (a.mode === 'panel') return <PanelArt slug={slug} />;
  return <img src={imageOf(slug)} alt={alt} width={a.w} height={a.h} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />;
}
