# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Previewing the Site

No build step — the site is plain HTML/CSS/JS. Serve it locally with:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Kill the server when done: `kill %1`

## Deployment

Merging to `main` automatically deploys to **Azure Static Web Apps** via `.github/workflows/azure-static-web-apps-kind-glacier-0be94221e.yml`. The workflow sets `skip_app_build: true` because there is no build step — files are deployed as-is from the repo root.

## CSS Architecture

There are two CSS files loaded in order on every page:

| File | Purpose |
|------|---------|
| `css/normalize.css` | HTML5 reset only — do not modify |
| `css/style.css` | All base styles (~3,500 lines). Contains CSS custom properties, component styles, and all responsive breakpoints. ||

**CSS variables** are declared in `:root` inside `style.css`. The brand palette is:
- `--salmon` / `--salmon-bright` / `--salmon-dark` — primary coral colour
- `--purple` / `--purple-bright` / `--purple-dark` — lavender accent
- `--blue` / `--blue-bright` / `--blue-dark` — secondary blue
- `--pink`, `--yellow`, `--peach`, `--peach-light` — supporting tones
- `--font-heading`: `Playfair Display` (serif, for headings)
- `--font-body`: `Plus Jakarta Sans` (sans-serif, for body copy)

When adding new styles, prefer `artistic.css` for visual/aesthetic overrides and `style.css` for structural/layout rules.

## JavaScript Architecture

All interactive behaviour lives in `js/main.js` (single `DOMContentLoaded` listener). Key responsibilities:

- **Scroll-reveal animations** — `IntersectionObserver` adds `.is-visible` to `[data-animate]` elements; stagger delay is set via `--reveal-delay` CSS custom property on `[data-animate-group]` children.
- **Header scroll effects** — adds `.scrolled` class to `<header>` on scroll.
- **Mobile navigation** — hamburger toggle (`#navToggle`) controls `nav.expanded` / `nav.collapsed` classes; submenus use `.has-submenu.open`.
- **Gallery modal** — opens a lightbox (`#galleryModal`) for journey-page artwork; keyboard and focus-trap logic included.
- **Prize card tilt** — `mousemove` 3-D CSS transform effect on `.prize-card` elements.
- **Horizontal scroll carousels** — `scroll-snap` based, with prev/next buttons and resize handling.
- **Form handling** — registration and contact form validation/submission with inline error states.
- **Button ripple effect** — `addButtonEffects()` injects a ripple span on `.cta-button` / `.secondary-button` mouseenter.

`js/privacy-notice.js` manages the cookie-consent banner (`.cookie-consent`).  
`js/clarity-helper.js` wraps Microsoft Clarity event tracking.

## HTML Page Conventions

Every page links stylesheets in this order and the three JS files at the bottom of `<body>`:

```html
<link rel="stylesheet" href="css/normalize.css">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/artistic.css">
...
<script src="js/main.js"></script>
<script src="js/privacy-notice.js"></script>
<script src="js/clarity-helper.js"></script>
```

Scroll-reveal: add `data-animate` to any element that should fade+rise in on scroll; wrap siblings in a `data-animate-group` parent for automatic stagger.

Page-specific headers use `.page-header > h1`; the homepage uses `.hero` with `.hero-title-word--artists/--of/--tomorrow` spans for per-word colour styling.

## Content Security Policy

The CSP is set globally in `staticwebapp.config.json` (not in HTML meta tags). Any new third-party scripts, styles, or frames must be explicitly allow-listed there before they will load in production.

## Images

Images live in `images/` with subdirectories for `winners/`, event photos, founder portraits, and social icons. The logo is `images/logo.svg` (1080×1080, used at 40px in the header).
