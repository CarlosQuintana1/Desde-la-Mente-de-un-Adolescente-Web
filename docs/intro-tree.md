# Intro y arbol de la mente

La portada conserva la cita y el zoom original. El mismo H1 se reduce y sube.
Una semilla se abre; de ella crecen raices, tronco, ramas y hojas. Las disciplinas
aparecen al completarse sus ramas principales. No hay onda de audio.

## Implementacion

- `Hero.jsx` controla el titulo y las etiquetas sin estado React por frame.
- El progreso usa la altura estable de `.hero-stage`, no la barra variable del navegador.
- `MindTree.jsx` dibuja un canvas transparente solo cuando cambia el progreso.
- `treeGrowth.js` define 106 trazos Bezier, con uniones entre padres e hijos.
  Las siluetas crecen desde sus puntos de origen; las hojas se despliegan desde
  las puntas. No hay imagen oculta, mascaras, desenfoques ni capas de mezcla.
- Las curvas se muestrean una vez y el canvas limita su resolucion a DPR 2.
- La secuencia ocupa 360svh, antes 440svh; las ramas crecen de forma solapada.
- `ResizeObserver` vuelve a medir titulo y escenario al cambiar dimensiones o fuentes.
- Movimiento reducido: dos estados estaticos, sin zoom, desplazamientos ni pulsos.
- La seccion siguiente conserva su observer de entrada y la firma con lineas laterales.

## Verificacion

`pnpm run build` y `node scripts/verify-intro.mjs http://127.0.0.1:4179`.
El script requiere Playwright con Chromium. Para una instalacion externa se pueden
indicar `PLAYWRIGHT_MODULE` (modulo importable) y `CHROMIUM_PATH` (ejecutable).

Matriz: 1440x900, 390x844, 320x568, 844x390 y 390x844 con movimiento reducido.
Comprueba crecimiento de superficie y avance de las puntas mediante pixeles del
canvas, reversibilidad exacta, etiquetas dentro del viewport, ausencia de onda,
mascaras y desbordamiento, errores JS y enlace a About.
Capturas inspeccionadas en semilla, brote, crecimiento parcial y arbol completo.
Medicion aislada del dibujo, canvas 708x885, 181 pasos: p95 1.4 ms normal y 2.7 ms
con CPU Chromium ralentizada 4x. No incluye composicion ni garantiza FPS del dispositivo.
Las pruebas moviles son emulacion Chromium; Safari en iPhone fisico queda sin verificar.
