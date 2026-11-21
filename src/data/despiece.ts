/**
 * Despiece de las plantas diésel. Los datos de cada pieza salen de la ficha
 * técnica del equipo; las formas del modelo 3D son una representación esquemática.
 */
export type PiezaId = 'cabina' | 'motor' | 'radiador' | 'alternador' | 'control' | 'base' | 'bateria' | 'escape';

export interface Pieza {
  id: PiezaId;
  nombre: string;
  texto: string;
  datos: [string, string][];
}

export const ORDEN: PiezaId[] = ['cabina', 'motor', 'radiador', 'alternador', 'control', 'base', 'bateria', 'escape'];

export const despiece: Record<string, Pieza[]> = {
  'akx-20': [
    {
      id: 'cabina',
      nombre: 'Cabina silenciosa',
      texto: 'Todo el equipo trabaja dentro de una cabina cerrada. Sigue bajando para abrirla.',
      datos: [
        ['Dimensiones', '1750 × 750 × 860 mm'],
        ['Peso neto', '670 kg'],
      ],
    },
    {
      id: 'motor',
      nombre: 'Motor diésel N490D',
      texto: 'Cuatro cilindros y cuatro tiempos con inyección directa. Trabaja a 1800 rpm para entregar 60 Hz.',
      datos: [
        ['Potencia', '24 kWm'],
        ['Desplazamiento', '2.16 L'],
        ['Índice de compresión', '18:1'],
        ['Consumo', '3.00 L/h al 50 % · 4.10 L/h al 75 %'],
      ],
    },
    {
      id: 'radiador',
      nombre: 'Radiador y ventilador',
      texto: 'El motor se refrigera por agua. Si el refrigerante sube de temperatura, el control detiene la planta.',
      datos: [
        ['Refrigeración', 'Por agua'],
        ['Protección', 'Alta temperatura del refrigerante'],
      ],
    },
    {
      id: 'alternador',
      nombre: 'Alternador 184ES',
      texto: 'Convierte el giro del motor en electricidad. Es síncrono, sin escobillas y de tecnología Stanford.',
      datos: [
        ['Potencia', '20 kVA stand-by / 18 kVA prime'],
        ['Salida', '110 V / 220 V, monofásico 3 hilos'],
        ['Amperaje máximo', '81 A'],
        ['Aislamiento y protección', 'H, IP23'],
        ['Regulador de voltaje', 'AVR estándar'],
      ],
    },
    {
      id: 'control',
      nombre: 'Control SmartGen HGM4020N',
      texto: 'Arranca y detiene la planta de forma manual o automática y vigila sus protecciones.',
      datos: [
        ['Arranque y parada', 'Manual o automática'],
        ['Breaker', 'CHINT 100 A'],
        ['Transferencia (ATS)', 'AISIKAI automática, 100 A'],
        ['Protecciones', 'Baja presión de aceite, sobrecarga y desequilibrio'],
      ],
    },
    {
      id: 'base',
      nombre: 'Base y tanque de combustible',
      texto: 'El chasis sostiene motor y alternador, y lleva el depósito de diésel incluido.',
      datos: [
        ['Capacidad del tanque', '40 L'],
        ['Combustible', 'Diésel'],
      ],
    },
    {
      id: 'bateria',
      nombre: 'Batería de arranque',
      texto: 'Da la energía para el arranque eléctrico del motor.',
      datos: [['Voltaje', '12 V']],
    },
    {
      id: 'escape',
      nombre: 'Silenciador de escape',
      texto: 'Saca los gases del motor fuera de la cabina y baja el ruido del escape.',
      datos: [],
    },
  ],
  'akx-27-5': [
    {
      id: 'cabina',
      nombre: 'Cabina silenciosa',
      texto: 'Todo el equipo trabaja dentro de una cabina cerrada. Sigue bajando para abrirla.',
      datos: [
        ['Dimensiones', '2000 × 900 × 1100 mm'],
        ['Peso neto', '1510 kg'],
      ],
    },
    {
      id: 'motor',
      nombre: 'Motor diésel QC490D',
      texto: 'Cuatro cilindros y cuatro tiempos con inyección directa. Trabaja a 1800 rpm para entregar 60 Hz.',
      datos: [
        ['Potencia', '25 / 28 kWm'],
        ['Desplazamiento', '2.16 L'],
        ['Índice de compresión', '18:1'],
        ['Consumo', '3.90 L/h al 50 % · 5.40 L/h al 75 %'],
      ],
    },
    {
      id: 'radiador',
      nombre: 'Radiador y ventilador',
      texto: 'El motor se refrigera por agua. Si el refrigerante sube de temperatura, el control detiene la planta.',
      datos: [
        ['Refrigeración', 'Por agua'],
        ['Protección', 'Alta temperatura del refrigerante'],
      ],
    },
    {
      id: 'alternador',
      nombre: 'Alternador 184F',
      texto: 'Convierte el giro del motor en electricidad. Es síncrono, sin escobillas y de tecnología Stanford.',
      datos: [
        ['Potencia', '27.5 kVA stand-by / 24.75 kVA prime'],
        ['Salida', '110 V / 220 V, monofásico 3 hilos'],
        ['Amperaje máximo', '116 A'],
        ['Aislamiento y protección', 'H, IP23'],
        ['Regulador de voltaje', 'AVR estándar'],
      ],
    },
    {
      id: 'control',
      nombre: 'Control ComAp AMF8',
      texto: 'Arranca y detiene la planta de forma manual o automática y vigila sus protecciones.',
      datos: [
        ['Arranque y parada', 'Manual o automática'],
        ['Breaker', 'CHINT 100 A'],
        ['Transferencia (ATS)', 'AISIKAI automática, 100 A'],
        ['Protecciones', 'Baja presión de aceite, sobrecarga y desequilibrio'],
      ],
    },
    {
      id: 'base',
      nombre: 'Base y tanque de combustible',
      texto: 'El chasis sostiene motor y alternador, y lleva el depósito de diésel incluido.',
      datos: [
        ['Capacidad del tanque', '40 L'],
        ['Combustible', 'Diésel'],
      ],
    },
    {
      id: 'bateria',
      nombre: 'Batería de arranque',
      texto: 'Da la energía para el arranque eléctrico del motor.',
      datos: [['Voltaje', '12 V']],
    },
    {
      id: 'escape',
      nombre: 'Silenciador de escape',
      texto: 'Saca los gases del motor fuera de la cabina y baja el ruido del escape.',
      datos: [],
    },
  ],
};

/** Tramo del scroll (0 a 1) que ocupa cada pieza. La cabina va primero y es más corta. */
export const TRAMO_CABINA = 0.16;

export function piezaEnProgreso(p: number, total: number): number {
  if (p < TRAMO_CABINA) return 0;
  const resto = total - 1;
  return 1 + Math.min(resto - 1, Math.floor(((p - TRAMO_CABINA) / (1 - TRAMO_CABINA)) * resto));
}

/** Progreso al centro del tramo de una pieza, para saltar a ella. */
export function progresoDePieza(i: number, total: number): number {
  if (i <= 0) return 0;
  const resto = total - 1;
  return TRAMO_CABINA + ((i - 1 + 0.5) / resto) * (1 - TRAMO_CABINA);
}
