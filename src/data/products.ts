import assetsJson from './assets.json';

export type CategoryId = 'plantas' | 'estaciones' | 'inversores' | 'baterias' | 'paneles';

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  blurb: string;
}

export const categories: Category[] = [
  {
    id: 'plantas',
    name: 'Plantas eléctricas',
    short: 'Plantas',
    blurb: 'Generadores de 3 a 27.5 kVA a gasolina, gas y diésel, con arranque eléctrico y transferencia automática.',
  },
  {
    id: 'estaciones',
    name: 'Estaciones portátiles',
    short: 'Estaciones',
    blurb: 'Energía LiFePO4 silenciosa de 800 a 6000 W. Se recargan en la pared o con paneles solares.',
  },
  {
    id: 'inversores',
    name: 'Inversores',
    short: 'Inversores',
    blurb: 'Inversores cargadores y solares de 1.5 a 12 kW, de onda sinusoidal pura.',
  },
  {
    id: 'baterias',
    name: 'Baterías de litio',
    short: 'Baterías',
    blurb: 'Almacenamiento LiFePO4 de 2.5 a 15 kWh con hasta 6000 ciclos de vida.',
  },
  {
    id: 'paneles',
    name: 'Paneles solares',
    short: 'Paneles',
    blurb: 'Módulos monocristalinos de media celda de 575 y 670 W.',
  },
];

export interface Stat {
  label: string;
  value: string;
  unit?: string;
}

export interface SpecGroup {
  title: string;
  rows: [string, string][];
}

export interface Product {
  slug: string;
  model: string;
  name: string;
  category: CategoryId;
  kind: string;
  tagline: string;
  description: string;
  /** Potencia de referencia en W (o Wh en baterías), solo para ordenar */
  power: number;
  stats: Stat[];
  features: string[];
  specs: SpecGroup[];
  uses?: string[];
  certs?: string[];
  note?: string;
}

export type ModelMode = 'extrude' | 'relief' | 'panel';

export interface ProductAsset {
  w: number;
  h: number;
  mode: ModelMode;
  depth?: string;
  contour?: number[][];
  /** ancho, alto, fondo en mm */
  dims?: number[];
  gallery: { file: string; w: number; h: number }[];
  panel?: { cols: number; rows: number };
}

export const assets = assetsJson as unknown as Record<string, ProductAsset>;

export const imageOf = (slug: string) => `/products/${slug}.webp`;

const USOS_GENERADOR = ['Hogar', 'Oficina', 'Comercio', 'Obras', 'Camping'];

const PUERTOS_ESTACION = (ac: string, extra: [string, string]): SpecGroup => ({
  title: 'Puertos e interfaz',
  rows: [
    ['Salidas AC (corriente alterna)', ac],
    ['Salidas USB-C (carga rápida)', '2 puertos: 1× PD 100 W + 1× PD 27 W'],
    ['Salidas USB-A', '4 puertos: 2× QC 3.0 + 2× 5 V / 2.4 A'],
    ['Salida DC (corriente continua)', '1 puerto DC 12 V + 1 salida 5 A'],
    extra,
    ['Centro de monitoreo', 'Pantalla LCD central'],
  ],
});

export const products: Product[] = [
  /* ───────────── Plantas eléctricas ───────────── */
  {
    slug: 'akx-m3',
    model: 'AKXM3',
    name: 'AKX Mini 3 kVA',
    category: 'plantas',
    kind: 'Generador inverter a gasolina',
    tagline: 'Compacta, silenciosa y lista para llevar.',
    description:
      'Planta inverter monofásica de 3 kVA refrigerada por aire. Pesa 41 kg, trabaja de 8 a 10 horas continuas y entrega energía a 120 V para lo esencial de la casa, el negocio o una salida de campo.',
    power: 3000,
    stats: [
      { label: 'Potencia principal', value: '3.0', unit: 'kVA' },
      { label: 'Funcionamiento continuo', value: '8–10', unit: 'h' },
      { label: 'Ruido', value: '60', unit: 'dB' },
      { label: 'Peso neto', value: '41', unit: 'kg' },
    ],
    features: [
      'Arranque manual y eléctrico',
      'Salidas AC de 120 V y DC de 12 V',
      'Advertencia de bajo nivel de aceite y de sobrecarga',
      'Interruptor de control de ahorro',
      'Manija de tiro para moverla con una mano',
    ],
    specs: [
      {
        title: 'Generador',
        rows: [
          ['Potencia principal', '3.0 kVA'],
          ['Potencia', '2.7 kW / 2.9 kW'],
          ['Potencia máxima de salida', '120 VAC / 25 A · 12 VDC / 8.3 A'],
          ['Fase', 'Monofásica'],
          ['Frecuencia', '60 Hz'],
          ['Combustible', 'Gasolina'],
          ['Tipo de motor', 'Refrigerado por aire'],
          ['Cilindrada', '1 cilindro, 4 tiempos'],
          ['Método de arranque', 'Manual / Eléctrico'],
          ['Horas de funcionamiento continuo', '8 a 10 h'],
          ['Ruido', '60 dB'],
        ],
      },
      {
        title: 'Peso y dimensiones',
        rows: [
          ['Ancho', '710 mm'],
          ['Profundidad', '420 mm'],
          ['Alto', '505 mm'],
          ['Peso neto', '41 kg'],
          ['Tanque lleno', '15 L'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Camping'],
    certs: ['CE'],
  },
  {
    slug: 'akx-m7',
    model: 'AKXM7',
    name: 'AKX Mini 7 kVA',
    category: 'plantas',
    kind: 'Generador inverter a gasolina',
    tagline: 'Motor potente en un cuerpo de 50 kg.',
    description:
      'Planta inverter de 7 kVA refrigerada por aire, con tanque de 14 L para uso prolongado y solo 62 dB a 7 metros. Arranca a mano, con botón o a distancia.',
    power: 7000,
    stats: [
      { label: 'Potencia principal', value: '7.0', unit: 'kVA' },
      { label: 'Potencia máxima', value: '6.5', unit: 'kW' },
      { label: 'Ruido a 7 m', value: '62', unit: 'dB' },
      { label: 'Tanque', value: '14', unit: 'L' },
    ],
    features: [
      'Arranque manual, eléctrico y remoto',
      'Tomas AC de 220 V / 30 A y de 110 V / 30 A y 15 A',
      'Salida DC de 12 V',
      'Asa de transporte, varilla de tracción y ruedas',
      'Interruptor 3 en 1: encendido, combustible y estrangulador',
    ],
    specs: [
      {
        title: 'Generador',
        rows: [
          ['Potencia principal', '7.0 kVA'],
          ['Potencia', '6 kW'],
          ['Potencia máxima de salida', '6.5 kW'],
          ['Voltaje nominal DC', '12 V'],
          ['Fase', 'Monofásico, 3 hilos'],
          ['Frecuencia', '60 Hz'],
          ['Método de arranque', 'Manual / Eléctrico / Remoto'],
          ['Funcionamiento al 50 % de carga', '7 h'],
          ['Tipo de motor', 'Refrigerado por aire'],
          ['Combustible', 'Gasolina sin plomo'],
          ['Aceite en el motor', '0.8 L'],
          ['Cilindrada', '327 cc'],
          ['Ruido', '62 dB a 7 m'],
        ],
      },
      {
        title: 'Peso y dimensiones',
        rows: [
          ['Ancho', '605 mm'],
          ['Profundidad', '470 mm'],
          ['Alto', '560 mm'],
          ['Peso neto', '52 / 55 kg'],
          ['Tanque lleno', '14 L'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Obras', 'Camping'],
    certs: ['CE'],
  },
  {
    slug: 'akx-mini-9',
    model: 'AKXMINI9',
    name: 'AKX Mini 9 Silenciosa',
    category: 'plantas',
    kind: 'Generador inverter doble combustible',
    tagline: 'Gasolina o gas, con tablero ATS incluido.',
    description:
      'Generador inverter de 9 kVA que funciona con gasolina o GLP. Entrega energía limpia y estable para equipos sensibles, opera a 61 dB y trae tablero de transferencia automática para entrar solo cuando se va la luz.',
    power: 9000,
    stats: [
      { label: 'Potencia máxima', value: '9', unit: 'kVA' },
      { label: 'Potencia nominal', value: '7.6', unit: 'kVA' },
      { label: 'Ruido', value: '61', unit: 'dB' },
      { label: 'Autonomía a ¼ de carga', value: '8', unit: 'h' },
    ],
    features: [
      'Tecnología inverter: energía limpia para computadoras, televisores y routers',
      'Dual fuel: gasolina o GLP (gas licuado de petróleo)',
      'Arranque retráctil, eléctrico y por control remoto',
      'Doble voltaje 110 / 220 V',
      'Ruedas y manillar telescópico',
      'Tablero ATS incluido para transferencia automática',
    ],
    specs: [
      {
        title: 'Generador',
        rows: [
          ['Voltaje nominal', '110 / 220 V'],
          ['Frecuencia', '60 Hz'],
          ['Potencia nominal', '7.6 kW (gasolina) / 7.2 kW (GLP)'],
          ['Potencia máxima', '9 kW (gasolina) / 8 kW (GLP)'],
          ['Salida DC', '5 V / 2.1 A / 1 A'],
          ['Capacidad del tanque', '18.5 L'],
          ['Nivel de ruido', '61 dB'],
          ['Autonomía (¼ de carga)', 'Hasta 8 horas'],
          ['Factor de potencia', '1.0'],
          ['Modelo del motor', '192F-GS'],
          ['Sistema de arranque', 'Retráctil / Eléctrico / Remoto'],
        ],
      },
      {
        title: 'Tablero ATS',
        rows: [
          ['Voltaje nominal', '110 / 220 V'],
          ['Corriente nominal', '100 A'],
          ['Frecuencia', '60 Hz'],
          ['Modo de operación', 'Automático / Manual'],
        ],
      },
      {
        title: 'Peso y dimensiones',
        rows: [
          ['Dimensiones', '70 × 56.5 × 48 cm'],
          ['Peso neto', '71.3 kg'],
          ['Peso bruto', '86.4 kg'],
        ],
      },
    ],
    uses: USOS_GENERADOR,
  },
  {
    slug: 'akx-m10',
    model: 'AKXM10',
    name: 'AKX Mini 10 kVA Silenciosa',
    category: 'plantas',
    kind: 'Generador insonorizado a gasolina y gas',
    tagline: 'Cabina cerrada, doble combustible y ATS.',
    description:
      'Planta de 10 kVA en cabina insonorizada con cerradura. Trabaja con gasolina o GLP, entrega 110 / 220 V monofásico y se integra con transferencia automática.',
    power: 10000,
    stats: [
      { label: 'Potencia máxima', value: '10.2', unit: 'kVA' },
      { label: 'Potencia nominal', value: '9.6', unit: 'kVA' },
      { label: 'Potencia activa', value: '8', unit: 'kW' },
      { label: 'Tanque', value: '25', unit: 'L' },
    ],
    features: [
      'Funciona con gasolina y gas (GLP)',
      'Compatible con ATS',
      'Controlador digital con indicadores de voltaje, frecuencia, batería y tiempo de ejecución',
      'Alarmas de alta temperatura, fallo de arranque, exceso de velocidad, baja presión de aceite y voltaje alto/bajo',
      'Botón de parada de emergencia',
      'Cabina con cerradura',
    ],
    specs: [
      {
        title: 'Características',
        rows: [
          ['Potencia nominal', '9.6 kVA'],
          ['Potencia máxima', '10.2 kVA'],
          ['Potencia aparente', '10 kVA'],
          ['Potencia activa', '8 kW'],
          ['Frecuencia', '60 Hz'],
          ['Voltaje estándar', '110 / 220 V'],
          ['Fase', 'Monofásico'],
          ['Factor de potencia nominal', '1.0'],
          ['ATS', 'Sí'],
        ],
      },
      {
        title: 'Combustible',
        rows: [
          ['Gasolina', 'Sí (sin plomo, hasta 10 % de etanol)'],
          ['Gas (GLP)', 'Sí'],
          ['No usar', 'Gasolina con plomo, E15, E85 ni gasolina vieja o contaminada'],
        ],
      },
      {
        title: 'Chasis',
        rows: [
          ['Ancho', '1000 mm'],
          ['Profundidad', '575 mm'],
          ['Alto', '780 mm'],
          ['Peso neto', '165 kg'],
          ['Tanque lleno', '25 L'],
        ],
      },
      {
        title: 'Entorno operativo',
        rows: [
          ['Temperatura', '-30 °C a 40 °C'],
          ['Humedad', '< 95 %'],
          ['Altitud', '< 1000 m (reducción de potencia sobre 1000 m)'],
          ['Estándar', 'ISO 9001'],
          ['Certificación', 'CE'],
        ],
      },
    ],
    uses: ['Hogar', 'Oficina', 'Comercio'],
    certs: ['ISO 9001', 'CE'],
  },
  {
    slug: 'akx-mini-13-5',
    model: 'AKXMINI13.5',
    name: 'AKX Mini 13.5 Silenciosa',
    category: 'plantas',
    kind: 'Generador inverter triple combustible',
    tagline: 'Tres combustibles. Una sola planta.',
    description:
      'El AKX13500iET entrega un suministro estable para hogares, oficinas, comercios y talleres. Su sistema Tri-Fuel deja elegir entre gasolina, GLP o gas natural según lo que haya disponible o cueste menos, y el inverter protege los equipos sensibles contra variaciones de voltaje.',
    power: 13500,
    stats: [
      { label: 'Potencia máxima', value: '13.5', unit: 'kVA' },
      { label: 'Potencia nominal', value: '11.5', unit: 'kVA' },
      { label: 'Combustibles', value: '3' },
      { label: 'Autonomía a ¼ de carga', value: '9', unit: 'h' },
    ],
    features: [
      'Tri-Fuel: gasolina, GLP o gas natural',
      'Tecnología inverter para equipos electrónicos sensibles',
      'Arranque retráctil, eléctrico y por control remoto',
      'Doble voltaje 110 / 220 V',
      'Ruedas de gran diámetro y manillar tipo U',
      'Tablero ATS incluido para transferencia automática',
    ],
    specs: [
      {
        title: 'Generador',
        rows: [
          ['Voltaje nominal', '110 / 220 V'],
          ['Frecuencia', '60 Hz'],
          ['Potencia nominal', '11.5 kW (gasolina) / 10.35 kW (GLP) / 9.2 kW (gas natural)'],
          ['Potencia máxima', '13.5 kW (gasolina) / 12.15 kW (GLP) / 10.8 kW (gas natural)'],
          ['Salida DC', '12 V / 8.3 A'],
          ['Capacidad del tanque', '26 L'],
          ['Cilindrada', '550 cc'],
          ['Nivel de ruido', '65 dB'],
          ['Autonomía (¼ de carga)', 'Hasta 9 horas'],
          ['Factor de potencia', '1.0'],
          ['Modelo del motor', '196F-GS'],
          ['Sistema de arranque', 'Retráctil / Eléctrico / Remoto'],
        ],
      },
      {
        title: 'Tablero ATS',
        rows: [
          ['Voltaje nominal', '110 / 220 V'],
          ['Corriente nominal', '100 A'],
          ['Frecuencia', '60 Hz'],
          ['Modo de operación', 'Automático / Manual'],
        ],
      },
      {
        title: 'Peso y dimensiones',
        rows: [
          ['Dimensiones', '77.5 × 75 × 55.5 cm'],
          ['Peso neto', '122.5 kg'],
          ['Peso bruto', '137 kg'],
        ],
      },
    ],
    uses: USOS_GENERADOR,
  },
  {
    slug: 'akx-20',
    model: 'AKX20',
    name: 'AKX 20 kVA Diésel',
    category: 'plantas',
    kind: 'Generador diésel silencioso',
    tagline: 'Respaldo diésel para trabajar todo el día.',
    description:
      'Planta diésel silenciosa de 20 kVA a 60 Hz, refrigerada por agua, con alternador de tecnología Stanford y control SmartGen. Incluye transferencia automática y depósito de combustible.',
    power: 20000,
    stats: [
      { label: 'Potencia en espera', value: '20', unit: 'kVA' },
      { label: 'Potencia prime', value: '18', unit: 'kVA' },
      { label: 'Consumo al 50 %', value: '3.0', unit: 'L/h' },
      { label: 'Tanque', value: '40', unit: 'L' },
    ],
    features: [
      'Motor diésel de 4 cilindros con inyección directa',
      'Alternador síncrono sin escobillas, tecnología Stanford',
      'Control SmartGen HGM4020N con arranque y parada manual o automática',
      'Transferencia automática AISIKAI de 100 A',
      'Protección contra alta temperatura del refrigerante, baja presión de aceite, sobrecarga y desequilibrio',
      'Breaker CHINT de 100 A y depósito de combustible incluidos',
    ],
    specs: [
      {
        title: 'Especificaciones',
        rows: [
          ['Potencia aparente', '20 kVA stand-by / 18 kVA prime'],
          ['Potencia activa', '16 kW'],
          ['Velocidad nominal', '1800 rpm'],
          ['Voltaje estándar', '110 V / 220 V'],
          ['Fases e hilos', 'Monofásico, 3 hilos'],
          ['Frecuencia', '60 Hz'],
          ['Batería', '12 V'],
          ['Amperaje máximo', '81 A'],
          ['Factor de potencia nominal', '0.8'],
        ],
      },
      {
        title: 'Motor',
        rows: [
          ['Modelo', 'N490D'],
          ['Potencia', '24 kWm'],
          ['Entrada de aire', 'Natural'],
          ['Regulador', 'Solenoide'],
          ['Ciclos y cilindros', '4 tiempos, 4 cilindros'],
          ['Desplazamiento', '2.16 L'],
          ['Consumo de combustible', '3.00 L/h al 50 % · 4.10 L/h al 75 %'],
          ['Índice de compresión', '18:1'],
          ['Sistema de combustión', 'Inyección directa'],
          ['Refrigeración', 'Por agua'],
        ],
      },
      {
        title: 'Alternador',
        rows: [
          ['Modelo', '184ES (tecnología Stanford)'],
          ['Potencia del alternador', '20 kVA stand-by / 18 kVA prime'],
          ['Sistema', 'Síncrono AC sin escobillas, monopalier'],
          ['Aislamiento y protección', 'H, IP23'],
          ['Regulador de voltaje', 'AVR estándar'],
        ],
      },
      {
        title: 'Control y transferencia',
        rows: [
          ['Sistema de control', 'SmartGen HGM4020N'],
          ['Arranque y parada', 'Manual o automática'],
          ['ATS', 'AISIKAI, transferencia automática, 100 A'],
          ['Breaker', 'CHINT 100 A'],
        ],
      },
      {
        title: 'Peso y dimensiones',
        rows: [
          ['Ancho (L)', '1750 mm'],
          ['Profundidad (W)', '750 mm'],
          ['Alto (H)', '860 mm'],
          ['Peso neto', '670 kg'],
          ['Capacidad del tanque', '40 L'],
        ],
      },
    ],
    uses: ['Comercio', 'Oficina', 'Obras'],
    note:
      'Los valores se obtuvieron en condiciones ideales de funcionamiento y deben tomarse como un estimado. Por el clima tropical de Venezuela el consumo tabulado puede incrementarse entre 5 % y 10 %, y alrededor de 3.6 % adicional si el diésel presenta impurezas.',
  },
  {
    slug: 'akx-27-5',
    model: 'AKX27.5',
    name: 'AKX 27.5 kVA Diésel',
    category: 'plantas',
    kind: 'Generador diésel silencioso',
    tagline: 'La más grande de la línea: 22 kW en cabina silenciosa.',
    description:
      'Planta diésel silenciosa de 27.5 kVA a 60 Hz, refrigerada por agua, con alternador de tecnología Stanford y control ComAp. Incluye transferencia automática y depósito de combustible.',
    power: 27500,
    stats: [
      { label: 'Potencia en espera', value: '27.5', unit: 'kVA' },
      { label: 'Potencia activa', value: '22', unit: 'kW' },
      { label: 'Consumo al 50 %', value: '3.9', unit: 'L/h' },
      { label: 'Tanque', value: '40', unit: 'L' },
    ],
    features: [
      'Motor diésel de 4 cilindros con inyección directa',
      'Alternador síncrono sin escobillas, tecnología Stanford',
      'Control ComAp AMF8 con arranque y parada manual o automática',
      'Transferencia automática AISIKAI de 100 A',
      'Protección contra alta temperatura del refrigerante, baja presión de aceite, sobrecarga y desequilibrio',
      'Breaker CHINT de 100 A y depósito de combustible incluidos',
    ],
    specs: [
      {
        title: 'Especificaciones',
        rows: [
          ['Potencia aparente', '27.5 kVA stand-by / 24.75 kVA prime'],
          ['Potencia activa', '22 kW'],
          ['Velocidad nominal', '1800 rpm'],
          ['Voltaje estándar', '110 V / 220 V'],
          ['Fases e hilos', 'Monofásico, 3 hilos'],
          ['Frecuencia', '60 Hz'],
          ['Batería', '12 V'],
          ['Amperaje máximo', '116 A'],
          ['Factor de potencia nominal', '0.8'],
        ],
      },
      {
        title: 'Motor',
        rows: [
          ['Modelo', 'QC490D'],
          ['Potencia', '25 / 28 kWm'],
          ['Entrada de aire', 'Natural'],
          ['Regulador', 'Solenoide'],
          ['Ciclos y cilindros', '4 tiempos, 4 cilindros'],
          ['Desplazamiento', '2.16 L'],
          ['Consumo de combustible', '3.90 L/h al 50 % · 5.40 L/h al 75 %'],
          ['Índice de compresión', '18:1'],
          ['Sistema de combustión', 'Inyección directa'],
          ['Refrigeración', 'Por agua'],
        ],
      },
      {
        title: 'Alternador',
        rows: [
          ['Modelo', '184F (tecnología Stanford)'],
          ['Potencia del alternador', '27.5 kVA stand-by / 24.75 kVA prime'],
          ['Sistema', 'Síncrono AC sin escobillas, monopalier'],
          ['Aislamiento y protección', 'H, IP23'],
          ['Regulador de voltaje', 'AVR estándar'],
        ],
      },
      {
        title: 'Control y transferencia',
        rows: [
          ['Sistema de control', 'ComAp AMF8'],
          ['Arranque y parada', 'Manual o automática'],
          ['ATS', 'AISIKAI, transferencia automática, 100 A'],
          ['Breaker', 'CHINT 100 A'],
        ],
      },
      {
        title: 'Peso y dimensiones',
        rows: [
          ['Ancho (L)', '2000 mm'],
          ['Profundidad (W)', '900 mm'],
          ['Alto (H)', '1100 mm'],
          ['Peso neto', '1510 kg'],
          ['Capacidad del tanque', '40 L'],
        ],
      },
    ],
    uses: ['Comercio', 'Oficina', 'Obras'],
  },

  /* ───────────── Estaciones portátiles ───────────── */
  {
    slug: 'akx-pe800',
    model: 'AKX-PE800KW',
    name: 'Estación portátil 800 W',
    category: 'estaciones',
    kind: 'Estación de carga portátil 768 Wh',
    tagline: 'Energía de 8.8 kg que cabe en la maleta del carro.',
    description:
      'Estación de carga portátil de 800 W con batería LiFePO4 de 768 Wh. Sin ruido ni combustible: se recarga en la pared en 2 a 4 horas o con paneles solares AKX de 200 W.',
    power: 800,
    stats: [
      { label: 'Salida nominal', value: '800', unit: 'W' },
      { label: 'Batería', value: '768', unit: 'Wh' },
      { label: 'Recarga AC', value: '2–4', unit: 'h' },
      { label: 'Peso neto', value: '8.8', unit: 'kg' },
    ],
    features: [
      'Celdas LiFePO4 con más de 3500 ciclos de carga',
      '4 tomas AC de 120 V',
      'USB-C con carga rápida PD de 100 W',
      'Pad superior de carga inalámbrica',
      'Admite paneles solares AKX de 200 W para autonomía total',
      'Chasis de polímero ABS resistente a impactos y temperatura',
    ],
    specs: [
      {
        title: 'Energía',
        rows: [
          ['Potencia de salida nominal', '800 W'],
          ['Capacidad de batería', '768 Wh'],
          ['Química de celda', 'LiFePO4'],
          ['Vida útil', 'Más de 3500 ciclos de carga'],
        ],
      },
      PUERTOS_ESTACION('4 tomas AC 120 V estándar', ['Carga inalámbrica', '1 pad superior']),
      {
        title: 'Recarga',
        rows: [
          ['Red eléctrica (AC)', '2 h a 4 h'],
          ['Generación solar', '4 h a 6 h'],
          ['Paneles compatibles', 'Paneles solares AKX (200 W)'],
        ],
      },
      {
        title: 'Chasis',
        rows: [
          ['Material', 'Polímero ABS de alta resistencia a impactos y temperatura'],
          ['Acabado', 'Bitono gris/negro texturizado'],
          ['Dimensiones', '317.3 × 210 × 197 mm'],
          ['Peso neto', '8.8 kg'],
        ],
      },
    ],
    uses: ['Hogar', 'Oficina', 'Camping'],
  },
  {
    slug: 'akx-pe2400',
    model: 'AKX-PE2400KW',
    name: 'Estación portátil 2400 W',
    category: 'estaciones',
    kind: 'Estación de carga portátil 2496 Wh',
    tagline: 'Seis tomas, cero ruido.',
    description:
      'Estación de carga portátil de 2400 W con batería LiFePO4 de 2496 Wh y ruedas. Alimenta seis equipos a 120 V a la vez y se recarga en la pared o con paneles solares AKX de 400 W.',
    power: 2400,
    stats: [
      { label: 'Salida nominal', value: '2400', unit: 'W' },
      { label: 'Batería', value: '2496', unit: 'Wh' },
      { label: 'Recarga AC', value: '4–6', unit: 'h' },
      { label: 'Peso neto', value: '25', unit: 'kg' },
    ],
    features: [
      'Celdas LiFePO4 con más de 3500 ciclos de carga',
      '6 tomas AC de 120 V',
      'USB-C con carga rápida PD de 100 W',
      '2 pads superiores de carga inalámbrica',
      'Admite paneles solares AKX de 400 W para autonomía total',
      'Chasis ABS con ruedas',
    ],
    specs: [
      {
        title: 'Energía',
        rows: [
          ['Potencia de salida nominal', '2400 W'],
          ['Capacidad de batería', '2496 Wh'],
          ['Química de celda', 'LiFePO4'],
          ['Vida útil', 'Más de 3500 ciclos de carga'],
        ],
      },
      PUERTOS_ESTACION('6 tomas AC 120 V estándar', ['Carga inalámbrica', '2 pads superiores']),
      {
        title: 'Recarga',
        rows: [
          ['Red eléctrica (AC)', '4 h a 6 h'],
          ['Generación solar', '8 h a 10 h'],
          ['Paneles compatibles', 'Paneles solares AKX (400 W)'],
        ],
      },
      {
        title: 'Chasis',
        rows: [
          ['Material', 'Polímero ABS de alta resistencia a impactos y temperatura'],
          ['Acabado', 'Bitono gris, con ruedas'],
          ['Dimensiones', '500 × 300 × 280 mm'],
          ['Peso neto', '25 kg'],
        ],
      },
    ],
    uses: ['Hogar', 'Oficina', 'Comercio', 'Camping'],
  },
  {
    slug: 'akx-pe6000',
    model: 'AKX-PE6000KW',
    name: 'Estación portátil 6000 W',
    category: 'estaciones',
    kind: 'Estación de carga portátil 3600 Wh',
    tagline: '6000 W sobre ruedas, con salida de 220 V.',
    description:
      'La estación más potente de la línea: 6000 W de salida, batería LiFePO4 de 3600 Wh y toma de 220 V para equipos de mayor consumo. Se recarga en la pared o con paneles solares AKX de 400 W.',
    power: 6000,
    stats: [
      { label: 'Salida nominal', value: '6000', unit: 'W' },
      { label: 'Batería', value: '3600', unit: 'Wh' },
      { label: 'Recarga AC', value: '5–8', unit: 'h' },
      { label: 'Peso neto', value: '46', unit: 'kg' },
    ],
    features: [
      'Celdas LiFePO4 con más de 3500 ciclos de carga',
      '3 tomas AC de 120 V y 1 toma AC de 220 V',
      'USB-C con carga rápida PD de 100 W',
      'Pantalla LCD central de monitoreo',
      'Admite paneles solares AKX de 400 W para autonomía total',
      'Chasis ABS con ruedas',
    ],
    specs: [
      {
        title: 'Energía',
        rows: [
          ['Potencia de salida nominal', '6000 W'],
          ['Capacidad de batería', '3600 Wh'],
          ['Química de celda', 'LiFePO4'],
          ['Vida útil', 'Más de 3500 ciclos de carga'],
        ],
      },
      PUERTOS_ESTACION('3 tomas AC 120 V estándar', ['Salida AC 220 V', '1 toma AC 220 V estándar']),
      {
        title: 'Recarga',
        rows: [
          ['Red eléctrica (AC)', '5 h a 8 h'],
          ['Generación solar', '10 h a 15 h'],
          ['Paneles compatibles', 'Paneles solares AKX (400 W)'],
        ],
      },
      {
        title: 'Chasis',
        rows: [
          ['Material', 'Polímero ABS de alta resistencia a impactos y temperatura'],
          ['Acabado', 'Bitono gris, con ruedas'],
          ['Dimensiones', '560 × 390 × 320 mm'],
          ['Peso neto', '46 kg'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Obras'],
  },

  /* ───────────── Inversores ───────────── */
  {
    slug: 'inversor-akx-1-5kw',
    model: 'AKXI1.5',
    name: 'Inversor AKX 1.5 kW',
    category: 'inversores',
    kind: 'Inversor cargador',
    tagline: 'Respaldo para la casa o el local cuando falla la red.',
    description:
      'Almacena energía y la entrega cuando el suministro principal falla. Su arranque suave protege motores como los de neveras o bombas de agua, y la pantalla muestra el estado del sistema de un vistazo.',
    power: 1500,
    stats: [
      { label: 'Potencia nominal', value: '1.5', unit: 'kW' },
      { label: 'Sobretensión (20 ms)', value: '4.5', unit: 'kW' },
      { label: 'Arranque de motores', value: '2', unit: 'HP' },
      { label: 'Batería', value: '12', unit: 'VDC' },
    ],
    features: [
      'Salida de onda sinusoidal pura',
      'Soporta 3 veces la potencia nominal en el arranque',
      'Pantalla multifunción con estados LED + LCD',
      'Monitoreo por software de PC; admite módulo WiFi / 4G',
      'Prioridad de red o de batería configurable',
      'Voltaje de salida configurable a 110 / 115 / 120 V y frecuencia a 50 / 60 Hz',
      'Modo ahorro de energía',
    ],
    specs: [
      {
        title: 'Entrada / salida',
        rows: [
          ['Potencia nominal', '1.5 kW'],
          ['Capacidad de sobretensión (20 ms)', '4.5 kW'],
          ['Capacidad de iniciar motores eléctricos', '2 HP'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Tensión nominal de salida RMS', '100-110-120 V AC'],
          ['Frecuencia de salida', '50 Hz ± 0.3 Hz / 60 Hz ± 0.3 Hz'],
          ['Eficiencia del inversor (pico)', '> 88 %'],
          ['Eficiencia en modo línea', '> 95 %'],
          ['Factor de poder', '0.9 – 1.0'],
          ['Tiempo de transferencia típico', '10 ms (máx.)'],
          ['Ruido audible', '60 dB máx.'],
        ],
      },
      {
        title: 'Batería y cargador',
        rows: [
          ['Voltaje DC', '12 V DC'],
          ['Tipo de batería', 'Baterías de gel'],
          ['Alarma de voltaje bajo', '10.5 V DC'],
          ['Alarma de voltaje alto', '16.0 V DC'],
          ['Protección del cargador', '15 A'],
        ],
      },
      {
        title: 'Bypass y protección',
        rows: [
          ['Protección contra sobrecarga (SMPS)', 'Breaker'],
          ['Protección de salida contra cortocircuitos', 'Breaker'],
          ['Capacidad del breaker del bypass', '10 A'],
          ['Corriente de bypass máxima', '30 A'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '425 mm'],
          ['Ancho', '375 mm'],
          ['Alto', '200 mm'],
          ['Peso neto', '17 kg'],
          ['Montaje', 'En pared'],
          ['Temperatura en operación', '0 °C a 40 °C'],
          ['Temperatura en almacenamiento', '-15 °C a 60 °C'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio'],
    certs: ['CE'],
  },
  {
    slug: 'inversor-akx-pro-2-5kw',
    model: 'AKXIP2.5',
    name: 'Inversor AKX PRO 2.5 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar',
    tagline: 'Solar de 24 V que sigue funcionando sin batería.',
    description:
      'Inversor cargador solar de 2.5 kW a 230 V con MPPT integrado y puerto BMS. Compatible con la red pública o con un generador, y capaz de operar aun sin batería conectada.',
    power: 2500,
    stats: [
      { label: 'Potencia', value: '2.5', unit: 'kW' },
      { label: 'Eficiencia pico', value: '95', unit: '%' },
      { label: 'Campo solar máx.', value: '3000', unit: 'W' },
      { label: 'Batería', value: '24', unit: 'VDC' },
    ],
    features: [
      'Inversor de onda sinusoidal pura',
      'Puerto de comunicación BMS integrado',
      'Kit antipolvo integrado',
      'Sigue funcionando sin la batería',
      'Rango de entrada y corriente de carga configurables desde la pantalla LCD',
      'Compatible con la red eléctrica pública o la energía de un generador',
      'Protección contra sobrecarga, sobretemperatura y cortocircuitos',
    ],
    specs: [
      {
        title: 'Entrada / salida',
        rows: [
          ['Voltaje de entrada', '230 VAC'],
          ['Rango de frecuencia', '50 Hz / 60 Hz'],
          ['Rango de voltaje seleccionable', '180 – 270 VAC'],
          ['Regulación de voltaje AC (modo batería)', '230 V AC ± 5 %'],
          ['Sobrecarga de salida', '5 kW (5 segundos)'],
          ['Eficiencia (pico)', '95 %'],
          ['Tiempo de transferencia', '10 ms típico (UPS) · 20 ms típico (dispositivos del hogar)'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Consumo de energía en vacío', '< 35 W'],
        ],
      },
      {
        title: 'Entrada fotovoltaica',
        rows: [
          ['Tipo de cargador solar', 'MPPT'],
          ['Número de puertos MPPT', '1'],
          ['Potencia máxima del conjunto fotovoltaico', '3000 W'],
          ['Rango MPPT y voltaje de funcionamiento', '30 ~ 400 VDC (30 ~ 60 V con batería)'],
          ['Voltaje a circuito abierto (VOC)', '450 VDC'],
          ['Corriente de cortocircuito (ISC)', '13 A'],
          ['Corriente de carga máxima', '100 A'],
        ],
      },
      {
        title: 'Cargador de batería',
        rows: [
          ['Tipo de batería', 'Litio'],
          ['Voltaje de batería', '24 VDC'],
          ['Voltaje de carga flotante', '27 VDC'],
          ['Corriente AC de carga máxima', '80 A'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '90 mm'],
          ['Ancho', '288 mm'],
          ['Alto', '357 mm'],
          ['Peso neto', '7.0 kg'],
          ['Montaje', 'En pared'],
          ['Humedad', '5 % a 95 % de humedad relativa'],
          ['Temperatura en operación', '-10 °C a 50 °C'],
          ['Cumplimiento de seguridad', 'CE'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio'],
    certs: ['CE'],
  },
  {
    slug: 'inversor-akx-pro-3kw',
    model: 'AKXIP3.0',
    name: 'Inversor AKX PRO 3.0 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar',
    tagline: '3 kW a 120 V con controlador solar integrado.',
    description:
      'Inversor cargador solar de 3 kW a 120 V con controlador de carga integrado. Se reinicia solo cuando vuelve la red, arranca en frío y deja configurar prioridades desde la pantalla LCD.',
    power: 3000,
    stats: [
      { label: 'Potencia', value: '3.0', unit: 'kW' },
      { label: 'Pico (5 s)', value: '6', unit: 'kW' },
      { label: 'Eficiencia pico', value: '90', unit: '%' },
      { label: 'Batería', value: '24', unit: 'VDC' },
    ],
    features: [
      'Inversor de onda sinusoidal pura',
      'Controlador de carga solar MPPT',
      'Prioridad del cargador AC / solar configurable en la pantalla LCD',
      'Compatible con la red eléctrica pública o la energía de un generador',
      'Reinicio automático cuando el voltaje AC se recupera',
      'Protección contra sobrecarga, sobretemperatura y cortocircuito',
      'Función de arranque en frío',
    ],
    specs: [
      {
        title: 'Entrada / salida',
        rows: [
          ['Voltaje de entrada', '120 VAC'],
          ['Rango de frecuencia', '50 Hz / 60 Hz'],
          ['Rango de voltaje', '90 – 140 VAC'],
          ['Regulación de voltaje de salida', '110 / 120 VAC ± 5 %'],
          ['Sobrecarga de salida', '6 kW (5 segundos)'],
          ['Protección contra sobrecarga', '5 s a ≥ 150 % de carga · 10 s a 110 % ~ 150 %'],
          ['Eficiencia (pico)', '90 %'],
          ['Tiempo de transferencia', '10 ms típico (computadoras) · 20 ms típico (electrodomésticos)'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Consumo de energía en espera', '2 W'],
        ],
      },
      {
        title: 'Entrada fotovoltaica',
        rows: [
          ['Tipo de cargador solar', 'PWM / MPPT'],
          ['Número de puertos MPPT', '1'],
          ['Voltaje a circuito abierto (VOC)', '145 VDC'],
          ['Voltaje mínimo del conjunto fotovoltaico', '17 VDC'],
          ['Rango MPPT y voltaje de funcionamiento', '38 ~ 80 VDC'],
          ['Corriente de cortocircuito (ISC)', '80 A'],
        ],
      },
      {
        title: 'Cargador de batería',
        rows: [
          ['Tipo de batería', 'Litio'],
          ['Voltaje de batería', '24 VDC'],
          ['Voltaje de carga flotante', '27 VDC'],
          ['Corriente de carga máxima', '140 A'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '305 mm'],
          ['Ancho', '125 mm'],
          ['Alto', '460 mm'],
          ['Peso neto', '11 kg'],
          ['Montaje', 'En pared'],
          ['Humedad', '5 % a 95 % de humedad relativa'],
          ['Temperatura en operación', '0 °C a 55 °C'],
          ['Cumplimiento de seguridad', 'CE'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio'],
    certs: ['CE'],
  },
  {
    slug: 'inversor-akx-zero-3kw',
    model: 'AKXIZ3.0',
    name: 'Inversor AKX ZERO 3.0 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar para servidores',
    tagline: 'Cero milisegundos. Nada se reinicia.',
    description:
      'Inversor híbrido de 3 kW pensado para cargas de misión crítica: centros de datos, servidores y equipos de telecomunicaciones. Su tiempo de transferencia de 0 ms garantiza que los equipos conectados no sufran cortes ni reinicios inesperados.',
    power: 3000,
    stats: [
      { label: 'Tiempo de transferencia', value: '0', unit: 'ms' },
      { label: 'Potencia', value: '3.0', unit: 'kW' },
      { label: 'Campo solar máx.', value: '4000', unit: 'W' },
      { label: 'En paralelo', value: '9', unit: 'unidades' },
    ],
    features: [
      'Tiempo de transferencia cero (0 ms) para cargas de misión crítica',
      'Inversor solar de onda sinusoidal pura',
      'Cargador solar MPPT de 80 A incorporado',
      'Alto rango de entrada DC',
      'Prioridad de entrada AC / solar configurable desde el panel LCD',
      'Compatible con voltaje principal y generador',
      'Opera en paralelo hasta 9 unidades',
    ],
    specs: [
      {
        title: 'Entrada',
        rows: [
          ['Voltaje de entrada', '120 VAC'],
          ['Rango de voltaje seleccionable', '95 – 140 VAC'],
          ['Rango de frecuencia', '50 Hz / 60 Hz (detección automática) ± 4 Hz'],
          ['Factor de potencia', '0.98 a voltaje nominal (100 % de carga)'],
          ['THDi', '10 %'],
        ],
      },
      {
        title: 'Salida',
        rows: [
          ['Regulación de voltaje AC (modo batería y línea)', '120 VAC ± 5 %'],
          ['Rango de frecuencia (sincronizado)', '46 ~ 54 Hz o 56 ~ 64 Hz'],
          ['Rango de frecuencia (modo batería)', '50 Hz ± 0.1 Hz o 60 Hz ± 0.1 Hz'],
          ['Distorsión armónica', '3 % THD (carga lineal)'],
          ['Forma de onda', 'Onda sinusoidal pura'],
        ],
      },
      {
        title: 'Eficiencia y transferencia',
        rows: [
          ['Modo línea', '> 90 %'],
          ['Modo ECO', '98 %'],
          ['Modo batería', '92 %'],
          ['Modo AC a modo batería', '0 ms'],
          ['Inversor a bypass', '4 ms (típico)'],
        ],
      },
      {
        title: 'Solar y batería',
        rows: [
          ['Tipo de cargador solar', 'MPPT'],
          ['Número de puertos MPPT', '1'],
          ['Potencia máxima del conjunto fotovoltaico', '4000 W'],
          ['Tensión máxima fotovoltaica', '145 VDC'],
          ['Corriente de carga solar máxima', '80 A'],
          ['Voltaje de batería', '48 VDC (litio)'],
          ['Voltaje de carga flotante', '54 VDC'],
          ['Protección sobrevoltaje', '66 VDC'],
          ['Corriente de carga máxima', '60 A'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '120 mm'],
          ['Ancho', '295 mm'],
          ['Alto', '468 mm'],
          ['Peso neto', '11 kg'],
          ['Montaje', 'En pared'],
          ['Temperatura en operación', '-10 °C a 50 °C'],
          ['Certificación de seguridad', 'CE'],
        ],
      },
    ],
    uses: ['Oficina', 'Comercio'],
    certs: ['CE'],
  },
  {
    slug: 'inversor-growatt-3kw-48p',
    model: 'AKXIGT3',
    name: 'Inversor Growatt 3.0 kW – 48P',
    category: 'inversores',
    kind: 'Inversor cargador solar',
    tagline: 'Respaldo a 48 V con monitoreo por WiFi.',
    description:
      'Inversor multifuncional Growatt de 3000 W y 48 V para hogares y pequeñas empresas. Opera con baterías de litio, se alimenta de paneles solares y gestiona la carga y descarga para alargar la vida del sistema. Soporta aires acondicionados.',
    power: 3000,
    stats: [
      { label: 'Potencia nominal', value: '3000', unit: 'W' },
      { label: 'Pico', value: '6000', unit: 'VA' },
      { label: 'Campo solar máx.', value: '4500', unit: 'W' },
      { label: 'En paralelo', value: '6', unit: 'unidades' },
    ],
    features: [
      'Inversor de almacenamiento de energía fuera de la red',
      'Salida de 110 V',
      'Controlador de carga solar MPPT integrado',
      'Compatible con 6 unidades en paralelo',
      'Baterías de 48 VDC de litio o plomo-ácido',
      'Monitoreo remoto vía WiFi',
    ],
    specs: [
      {
        title: 'Salida del inversor',
        rows: [
          ['Potencia nominal', '3000 VA / 3000 W'],
          ['Capacidad paralela', 'Sí, 6 unidades máx.'],
          ['Regulación de voltaje AC (modo batería)', '120 VAC ± 5 % a 50 / 60 Hz'],
          ['Potencia de sobretensión', '6000 VA'],
          ['Eficiencia (pico)', '93 %'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Tiempo de transferencia', '10 ms – 20 ms'],
        ],
      },
      {
        title: 'Cargador solar',
        rows: [
          ['Potencia máxima del conjunto fotovoltaico', '4500 W'],
          ['Rango MPPT a voltaje de funcionamiento', '60 V CC ~ 115 V CC'],
          ['Voltaje máximo de circuito abierto', '145 V CC'],
          ['Corriente máxima de carga solar', '80 A'],
          ['Eficiencia máxima', '97 %'],
          ['Consumo de energía en espera', '2 W'],
        ],
      },
      {
        title: 'Cargador AC',
        rows: [
          ['Corriente de carga', '60 A'],
          ['Voltaje de entrada de CA', '120 V CA'],
          ['Rango de voltaje seleccionable', '95-140 V CA / 65-140 V CA'],
          ['Rango de frecuencia', '50 Hz / 60 Hz'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '130 mm'],
          ['Ancho', '350 mm'],
          ['Alto', '455 mm'],
          ['Peso neto', '11 kg'],
          ['Montaje', 'En pared'],
          ['Humedad', 'Del 5 % al 95 %'],
          ['Temperatura de funcionamiento', '0 °C a 55 °C'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio'],
  },
  {
    slug: 'inversor-akx-home-6kw',
    model: 'AKXIH6.0',
    name: 'Inversor AKX HOME 6.0 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar',
    tagline: 'El de la casa: 6 kW con cargador MPPT de 80 A.',
    description:
      'Inversor cargador solar de 6 kW a 48 V con interfaz amigable, carga en tres pasos y puerto WiFi. Acepta baterías de ácido o de litio y deja elegir la prioridad de la fuente de salida.',
    power: 6000,
    stats: [
      { label: 'Potencia', value: '6.0', unit: 'kW' },
      { label: 'Cargador MPPT', value: '80', unit: 'A' },
      { label: 'Campo solar máx.', value: '5000', unit: 'W' },
      { label: 'Batería', value: '48', unit: 'VDC' },
    ],
    features: [
      'Salida de onda sinusoidal pura',
      'Carga en 3 pasos: bruta, absorción y flotación',
      'Pantalla multifunción e interfaz amigable',
      'Protección contra sobrecargas y cortocircuitos',
      'Selección de prioridad de la fuente de salida',
      'Selección de batería de ácido o de litio',
      'Puerto WiFi y BAT CAN',
      'Modo ahorro de energía',
    ],
    specs: [
      {
        title: 'Entrada / salida',
        rows: [
          ['Voltaje de entrada', '220 VAC'],
          ['Rango de frecuencia', '50 Hz / 60 Hz'],
          ['Rango de voltaje seleccionable', '90-140 VAC (computadores) · 80-140 VAC (dispositivos de hogar)'],
          ['Voltaje de salida', '100/110/120 VAC (200/220/240 VAC) ± 10 %'],
          ['Tiempo de transferencia', '10 ms (computadoras) · 20 ms (dispositivos del hogar)'],
          ['Eficiencia (pico)', '80 %'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Consumo de energía en vacío', '< 70 W'],
        ],
      },
      {
        title: 'Entrada fotovoltaica',
        rows: [
          ['Tipo de cargador solar', 'MPPT – 80 A'],
          ['Número de puertos MPPT', '1'],
          ['Potencia máxima del conjunto fotovoltaico', '5000 W'],
          ['Voltaje máximo de entrada', '245 ± 2 V'],
          ['Corriente de carga máxima', '80 A ± 4 A'],
          ['Rango de voltaje MPPT', '60 – 230 V'],
        ],
      },
      {
        title: 'Cargador de batería',
        rows: [
          ['Voltaje de batería', '48 VDC'],
          ['Etapas de carga', 'Carga bruta, absorción, flotación'],
          ['Corriente de carga ajustable', '10 A mín. (ajuste cada 5 A)'],
          ['Protección contra cortocircuitos', 'Breaker / disyuntor'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '550 mm'],
          ['Ancho', '330 mm'],
          ['Montaje', 'En pared'],
          ['Humedad', '5 % a 95 % de humedad relativa'],
          ['Temperatura en operación', '-10 °C a 50 °C'],
          ['Cumplimiento de seguridad', 'UL'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio'],
    certs: ['UL'],
  },
  {
    slug: 'inversor-akx-infini-solar-6kw',
    model: 'AKXIF6.0',
    name: 'Inversor AKX INFINI SOLAR 6.0 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar híbrido',
    tagline: 'Conectado a la red, híbrido o fuera de red.',
    description:
      'Inversor híbrido de 6 kW que trabaja conectado a la red, en modo híbrido o fuera de red. Recibe hasta 6000 W de paneles con tensión de entrada de hasta 450 VDC y carga baterías de 48 V a 120 A.',
    power: 6000,
    stats: [
      { label: 'Potencia', value: '6.0', unit: 'kW' },
      { label: 'Campo solar máx.', value: '6000', unit: 'W' },
      { label: 'Carga máx.', value: '120', unit: 'A' },
      { label: 'Eficiencia DC/AC', value: '95', unit: '%' },
    ],
    features: [
      'Tres modos: conectado a la red, híbrido y fuera de red',
      'Salida 110-120 VAC (L-N) / 220-240 VAC (L1-L2)',
      'Funcionamiento en paralelo',
      'Puerto BMS: CAN, RS-485 o RS-232',
      'Comunicación RS232, contacto seco y WiFi',
      'Puerto USB y puerto para panel LCD remoto',
    ],
    specs: [
      {
        title: 'Entrada y salida',
        rows: [
          ['Tensión nominal de funcionamiento', '110-120 VAC (L-N) / 220-240 VAC (L1-L2)'],
          ['Corriente nominal de salida', '27 / 27 A'],
          ['Frecuencia nominal', '50 / 60 Hz'],
          ['Rango de factor de potencia', '0.9 de adelanto – 0.9 de atraso'],
          ['Corriente máxima de entrada', '40 / 40 A'],
          ['Máxima eficiencia de conversión (DC/AC)', '95 %'],
        ],
      },
      {
        title: 'Entrada fotovoltaica',
        rows: [
          ['Potencia FV máxima', '6000 W'],
          ['Tensión de entrada máxima', '450 VDC'],
          ['Rango MPPT de potencia', '120 VDC ~ 430 VDC'],
          ['Número de rastreadores MPPT', '1'],
          ['Corriente de cortocircuito (ISC)', '27 A'],
        ],
      },
      {
        title: 'Batería y cargador',
        rows: [
          ['Tensión nominal de DC', '48 VDC'],
          ['Corriente de carga máxima (desde la red)', '120 A'],
          ['Corriente de carga máxima (desde FV)', '120 A'],
          ['Corriente de carga máxima', '120 A'],
        ],
      },
      {
        title: 'Salida en modo batería',
        rows: [
          ['Tensión nominal de salida', '110-120 VAC (L-N) / 220-240 VAC (L1-L2)'],
          ['Forma de onda de salida', 'Onda sinusoidal pura'],
          ['Eficiencia', '93 %'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '593.6 mm'],
          ['Ancho', '365 mm'],
          ['Alto', '138.4 mm'],
          ['Peso neto', '26 kg'],
          ['Montaje', 'En pared'],
          ['Temperatura en operación', '-10 °C a +50 °C'],
          ['Grado de protección', 'IP21'],
          ['Cumplimiento de seguridad', 'CE'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio'],
    certs: ['CE', 'IP21'],
  },
  {
    slug: 'inversor-akx-max-pro-i-6-5kw',
    model: 'AKXIMPI6.5',
    name: 'Inversor AKX Max Pro I 6.5 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar',
    tagline: '6.5 kW con doble MPPT y WiFi integrado.',
    description:
      'Inversor cargador solar de 6.5 kW a 120 V con dos entradas MPPT para hasta 8000 W de paneles. Trae WiFi integrado para supervisarlo desde el teléfono y trabaja en paralelo con hasta 6 unidades.',
    power: 6500,
    stats: [
      { label: 'Potencia', value: '6.5', unit: 'kW' },
      { label: 'Campo solar máx.', value: '8000', unit: 'W' },
      { label: 'Pico', value: '13000', unit: 'VA' },
      { label: 'En paralelo', value: '6', unit: 'unidades' },
    ],
    features: [
      'WiFi integrado para supervisión móvil (app Android / iOS)',
      'Puerto de comunicación para BMS (RS485, CAN BUS o RS232)',
      'Ventilador cambiable para facilitar el mantenimiento',
      'Salida VDC para ventilador, bombilla LED, router y más',
      'Diseño independiente de la batería',
      'Temporizador de uso y prioridad de salida AC / PV configurable',
      'Compatible con red eléctrica o generador',
      'USB On-the-go e indicación de estado con luces RGB',
    ],
    specs: [
      {
        title: 'Entrada / salida',
        rows: [
          ['Voltaje de entrada', '120 VAC'],
          ['Rango de frecuencia', '50 Hz / 60 Hz'],
          ['Rango de voltaje seleccionable', '90-140 VAC (computadores) · 80-140 VAC (dispositivos de hogar)'],
          ['Regulación de voltaje AC (modo batería)', '120 VAC ± 5 %'],
          ['Sobrecarga de salida', '13000 VA'],
          ['Eficiencia (pico)', '91 %'],
          ['Tiempo de transferencia', '10 ms (computadoras) · 20 ms (dispositivos del hogar)'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Consumo de energía en vacío', '< 70 W'],
          ['Voltaje DC', '12 VDC ± 5 %, 100 W'],
        ],
      },
      {
        title: 'Entrada fotovoltaica',
        rows: [
          ['Tipo de cargador solar', 'MPPT'],
          ['Número de puertos MPPT', '2'],
          ['Potencia máxima del conjunto fotovoltaico', '8000 W (4000 W × 2)'],
          ['Rango MPPT y voltaje de funcionamiento', '90 ~ 230 VDC'],
          ['Tensión máxima fotovoltaica', '250 VDC'],
          ['Corriente de carga solar máxima', '120 A'],
        ],
      },
      {
        title: 'Cargador de batería',
        rows: [
          ['Tipo de batería', 'Litio'],
          ['Voltaje de batería', '48 VDC'],
          ['Voltaje de carga flotante', '54 VDC'],
          ['Protección sobrevoltaje', '63 VDC'],
          ['Corriente de carga máxima', '120 A'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '147.4 mm'],
          ['Ancho', '432.5 mm'],
          ['Alto', '553.6 mm'],
          ['Peso neto', '18.4 kg'],
          ['Montaje', 'En pared'],
          ['Humedad', '5 % a 95 % de humedad relativa'],
          ['Temperatura en operación', '-10 °C a 50 °C'],
          ['Cumplimiento de seguridad', 'UL'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Oficina'],
    certs: ['UL'],
  },
  {
    slug: 'inversor-akx-max-pro-ii-6-5kw',
    model: 'AKXIMPII6.5',
    name: 'Inversor AKX Max Pro II 6.5 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar',
    tagline: 'La segunda generación, con registro de eventos.',
    description:
      'Inversor cargador solar de 6.5 kW a 120 V con dos entradas MPPT para hasta 8000 W de paneles, WiFi integrado y registro de eventos almacenado en el equipo. Trabaja en paralelo con hasta 6 unidades.',
    power: 6500,
    stats: [
      { label: 'Potencia', value: '6.5', unit: 'kW' },
      { label: 'Campo solar máx.', value: '8000', unit: 'W' },
      { label: 'Pico', value: '13000', unit: 'VA' },
      { label: 'En paralelo', value: '6', unit: 'unidades' },
    ],
    features: [
      'WiFi integrado para supervisión móvil (app Android / iOS)',
      'Puerto de comunicación para BMS (RS485, CAN BUS o RS232)',
      'Ventilador cambiable para facilitar el mantenimiento',
      'Salida VDC para ventilador, bombilla LED, router y más',
      'Registro de eventos almacenado en el inversor',
      'Temporizador de uso y prioridad de salida AC / PV configurable',
      'Compatible con voltaje principal y generador',
      'USB On-the-go e indicación de estado con luces RGB',
    ],
    specs: [
      {
        title: 'Entrada / salida',
        rows: [
          ['Voltaje de entrada', '120 VAC'],
          ['Rango de frecuencia', '50 Hz / 60 Hz'],
          ['Rango de voltaje seleccionable', '90-140 VAC (computadores) · 80-140 VAC (dispositivos de hogar)'],
          ['Regulación de voltaje AC (modo batería)', '120 VAC ± 5 %'],
          ['Sobrecarga de salida', '13000 VA'],
          ['Eficiencia (pico)', '91 %'],
          ['Tiempo de transferencia', '15 ms / 20 ms'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Consumo de energía en vacío', '< 75 W'],
          ['Voltaje DC', '12 VDC ± 5 %, 100 W'],
        ],
      },
      {
        title: 'Entrada fotovoltaica',
        rows: [
          ['Tipo de cargador solar', 'MPPT'],
          ['Número de puertos MPPT', '2'],
          ['Potencia máxima del conjunto fotovoltaico', '8000 W (4000 W × 2)'],
          ['Rango MPPT y voltaje de funcionamiento', '90 ~ 230 VDC'],
          ['Tensión máxima fotovoltaica', '250 VDC'],
          ['Corriente de carga solar máxima', '120 A'],
        ],
      },
      {
        title: 'Cargador de batería',
        rows: [
          ['Tipo de batería', 'Litio'],
          ['Voltaje de batería', '48 VDC'],
          ['Voltaje de carga flotante', '54 VDC'],
          ['Protección sobrevoltaje', '66 VDC'],
          ['Corriente de carga máxima', '120 A'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '158.4 mm'],
          ['Ancho', '503.6 mm'],
          ['Alto', '530.8 mm'],
          ['Peso neto', '20 kg'],
          ['Montaje', 'En pared'],
          ['Humedad', '5 % a 95 % de humedad relativa'],
          ['Temperatura en operación', '-10 °C a 50 °C'],
          ['Cumplimiento de seguridad', 'UL'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Oficina'],
    certs: ['UL'],
  },
  {
    slug: 'inversor-akx-10kw',
    model: 'AKXI10',
    name: 'Inversor AKX 10 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar',
    tagline: 'Fase dividida 120 / 240 V y 200 A de carga.',
    description:
      'Inversor cargador solar de 10 kW de diseño industrial, fácil de instalar. Doble MPPT con hasta 99.9 % de eficiencia para 11000 W de paneles, carga de hasta 200 A y funcionamiento en paralelo con 6 unidades.',
    power: 10000,
    stats: [
      { label: 'Potencia', value: '10', unit: 'kW' },
      { label: 'Campo solar máx.', value: '11000', unit: 'W' },
      { label: 'Carga máx.', value: '200', unit: 'A' },
      { label: 'Pico', value: '20000', unit: 'VA' },
    ],
    features: [
      'Corriente de carga de hasta 200 A',
      'Comunicación BMS con baterías de iones de litio, con doble activación',
      'Tecnología MPPT avanzada con hasta 99.9 % de eficiencia',
      'Corriente de entrada fotovoltaica de hasta 22 + 22 A',
      'Energía AC de onda sinusoidal pura',
      'Funcionamiento en paralelo con 6 unidades',
      'Franja horaria para ahorrar con tarifas pico-valle',
      'Fase dividida 120 / 240 V y 120 / 208 V',
    ],
    specs: [
      {
        title: 'Entrada / salida',
        rows: [
          ['Voltaje de entrada', '120 / 240 VAC'],
          ['Rango de frecuencia', '50 Hz / 60 Hz'],
          ['Rango de voltaje', '90 – 140 VAC'],
          ['Voltaje de salida', '120 VAC 1 fase / 240 fase dividida / trifásica en paralelo'],
          ['Sobrecarga de salida', '20000 VA'],
          ['Eficiencia (pico)', '92 %'],
          ['Tiempo de transferencia', '10 ms'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Consumo de energía en vacío', '< 75 W'],
          ['Voltaje DC', '12 VDC ± 5 %, 100 W'],
        ],
      },
      {
        title: 'Entrada fotovoltaica',
        rows: [
          ['Tipo de cargador solar', 'MPPT'],
          ['Número de puertos MPPT', '2'],
          ['Potencia máxima del conjunto fotovoltaico', '11000 W (5500 × 2)'],
          ['Rango MPPT y voltaje de funcionamiento', '125 ~ 425 VDC'],
          ['Tensión máxima fotovoltaica', '500 VDC + 500 VDC'],
          ['Corriente de carga solar máxima', '22 / 22 A'],
        ],
      },
      {
        title: 'Cargador de batería',
        rows: [
          ['Tipo de batería', 'Litio'],
          ['Voltaje de batería', '48 VDC'],
          ['Voltaje de carga flotante', '54 VDC'],
          ['Protección sobrevoltaje', '63 VDC'],
          ['Corriente de carga máxima', '200 A'],
          ['Corriente de descarga máxima', '220 A'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '620 mm'],
          ['Ancho', '445 mm'],
          ['Alto', '130 mm'],
          ['Peso neto', '27 kg'],
          ['Montaje', 'En pared'],
          ['Humedad', '5 % a 95 % de humedad relativa'],
          ['Temperatura en operación', '-10 °C a 55 °C'],
          ['Cumplimiento de seguridad', 'IEC'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Oficina'],
    certs: ['IEC'],
  },
  {
    slug: 'inversor-akx-un-limet-pro-12kw',
    model: 'AKXUL12',
    name: 'Inversor AKX UN-LIMET PRO 12 kW',
    category: 'inversores',
    kind: 'Inversor cargador solar',
    tagline: '12 kW sellados con protección IP65.',
    description:
      'El inversor más grande de la línea: 12 kW, índice de protección IP65, doble MPPT para 12000 W de paneles y disyuntores DC y AC incorporados. Acepta generador como segunda fuente y trabaja en paralelo con 6 unidades.',
    power: 12000,
    stats: [
      { label: 'Potencia', value: '12', unit: 'kW' },
      { label: 'Protección', value: 'IP65' },
      { label: 'Campo solar máx.', value: '12000', unit: 'W' },
      { label: 'Carga máx.', value: '200', unit: 'A' },
    ],
    features: [
      'Índice de protección IP65',
      'Fase dividida 120 / 240 V y 120 / 208 V',
      'Compartimento para cables con puerta',
      'Disyuntor DC de 300 A y disyuntor AC de 60 A incorporados',
      'Acoplamiento de CA incorporado',
      'WiFi incorporado para monitoreo móvil',
      'Acepta entrada de generador como segunda fuente',
      'Detección de falla de arco (AFD) y apagado rápido (RSD)',
      'Sensor CT externo para 100 % de autoconsumo',
      'Funcionamiento en paralelo con 6 unidades',
    ],
    specs: [
      {
        title: 'Entrada / salida',
        rows: [
          ['Voltaje de entrada', '120 / 240 VAC'],
          ['Voltaje de arranque', '125 VDC / 160 VDC'],
          ['Voltaje de reinicio automático', '85 VAC (por fase) / 90 VAC (por fase)'],
          ['Rango de voltaje', '90 – 140 VCA (por fase)'],
          ['Voltaje de salida', '120 V AC (P-N), 208 V AC (P-P), 240 V AC (P-P)'],
          ['Corriente máxima de entrada', '60 A por fase'],
          ['Sobrecarga de salida', '10000 VA'],
          ['Eficiencia (pico)', '91 %'],
          ['Factor de potencia', '0.9 de retraso a 0.9 de adelanto'],
          ['Forma de onda', 'Onda sinusoidal pura'],
          ['Consumo de energía en vacío', '< 75 W'],
        ],
      },
      {
        title: 'Entrada fotovoltaica',
        rows: [
          ['Tipo de cargador solar', 'MPPT'],
          ['Número de puertos MPPT', '2'],
          ['Potencia máxima del conjunto fotovoltaico', '12000 W (6000 W × 2)'],
          ['Rango MPPT y voltaje de funcionamiento', '120 VCC ~ 550 VCC'],
          ['Tensión máxima fotovoltaica', '600 VDC'],
        ],
      },
      {
        title: 'Cargador de batería',
        rows: [
          ['Tipo de batería', 'Litio'],
          ['Voltaje de batería', '48 VDC (40 – 62 VDC)'],
          ['Voltaje de carga flotante', '54 VDC'],
          ['Protección sobrevoltaje', '63 VDC'],
          ['Corriente de carga máxima', '200 A'],
          ['Corriente de descarga máxima', '200 A'],
        ],
      },
      {
        title: 'Protecciones',
        rows: [
          ['Índice de protección', 'IP65'],
          ['Interruptor de DC fotovoltaico NEC 250.15', 'Sí'],
          ['Detección de falla a tierra — NEC 690.5', 'Sí'],
          ['Apagado rápido de sistemas fotovoltaicos NEC 690.12', 'Sí'],
          ['Detección de fallas de arco fotovoltaico — NEC 690.11', 'Sí'],
          ['Protección contra rayos de entrada fotovoltaica', 'Sí'],
          ['Disyuntor de entrada y salida de AC', 'Incorporado'],
          ['Disyuntor de CC de batería', 'Incorporado'],
        ],
      },
      {
        title: 'Tamaño y entorno',
        rows: [
          ['Largo', '215.5 mm'],
          ['Ancho', '515 mm'],
          ['Alto', '798 mm'],
          ['Peso neto', '49 kg'],
          ['Montaje', 'En pared'],
          ['Temperatura en operación', '-25 °C a 60 °C'],
          ['Reducción de potencia', '> 45 °C'],
          ['Cumplimiento de seguridad', 'UL / CSA / CEC'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Obras'],
    certs: ['UL', 'CSA', 'CEC', 'IP65'],
  },

  /* ───────────── Baterías ───────────── */
  {
    slug: 'bateria-akx-lt-25-6v-100ah',
    model: 'BTAKX2.5',
    name: 'Batería de litio AKX LT 25.6 V 100 Ah',
    category: 'baterias',
    kind: 'Batería de litio monoblock',
    tagline: '2.5 kWh en formato monoblock.',
    description:
      'Batería de litio de 25.6 V y 100 Ah en formato monoblock, con 2560 Wh de energía nominal y más de 4000 ciclos de vida. Va con los inversores AKX de 24 V.',
    power: 2560,
    stats: [
      { label: 'Energía nominal', value: '2560', unit: 'Wh' },
      { label: 'Voltaje nominal', value: '25.6', unit: 'V' },
      { label: 'Capacidad', value: '100', unit: 'Ah' },
      { label: 'Ciclos de vida', value: '>4000' },
    ],
    features: [
      'Más de 4000 ciclos a 25 °C y 80 % de DOD',
      'Corriente de carga y descarga máxima de 100 A',
      'Formato monoblock de 480 × 170 × 240 mm',
    ],
    specs: [
      {
        title: 'Parámetros básicos',
        rows: [
          ['Voltaje nominal', '25.6 V'],
          ['Capacidad nominal', '100 Ah'],
          ['Energía nominal', '2560 Wh'],
        ],
      },
      {
        title: 'Funcionamiento',
        rows: [
          ['Rango de voltaje', '20 V ~ 28 V'],
          ['Corriente de carga recomendada', '50 A'],
          ['Corriente de carga máxima', '100 A'],
          ['Corriente de descarga máxima', '100 A'],
          ['Humedad', '5 ~ 95 % HR'],
          ['Temperatura de carga', '0 ~ 45 °C'],
        ],
      },
      {
        title: 'Vida útil y tamaño',
        rows: [
          ['Ciclo de vida', '> 4000 (0.5C a 25 °C, 80 % DOD)'],
          ['Dimensiones', '480 × 170 × 240 mm'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio'],
    certs: ['UN38.3'],
  },
  {
    slug: 'bateria-akx-5k-51-2v-100ah',
    model: 'BTAKX5k',
    name: 'Batería de litio AKX 5K 51.2 V 100 Ah',
    category: 'baterias',
    kind: 'Batería de litio de pared',
    tagline: '5 kWh de pared, diseñada para 15 años.',
    description:
      'Batería de litio de 51.2 V y 100 Ah con 5120 Wh de energía nominal. Se comunica con el inversor por RS485 o CAN, trae pantalla LED + LCD y está diseñada para 6000 ciclos y 15 años de vida.',
    power: 5120,
    stats: [
      { label: 'Energía nominal', value: '5120', unit: 'Wh' },
      { label: 'Voltaje nominal', value: '51.2', unit: 'V' },
      { label: 'Ciclos de vida', value: '6000' },
      { label: 'Vida de diseño', value: '15', unit: 'años' },
    ],
    features: [
      '6000 ciclos a 25 °C y 80 % de DOD',
      'Comunicación RS485 y CAN',
      'Pantalla LED + LCD',
      'Terminal enchufable',
      'Transporte certificado UN38.3',
    ],
    specs: [
      {
        title: 'Parámetros básicos',
        rows: [
          ['Voltaje nominal', '51.2 V'],
          ['Capacidad nominal', '100 Ah'],
          ['Energía nominal', '5120 Wh'],
        ],
      },
      {
        title: 'Funcionamiento',
        rows: [
          ['Rango de voltaje', '44.8 ~ 56 V'],
          ['Rango de voltaje de carga', '55.2 ~ 56 V'],
          ['Voltaje de corte', '44.8 V'],
          ['Corriente de carga recomendada', '50 A'],
          ['Corriente de carga máxima', '100 A'],
          ['Corriente de descarga máxima', '100 A'],
        ],
      },
      {
        title: 'Parámetros físicos',
        rows: [
          ['Dimensiones (ancho × profundidad × alto)', '640 × 425 × 157 mm'],
          ['Peso', '50 kg'],
          ['Puerto de comunicación', 'RS485, CAN'],
          ['Pantalla', 'LED + LCD'],
          ['Terminal', 'Enchufable'],
        ],
      },
      {
        title: 'Ambiente y vida útil',
        rows: [
          ['Humedad', '5 ~ 95 % HR'],
          ['Temperatura de carga', '0 ~ 45 °C'],
          ['Temperatura de descarga', '-20 ~ 55 °C'],
          ['Temperatura de almacenamiento', '-20 ~ 45 °C'],
          ['Ciclo de vida', '6000 (0.5C a 25 °C, 80 % DOD)'],
          ['Vida útil de diseño', '15 años'],
          ['Transporte', 'UN38.3'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Oficina'],
    certs: ['UL', 'UN38.3'],
  },
  {
    slug: 'bateria-akx-ip65-15k-280ah',
    model: 'AKX-15K IP65',
    name: 'Batería de litio IP65 15K 51.2 V 280 Ah',
    category: 'baterias',
    kind: 'Batería de litio de pared IP65',
    tagline: '14 kWh sellados contra polvo y agua.',
    description:
      'Batería de litio de 51.2 V y 280 Ah con 14 336 Wh de almacenamiento y protección IP65. Incluye BMS, carga y descarga de hasta 200 A y está diseñada para 6000 ciclos y 15 años de vida.',
    power: 14336,
    stats: [
      { label: 'Almacenamiento', value: '14 336', unit: 'Wh' },
      { label: 'Protección', value: 'IP65' },
      { label: 'Ciclos de vida', value: '6000' },
      { label: 'Vida de diseño', value: '15', unit: 'años' },
    ],
    features: [
      'Protección IP65',
      'BMS integrado',
      'Corriente máxima de carga y descarga de 200 A',
      '6000 ciclos a 25 °C y 80 % de DOD',
      'Vida útil de diseño de 15 años',
    ],
    specs: [
      {
        title: 'Batería',
        rows: [
          ['Voltaje nominal', '51.2 V'],
          ['Capacidad nominal', '280 Ah'],
          ['Cantidad de almacenamiento', '14 336 Wh'],
          ['Corriente de carga', '0.5C'],
          ['IP rating', '65'],
          ['BMS', 'Sí'],
          ['Máxima corriente de carga y descarga', '200 A'],
        ],
      },
      {
        title: 'Dimensiones',
        rows: [
          ['Largo (L)', '900 mm'],
          ['Ancho (W)', '170 mm'],
          ['Alto (H)', '566 mm'],
          ['Peso neto', '150 kg'],
        ],
      },
      {
        title: 'Vida útil',
        rows: [
          ['Ciclo de vida', '6000 (0.5C a 25 °C, 80 % DOD)'],
          ['Vida útil de diseño', '15 años'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Obras'],
    certs: ['IEC', 'IP65'],
  },
  {
    slug: 'bateria-akx-premium-15k-300ah',
    model: 'AKX-15K Premium',
    name: 'Batería de litio Premium 15K 51.2 V 300 Ah',
    category: 'baterias',
    kind: 'Batería de litio de piso',
    tagline: '15 kWh sobre ruedas, con pantalla integrada.',
    description:
      'Batería de litio de 51.2 V y 300 Ah con 15 360 Wh de almacenamiento, en gabinete de piso con ruedas y pantalla. Incluye BMS, carga y descarga de hasta 200 A y está diseñada para 6000 ciclos y 15 años de vida.',
    power: 15360,
    stats: [
      { label: 'Almacenamiento', value: '15 360', unit: 'Wh' },
      { label: 'Capacidad', value: '300', unit: 'Ah' },
      { label: 'Ciclos de vida', value: '6000' },
      { label: 'Vida de diseño', value: '15', unit: 'años' },
    ],
    features: [
      'Gabinete de piso con ruedas',
      'BMS integrado y pantalla de estado',
      'Corriente máxima de carga y descarga de 200 A',
      '6000 ciclos a 25 °C y 80 % de DOD',
      'Vida útil de diseño de 15 años',
    ],
    specs: [
      {
        title: 'Batería',
        rows: [
          ['Voltaje nominal', '51.2 V'],
          ['Capacidad nominal', '300 Ah'],
          ['Cantidad de almacenamiento', '15 360 Wh'],
          ['Corriente de carga', '0.5C'],
          ['IP rating', '21'],
          ['BMS', 'Sí'],
          ['Máxima corriente de carga y descarga', '200 A'],
        ],
      },
      {
        title: 'Dimensiones',
        rows: [
          ['Largo (L)', '960 mm'],
          ['Ancho (W)', '260 mm'],
          ['Alto (H)', '460 mm'],
          ['Peso neto', '130 kg'],
        ],
      },
      {
        title: 'Vida útil',
        rows: [
          ['Ciclo de vida', '6000 (0.5C a 25 °C, 80 % DOD)'],
          ['Vida útil de diseño', '15 años'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Oficina'],
    certs: ['IEC', 'IP21'],
  },

  /* ───────────── Paneles ───────────── */
  {
    slug: 'panel-solar-akx-575w',
    model: 'AKXISPM 575',
    name: 'Panel solar monocristalino 575 W',
    category: 'paneles',
    kind: 'Panel solar monocristalino modular',
    tagline: '144 medias celdas M10 en vidrio templado.',
    description:
      'Módulo monocristalino de 575 W con 144 medias celdas M10, vidrio templado de 3.2 mm y marco de aluminio anodizado. Tecnología de célula de medio corte, anti-PID y baja degradación LID.',
    power: 575,
    stats: [
      { label: 'Potencia máxima', value: '575', unit: 'W' },
      { label: 'Eficiencia', value: '20', unit: '%' },
      { label: 'Medias celdas', value: '144' },
      { label: 'Carga mecánica', value: '5400', unit: 'Pa' },
    ],
    features: [
      'Tecnología de célula de medio corte',
      'Anti-PID y bajo LID',
      'Vidrio frontal templado revestido de 3.2 mm',
      'Marco de aleación de aluminio anodizado',
      'Caja de conexiones IP68 con 3 diodos de derivación',
      'Conectores compatibles con MC4',
    ],
    specs: [
      {
        title: 'Características del panel',
        rows: [
          ['Células solares', 'Monocristalino'],
          ['N.º de células', '144 (6 × 24), media celda M10'],
          ['Vidrio frontal', 'Vidrio templado revestido de 3.2 mm'],
          ['Marco', 'Aleación de aluminio anodizado'],
          ['Caja de conexiones', 'IP68 (3 diodos de derivación)'],
          ['Conectores', 'Compatibles con MC4'],
          ['Prueba de carga mecánica', '5400 Pa'],
          ['Dimensiones', '2278 × 1134 × 35 mm'],
        ],
      },
      {
        title: 'Parámetros eléctricos (STC)',
        rows: [
          ['Clase de potencia', 'LNCT-575ND'],
          ['Potencia máxima (Pmax)', '575 W'],
          ['Tensión de circuito abierto (Voc)', '47.85 V ± 5 %'],
          ['Corriente de cortocircuito (Isc)', '15.21 A'],
          ['Tensión a máxima potencia (Vmpp)', '40.10 V'],
          ['Corriente de máxima potencia (Impp)', '14.34 A'],
          ['Eficiencia del módulo', '20 %'],
        ],
      },
      {
        title: 'Funcionamiento',
        rows: [
          ['Temperatura del módulo', '-40 °C a +85 °C'],
          ['Voltaje máximo del sistema', '1500 V CC (IEC)'],
          ['Rango máximo de fusibles en serie', '25 A'],
          ['Tolerancia de potencia', '0 / +5 W'],
          ['Temperatura nominal de funcionamiento (NMOT)', '45 ± 2 °C'],
          ['Coeficiente de temperatura de Pmax', '-0.29 %/°C'],
          ['Coeficiente de temperatura de Voc', '-0.25 %/°C'],
          ['Coeficiente de temperatura de Isc', '+0.045 %/°C'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Obras'],
    certs: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'IEC 61215', 'IEC 61730', 'CE'],
    note: 'STC: irradiancia 1000 W/m², temperatura de celda 25 °C, AM 1.5G.',
  },
  {
    slug: 'panel-solar-akx-670w',
    model: 'AKXISPM 670',
    name: 'Panel solar monocristalino 670 W',
    category: 'paneles',
    kind: 'Panel solar monocristalino modular',
    tagline: '132 medias celdas M12 y 21.6 % de eficiencia.',
    description:
      'Módulo monocristalino de 670 W con 132 medias celdas M12 de 210 mm e interconexión de alta densidad. Opción ideal para instalaciones terrestres a gran escala.',
    power: 670,
    stats: [
      { label: 'Potencia máxima', value: '670', unit: 'W' },
      { label: 'Eficiencia', value: '21.6', unit: '%' },
      { label: 'Medias celdas', value: '132' },
      { label: 'Carga mecánica', value: '5400', unit: 'Pa' },
    ],
    features: [
      'Tecnología de interconexión de alta densidad',
      'Anti-PID y bajo LID',
      'Vidrio frontal templado revestido de 3.2 mm',
      'Marco de aleación de aluminio anodizado',
      'Caja de conexiones IP68 con 3 diodos de derivación',
      'Conectores compatibles con MC4',
    ],
    specs: [
      {
        title: 'Características del panel',
        rows: [
          ['Células solares', 'Monocristalino'],
          ['N.º de células', '132 (6 × 22), media celda M12 / 210 mm'],
          ['Vidrio frontal', 'Vidrio templado revestido de 3.2 mm'],
          ['Marco', 'Aleación de aluminio anodizado'],
          ['Caja de conexiones', 'IP68 (3 diodos de derivación)'],
          ['Conectores', 'Compatibles con MC4'],
          ['Prueba de carga mecánica', '5400 Pa'],
          ['Dimensiones', '2384 × 1303 × 35 mm'],
        ],
      },
      {
        title: 'Parámetros eléctricos (STC)',
        rows: [
          ['Clase de potencia', 'LNET-670M'],
          ['Potencia máxima (Pmax)', '670 W'],
          ['Tensión de circuito abierto (Voc)', '45.71 V'],
          ['Corriente de cortocircuito (Isc)', '18.78 A'],
          ['Tensión a máxima potencia (Vmpp)', '38.22 V'],
          ['Corriente de máxima potencia (Impp)', '17.53 A'],
          ['Eficiencia del módulo', '21.60 %'],
        ],
      },
      {
        title: 'Funcionamiento',
        rows: [
          ['Temperatura del módulo', '-40 °C a +85 °C'],
          ['Voltaje máximo del sistema', '1500 V CC (IEC)'],
          ['Rango máximo de fusibles en serie', '30 A'],
          ['Tolerancia de potencia', '0 / +5 W'],
          ['Temperatura nominal de funcionamiento (NMOT)', '43 ± 2 °C'],
          ['Coeficiente de temperatura de Pmax', '-0.34 %/°C'],
          ['Coeficiente de temperatura de Voc', '-0.25 %/°C'],
          ['Coeficiente de temperatura de Isc', '+0.04 %/°C'],
        ],
      },
    ],
    uses: ['Hogar', 'Comercio', 'Obras'],
    certs: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'IEC 61215', 'IEC 61730', 'CE'],
    note: 'STC: irradiancia 1000 W/m², temperatura de celda 25 °C, AM 1.5G.',
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const categoryById = (id: string) => categories.find((c) => c.id === id);
export const productsOf = (id: CategoryId) => products.filter((p) => p.category === id);
