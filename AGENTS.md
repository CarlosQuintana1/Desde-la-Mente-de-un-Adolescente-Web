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
- `public/_redirects` - Cloudflare Pages SPA fallback (`/* /index.html 200`). Required for client-side routes to survive a direct hit or a reload.
- `functions/api/contacto.js` - Pages Function backing the contact form (POST only). Validates, rate-limits, writes to D1, then fires an optional Telegram notification.
- `wrangler.toml` - Pages project config and the D1 binding (`DB`).
- `schema.sql` - D1 schema for the `mensajes` table.
- `scripts/sitemap.mjs` - Generates `public/sitemap.xml` from `src/data/episodes.js` on every build. The file is gitignored; never edit it by hand.
- `public/site.webmanifest`, `public/favicon.ico`, `public/icon-*.png`, `public/apple-touch-icon.png` - Icons and PWA manifest, wired from the `<head>` of `index.html`.

## Development & Commands
- **Dev server (front only):** `pnpm dev`
- **Dev server with Functions + local D1:** `pnpm exec wrangler pages dev`
- **Build:** `pnpm run build`
- **Preview:** `pnpm run preview`
- **Deploy:** `pnpm run deploy` (builds, then `wrangler pages deploy`)
- **Read contact messages:** `pnpm run mensajes`
No linter or test runner configured by default.

## Hosting & Backend
- Hosted on Cloudflare Pages, project `desde-la-mente`, production branch `main`.
- The contact form POSTs JSON to `/api/contacto`. Messages are stored in the D1 database `dm-contacto`, table `mensajes`.
- Anti-abuse: a hidden `sitio` honeypot field, and a cap of 3 submissions per 10 minutes keyed on a truncated SHA-256 of the client IP. The raw IP is never stored.
- Telegram notifications are optional and off unless both secrets exist:
  `wrangler pages secret put TELEGRAM_BOT_TOKEN` and `wrangler pages secret put TELEGRAM_CHAT_ID`.
  Without them the message is still stored; only the notification is skipped.
- Schema changes: edit `schema.sql`, then `wrangler d1 execute dm-contacto --remote --file=schema.sql`.
- `compatibility_date` in `wrangler.toml` must not be newer than the local workerd binary, or `wrangler pages dev` refuses to boot.

## Quirks & Conventions
- **CSS:** Plain CSS is used (no Tailwind/Sass). Global styles are imported directly in `App.jsx`.
- **Assets:** Images and icons are typically in `public/assets/img/`.
- **React 19 Hook Usage:** Context consumption is performed using the React 19 native `use(Context)` API instead of `useContext`.
- **Compound Components Pattern:** Complex state-heavy components (like `ContactForm`) are structured as compound components with decoupled states and shared contexts, exporting subcomponents via dot-notation (e.g., `ContactForm.Input`).
- **Scroll-Driven Animations:** Section reveals use `useScrollProgress` hook (status-based `IntersectionObserver` replacement) which returns a `progress` value (0→1) mapped directly to scroll position. Inline styles via `scrollRevealStyle(progress, type)` and `stagger(progress, offset)` replace CSS transition classes for smooth, progressive entry animations.
- **Preact & XState Usage:** Preact signals and XState machines are used where beneficial for state and animation orchestration.
- **Accessibility Landmark Routing:** All keyboard actions use a dedicated Skip Link (`Saltar al contenido principal`) at the top of the body pointing to `<main id="main-content">`. Focus indicators use active, high-visibility glows on `:focus-visible`.

## Available Skills
- `frontend-design` - For UI/UX improvements
- `accessibility` - For WCAG compliance audits
- `seo` - For search engine optimization
- `vercel-react-best-practices` - For React performance guidelines
- `vercel-composition-patterns` - For modular compound component and context architectures

