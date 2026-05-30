# AGENTS.md

## Project Overview
React single-page application for the podcast "Desde la Mente de un Adolescente". Built with Vite, using React 19 and React Router v7.

## Key Boundaries & Entrypoints
- `index.html` - Main HTML entry, points to `src/main.jsx`
- `src/main.jsx` - React root and Router configuration
- `src/App.jsx` - Layout, routing (`/` and `/episodios`), skip link (`#main-content`), and global effects (e.g., particles)
- `src/styles/main.css` - Active CSS file containing global typography, visual layout, and customized glowing `:focus-visible` indicators.
- `public/robots.txt` - Crawl configurations and sitemap indexing directives.
- `public/sitemap.xml` - Production route map for SEO indexing.

## Development & Commands
- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Preview:** `npm run preview`
No linter or test runner configured by default.

## Quirks & Conventions
- **CSS:** Plain CSS is used (no Tailwind/Sass). Global styles are imported directly in `App.jsx`.
- **Assets:** Images and icons are typically in `public/assets/img/`.
- **React 19 Hook Usage:** Context consumption is performed using the React 19 native `use(Context)` API instead of `useContext`.
- **Compound Components Pattern:** Complex state-heavy components (like `ContactForm`) are structured as compound components with decoupled states and shared contexts, exporting subcomponents via dot-notation (e.g., `ContactForm.Input`).
- **Accessibility Landmark Routing:** All keyboard actions use a dedicated Skip Link (`Saltar al contenido principal`) at the top of the body pointing to `<main id="main-content">`. Focus indicators use active, high-visibility glows on `:focus-visible`.

## Available Skills
- `frontend-design` - For UI/UX improvements
- `accessibility` - For WCAG compliance audits
- `seo` - For search engine optimization
- `vercel-react-best-practices` - For React performance guidelines
- `vercel-composition-patterns` - For modular compound component and context architectures

