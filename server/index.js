import express from 'express';
import compression from 'compression';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');
const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());
app.use(express.json({ limit: '50kb' }));

const esc = (v) =>
  String(v ?? '')
    .slice(0, 4000)
    .replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Límite simple por IP: 5 envíos cada 10 minutos
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mail: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO) });
});

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, city, interest, message, items, website } = req.body || {};
  if (website) return res.json({ ok: true }); // campo trampa para bots
  if (!name || String(name).trim().length < 2 || (!phone && !email)) {
    return res.status(400).json({ ok: false, error: 'Faltan datos: nombre y un teléfono o correo.' });
  }
  if (limited(req.ip)) {
    return res.status(429).json({ ok: false, error: 'Demasiados envíos. Intenta de nuevo en unos minutos.' });
  }
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }
  const list = Array.isArray(items) ? items.slice(0, 40) : [];
  const rows = list
    .map((i) => `<tr><td style="padding:4px 12px 4px 0">${esc(i.qty)} ×</td><td style="padding:4px 0"><b>${esc(i.name)}</b> <span style="color:#666">(${esc(i.model)})</span></td></tr>`)
    .join('');
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111">
      <h2 style="margin:0 0 12px">Nueva solicitud desde la web AKX</h2>
      <p><b>Nombre:</b> ${esc(name)}<br/>
      <b>Teléfono:</b> ${esc(phone) || '—'}<br/>
      <b>Correo:</b> ${esc(email) || '—'}<br/>
      <b>Ciudad:</b> ${esc(city) || '—'}<br/>
      <b>Interés:</b> ${esc(interest) || '—'}</p>
      ${rows ? `<h3 style="margin:18px 0 6px">Equipos para cotizar</h3><table>${rows}</table>` : ''}
      <h3 style="margin:18px 0 6px">Mensaje</h3>
      <p style="white-space:pre-wrap">${esc(message) || '—'}</p>
    </div>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'AKX Web <onboarding@resend.dev>',
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: email || undefined,
        subject: `Solicitud web — ${String(name).slice(0, 80)}${list.length ? ` (${list.length} equipos)` : ''}`,
        html,
      }),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'No se pudo enviar el mensaje.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Contact error', err);
    res.status(502).json({ ok: false, error: 'No se pudo enviar el mensaje.' });
  }
});

app.use(
  express.static(dist, {
    index: false,
    setHeaders(res, file) {
      if (file.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      else if (/\.(webp|png|svg|jpg|woff2)$/.test(file)) res.setHeader('Cache-Control', 'public, max-age=604800');
    },
  }),
);

// SPA: cualquier otra ruta devuelve index.html
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(PORT, () => console.log(`AKX web en http://localhost:${PORT}`));
