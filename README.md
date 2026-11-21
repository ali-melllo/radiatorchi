# Radiatorchi (رادیاتورچی)

Bilingual (fa default / en) automotive catalog and corporate site. Next.js App Router, strict TypeScript, Tailwind v4, Radix primitives, Motion, next-intl, next-themes. No backend, no cart, no payments.

## Run
```bash
npm install          # then consider `npx npm-check-updates -u` (see "Unverified")
npm run dev          # http://localhost:3000  (redirects to /fa)
npm run typecheck && npm run lint && npm run test
npm run build && npm run start
npx playwright install chromium && npm run test:e2e
```
Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) for canonicals, hreflang, sitemap and JSON-LD.

## What to replace before launch
| What | Where |
|---|---|
| Phone / WhatsApp / email / address / hours / social | `src/config/contact.ts` (validated by Zod; empty values are hidden) |
| Logo (light/dark, icon) | `public/images/logo/*` + `src/config/brand.ts` (placeholders are SVG; PNG works too) |
| Products, images, compatibility, specs, SKU | `src/data/products.ts` (demo entries are flagged `isSample`: visible notice, `noindex`, excluded from sitemap) |
| Categories, manufacturers, FAQ | `src/data/categories.ts`, `manufacturers.ts`, `faqs.ts` |
| Company, legal and UI copy | `messages/fa.json`, `messages/en.json` (legal text is a draft and needs legal review) |
| OG image | `public/images/banners/og.jpg` (1200x630 placeholder) |

## Rendering
| Route | Mode |
|---|---|
| `/[locale]`, about, contact, faq, ordering-guide, privacy-policy, terms, categories, categories/[slug], products/[slug] | Static (SSG, `generateStaticParams`, `dynamicParams = false`) |
| `/[locale]/products` | Dynamic (filters are URL search params, rendered on the server so results are crawlable) |
| Client islands | header/mobile drawer, theme + language switchers, catalog controls, gallery, FAQ, contact modal, Motion wrappers |

Static export (`output: "export"`) is not supported: it conflicts with the `/` redirect middleware and the dynamic catalog.

## Notes
- Slugs are localized (`/fa/products/radiator-nemune-alef` ↔ `/en/products/radiator-sample-a`); the language switcher and hreflang use a slug map.
- Brand red `#F01420` with white text is about 4.3:1: fine for large/bold text, so buttons use semibold 15px+. Red text on light surfaces uses the darker `--brand-ink`.
- Motion: transform/opacity only, `LazyMotion` + `domAnimation`, honors `prefers-reduced-motion`.
- Redux/RTK Query intentionally omitted: there is no remote API to justify them.
