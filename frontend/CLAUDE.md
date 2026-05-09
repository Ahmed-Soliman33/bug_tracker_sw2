# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **React 19** + **Vite 8** (using React Compiler via Babel)
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js`)
- **Framer Motion** — animations
- **React Router v7** — client-side routing
- **React Icons** — icon library

## Commands

```bash
npm run dev      # start dev server (auto-picks available port)
npm run build    # production build → dist/
npm run preview  # preview production build
npm run lint     # ESLint
```

## Architecture

### Page composition

`About.jsx` (`pages/about/About.jsx`) renders the About Us page, currently composed of `AboutHero`. Accessible at `/about` — linked from Header and Footer.

`Home.jsx` renders sections in order: `Hero → TrustedCustomers → WhyNawras → ImpactBar → OurSolutions → Features → VideoShowcase → LatestNews → ComingSoon → PartnerPerspectives`. Add new homepage sections here.

`BlogPost` (`pages/blog/BlogPost.jsx`) is lazy-loaded via React's `lazy()` + `Suspense`. It reads a post by slug from `services/posts.js` and renders a two-column layout (article + sidebar of related posts).

### Components

| Component | Notes |
|---|---|
| `Header` | Floating pill navbar with dropdown + RTL-aware language switcher |
| `Hero` | Composed of `HeroBackground` (SVG arcs) + `HeroCollage` (4-image grid) |
| `TrustedCustomers` | Infinite drag-scroll carousel of partner logos — auto-play + arrow nav |
| `WhyNawras` | Headline text + full-width dashboard screenshot |
| `ImpactBar` | Stat counters (faster onboarding, productivity, ROI, retention) |
| `OurSolutions` | Two-card layout for HCM and ERP product lines |
| `Features` | Six-feature grid (cloud, automation, analytics, security, integration, success) |
| `VideoShowcase` | YouTube embed behind a thumbnail + animated play button; frame overlay via `vedio-section-border.png` |
| `LatestNews` | Infinite drag-scroll carousel of blog post cards (same pattern as TrustedCustomers) |
| `ComingSoon` | Two-card promo section for upcoming products (Nawras GRC + Anhar); card data is co-located in the component file, not in `mockData` |
| `PartnerPerspectives` | Testimonial/quote carousel from partner companies |
| `Footer` + `ContactForm` | Footer with social links; ContactForm is controlled, ready for Apollo mutation |

### Data flow

- `src/mockData/index.js` — structural data (`heroData`, `footerData`) with no translations; swap exports for WPGraphQL queries
- `src/services/posts.js` — `MOCK_POSTS` array + `getPosts()` / `getPostBySlug(slug)` async functions; swap for real API calls
- All user-facing strings live in `src/i18n/locales/`; components call `useTranslation(namespace)` — never hardcode copy

### Context & layout

- `LanguageContext` (`context/LanguageContext.jsx`) — sets `dir`/`lang` on `<html>`, exposes `{ lang, isRTL, toggle }` via `useLang()`
- `MainLayout` wraps every route with `Header` + `Footer`
- `App.jsx` is the router root: `LanguageProvider → BrowserRouter → MainLayout → Routes`

## i18n

The project uses **i18next** + **react-i18next** with lazy-loaded JSON namespaces:

- **Namespaces**: `common`, `nav`, `hero`, `footer`, `whyNawras` — each maps to a JSON file per locale.
- **Language detection order**: `?lang=` query param → `localStorage` (key: `nw_lang`) → browser preference.
- **`useLang()`** — hook from `LanguageContext` — returns `{ lang, isRTL, toggle }`. `toggle()` switches between `"en"` and `"ar"` and persists to localStorage.
- **`useTranslation(namespace)`** — standard react-i18next hook for accessing translated strings.
- `useSuspense` is disabled; components render immediately with fallback key strings while namespaces resolve.
- To add a new namespace: add JSON files in both `locales/en/` and `locales/ar/`, then add the namespace name to `NAMESPACES` in `i18n/config.js`.

## LTR/RTL Rules

- **Always use Tailwind logical properties**: `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `border-s`, `border-e` etc. Physical properties (`pl-`, `pr-`, `left-`, `right-`) break RTL layout.
- `LanguageContext` sets `dir` and `lang` on `<html>` automatically. Components read `isRTL` for imperative logic, or apply `dir={isRTL ? "rtl" : "ltr"}` on sub-trees with independent directionality.
- Fonts: LTR uses **Outfit**, RTL uses **Noto Sans Arabic** — both loaded in `index.html`, applied via `[dir="rtl"]` CSS selector.

## Backend Integration (future)

Two swap points:
1. `src/mockData/index.js` — structural data (nav links, hero collage images, social URLs)
2. `src/services/posts.js` — `getPosts()` and `getPostBySlug()` contain the WPGraphQL query pattern in comments

When wiring real data: add `@apollo/client` + `graphql`, create `src/services/apolloClient.js`, then replace mock exports with Apollo queries. `ContactForm.jsx` has a `// TODO` with the mutation pattern for WP Ninja Forms.

## Design Tokens

| Variable | Value |
|---|---|
| Navy (primary) | `#0d1b4b` |
| Teal (accent) | `#00b894` |
| Teal light | `#00cec9` |
| Footer bg | `#050e24` |

## Notes

- `footer-logo.png` is a 1×1 placeholder. `Footer.jsx` imports `header-logo.png` instead and applies `brightness-0 invert` to render it white on the dark background.
- Both `LatestNews` and `TrustedCustomers` use the same infinite-scroll pattern: tripled array (`[copy | original | copy]`), centred on the middle copy, normalising position on boundaries to keep the loop seamless.
- `VideoShowcase` uses a PNG border frame (`vedio-section-border.png`, 1238×618 px). The iframe is inset by measured percentages (`INSET_X`, `INSET_Y`, `CORNER_RADIUS`) to align pixel-perfectly inside the frame stroke.
- Vite auto-selects port if 5173/5174 are in use — check terminal output for the actual URL.
