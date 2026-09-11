CREATE TABLE IF NOT EXISTS mensajes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  pais TEXT,
  ip_hash TEXT,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mensajes_creado ON mensajes(creado DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_ip ON mensajes(ip_hash, creado);
