const ASUNTOS = ['general', 'invitado', 'carlos', 'patrocinio', 'feedback'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITE = 3;
const VENTANA_MIN = 10;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const limpiar = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

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

export async function onRequestPost({ request, env, waitUntil }) {
  if (!env.DB) return json({ ok: false, error: 'El formulario no esta configurado.' }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Formato invalido.' }, 400);
  }

  // honeypot: un bot llena todos los campos, una persona no ve este
  if (limpiar(body.sitio, 200)) return json({ ok: true });

  const nombre = limpiar(body.nombre, 80);
  const email = limpiar(body.email, 120);
  const asunto = ASUNTOS.includes(body.asunto) ? body.asunto : 'general';
  const mensaje = limpiar(body.mensaje, 2000);

  const errores = {};
  if (nombre.length < 2) errores.nombre = 'Por favor, introduce tu nombre.';
  if (!EMAIL.test(email)) errores.email = 'Por favor, introduce un correo electrónico válido.';
  if (mensaje.length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  if (Object.keys(errores).length) return json({ ok: false, errores }, 400);

  const ipHash = await hashIp(request.headers.get('cf-connecting-ip') || '');
  const pais = request.cf?.country || null;

  try {
    const recientes = await env.DB
      .prepare("SELECT COUNT(*) AS n FROM mensajes WHERE ip_hash = ? AND creado > datetime('now', ?)")
      .bind(ipHash, `-${VENTANA_MIN} minutes`)
      .first();

    if ((recientes?.n ?? 0) >= LIMITE) {
      return json({ ok: false, error: 'Ya enviaste varios mensajes. Intenta de nuevo en un rato.' }, 429);
    }

    await env.DB
      .prepare('INSERT INTO mensajes (nombre, email, asunto, mensaje, pais, ip_hash) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(nombre, email, asunto, mensaje, pais, ipHash)
      .run();
  } catch {
    return json({ ok: false, error: 'No se pudo guardar el mensaje. Intenta de nuevo.' }, 500);
  }

  const aviso = avisarTelegram(env, { nombre, email, asunto, mensaje, pais });
  if (waitUntil) waitUntil(aviso); else await aviso;

  return json({ ok: true });
}

export const onRequest = ({ request }) =>
  request.method === 'POST' ? undefined : json({ ok: false, error: 'Metodo no permitido.' }, 405);
