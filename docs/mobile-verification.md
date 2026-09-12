# Mobile layout regression checks

## Regression fixed on 2026-09-12

- At 360px, the featured card was 306px wide while its information column
  extended past the card. Non-wrapping platform links set the grid's automatic
  minimum width. `overflow: hidden` concealed the overflow instead of fixing it.
- Grid tracks now use `minmax(0, 1fr)`. Images have explicit responsive widths,
  information columns can shrink, and platform links wrap inside the card.
- The hero uses `100svh` instead of `100dvh`; its background no longer animates
  scale or brightness. The illustration and existing copy are unchanged.
- Mobile, coarse-pointer and reduced-motion modes override reveal styles in CSS,
  including before effects run and after viewport changes. Keep the `--reveal-*`
  properties in `main.css` and `scrollRevealStyle` together.

## Checks performed

- Production overflow reproduced at 360px before changes.
- Corrected featured card: 320, 360, 375, 390, 412, 480 and 768px. No clipped
  descendants; mobile section styles resolve to opacity 1, no transform and
  zero transition duration.
- Tablet/desktop checks: 820, 1024 and 1440px. Intentional image hover cropping
  and the horizontally scrollable carousel are not text overflow failures.
- All ten detail routes at 320px: no clipped card content. Episode 10's notes
  expand correctly. Listing contains ten cards without internal overflow.
- Contact fields remain editable at 320px. No form message was submitted.
- Direct `/#acercadma` aligns its section; manual scrolling continues afterward.
- Mobile home: no CSS animations, background filter or background transform;
  Lenis does not initialise. Desktop carousel next control advances the track.

## Repeat before changing layout or motion

1. Build with `pnpm run build` (or `npm run build` with installed dependencies).
2. Test home, `/episodios` and `/episodio/10` at 320px and 390px, then 820px
   and 1440px. Include short landscape and tall portrait screens.
3. Check element bounds inside the featured card, not only document width:
   an ancestor with hidden overflow can conceal a failing layout.
4. Confirm platform labels fit, images load, notes expand, and hash navigation
   does not pull the page back after a user scrolls.
5. Test with a coarse pointer and reduced motion on a real device before
   claiming phone performance is solved. Viewport tests are not FPS measurements.

## Limits and rollback

Browser checks used the desktop in-app browser at explicit viewport sizes.
Android/iOS device FPS, OS text scaling and browser-bar resizing were not measured.
No database schema, contact endpoint or production messages changed.
If content becomes inaccessible after deployment, roll back the Pages deployment
and retain the screenshots and viewport size for reproduction.
