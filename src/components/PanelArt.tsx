import { assets } from '../data/products';

/** Dibujo vectorial del panel solar para vistas 2D (tarjetas, lista de cotización). */
export default function PanelArt({ slug, className = '' }: { slug: string; className?: string }) {
  const a = assets[slug];
  const cols = a.panel?.cols ?? 6;
  const rows = a.panel?.rows ?? 24;
  const dims = a.dims ?? [1134, 2278, 35];
  const W = 300;
  const H = Math.round((W * dims[1]) / dims[0]);
  const m = 8;
  const mid = 5;
  const cw = (W - m * 2) / cols;
  const ch = (H - m * 2 - mid) / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(<rect key={`${r}-${c}`} x={m + c * cw + 0.6} y={m + r * ch + (r >= rows / 2 ? mid : 0) + 0.6} width={cw - 1.2} height={ch - 1.2} fill={`url(#cell-${slug})`} />);
    }
  }
  return (
    <svg className={`panel-art ${className}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Panel solar monocristalino">
      <defs>
        <linearGradient id={`cell-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#101a30" />
          <stop offset="0.55" stopColor="#0a1020" />
          <stop offset="1" stopColor="#16223f" />
        </linearGradient>
        <linearGradient id={`glass-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#A6DB40" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} rx="3" fill="#c9cfd5" />
      <rect x="3.5" y="3.5" width={W - 7} height={H - 7} fill="#04060a" />
      {cells}
      <rect x="3.5" y="3.5" width={W - 7} height={H - 7} fill={`url(#glass-${slug})`} />
    </svg>
  );
}
