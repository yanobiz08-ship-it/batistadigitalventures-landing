# batistadigitalventures-landing
Landing page for Batista Digital Ventures — digital platforms, mobile apps, and technology solutions.

## Operations notes

- **Admin / Dev panel:** there is no public button any more. Open
  `https://batistadigitalventures.com/#bdv-ops` (the hash is removed from the address bar
  right after the panel opens), or run `BDV_OPS.openAdmin()` in the browser console.
  Access is still protected by the Worker key, exactly as before.
- **Private documents:** contract drafts (partner agreement, MSA/SOW) must not live in this
  repository. Everything in this repo is publicly served by GitHub Pages and readable on GitHub.
- **Images:** optimized, right-sized copies live in `assets/img/`. The original masters
  (`assets/BDV Logo Banner.jpg`, `assets/BDV Logo.png`) are kept but no longer loaded by the page
  (the 512px PNG is only referenced as the Organization logo in the JSON-LD).
- **SEO files:** `robots.txt`, `sitemap.xml`, `favicon.ico`, `favicon-32x32.png`,
  `apple-touch-icon.png` and `assets/img/og-image.jpg` (1200×630) are at the site root / assets.
- **Editing page text (phase 2):** `index.html` and `js/bdv-i18n.js` are generated from
  `tools/site-src/` (`template.html` = markup with `§key§` placeholders, `strings.py` = every
  text as `(es, en)`, `build.py` = cards/portfolio/process/FAQ generators). Edit there and run
  `python3 tools/site-src/build.py` — it rewrites both files so Spanish (static HTML, default) and
  English (dictionary) never drift apart. Quick one-off fix without Python: change the Spanish text in
  `index.html` **and** the matching key (`data-i18n="…"`) in both `es` and `en` in `js/bdv-i18n.js`.
- **Forms / Worker actions:** the quote form (`#bdv-quote-form`) POSTs `action: "request_services"`; the partner
  application (`#bdv-partner-form`) POSTs `action: "partner_application"` (stored apart in KV `partner_applications`);
  the client viewer uses POST `action: "client_lookup"` (rate-limited). See `js/bdv-site.js` / `js/bdv-ops-panel.js`.
  The admin panel shows client requests and partner applications in separate lists (legacy partner
  submissions that came in through `request_services` are still detected and listed with partners).
- **Worker source:** not in this repo (Cloudflare Worker `bdv-backend-api`). A local git copy with tests was prepared
  outside the repo; see PR #2 for details and rollback instructions.
- **Layout CSS:** `css/bdv-site.css` (page layout, dark/gold design); `css/brand-media.css` keeps the
  header logo, modals, client viewer and admin panel styles.
- **Portfolio images:** WebP copies in `assets/img/portfolio/` (originals are not in the repo).
