import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { categories, productBySlug } from '../data/products';
import { useQuote, quoteText } from '../lib/quote';
import { site, whatsappLink } from '../config/site';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unavailable';

export default function Contact() {
  const { items, clear, remove } = useQuote();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const wa = whatsappLink(quoteText(items));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (!data.phone && !data.email) {
      setStatus('error');
      setError('Déjanos un teléfono o un correo para poder responderte.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => {
            const p = productBySlug(i.slug);
            return { qty: i.qty, name: p?.name, model: p?.model };
          }),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setStatus('sent');
        form.reset();
        clear();
      } else if (json.error === 'not_configured') {
        setStatus('unavailable');
      } else {
        setStatus('error');
        setError(json.error || 'No se pudo enviar el mensaje. Intenta de nuevo.');
      }
    } catch {
      setStatus('error');
      setError('No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.');
    }
  };

  return (
    <div className="contact">
      <section className="contact__top">
        <div className="wrap contact__grid">
          <div className="contact__intro">
            <h1 className="display display--md">Hablemos de tu energía</h1>
            <p className="lead">
              Cuéntanos qué equipos necesitas mantener encendidos y por cuánto tiempo. Te respondemos con el equipo AKX indicado, precio y disponibilidad.
            </p>
            <ul className="channels">
              {wa && (
                <li>
                  <span>WhatsApp</span>
                  <a href={wa} target="_blank" rel="noreferrer">
                    Escribir ahora
                  </a>
                </li>
              )}
              {site.phone && (
                <li>
                  <span>Teléfono</span>
                  <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                </li>
              )}
              {site.email && (
                <li>
                  <span>Correo</span>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
              )}
              <li>
                <span>Instagram</span>
                <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noreferrer">
                  @{site.instagram}
                </a>
              </li>
              {site.address && (
                <li>
                  <span>Dirección</span>
                  <p>{site.address}</p>
                </li>
              )}
              {site.hours && (
                <li>
                  <span>Horario</span>
                  <p>{site.hours}</p>
                </li>
              )}
            </ul>
          </div>

          <div className="contact__form">
            {status === 'sent' ? (
              <div className="notice notice--ok" role="status">
                <h2>Mensaje enviado</h2>
                <p>Recibimos tu solicitud. Un asesor de AKX te va a contactar con la cotización.</p>
                <Link className="btn btn--green" to="/tienda">
                  Volver a la tienda
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} noValidate={false}>
                {items.length > 0 && (
                  <div className="quote-box">
                    <h2>Equipos para cotizar</h2>
                    <ul>
                      {items.map((i) => {
                        const p = productBySlug(i.slug);
                        if (!p) return null;
                        return (
                          <li key={i.slug}>
                            <span>
                              <b>{i.qty} ×</b> {p.name}
                            </span>
                            <button type="button" className="link" onClick={() => remove(i.slug)} aria-label={`Quitar ${p.name}`}>
                              Quitar
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="form-row">
                  <label className="field">
                    <span>Nombre</span>
                    <input name="name" type="text" autoComplete="name" required minLength={2} />
                  </label>
                  <label className="field">
                    <span>Ciudad</span>
                    <input name="city" type="text" autoComplete="address-level2" />
                  </label>
                </div>
                <div className="form-row">
                  <label className="field">
                    <span>Teléfono o WhatsApp</span>
                    <input name="phone" type="tel" autoComplete="tel" inputMode="tel" />
                  </label>
                  <label className="field">
                    <span>Correo</span>
                    <input name="email" type="email" autoComplete="email" />
                  </label>
                </div>
                <label className="field">
                  <span>Línea de interés</span>
                  <select name="interest" defaultValue="">
                    <option value="">Todavía no lo sé</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>¿Qué necesitas mantener encendido?</span>
                  <textarea name="message" rows={5} placeholder="Ej.: una nevera, dos aires de 12 000 BTU, luces y el internet durante 6 horas." />
                </label>
                <label className="hp" aria-hidden="true">
                  Sitio web
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
                {status === 'error' && (
                  <p className="notice notice--error" role="alert">
                    {error}
                  </p>
                )}
                {status === 'unavailable' && (
                  <div className="notice notice--error" role="alert">
                    <p>El formulario todavía no está conectado al correo de AKX, así que tu mensaje no se envió.</p>
                    {wa ? (
                      <a className="btn btn--green" href={wa} target="_blank" rel="noreferrer">
                        Enviar por WhatsApp
                      </a>
                    ) : (
                      <a className="btn btn--green" href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noreferrer">
                        Escribir por Instagram
                      </a>
                    )}
                  </div>
                )}
                <button type="submit" className="btn btn--green btn--block" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Enviando…' : items.length ? 'Enviar solicitud de cotización' : 'Enviar mensaje'}
                </button>
                <p className="form-note">Usamos tus datos solo para responder esta solicitud.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
