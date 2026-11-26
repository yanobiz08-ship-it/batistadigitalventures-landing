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
