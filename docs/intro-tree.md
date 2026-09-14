# Intro y arbol de la mente

La portada conserva la cita y el zoom original. El mismo H1 se reduce y sube;
no hay un segundo titulo duplicado. Una onda visual da paso a raices y tronco.
Ciencia, Tecnologia, Arte y Humanidades aparecen en orden y activan su rama.

## Implementacion

- `Hero.jsx` controla la secuencia con variables CSS, sin estado React por frame.
- El progreso usa la altura estable de `.hero-stage`, no la barra variable del navegador.
- `MindTree.jsx` revela una ilustracion WebP de 195 KB mediante mascaras SVG.
- Las mascaras y tintes comparten coordenadas de 800 x 1000; el fondo negro
  de la ilustracion se integra mediante `screen` en el contenedor completo.
- Las etiquetas tienen posiciones finales independientes de su desplazamiento animado.
- `ResizeObserver` vuelve a medir titulo y escenario al cambiar dimensiones o fuentes.
- Movimiento reducido: dos estados estaticos, sin zoom, desplazamientos ni pulsos.
- La seccion siguiente conserva su observer de entrada y la firma con lineas laterales.

## Verificacion

`pnpm run build` y `node scripts/verify-intro.mjs http://127.0.0.1:4179`.
El script requiere Playwright con Chromium. Para una instalacion externa se pueden
indicar `PLAYWRIGHT_MODULE` (modulo importable) y `CHROMIUM_PATH` (ejecutable).

Matriz: 1440x900, 390x844, 320x568, 844x390 y 390x844 con movimiento reducido.
Comprueba progresion por disciplina, reversibilidad, etiquetas dentro del viewport,
ausencia de desbordamiento horizontal, pixeles del arbol, errores JS y enlace a About.
Capturas inspeccionadas en inicio, titulo, crecimiento parcial y arbol completo.
Las pruebas moviles son emulacion Chromium; Safari en iPhone fisico queda sin verificar.
