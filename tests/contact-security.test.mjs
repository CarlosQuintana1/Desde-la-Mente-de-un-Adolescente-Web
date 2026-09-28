import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { onRequest } from '../functions/api/contacto.js';
import { validateContact } from '../src/utils/contactValidation.js';

const valid = { nombre: "María O'Connor", email: 'maria@example.com', asunto: 'feedback', mensaje: 'Me encantó el episodio, gracias por compartirlo.', sitio: '' };
function setup(t) {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../schema.sql', import.meta.url), 'utf8'));
  t.after(() => sqlite.close());
  const DB = { prepare(sql) {
    return { bind(...args) {
      return { async first() { return sqlite.prepare(sql).get(...args) ?? null; } };
    }, async run() { return sqlite.prepare(sql).run(); } };
  } };
  const send = (body = valid, options = {}) => {
    const headers = { origin: 'https://podcast.test', 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.1', ...options.headers };
    const request = new Request('https://podcast.test/api/contacto', {
      method: options.method || 'POST', headers,
      ...(options.method === 'GET' ? {} : { body: options.raw ?? JSON.stringify(body) }),
    });
    return onRequest({ request, env: { DB } });
  };
  return { sqlite, send };
}

test('normal Spanish, accents, apostrophes, emoji and small binary examples remain valid', () => {
  for (const mensaje of [valid.mensaje, 'Me gusta la biología marina 🐠', 'Quisiera un episodio sobre 1010 y 0101.', "¿Qué significa SELECT 'hola' en una consulta?"]) {
    assert.ok(validateContact({ ...valid, mensaje }).data);
  }
});

test('reject links, HTML, encoded links, binary dumps and hidden controls', () => {
  for (const mensaje of ['Mira https://ejemplo.com', 'Visita ejemplo.com/path', 'Mira www.ejemplo.com', 'Visita 127.0.0.1 ahora', 'Visita ｈｔｔｐｓ：／／ejemplo.com', 'Mira https%253A%252F%252Fejemplo%252Ecom', 'Mira ejemplo&#46;com', '<script>alert(1)</script>', 'Hola &lt;img src=x&gt;', '```js alert(1)```', '01'.repeat(64), '01010101 '.repeat(10), 'QWxh'.repeat(60), 'Texto\u0000oculto', 'Texto\u202Eoculto', 'javascript:alert(1)']) {
    assert.ok(validateContact({ ...valid, mensaje }).errores?.mensaje, mensaje);
  }
});

test('validate schema, types, field lengths and selected subjects without silent truncation', () => {
  for (const body of [null, [], 'text', 5, { ...valid, extra: true }, { ...valid, nombre: {} }, { ...valid, email: 'bad' }, { ...valid, asunto: 'general' }, { ...valid, nombre: 'a'.repeat(81) }, { ...valid, mensaje: 'x'.repeat(2001) }]) {
    assert.equal(validateContact(body).data, undefined);
  }
});

test('only same-origin JSON POSTs are accepted; responses cannot be cached', async t => {
  const { send } = setup(t);
  assert.equal((await send(valid, { method: 'GET' })).status, 405);
  assert.equal((await send(valid, { headers: { origin: 'https://attacker.test' } })).status, 403);
  assert.equal((await send(valid, { headers: { origin: 'null' } })).status, 403);
  assert.equal((await send(valid, { headers: { 'sec-fetch-site': 'cross-site' } })).status, 403);
  assert.equal((await send(valid, { headers: { 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await send(valid, { headers: { 'content-encoding': 'gzip' } })).status, 415);
  const response = await send();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
});

test('reject missing trusted IP, malformed JSON, invalid UTF-8 and oversized streamed bodies', async t => {
  const { send } = setup(t);
  assert.equal((await send(valid, { headers: { 'cf-connecting-ip': '' } })).status, 503);
  assert.equal((await send(valid, { raw: '{' })).status, 400);
  assert.equal((await send(null)).status, 400);
  assert.equal((await send(valid, { raw: new Uint8Array([0xff, 0xfe]) })).status, 400);
  assert.equal((await send(valid, { raw: 'x'.repeat(17000) })).status, 413);
  assert.equal((await send(valid, { headers: { 'content-length': '17000' } })).status, 413);
});

test('honeypot returns success without storing or notifying', async t => {
  const { send, sqlite } = setup(t);
  assert.equal((await send({ ...valid, sitio: 'bot' })).status, 200);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM mensajes').get().n, 0);
});

test('parallel valid submissions cannot exceed 3 per IP in 10 minutes', async t => {
  const { send, sqlite } = setup(t);
  const responses = await Promise.all(Array.from({ length: 20 }, () => send()));
  assert.equal(responses.filter(r => r.status === 200).length, 3);
  assert.equal(responses.filter(r => r.status === 429).length, 17);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM mensajes').get().n, 3);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM contacto_intentos').get().n, 10);
  assert.equal((await send(valid, { headers: { 'cf-connecting-ip': '192.0.2.2' } })).status, 200);
});

test('invalid submissions count toward 10 attempts per minute and expire', async t => {
  const { send, sqlite } = setup(t);
  for (let i = 0; i < 10; i++) assert.equal((await send(null)).status, 400);
  const limited = await send(null);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');
  sqlite.exec("UPDATE contacto_intentos SET creado = datetime('now', '-61 seconds')");
  assert.equal((await send()).status, 200);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM mensajes').get().n, 1);
});

test('10 minute message window expires independently of attempts', async t => {
  const { send, sqlite } = setup(t);
  for (let i = 0; i < 3; i++) await send();
  assert.equal((await send()).headers.get('retry-after'), '600');
  sqlite.exec("UPDATE mensajes SET creado = datetime('now', '-601 seconds')");
  assert.equal((await send()).status, 200);
});

test('SQL-looking content stays inert, raw IP is not persisted, old attempt cleanup is bounded', async t => {
  const { send, sqlite } = setup(t);
  const mensaje = "Quiero aprender sobre SQL: '); DROP TABLE mensajes; --";
  assert.equal((await send({ ...valid, mensaje })).status, 200);
  const row = sqlite.prepare('SELECT * FROM mensajes').get();
  assert.equal(row.mensaje, mensaje);
  assert.match(row.ip_hash, /^[a-f0-9]{32}$/);
  sqlite.exec("INSERT INTO contacto_intentos (ip_hash, creado) VALUES ('old', datetime('now', '-2 days'))");
  await send();
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM contacto_intentos WHERE ip_hash = 'old'").get().n, 0);
});

test('database failures fail closed without leaking implementation details', async () => {
  const request = new Request('https://podcast.test/api/contacto', { method: 'POST', headers: { origin: 'https://podcast.test', 'cf-connecting-ip': '192.0.2.1' }, body: '{}' });
  const result = await onRequest({ request, env: { DB: { prepare() { throw new Error('secret schema'); } } } });
  assert.equal(result.status, 503);
  assert.doesNotMatch(await result.text(), /secret schema/);
});
