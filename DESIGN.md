# Design System: Artists of Tomorrow

This file is the source of truth for generating new screens and components that align with the Artists of Tomorrow (AOT) and Leaders of Tomorrow (LOT) brand aesthetics. Use it when prompting Stitch or other AI design tools.

---

## AOT — Artists of Tomorrow

### 1. Visual Theme & Atmosphere

Warm, youthful, and vibrant. The AOT brand celebrates creativity and self-expression through a soft coral-lavender-sky palette drawn directly from the stylized mountain-and-sun logo. The interface feels approachable and alive — gently animated floating orbs and gradient text give it a breathing quality without ever becoming loud. Backgrounds are peachy-cream rather than stark white, maintaining warmth at every scroll depth. Shadows are low-opacity and large-radius, creating depth without harshness. The overall mood is: *inclusive celebration of young artists*.

---

### 2. Color Palette & Roles

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Warm Coral (primary) | `#E59D83` | CTAs, primary accents, 3rd-place prize border, hover base |
| Vivid Coral (CTA fill) | `#F4AE96` | Primary button fill, ripple effects |
| Deep Coral (hover) | `#D38A70` | Button hover states, active pressed states |
| Soft Lavender (accent) | `#C4B5ED` | Footer background, logo text color |
| Brighter Lavender | `#B8A6EF` | Accent highlights |
| Muted Lavender | `#A796DC` | Darker lavender variant |
| Sky Blue (secondary) | `#7AB8CC` | Secondary buttons, h3 headings, 3rd prize accents |
| Ocean Blue (secondary hover) | `#5A98C5` | Secondary button hover fill |
| Pale Sky (bright) | `#8ECFE3` | Secondary button border and bright accent |
| Blush Pink | `#DBC1E1` | Prize card accent, subtle section tones |
| Vivid Pink | `#EAB9E7` | Bright pink accent variant |
| Pale Lemon | `#FCF0A0` | Logo sun, highlight color, lemon accents |
| Warm Lemon | `#FFE8A3` | Bright yellow variant |
| Peachy Cream (background) | `#FFF0EB` | Body background color |
| Soft Peach (light sections) | `#FFF8F5` | Alternating section backgrounds |
| Champion Gold | `#FFD452` | 1st place prize border and icon |
| Pewter Silver | `#C6C6C6` | 2nd place prize border and icon |
| Deep Charcoal (text) | `#333333` | Body text, headings |
| Muted Stone (secondary text) | `#666666` | Captions, subheadings, metadata |

---

### 3. Typography Rules

**Headings — Playfair Display (serif).** Elegant and editorial. Letter-spacing pulled tight at −0.02em to feel crafted rather than default. Used for all h1–h3 and key display text.

- **H1 (hero):** Fluid scale from 2.7rem to 4.4rem across viewport widths. Weight 700. Line-height 1.05 — very tight for drama. Often rendered as multi-color gradient text (coral → lavender).
- **H2 (section titles):** 2.8rem, weight 600, line-height 1.3. Always followed by a centered 3px Warm Coral underline bar (60px wide, animates to 80px on hover).
- **H3 (card titles):** 1.75rem, weight 500. Color is Sky Blue (`#7AB8CC`) by default.
- **Page headers:** 3.5rem, weight 700, on interior pages.

**Body — Plus Jakarta Sans (sans-serif).** Clean, friendly, and highly legible. 1.05rem base size, 1.75 line-height for generous readability. Letter-spacing slightly open at +0.01em.

**Navigation & UI labels:** Plus Jakarta Sans, uppercase, letter-spacing 1.2px, weight 600.

---

### 4. Component Stylings

**Buttons**

- *Primary CTA:* Fully pill-shaped (50px border-radius). Filled with Vivid Coral (`#F4AE96`). White text, uppercase, weight 600, 0.95rem, letter-spacing 1.2px. Carries a warm coral glow shadow: `0 10px 26px rgba(244, 174, 150, 0.45)`. On hover: lifts 2px upward, shadow deepens.
- *Secondary:* Same pill shape. Transparent background with a 2px Pale Sky (`#8ECFE3`) border, matching text. On hover: fills solid Pale Sky, white text, lifts 2px.

**Cards**

- *Standard:* White background, 15–16px rounded corners (subtly rounded, not pill-shaped), padding 35px × 30px. Whisper-soft salmon shadow (`0 10px 30px rgba(229, 157, 131, 0.1)`). On hover: lifts 5px and reveals an animated salmon→sky-blue gradient accent bar along the bottom edge.
- *Prize cards:* More generous rounding (22px). Differentiated by a 6px colored top border — Champion Gold for 1st, Pewter Silver for 2nd, Sky Blue for 3rd, Soft Lavender for recognition. White background with very subtle border.

**Inputs & Forms**

White background, light gray border (`#DDDDDD`), 10–14px border-radius (gently rounded). On focus: Warm Coral outline. Inline error states with color feedback.

---

### 5. Layout Principles

- **Container:** Centered, with 24px side padding. Content never stretches fully edge-to-edge.
- **Hero padding:** Generous fluid padding — `clamp(110px, 20vh, 160px)` at top, matching rhythm at bottom. Creates breathing room around the key message.
- **Section padding:** 5rem (80px) top and bottom as the standard rhythm unit. Compresses to 50px on mobile.
- **Grids:** Start at 1 column on narrow mobile, expand to 2 columns at 640px, and 3 columns at 992px+ for card grids. Footer uses a 4-column grid on desktop → 2 on tablet → 1 on mobile.
- **Spacing scale:** Gaps follow a consistent progression: 12, 16, 20, 24, 30, 36, 40px. Card padding uses 24–35px.

---

### 6. Animations & Interactions

**Transition easing:** All transitions use `cubic-bezier(0.165, 0.84, 0.44, 1)` — a fast-out, smooth ease. Three speeds: fast (0.2s), medium (0.3s), slow (0.5s).

**Scroll reveal:** Elements with `[data-animate]` fade in and rise from 32px below (opacity 0→1, translateY 32px→0) over 0.5s as they enter the viewport. Sibling groups stagger with incremental delays via a CSS custom property.

**Floating ornaments:** Three decorative orbs in the hero section gently pulse in scale and opacity (`shimmerPulse`, ~4s ease-in-out infinite). Background ornament elements drift slowly on a long loop (28s).

**Hero background:** A diagonal SVG diamond pattern slowly floats across the background (animating background-position over a long linear loop). Adds texture without distraction.

**Footer gradient bar:** A 6px top border on the footer slides its gradient background-position continuously — salmon → sky blue → pink → lemon — creating a slow, breathing color shift.

**Hover interactions:** All interactive surfaces lift upward (translateY −2px for buttons, −5px for cards) and deepen their shadow. Smooth 0.3s transitions everywhere.

**Reduced motion:** All keyframe animations are disabled for users who prefer reduced motion. Elements appear instantly at full opacity with no transforms.

---

## LOT — Leaders of Tomorrow

### 1. Visual Theme & Atmosphere

Prestigious, structured, and warm. LOT is a Toastmasters chapter sub-brand that shares AOT's serif heading font but speaks a different visual language: deep midnight navy as the dominant canvas, punctuated by burnished gold accents that suggest achievement and tradition. An emerald green appears as a tertiary accent, adding life without breaking the gravity. The mood is *professional mentorship* — polished enough for a stage, warm enough for a classroom.

---

### 2. Color Palette & Roles

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Midnight Navy (primary bg) | `#1a2744` | Page and section backgrounds |
| Lighter Navy (card bg) | `#253557` | Cards, elevated surfaces on navy |
| Deep Navy (darkest) | `#111b33` | Footer background, darkest surfaces |
| Burnished Gold (primary) | `#d4a843` | Primary buttons, animated accent bars, highlight text |
| Warm Gold (hover) | `#e8c86e` | Button hover state, gold glow moments |
| Muted Gold | `#c9a24b` | Decorative accents, speech card stripe variant |
| Forest Emerald | `#2d8b6e` | Tertiary accent, speech card stripe |
| Bright Emerald | `#3aaa88` | Emerald hover and highlight |
| Ivory Cream | `#f8f6f1` | Role card backgrounds, light surfaces |
| Warm Cream Alt | `#f0ece4` | Alternate light section tone |
| Soft Off-White | `#ffffff` | Text on navy, light icons |
| Deep Ink (body text) | `#3a3a42` | Body text on light surfaces |
| Muted Ink (secondary text) | `#6b6b78` | Captions, metadata on light surfaces |

---

### 3. Typography Rules

**Headings — Playfair Display (serif).** Same editorial typeface as AOT. On LOT, it carries more gravitas — white or gold-tinted on dark navy backgrounds.

- **H1 (hero):** Fluid scale 2.6rem to 4.2rem. Weight 800 — heavier than AOT's 700 for added authority. Rendered as a multi-stop gradient: light blue → Burnished Gold.
- **H2 (section titles):** Gold color (`#d4a843`) on navy backgrounds. 3px gold underline accent bar.
- **Section labels / badges:** Small uppercase labels in gold, weight 600, letter-spacing 0.1em, used above hero headings.

**Body — Lato (sans-serif).** Slightly more neutral and utilitarian than AOT's Plus Jakarta Sans, suiting the structured meeting-room context. Same 1.05rem base, 1.75 line-height.

**Footer links:** Playfair Display at 0.92rem, 75% white opacity. Serif footer links create a less generic, more editorial feel.

---

### 4. Component Stylings

**Buttons**

- *Primary:* Gently rounded rectangle (10px border-radius — modern but not pill-shaped). Filled with Burnished Gold (`#d4a843`). Deep navy text, weight 700, uppercase, letter-spacing 0.07em. Gold ambient glow: `0 4px 18px rgba(212, 168, 67, 0.3)`. On hover: fills to Warm Gold, lifts 2px.
- *Outline:* Transparent, white border (30% opacity). White text. On hover: border turns gold, text turns Warm Gold, very subtle gold background tint, lifts 2px.

**Cards**

- *Flow step / info cards:* White background, 14px rounded corners, 28px × 24px padding. Soft navy shadow (`0 4px 20px rgba(26, 39, 68, 0.08)`). Subtle navy border. On hover: lifts 5px, shadow deepens to `0 12px 36px rgba(26, 39, 68, 0.14)`.
- *Role cards:* Ivory Cream (`#f8f6f1`) background, 14px rounded corners, center-aligned content. No border. On hover: lifts 6px.
- *Speech category cards:* White, 14px rounded corners, 4px left border stripe in a rotating accent color (Gold → Emerald → Lighter Navy → Muted Gold → Bright Emerald per card position). On hover: lifts 5px, shadow deepens.

**Inputs & Forms**

White or cream background, light border, 10–14px border-radius. On focus: Burnished Gold outline.

---

### 5. Layout Principles

- **Container:** Centered, 24px side padding. Same grid system as AOT.
- **Hero padding:** 120px top, 100px bottom — slightly less fluid than AOT but still generous.
- **Section accent:** A 4px animated gold gradient bar (`lotGradientSlide`) runs at the very top of the hero, acting as a visual entry point.
- **Speech grid:** Fixed 3-column layout (`repeat(3, minmax(0, 320px))`) centered via `justify-content: center`. Cards never stretch beyond 320px each.
- **Footer grid:** 4 columns (1.4fr 1fr 1fr 1.2fr ratio) on desktop → 2 columns on tablet → 1 column on mobile.

---

### 6. Animations & Interactions

**Transition easing:** Same easing curve as AOT (`cubic-bezier(0.165, 0.84, 0.44, 1)`), same three speed tiers (0.2s / 0.3s / 0.5s).

**Hero gold accent bar:** A 4px bar at the hero top continuously slides its background-position through a gold gradient loop (`lotGradientSlide`, 4s linear infinite).

**Scroll reveal:** Same `[data-animate]` fadeInUp system as AOT — consistent experience across both sub-brands.

**Card hover:** All LOT cards lift (−5px to −6px) with shadow deepening on hover. Smooth 0.3s transitions.

**Reduced motion:** Identical to AOT — all keyframe animations off, instant opacity, no transforms.

---

## Shared Conventions

- **Scroll reveal system:** `[data-animate]` on any element triggers a fade+rise on viewport entry. Wrap siblings in `[data-animate-group]` for automatic stagger via `--reveal-delay`.
- **Header:** Both brands use `.lot-site-header` markup. AOT gets an animated gradient bar via `::after`; LOT uses `.lot-hero::after` instead.
- **Logo:** `images/logo.svg` in header (eager-loaded, never lazy). `images/logo-favicon.png` for browser tab.
- **Script load order (every page):** `main.js` → `privacy-notice.js` → `clarity-helper.js` at bottom of `<body>`.
