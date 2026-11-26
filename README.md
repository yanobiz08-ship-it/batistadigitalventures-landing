# batistadigitalventures-landing
Landing page for Batista Digital Ventures — apps, websites and digital systems, in Spanish and English.
Static site served by GitHub Pages (custom domain in `CNAME`). Everything in this repo is public.

## Structure
- `index.html` (Spanish, also `x-default`) and `en/index.html` (English) — one static page per language, linked
  with `hreflang` so Google indexes both; the ES/EN switch is a normal link. `404.html` — bilingual, `noindex`.
- `cuanto-cuesta-una-pagina-web/` and `en/how-much-does-a-website-cost/` — pricing guide (ES/EN pair) with
  cited market ranges, our prices from the same keys as the home page, visible FAQ, Article/BreadcrumbList/FAQPage JSON-LD.
- `js/bdv-i18n.js` — the ES/EN texts used by the scripts (`window.BDV_t`), for the page's `<html lang>`.
- `js/brand-media.js` — shared helpers (`window.BDV_CORE`), the legal texts (Terms of Service, Privacy Policy,
  Accessibility Statement) opened by any `[data-legal="terms|privacy|accessibility"]` button, request confirmation modal.
- `js/bdv-site.js` — quote form, partner application form, service preselect, portfolio galleries.
- `js/bdv-ops-panel.js` — client progress viewer and the private admin/partner panel.
- `js/bdv-sow-signer.js` — SOW viewer, e-signature and Stripe checkout (`?sow=SOW-XXXX`).
- `js/bdv-a11y.js` — dialog semantics, focus trap, Escape to close, labels for unlabeled fields.
- `css/bdv-site.css` — page layout and header (dark/gold, mobile-first); `css/brand-media.css` — UI injected by JS
  (legal links, modals, client viewer, admin panel).
- `assets/img/` — header logo, OG image and WebP portfolio/founder images; `assets/BDV Logo.png` is the
  512px logo referenced by the Organization JSON-LD.
- `robots.txt`, `sitemap.xml` (generated), `site.webmanifest`, favicons at the root.

## Editing texts
Every page above, `404.html`, `sitemap.xml` and `js/bdv-i18n.js` are generated from `tools/site-src/`
(`template.html` = `<head>`, header, footer and scripts shared by every page; `home.html` and `guide.html` = each
page's `<main>` with `§key§` placeholders; `404.html`; `strings.py` = every text as `(es, en)`; `build.py` =
cards/portfolio/process/FAQ generators, guide sources, JSON-LD, sitemap and the per-language pages; add a page in `PAGES`). Edit there and run
`python3 tools/site-src/build.py`; it rewrites the generated files so Spanish and English never drift apart, and fails
if a key is missing or unused. It also adds `?v=<content hash>` to every stylesheet/script URL so a deploy never
mixes new HTML with CSS/JS cached by the CDN. Asset URLs are root-relative (`/css/…`) so every page shares them.

## Backend (Cloudflare Worker `bdv-backend-api`)
All forms use the same Worker endpoint (`BDV_CORE.apiUrl`):
- quote form → `action: "request_services"`;
- partner application → `action: "partner_application"` (stored apart from client requests);
- client progress viewer → `action: "client_lookup"` (POST, rate-limited);
- SOW signer → `GET ?sow=`, `sign_sow`, `create_checkout`.
The Worker source is not in this repo (see PR #2 for its backup, tests and rollback instructions).

## Operations
- **Admin / partner panel:** no public button. Open `https://batistadigitalventures.com/#bdv-ops` (the hash is removed
  right after the panel opens) or run `BDV_OPS.openAdmin()` in the console. Access is protected by the Worker keys.
  Client requests and partner applications are shown in separate lists.
- **Offers and legal texts:** the holiday offer ends at `OFFER_END` in `tools/site-src/build.py`. Its dates and
  conditions are also written in the Terms of Service ("Ofertas / Offers", `js/brand-media.js`) and in `offerTerms` /
  `a4Offer` (`strings.py`); change them together, and update the "effective" month of any legal text you edit.
- **Private documents** (contracts, drafts, internal rules) must never be committed here.
