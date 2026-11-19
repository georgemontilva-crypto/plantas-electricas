/**
 * Datos de contacto de la marca. Todo lo que esté vacío simplemente no se muestra.
 * whatsapp: solo dígitos con código de país, sin "+" ni espacios (ej. "584121234567").
 */
export const site = {
  name: 'AKX',
  legalName: 'AKX Generator',
  tagline: 'Energía que no se apaga',
  url: 'https://www.akxgenerator.com',
  instagram: 'akxgenerator',
  whatsapp: '',
  phone: '',
  email: '',
  address: '',
  hours: '',
};

export function whatsappLink(text: string): string | null {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
