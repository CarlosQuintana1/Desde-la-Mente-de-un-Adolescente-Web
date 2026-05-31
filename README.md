# 🌌 Desde la Mente de un Adolescente - Web Official

[![Sitio Web - En Producción](https://img.shields.io/badge/Status-Producción-6366f1?style=for-the-badge&logo=react)](http://localhost:5173)
[![Build - Clean](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge&logo=vite)](http://localhost:5173)
[![Tecnología - React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev)

Plataforma oficial del podcast **"Desde la Mente de un Adolescente"**. Una aplicación web SPA (Single Page Application) ultra-premium diseñada para transmitir una experiencia inmersiva, atmosférica y interactiva que rinde tributo a las ideas, ciencia y arte desde la perspectiva de la mente adolescente.

---

## 🎨 Concepto y Filosofía de Diseño

El sitio web está inspirado en el espacio profundo y la curiosidad intelectual. Presenta una interfaz de usuario envolvente que combina estética oscura de vanguardia con efectos de iluminación dinámicos.

*   **Atmósfera Cósmica:** Un esquema de colores oscuros profundos combinados con degradados en tonos índigo, violeta y azul eléctrico (`#6366f1`, `#818cf8`, `#4f46e5`).
*   **Efecto Glassmorphism:** Menús flotantes, tarjetas y botones que utilizan filtros de desenfoque de fondo (`backdrop-filter: blur()`) para simular capas de cristal translúcido suspendidas en el espacio.
*   **Micro-interacciones Orgánicas:**
    *   **3D Tilt Gestures (Efecto Giroscopio):** Tarjetas interactivas que reaccionan tridimensionalmente a la posición exacta del cursor en pantalla.
    *   **Lienzo de Partículas:** Un fondo animado continuo que emula polvo estelar flotando suavemente.
    *   **Filtros de Legibilidad:** Difuminados de sombra (`text-shadow`) para blindar el contraste tipográfico contra los elementos del fondo.

---

## 🚀 Características Principales

### 1. Plano Principal (Hero Section)
*   **Badge de Temporada Premium:** Un pill circular de alto contraste en formato glassmorphic que destaca el podcast actual.
*   **Tipografía Inmersiva:** Título gigante asimétrico alineado a la izquierda con acentos de color vibrantes y siluetas protectoras de contraste (`text-shadow`).
*   **Llamados a la Acción Sincronizados:** Botones con degradados de marca unificados y efectos de brillo inverso interactivo al hacer hover.

### 2. Carrusel de Episodios Inteligente
*   **Desplazamiento Easing Fluido:** Sistema de navegación asistida que realiza un scroll curvo continuo tipo `easeInOutCubic` en clicks rápidos.
*   **Límites Inteligentes de Scroll:** Las flechas de navegación izquierda y derecha se ocultan y revelan dinámicamente al tocar los límites físicos del contenedor (con un buffer de `40px` que se adapta perfectamente al padding lateral del carril).
*   **Cero Desfases Visuales:** Desplazamiento horizontal optimizado que evita cortes en los extremos gracias a la distribución del padding en el track y ocultación inteligente en pantallas táctiles móviles.

### 3. Página de Todos los Episodios
*   **Responsive Grid Layout:** Un grid fluido adaptado automáticamente a pantallas desde móviles compactos hasta monitores panorámicos de alta resolución (`1440px` y `1920px+`).
*   **Filtros Rápidos:** Navegación interna por categorías para explorar temas sobre Ciencia, Tecnología, Arte y más.

### 4. Formulario de Contacto (Patrón Compound)
*   **Arquitectura Modular:** Diseñado bajo el patrón de componentes compuestos de React, permitiendo desacoplar el estado y compartir el contexto de validación de forma limpia.
*   **Intersección Inteligente:** Visibilidad garantizada mediante observadores de viewport (`IntersectionObserver`) optimizados que se activan suavemente en cuanto el formulario entra en la pantalla.

### 5. Accesibilidad (WCAG 2.2 Compliant)
*   **Ruta de Enlace de Salto:** Soporte para usuarios de teclado mediante un skip-link directo al contenido principal (`#main-content`).
*   **Indicadores de Foco Premium:** Estilos de contorno `:focus-visible` personalizados que añaden un anillo brillante de alta visibilidad para navegación asistida sin ratón.
*   **Marcadores Semánticos:** Etiquetas HTML5 semánticas completas y descripciones alternativas para lectores de pantalla.

---

## 🛠️ Stack Tecnológico

*   **Core:** [React 19](https://react.dev) (Usando la API nativa `use(Context)` y Hooks modernos).
*   **Enrutador:** [React Router v7](https://reactrouter.com) (Para transiciones de vista fluidas).
*   **Compilador:** [Vite](https://vite.dev) (Para recargas instantáneas HMR).
*   **Estilos:** Plain CSS (Modular, estructurado con variables personalizadas `--accent`, `--bg-primary`, etc., sin Tailwind/Sass para máximo control y rendimiento).
*   **SEO & Crawler:** Sitemap dinámico (`sitemap.xml`) e instrucciones de rastreo indexadas (`robots.txt`).

---

## 📂 Estructura del Repositorio

```bash
├── public/                 # Recursos estáticos
│   ├── assets/img/         # Imágenes comprimidas (.webp) y logos
│   ├── robots.txt          # Configuración del crawler SEO
│   └── sitemap.xml         # Mapa de rutas de indexación
├── src/
│   ├── components/         # Componentes React & Hojas de estilo locales
│   │   ├── Navbar.jsx      # Barra de navegación con contención simétrica
│   │   ├── Hero.jsx        # Plano principal asimétrico
│   │   ├── Episodes.jsx    # Carrusel inteligente y grid responsive
│   │   └── ContactForm.jsx # Formulario con patrón Compound Component
│   ├── data/
│   │   ├── episodes.js     # Base de datos de episodios (Ciencia, Arte, etc.)
│   │   └── constants.js    # Constantes y configuraciones del Tilt 3D
│   ├── hooks/
│   │   └── useInView.js    # Hook de detección de visibilidad en viewport
│   ├── styles/
│   │   └── main.css        # Estilos globales, variables CSS y Breakpoints de pantalla
│   ├── App.jsx             # Punto de entrada de layouts, partículas y rutas
│   └── main.jsx            # Configuración del React Root y Router v7
├── index.html              # Entrada HTML principal de la SPA
├── package.json            # Scripts y dependencias del proyecto
└── README.md               # Esta documentación
```

---

## 💻 Comandos de Desarrollo

Asegúrate de tener instalado [Node.js](https://nodejs.org). Luego, ejecuta los siguientes comandos en la terminal:

1. **Instalar Dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   *El servidor local se abrirá en [http://localhost:5173](http://localhost:5173) con Hot Module Replacement activo.*

3. **Compilar para Producción:**
   ```bash
   npm run build
   ```
   *Generará los archivos finales altamente optimizados, comprimidos y minificados en la carpeta `/dist`.*

4. **Previsualizar Compilación de Producción:**
   ```bash
   npm run preview
   ```

---

## 🌌 Normas de Estilos y Buenas Prácticas

Si vas a colaborar o modificar el código, por favor ten en cuenta los siguientes lineamientos:
*   **Preserva la Simetría en Pantallas Grandes:** El ancho del contenido se escala de manera dinámica en monitores grandes. Mantén todos los elementos alineados a la variable global `--content-max-width`.
*   **Micro-animaciones Suaves:** La interacción es clave. No utilices escalas superiores a `1.03` ni ángulos de giro mayores a `0.8°` para los efectos 3D en las tarjetas.
*   **Soporte de Z-Index en Botones:** Al usar la clase `.btn-primary`, envuelve siempre el contenido del botón en una etiqueta `<span>` para evitar que quede tapado por la capa degradada del hover.
*   **Formatos de Medios:** Utiliza siempre imágenes en formato `.webp` comprimidas para mantener un tiempo de carga del sitio por debajo de los `500ms`.
