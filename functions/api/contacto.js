import { validateContact } from '../../src/utils/contactValidation.js';

const MAX_BYTES = 16 * 1024;

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers },
  });

async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new RangeError();
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

async function hashIp(ip) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

async function avisarTelegram(env, m) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;

  const texto = [
    'Nuevo mensaje desde el sitio',
    `Nombre: ${m.nombre}`,
    `Correo: ${m.email}`,
    `Asunto: ${m.asunto}`,
    m.pais ? `Pais: ${m.pais}` : null,
    '',
    m.mensaje,
  ].filter(Boolean).join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: texto, disable_web_page_preview: true }),
    });
  } catch {
    // el mensaje ya quedo guardado, el aviso es secundario
  }
}

async function onRequestPost({ request, env, waitUntil }) {
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');
  if (origin !== new URL(request.url).origin || (fetchSite && fetchSite !== 'same-origin')) {
    return json({ ok: false, error: 'Envía el mensaje desde el formulario del sitio.' }, 403);
  }
  const ip = request.headers.get('cf-connecting-ip');
  if (!env.DB || !ip) return json({ ok: false, error: 'El formulario no está disponible temporalmente.' }, 503);
  const ipHash = await hashIp(ip);
  try {
    // Count rejected submissions too; a single SQL statement prevents concurrent bypasses.
    const attempt = await env.DB.prepare(`INSERT INTO contacto_intentos (ip_hash)
      SELECT ? WHERE (SELECT COUNT(*) FROM contacto_intentos
        WHERE ip_hash = ? AND creado > datetime('now', '-1 minute')) < 10
      RETURNING id`).bind(ipHash, ipHash).first();
    if (!attempt) return json({ ok: false, error: 'Demasiados intentos. Espera un minuto.' }, 429, { 'retry-after': '60' });
    const cleanup = env.DB.prepare(`DELETE FROM contacto_intentos WHERE id IN
      (SELECT id FROM contacto_intentos WHERE creado < datetime('now', '-1 day') LIMIT 100)`)
      .run().catch(() => {});
    if (waitUntil) waitUntil(cleanup); else await cleanup;
  } catch {
    return json({ ok: false, error: 'No se pudo procesar el mensaje. Intenta más tarde.' }, 503);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json'
    || (request.headers.has('content-encoding') && request.headers.get('content-encoding') !== 'identity')) {
    return json({ ok: false, error: 'Solo se permite el formato JSON del formulario.' }, 415);
  }

  let body;
  try {
    body = await readBody(request);
  } catch (error) {
    return json({ ok: false, error: error instanceof RangeError ? 'El envío es demasiado grande.' : 'Formato inválido.' }, error instanceof RangeError ? 413 : 400);
  }

  const validation = validateContact(body);
  if (validation.honeypot) return json({ ok: true });
  if (!validation.data) return json({ ok: false, error: validation.error, errores: validation.errores }, 400);
  const { nombre, email, asunto, mensaje } = validation.data;
  const pais = request.cf?.country || null;

  try {
    const saved = await env.DB
      .prepare(`INSERT INTO mensajes (nombre, email, asunto, mensaje, pais, ip_hash)
        SELECT ?, ?, ?, ?, ?, ? WHERE
        (SELECT COUNT(*) FROM mensajes WHERE ip_hash = ? AND creado > datetime('now', '-10 minutes')) < 3
        RETURNING id`)
      .bind(nombre, email, asunto, mensaje, pais, ipHash, ipHash)
      .first();
    if (!saved) return json({ ok: false, error: 'Ya enviaste 3 mensajes. Espera 10 minutos antes de enviar otro.' }, 429, { 'retry-after': '600' });
  } catch {
    return json({ ok: false, error: 'No se pudo guardar el mensaje. Intenta de nuevo.' }, 500);
  }

  const aviso = avisarTelegram(env, { nombre, email, asunto, mensaje, pais });
  if (waitUntil) waitUntil(aviso); else await aviso;

  return json({ ok: true });
}

export const onRequest = context => context.request.method === 'POST'
  ? onRequestPost(context)
  : json({ ok: false, error: 'Método no permitido.' }, 405, { allow: 'POST' });
