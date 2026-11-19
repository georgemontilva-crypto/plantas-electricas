import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { productBySlug } from '../data/products';

export interface QuoteItem {
  slug: string;
  qty: number;
}

interface QuoteCtx {
  items: QuoteItem[];
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

const Ctx = createContext<QuoteCtx | null>(null);
const KEY = 'akx-cotizacion';

function load(): QuoteItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuoteItem[];
    return parsed.filter((i) => productBySlug(i.slug) && i.qty > 0);
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* almacenamiento no disponible: la lista vive solo en memoria */
    }
  }, [items]);

  const add = useCallback((slug: string) => {
    setItems((list) => (list.some((i) => i.slug === slug) ? list.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i)) : [...list, { slug, qty: 1 }]));
    setOpen(true);
  }, []);
  const remove = useCallback((slug: string) => setItems((list) => list.filter((i) => i.slug !== slug)), []);
  const setQty = useCallback(
    (slug: string, qty: number) => setItems((list) => list.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i))),
    [],
  );
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<QuoteCtx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      open,
      setOpen,
      add,
      remove,
      setQty,
      clear,
      has: (slug) => items.some((i) => i.slug === slug),
    }),
    [items, open, add, remove, setQty, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuote() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useQuote fuera de QuoteProvider');
  return ctx;
}

/** Texto de la lista para WhatsApp o para el formulario. */
export function quoteText(items: QuoteItem[]): string {
  if (!items.length) return 'Hola, quiero información sobre los equipos AKX.';
  const lines = items.map((i) => {
    const p = productBySlug(i.slug);
    return p ? `• ${i.qty} × ${p.name} (${p.model})` : '';
  });
  return `Hola, quiero cotizar estos equipos AKX:\n${lines.filter(Boolean).join('\n')}`;
}
