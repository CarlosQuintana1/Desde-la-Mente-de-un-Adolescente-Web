export const CONTACT_LIMITS = { nombre: 80, email: 120, mensaje: 2000, sitio: 200 };
const SUBJECTS = new Set(['invitado', 'patrocinio', 'feedback']);
const FIELDS = new Set([...Object.keys(CONTACT_LIMITS), 'asunto']);
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/u;
const LINK = /(?:https?|ftp|file|data|javascript|vbscript|mailto):|www\s*\.|(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,62})\.)+[\p{L}]{2,63}\b|\b(?:\d{1,3}\.){3}\d{1,3}\b/iu;
const MARKUP = /<\s*[!/?\p{L}]|```/u;
const ENCODED = /(?:[01][\s,;]*){64,}|(?:\\x[\da-f]{2}){8,}|(?:\\u[\da-f]{4}){8,}|[A-Za-z\d+/]{200,}={0,2}/i;

function inspectionText(text) {
  let result = text.normalize('NFKC');
  for (let i = 0; i < 2; i++) {
    result = result.replace(/%([\da-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&#(x[\da-f]+|\d+);?/gi, (match, code) => {
        const value = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
        return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : match;
      })
      .replace(/&(?:lt|gt|colon|period);/gi, entity => ({ '&lt;': '<', '&gt;': '>', '&colon;': ':', '&period;': '.' })[entity.toLowerCase()]);
  }
  return result;
}

export function validateContact(body) {
  if (!body || Array.isArray(body) || typeof body !== 'object'
    || Object.keys(body).some(key => !FIELDS.has(key))) {
    return { error: 'Formato de formulario inválido.' };
  }
  const data = {};
  const errores = {};
  for (const [field, max] of Object.entries(CONTACT_LIMITS)) {
    const value = body[field] ?? (field === 'sitio' ? '' : null);
    if (typeof value !== 'string' || value.length > max || CONTROL.test(value)) {
      errores[field] = `Introduce texto válido de hasta ${max} caracteres.`;
      continue;
    }
    data[field] = value.normalize('NFC').trim();
  }
  if (Object.keys(errores).length) return { errores };
  if (data.sitio) return { honeypot: true };
  if (data.nombre.length < 2 || !/^[\p{L}\p{M} .’'\-]+$/u.test(data.nombre)) {
    errores.nombre = 'Introduce tu nombre, sin enlaces ni símbolos especiales.';
  }
  if (!/^[A-Za-z\d.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z\d](?:[A-Za-z\d-]*[A-Za-z\d])?(?:\.[A-Za-z\d](?:[A-Za-z\d-]*[A-Za-z\d])?)+$/.test(data.email)
    || data.email.includes('..')) {
    errores.email = 'Introduce un correo electrónico válido.';
  }
  if (!SUBJECTS.has(body.asunto)) errores.asunto = 'Selecciona un motivo de contacto válido.';
  data.asunto = body.asunto;
  if (data.mensaje.length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  for (const field of ['nombre', 'mensaje']) {
    const inspected = inspectionText(data[field]);
    if (LINK.test(inspected)) errores[field] = 'No se permiten enlaces ni direcciones web en este campo.';
    else if (CONTROL.test(inspected) || MARKUP.test(inspected) || ENCODED.test(inspected)) {
      errores[field] = 'Escribe texto normal, sin HTML, bloques de código ni cadenas codificadas.';
    }
  }
  return Object.keys(errores).length ? { errores } : { data };
}
