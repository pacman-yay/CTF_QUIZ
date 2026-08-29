# Premium Cyber Theme — Implementation Guide

This document outlines the design system, color palette, typography, and specific CSS techniques used to create the "Premium Cyber" aesthetic for the Quiz Arena application.

## 1. Color Palette

The interface relies on a deep, cold blue foundation heavily weighted towards dark surfaces, accented sparingly by bright, tactical blues and semantic status colors.

### Base / Backgrounds
- `--bg-layer-1: #050914;` — Deepest space, used for the main body background.
- `--bg-layer-2: #080D19;` — Secondary backdrop.

### Surfaces (Panels & Cards)
- `--surface: #0D1525;` — Primary card backgrounds.
- `--surface-light: #111B2D;` — Elevated surfaces (e.g., hover states, inner panels).
- `--surface-lighter: #142036;` — Highest elevation surfaces.

### Borders
- `--border: #1D3150;` — Standard structural borders.
- `--border-light: #28466D;` — Highlighted or active borders.

### Accents & Typography
- `--primary: #4D8DFF;` — Main cyber blue accent (interactive elements).
- `--primary-hover: #36B9FF;` — Brighter cyan-blue for hover states.
- `--text-primary: #E8F0FF;` — High-contrast text (nearly white with a blue tint).
- `--text-secondary: #7F91AD;` — Muted text for metadata and secondary info.

### Semantic Status
- `--success: #3ECF8E;` — Matrix/Terminal green.
- `--warning: #E5AD4A;` — Tactical amber.
- `--danger: #E05260;` — Alert red.

---

## 2. Typography System

The application uses a dual-font system to balance readability with a technical aesthetic. Both are imported via Google Fonts.

1. **Primary Font (Body, Questions, Answers):**
   `Space Grotesk, sans-serif`
   Used for its modern, slightly geometric structure while remaining highly legible for long questions.

2. **Technical Font (HUD, Timers, Metadata):**
   `IBM Plex Mono, monospace`
   Used strictly for numbers, uppercase labels, buttons, and HUD indicators.

### Micro-Typography Utilities
- `.hud-label`: Uses IBM Plex Mono, `0.75rem`, `uppercase`, with `2px` letter spacing. Colored with `--text-secondary`.
- `.hud-value`: Uses IBM Plex Mono, standard sizing, `font-weight: 500`. Colored with `--text-primary`.

---

## 3. Visual & Structural Elements

### Background Architecture
The main background isn't a solid color. It is constructed using stacked CSS techniques on the `body` tag and its pseudo-elements to create depth without relying on heavy assets:
- **Base Color:** Deepest blue (`#050914`).
- **Grid Layer (`body::before`):** A CSS `linear-gradient` grid at `60px` sizing with `15%` opacity.
- **Illumination Layer (`body::after`):** A subtle `radial-gradient` acting as an ambient light source behind the main content area.

### Cyber Component Geometry
- **Zero Border Radius:** To maintain an engineered, tactical feel, `border-radius: 0` is applied globally to buttons and inputs.
- **Layered Borders:** Major panels use a `::before` pseudo-element to create an inset or double-border effect (`border: 1px solid var(--border-light); margin: 4px; pointer-events: none;`).
- **Corner Accents:** The login card and completion cards feature 4 distinct technical corners built with `absolute` positioned pseudo-elements that draw 2px borders on just two sides per corner.

### Interactive States & Glows
Neon is used sparingly. Instead of overwhelming glow, interactive elements use controlled `box-shadow` definitions:
- `--glow-subtle: 0 0 10px rgba(77, 141, 255, 0.15);` — Used for button hovers and active states.
- `--shadow-panel: 0 12px 40px rgba(0, 0, 0, 0.25);` — Deep shadows to lift panels off the grid.

---

## 4. UI Layout Patterns

- **Command Header:** The top bar minimizes padding and integrates a 2px high continuous progress bar at the bottom edge.
- **Question Navigator (Matrix):** Sidebar grids avoid heavy outlines in favor of subtle `.navBtn` boxes. Answered questions are denoted by a tiny green dot rather than filling the whole box, keeping the UI light.
- **Milliseconds Timer:** Utilizing `requestAnimationFrame`, the timer calculates elapsed time based on the exact start timestamp, rendering tens-of-milliseconds to reinforce the "mission critical" feel.
