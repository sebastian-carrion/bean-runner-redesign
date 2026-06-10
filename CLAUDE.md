# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a static HTML/CSS/JS redesign project for **BeanRunner Cafe** (201 S. Division St., Peekskill, NY). No build tools, bundlers, or package managers — open files directly in a browser.

## File map

| File | Purpose |
|------|---------|
| `BeanRunner_Prototype.html` | **Primary prototype (v2)** — full multi-section homepage with a page-switcher tab bar, annotation pins, and a Design Notes panel |
| `BeanRunner_Prototype_B.html` | **Alternative direction ("Onyx-inspired")** — lighter background, transparent-on-scroll nav, announcement ticker, marquee strip, accolades ticker; more editorial/magazine feel |
| `BeanRunner_Prototype_v1.html` | Earlier v1 iteration (superseded by Prototype A) |
| `BeanRunner_Menu.html` | Standalone menu page with sticky category tabs; linked to from Prototype A |
| `BeanRunner_Reviews_Mockups.html` | Isolated review-section variant explorations |
| `assets/` | Local images: `interior.jpg`, `cafe_people.jpg`, `cafe2.jpg`, `coffee.jpg`, `sandwich.jpg`, `welcome.jpg`, `logo.png` |

## Design system

All files share an identical set of CSS custom properties (tokens). Never introduce new color values — use the existing tokens:

```css
--espresso: #1C0F0A   /* darkest bg, footer */
--roast:    #2C1A10   /* dark section bg */
--amber:    #C8963E   /* primary accent, CTAs, labels */
--gold:     #E8B860   /* warm highlight, italic accents */
--cream:    #F5EFE0   /* light text on dark bg */
--parchment:#EDE5D0   /* light section bg */
--ash:      #5A5248   /* body text on light bg */
--smoke:    #9A8F82   /* secondary/muted text */
--white:    #FAF7F2   /* page background */
--ink:      #1A1614   /* darkest text */
```

**Typography stack** (Google Fonts — already loaded in every file):
- `--serif`: Playfair Display — headings, display text, italic accents
- `--sans`: DM Sans — body copy, UI labels
- `--mono`: DM Mono — eyebrows, tags, prices, timestamps, nav items

**Typographic conventions:**
- Eyebrows/labels: `font-family: var(--mono)`, `font-size: 9–11px`, `letter-spacing: .2–.4em`, `text-transform: uppercase`, `color: var(--amber)`
- Headings: `font-family: var(--serif)`, responsive sizing via `clamp()`
- Italic `<em>` inside headings always gets `color: var(--gold)` or `color: var(--amber)`

## Architecture of Prototype A (primary file)

`BeanRunner_Prototype.html` uses a **page-switcher pattern**: a fixed tab bar (`#page-switcher`) calls `switchPage(name)` to show/hide `<div id="view-*">` containers. Currently only `#view-home` is fully built; other views are stubs. Sections inside `#view-home`:

`#hero` → `#pillars` → `#events` (+ `.weekly-schedule`) → `#menu-preview` (tabbed via `switchTab()`) → `#about` → `#hours` → `#gallery` → `.reviews-section`

**Prototype-specific UI:**
- `.proto-banner` — fixed top bar indicating prototype status (z-index 9999)
- `.annotation-pin` / `.annotation-tooltip` — blue numbered pins with hover tooltips for design commentary; positioned with named classes like `.ann-hero-cta`
- `#design-notes` — fixed bottom-right panel toggled by JS

## Prototype B key differences

- Nav is **transparent over the hero**, turns opaque on scroll (`nav.scrolled` class added via JS when `scrollY > 60`)
- Has an `.announce-bar` (scrolling ticker) sitting between the proto-banner and nav
- No page-switcher; single-page linear layout
- Uses `--linen: #EEE9DF` as an extra token not present in Prototype A

## Business facts (content reference)

- **Founded:** 2008 (co-founders Ted Bitter and Drew Claxton)
- **Address:** 201 S. Division St., Peekskill, NY 10566 — `(914) 737-1701`
- **Live music:** Fridays (doors 6:30 / show 7:00) and Saturdays (doors 5:30 / show 6:00)
- **TripAdvisor:** 4.3★, 46 reviews, #17 in Peekskill
- **Email:** beanman.beanrunnercafe@gmail.com
