import hashlib, html, json, re, sys
sys.path.insert(0, '.')
from strings import S
import os
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
os.chdir(HERE)
SHELL = open('template.html').read()  # <head>, header, footer and scripts shared by every page
T = open('home.html').read()          # home page <main>
G = open('guide.html').read()         # pricing guide <main>
A = open('apps.html').read()          # app development <main>

ICONS = {
 'shield': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
 'linkedin': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4z"/></svg>',
 'building': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 10h.01M15 10h.01M9 13h.01M15 13h.01"/></svg>',
 'pin': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
 'doc': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
 'steps': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4v-4h4v-4h4V8h4"/><path d="M4 20V4"/></svg>',
 'key': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 20 3M16 7l3 3M14 9l2 2"/></svg>',
 'globe': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
 'clock': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 'phone': '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>',
 'monitor': '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
 'grid': '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
 'wrench': '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
 'check': '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 'alert': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/></svg>',
 'ext': '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
}

def t(k):  # text placeholder, filled per language at the end
    return f'§{k}§'

# Holiday offer: one source of truth for its end. Offer prices (keys ending in "Offer") and every
# .offer-only element are shown by js/bdv-site.js only before this instant; otherwise the page shows
# the normal prices. End of January 6, 2027, Pacific time (PST, UTC-8). The same dates appear in the Terms of
# Service ("Ofertas / Offers" in js/brand-media.js) and in strings.py (offerTerms, a4Offer): keep them in sync.
OFFER_END = '2027-01-07T00:00:00-08:00'
SHELL = SHELL.replace('@@OFFER_END@@', OFFER_END)

def price(key, tag='strong'):
    """Normal price; during the offer it is struck through and followed by the offer price."""
    if key + 'Offer' not in S:
        return f'<{tag}>{t(key + "Price")}</{tag}>'
    normal = f'<{tag} class="price-normal"><span class="bdv-sr-only offer-only">{t("priceNormalSr")}</span> <span>{t(key + "Price")}</span></{tag}>'
    offer = f'<{tag} class="price-offer offer-only"><span class="bdv-sr-only">{t("priceOfferSr")}</span> <span>{t(key + "Offer")}</span></{tag}>'
    return f'{normal} {offer}'

# Offer banner with its conditions, shown (like every .offer-only element) only while the offer runs.
OFFER_BANNER = """          <div class="offer-banner offer-only"><p><strong>§offerBadge§</strong> <span>§offerLock§</span></p>
          <p class="offer-terms"><span>§offerTerms§</span> <button type="button" class="bdv-link-btn" data-legal="terms">§legalTermsBtn§</button>.</p></div>"""
T = T.replace('@@OFFER_BANNER@@', OFFER_BANNER)

# services
SVC_PAGES = {1: 'apps'}  # service card -> its own landing page (key in PAGES)
svc = []
for n, (icon, qv) in enumerate([('phone','app'),('monitor','web'),('grid','system'),('wrench','repair')], 1):
    badge = f'<span class="svc-badge">{t(f"svc{n}Badge")}</span>' if f'svc{n}Badge' in S else ''
    lis = ''.join(f'<li>@@ICON:check@@<span><span>{t(f"svc{n}{x}")}</span>' + (' ' + price(f'svc{n}{x}', 'span') if f'svc{n}{x}Price' in S else '') + '</span></li>'
                  for x in 'abcde' if f'svc{n}{x}' in S)
    typical = f'<p class="svc-typical">{t(f"svc{n}Typical")}</p>' if f'svc{n}Typical' in S else ''
    more = f'\n              <a class="text-link svc-more" href="@@PAGE:{SVC_PAGES[n]}@@"><span>{t(f"svc{n}More")}</span> <span aria-hidden="true">→</span></a>' if n in SVC_PAGES else ''
    svc.append(f'''          <article class="service-card{' service-card-new' if badge else ''}">
            <div class="svc-top"><span class="svc-ico" aria-hidden="true">@@ICON:{icon}@@</span>{badge}</div>
            <h3>{t(f"svc{n}Title")}</h3>
            <p>{t(f"svc{n}Desc")}</p>
            <ul class="check-list">{lis}</ul>
            <div class="svc-foot">
              <p class="svc-price"><span>{t("svcFrom")}</span> {price(f"svc{n}")} <small>{t(f"svc{n}Unit")}</small></p>{typical}{more}
              <a class="btn btn-secondary btn-block" href="#cotizar" data-quote-service="{qv}">{t("svcQuoteBtn")}</a>
            </div>
          </article>''')
T = T.replace('@@SERVICES@@', '\n'.join(svc))

P = 'assets/img/portfolio/'
MQ = [('merqox-map','mqC1',702),('merqox-hoy-en-tu-barrio','mqC2',702),('merqox-super-taco-web','mqC3',642),('merqox-publish-offer','mqC4',702),
      ('merqox-hoy-en-la-calle','mqC5',702),('merqox-radar','mqC6',702),('merqox-qr-counter','mqC7',702),('merqox-academy','mqC8',702)]
TR = [('trivlo-travel-beyond','trC1'),('trivlo-nara','trC2'),('trivlo-destinations','trC3'),('trivlo-customize','trC4'),
      ('trivlo-itineraries','trC5'),('trivlo-offline-maps','trC6'),('trivlo-trip-planner','trC7'),('trivlo-boarding-pass','trC8')]
GY = [('gy-hero','gyC1'),('gy-services','gyC2'),('gy-features','gyC3'),('gy-map-team','gyC4'),('gy-tire-service','gyC5')]

def gallery(gid, items, framed, label, note_key=None):
    figs = []
    for it in items:
        name, key = it[0], it[1]
        if framed:
            img = f'<img src="/{P}{name}.webp" width="440" height="954" loading="lazy" decoding="async" alt="{t(key)}" />'
            figs.append(f'              <figure class="shot shot-framed">{img}<figcaption>{t(key)}</figcaption></figure>')
        else:
            h = it[2] if len(it) > 2 else 644
            img = f'<img src="/{P}{name}.webp" width="360" height="{h}" loading="lazy" decoding="async" alt="{t(key)}" />'
            figs.append(f'              <figure class="shot"><div class="phone">{img}</div><figcaption>{t(key)}</figcaption></figure>')
    note = f'\n            <p class="demo-note">{t(note_key)}</p>' if note_key else ''
    return f'''          <div class="gallery" data-gallery>
            <button type="button" class="gallery-btn gallery-prev" data-gallery-prev aria-controls="{gid}" aria-label="{t("galleryPrev")}">‹</button>
            <div class="gallery-track" id="{gid}" tabindex="0" role="region" aria-label="{label}">
{chr(10).join(figs)}
            </div>
            <button type="button" class="gallery-btn gallery-next" data-gallery-next aria-controls="{gid}" aria-label="{t("galleryNext")}">›</button>{note}
          </div>'''

def project(pid, name, kind, badge_key, badge_cls, desc, status, link_key, url, gal, case=''):
    return f'''        <article class="project" id="{pid}">
          <div class="project-info">
            <div class="project-badges"><span class="status-badge {badge_cls}">{t(badge_key)}</span></div>
            <p class="kicker">{t(kind)}</p>
            <h3 class="project-title">{name}</h3>
            <p class="project-desc">{t(desc)}</p>{case}
            <p class="project-status">{t(status)}</p>
            <a class="text-link" href="{url}" target="_blank" rel="noopener noreferrer"><span>{t(link_key)}</span> @@ICON:ext@@</a>
          </div>
{gal}
        </article>'''


# GY Roadside testimonial (published with the owner's approval). To credit the owner by name,
# set it here; it is shown before the translated role ("gyQuoteBy").
GY_QUOTE_NAME = ''
GY_QUOTE_SIGNER = (f'<strong>{html.escape(GY_QUOTE_NAME)}</strong>, ' if GY_QUOTE_NAME else '') + '<span>§gyQuoteBy§</span>'

CASE_GY = """
            <div class="case-study">
              <h4 class="case-h">§gyChallengeH§</h4>
              <p>§gyChallenge§</p>
              <h4 class="case-h">§gyDidH§</h4>
              <ul class="check-list">
""" + "\n".join(f'                <li>@@ICON:check@@<span>§gyDid{i}§</span></li>' for i in range(1, 7)) + """
              </ul>
              <h4 class="case-h">§gyNextH§</h4>
              <p>§gyNext§</p>
              <blockquote class="case-quote">
                <p>§gyQuote§</p>
                <footer>""" + GY_QUOTE_SIGNER + """</footer>
              </blockquote>
              <p class="case-disclosure">§gyDisclosure§</p>
            </div>"""

PROJ = [
 project('proyecto-merqox','MERQOX','mqKind','badgeSoon','is-soon','mqDesc','mqStatusNote','mqLink','https://merqox.com',
         gallery('merqox-gallery', MQ, False, 'MERQOX', 'demoData')),
 project('proyecto-trivlo','TRIVLO','trKind','badgeSoon','is-soon','trDesc','trStatusNote','trLink','https://trivlopro.com',
         gallery('trivlo-gallery', TR, True, 'TRIVLO')),
 project('proyecto-gy','GY Roadside Solutions','gyKind','badgeLiveClient','is-live','gyDesc','gyStatusNote','gyLink','https://gyroadsidesolutions.com',
         gallery('gy-gallery', GY, False, 'GY Roadside Solutions'), CASE_GY),
]
T = T.replace('@@PROJECTS@@', '\n'.join(PROJ))

pcts = [10, 25, 45, 75, 90, 100]
st = []
for i, p in enumerate(pcts, 1):
    st.append(f'''          <li class="stage" style="--pct: {p}%">
            <div class="stage-head"><span class="stage-num">{i}</span><span class="stage-pct"><span>{t("procProgress")}</span> {p}%</span></div>
            <h3>{t(f"st{i}Title")}</h3>
            <p>{t(f"st{i}Text")}</p>
            <div class="stage-bar" aria-hidden="true"><span></span></div>
          </li>''')
# 6 stages + commitments, shared by the home page and the app page.
PROCESS = """        <ol class="timeline">
""" + '\n'.join(st) + """
        </ol>
        <div class="guarantees">
          <p class="kicker">§guarKicker§</p>
          <div class="guarantee-grid">
            <div class="guarantee"><span class="g-ico" aria-hidden="true">@@ICON:doc@@</span><h3>§guar1Title§</h3><p>§guar1Text§</p></div>
            <div class="guarantee"><span class="g-ico" aria-hidden="true">@@ICON:clock@@</span><h3>§guar2Title§</h3><p>§guar2Text§</p></div>
            <div class="guarantee"><span class="g-ico" aria-hidden="true">@@ICON:key@@</span><h3>§guar3Title§</h3><p>§guar3Text§</p></div>
          </div>
        </div>
"""
T = T.replace('@@PROCESS@@', PROCESS)

def faq_html(items, indent=10):
    """Visible FAQ (<details>); an answer's "<key>Offer" text is shown only while the offer runs.
    Pages with FAQPage JSON-LD pass the same items to schema(), so the markup and the schema match."""
    sp = ' ' * indent
    return '\n'.join(f'''{sp}<details class="faq-item"{' open' if n == 0 else ''}>
{sp}  <summary>{t(q)}</summary>
{sp}  <p>{t(a)}</p>{f'''
{sp}  <p class="offer-only offer-note">{t(a + "Offer")}</p>''' if a + "Offer" in S else ""}
{sp}</details>''' for n, (q, a) in enumerate(items))

T = T.replace('@@FAQ@@', faq_html([(f'q{i}', f'a{i}') for i in range(1, 7)]))


# ---------- Pricing guide ----------
# Market figures are cited from these sources ([[n]] in the guide strings); BDV prices reuse the
# home page's svc* keys and price(), so both pages always show the same prices and offer state.
GUIDE_SOURCES = [
    ('gSrc1', 'https://www.siteground.com/academy/cost-to-build-website-web-app'),
    ('gSrc2', 'https://clutch.co/resources/how-to-create-a-budget-for-a-new-website'),
    ('gSrc3', 'https://www.shopify.com/blog/ecommerce-website-cost'),
    ('gSrc4', 'https://www.shopify.com/pricing'),
    ('gSrc5', 'https://www.squarespace.com/pricing'),
    ('gSrc6', 'https://www.smartling.com/blog/translation-rates'),
    ('gSrc7', 'https://developers.google.com/search/docs/fundamentals/do-i-need-seo'),
]
GUIDE_FAQ = [(f'gQ{k}', f'gA{k}') for k in range(1, 6)]
# App page: market data and store rules from these sources; prices reuse svc1*.
APP_SOURCES = [
    ('apSrc1', 'https://clutch.co/directory/mobile-application-developers/pricing'),
    ('gSrc1', 'https://www.siteground.com/academy/cost-to-build-website-web-app'),
    ('apSrc3', 'https://developer.apple.com/support/enrollment/'),
    ('apSrc4', 'https://developer.apple.com/distribute/app-review/'),
    ('apSrc5', 'https://support.google.com/googleplay/android-developer/answer/6112435'),
    ('apSrc6', 'https://support.google.com/googleplay/android-developer/answer/14151465'),
]
APP_FAQ = [('apQ1', 'apA1'), ('apQ2', 'apA2'), ('apQ3', 'apA3'), ('apQ4', 'apA4'), ('q3', 'a3')]

def sources_html(sources):
    items = '\n'.join(f'            <li id="fuente-{k}"><a href="{url}" target="_blank" rel="noopener noreferrer">{t(key)}</a> <span class="bdv-sr-only">{t("gNewTab")}</span></li>'
                      for k, (key, url) in enumerate(sources, 1))
    return f'          <ol class="guide-sources">\n{items}\n          </ol>'

def breadcrumb(crumb):
    return f'''          <nav class="breadcrumb" aria-label="{t("gCrumbAria")}">
            <ol>
              <li><a href="@@HOME@@">{t("gCrumbHome")}</a></li>
              <li aria-current="page">{t(crumb)}</li>
            </ol>
          </nav>'''

def fill_lists(page):
    """@@LIST:<prefix>:<n or letters>@@ -> check-list items for <prefix>1..n or <prefix>a, b, ..."""
    return re.sub(r'@@LIST:(\w+):(\w+)@@', lambda m: '\n'.join(li(m.group(1) + str(k)) for k in
                  (range(1, int(m.group(2)) + 1) if m.group(2).isdigit() else m.group(2))), page)

def li(key):
    return f'              <li>@@ICON:check@@<span>{t(key)}</span></li>'

def cost_card(n, ours):
    return f'''            <article class="cost-card">
              <h3>{t(f"gT{n}H")}</h3>
              <p>{t(f"gT{n}D")}</p>
              <dl class="cost-rows">
                <div><dt>{t("gMarket")}</dt><dd>{t(f"gT{n}M")}</dd></div>
                <div class="cost-ours"><dt>{t("gOurs")}</dt><dd>{ours}</dd></div>
              </dl>
            </article>'''

def from_price(svc, label=''):
    return (f'<span>{t(label)}:</span> ' if label else '') + f'<span>{t("svcFrom")}</span> {price(svc, "span")} <small>{t(svc + "Unit")}</small>'

CARDS = [
    cost_card(1, from_price('svc2')),
    cost_card(2, t('svc2Typical')),
    cost_card(3, t('gT3O')),
    cost_card(4, t('gT4O')),
    cost_card(5, f'{from_price("svc3", "svc3Title")}<br />{t("svc3Typical")}<br />{from_price("svc1", "svc1Title")}<br />{t("svc1Typical")}'
                 f'<br /><a class="text-link" href="@@PAGE:apps@@"><span>{t("gAppsLink")}</span> <span aria-hidden="true">→</span></a>'),
]
G = G.replace('@@OFFER_BANNER@@', OFFER_BANNER).replace('@@COST_CARDS@@', '\n'.join(CARDS))
G = fill_lists(G).replace('@@BREADCRUMB@@', breadcrumb('gCrumb'))
G = G.replace('@@PRICE:svc4e@@', price('svc4e', 'span'))
G = G.replace('@@FLAGS@@', '\n'.join(f'            <li><span class="flag-ico" aria-hidden="true">@@ICON:alert@@</span><span>{t(f"gR{k}")}</span></li>' for k in range(1, 7)))
G = G.replace('@@FAQ@@', faq_html(GUIDE_FAQ, 12)).replace('@@SOURCES@@', sources_html(GUIDE_SOURCES))

# ---------- App development page ----------
A = fill_lists(A).replace('@@BREADCRUMB@@', breadcrumb('apCrumb')).replace('@@PROCESS@@', PROCESS).replace('@@OFFER_BANNER@@', OFFER_BANNER)
A = A.replace('@@PRICE:svc1@@', price('svc1', 'span')).replace('@@APP_PROJECTS@@', '\n'.join(PROJ[1::-1]))  # TRIVLO, MERQOX
A = A.replace('@@FAQ@@', faq_html(APP_FAQ, 12)).replace('@@SOURCES@@', sources_html(APP_SOURCES))

T = re.sub(r'@@ICON:(\w+)@@', lambda m: ICONS[m.group(1)], T)
G = re.sub(r'@@ICON:(\w+)@@', lambda m: ICONS[m.group(1)], G)
A = re.sub(r'@@ICON:(\w+)@@', lambda m: ICONS[m.group(1)], A)

NF = open('404.html').read()
used = set(re.findall(r'§(\w+)§', SHELL + T + G + A)) | set(re.findall(r'§(\w+)(?:\.en)?§', NF)) | {'pageTitle', 'metaDesc', 'gTitle', 'gMetaDesc', 'apTitle', 'apMetaDesc', 'gSrcAria'}
missing = used - set(S)
assert not missing, missing
# Keys used from JavaScript (passed to BDV_t / tr as quoted strings) count as used too; only those are
# shipped in js/bdv-i18n.js, because everything else is already rendered into each language's HTML.
js_used = set()
for js_file in ('bdv-site.js', 'bdv-ops-panel.js', 'brand-media.js', 'bdv-sow-signer.js'):
    js_used |= set(re.findall(r'["\'](\w+)["\']', open(os.path.join(REPO, 'js', js_file)).read()))
js_used &= set(S)
unused = set(S) - used - js_used
assert not unused, f'unused i18n keys: {sorted(unused)}'
dicts = {lang: {k: S[k][i] for k in sorted(js_used)} for i, lang in enumerate(('es', 'en'))}
js = open('i18n-runtime.js').read().replace('/*__DICT__*/', json.dumps(dicts, ensure_ascii=False, indent=2))
open(os.path.join(REPO, 'js', 'bdv-i18n.js'), 'w').write(js)

# Cache busting: every local stylesheet/script URL gets ?v=<content hash>, so a deploy never
# serves new HTML with stale CSS/JS from the CDN cache.
def versioned(m):
    path = m.group(2)
    digest = hashlib.sha1(open(os.path.join(REPO, path), 'rb').read()).hexdigest()[:10]
    return f'{m.group(1)}="/{path}?v={digest}"'

# One static page per language and page, so Google can index each (hreflang pairs them).
# Spanish is the x-default. Paths are relative to SITE.
SITE = 'https://batistadigitalventures.com/'
LOCALES = {'es': 'es_US', 'en': 'en_US'}
PAGES = {
    'home':  {'paths': {'es': '', 'en': 'en/'}, 'main': T, 'title': 'pageTitle', 'desc': 'metaDesc', 'og_type': 'website',
              'preload': '<link rel="preload" as="image" href="/assets/img/portfolio/trivlo-hero-device.webp" type="image/webp" fetchpriority="high" />\n  ',
              # Admin panel (#bdv-ops), client viewer and SOW links (?sow=) live on the home page only.
              'scripts': '  <script src="/js/bdv-ops-panel.js" defer></script>\n  <script src="/js/bdv-sow-signer.js" defer></script>\n', 'assets': 8},
    'guide': {'paths': {'es': 'cuanto-cuesta-una-pagina-web/', 'en': 'en/how-much-does-a-website-cost/'}, 'main': G, 'title': 'gTitle', 'desc': 'gMetaDesc',
              'og_type': 'article', 'preload': '', 'scripts': '', 'assets': 6, 'crumb': 'gCrumb', 'faq': GUIDE_FAQ},
    'apps':  {'paths': {'es': 'desarrollo-de-apps/', 'en': 'en/app-development/'}, 'main': A, 'title': 'apTitle', 'desc': 'apMetaDesc',
              'og_type': 'website', 'preload': '', 'scripts': '', 'assets': 6, 'crumb': 'apCrumb', 'faq': APP_FAQ},
}
GUIDE_DATE = '2026-11-25'  # datePublished / dateModified of the guide; update dateModified when its figures change

def org_node(i):
    org = SITE + '#organization'
    services = [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': S[f'svc{n}Title'][i], 'description': S[f'svc{n}Desc'][i],
                 'provider': {'@id': org}, 'areaServed': {'@type': 'Country', 'name': 'United States'}}} for n in range(1, 5)]
    return {'@type': 'ProfessionalService', '@id': org, 'name': 'Batista Digital Ventures LLC', 'alternateName': ['Batista Digital Ventures', 'BDV'],
            'url': SITE, 'logo': {'@type': 'ImageObject', 'url': SITE + 'assets/BDV%20Logo.png', 'width': 512, 'height': 512},
            'image': SITE + 'assets/img/og-image.jpg', 'description': S['metaDesc'][i], 'email': 'contact@batistadigitalventures.com',
            'address': {'@type': 'PostalAddress', 'addressLocality': 'Lompoc', 'addressRegion': 'CA', 'addressCountry': 'US'},
            'areaServed': {'@type': 'Country', 'name': 'United States'}, 'duns': '150052438', 'knowsLanguage': ['es', 'en'],
            'founder': {'@id': SITE + '#founder'},
            'sameAs': ['https://www.youtube.com/channel/UCVkQn4dWIfmxu4kZ0kBTa9w'],
            'contactPoint': {'@type': 'ContactPoint', 'contactType': 'customer service', 'email': 'contact@batistadigitalventures.com', 'availableLanguage': ['es', 'en']},
            'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': S['svcKicker'][i].capitalize(), 'itemListElement': services}}

def plain(key, i):
    """Text of a string without its [[n]] citation markers (for JSON-LD)."""
    return re.sub(r'\s*\[\[\d+\]\]', '', S[key][i])

def schema(page, lang):
    """JSON-LD: the company as a ProfessionalService, its founder, the site and the page. No prices:
    the 'from' prices change with offers and are only final in the SOW. The guide adds Article,
    BreadcrumbList and FAQPage (its FAQ is visible on the page)."""
    i = 0 if lang == 'es' else 1
    cfg = PAGES[page]
    url = SITE + cfg['paths'][lang]
    founder = {'@type': 'Person', '@id': SITE + '#founder', 'name': 'Yano Batista', 'jobTitle': S['fRole'][i], 'worksFor': {'@id': SITE + '#organization'},
               'sameAs': ['https://www.linkedin.com/in/yano-batista']}
    webpage = {'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': S[cfg['title']][i], 'description': S[cfg['desc']][i], 'inLanguage': lang,
               'isPartOf': {'@id': SITE + '#website'}, 'about': {'@id': SITE + '#organization'}}
    graph = [org_node(i), founder,
             {'@type': 'WebSite', '@id': SITE + '#website', 'url': SITE, 'name': 'Batista Digital Ventures', 'inLanguage': ['es', 'en'], 'publisher': {'@id': SITE + '#organization'}},
             webpage]
    if 'crumb' in cfg:
        webpage['breadcrumb'] = {'@id': url + '#breadcrumb'}
        graph.append({'@type': 'BreadcrumbList', '@id': url + '#breadcrumb', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': S['gCrumbHome'][i], 'item': SITE + PAGES['home']['paths'][lang]},
            {'@type': 'ListItem', 'position': 2, 'name': S[cfg['crumb']][i], 'item': url}]})
    if 'faq' in cfg:
        graph.append({'@type': 'FAQPage', '@id': url + '#faq', 'inLanguage': lang, 'isPartOf': {'@id': url + '#webpage'}, 'mainEntity': [
            {'@type': 'Question', 'name': plain(q, i), 'acceptedAnswer': {'@type': 'Answer', 'text': plain(a, i)}} for q, a in cfg['faq']]})
    if page == 'guide':
        graph.append({'@type': 'Article', '@id': url + '#article', 'headline': S['gH1'][i], 'description': S['gMetaDesc'][i], 'inLanguage': lang,
                      'mainEntityOfPage': {'@id': url + '#webpage'}, 'image': SITE + 'assets/img/og-image.jpg', 'datePublished': GUIDE_DATE, 'dateModified': GUIDE_DATE,
                      'author': {'@id': SITE + '#founder'}, 'publisher': {'@id': SITE + '#organization'},
                      'citation': [u for _, u in GUIDE_SOURCES]})
    if page == 'apps':
        # No price in the schema: it changes with offers and is only final in the SOW.
        graph.append({'@type': 'Service', '@id': url + '#service', 'name': S['apH1'][i], 'serviceType': S['svc1Title'][i], 'description': S['apMetaDesc'][i],
                      'provider': {'@id': SITE + '#organization'}, 'areaServed': {'@type': 'Country', 'name': 'United States'}, 'availableLanguage': ['es', 'en'],
                      'url': url, 'mainEntityOfPage': {'@id': url + '#webpage'}})
    return '\n'.join('  ' + line for line in json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, indent=2).splitlines())

def render(page, lang):
    i = 0 if lang == 'es' else 1
    other = 'en' if lang == 'es' else 'es'
    cfg = PAGES[page]
    paths = cfg['paths']
    out = SHELL.replace('@@MAIN@@', cfg['main'])
    for k, v in {'TITLE': f'§{cfg["title"]}§', 'DESC': f'§{cfg["desc"]}§', 'OG_TYPE': cfg['og_type'], 'PRELOAD': cfg['preload'], 'HOME_SCRIPTS': cfg['scripts'],
                 'LANG': lang, 'URL': SITE + paths[lang], 'URL_ES': SITE + paths['es'], 'URL_EN': SITE + paths['en'], 'SITE': SITE,
                 'PATH_ES': '/' + paths['es'], 'PATH_EN': '/' + paths['en'],
                 'HOME': '' if page == 'home' else '/' + PAGES['home']['paths'][lang],
                 'OG_LOCALE': LOCALES[lang], 'OG_LOCALE_ALT': LOCALES[other], 'JSONLD': schema(page, lang),
                 f'ACTIVE_{lang.upper()}': ' active', f'ACTIVE_{other.upper()}': '',
                 f'CURRENT_{lang.upper()}': ' aria-current="page"', f'CURRENT_{other.upper()}': ''}.items():
        out = out.replace(f'@@{k}@@', v)
    out = re.sub(r'@@PAGE:(\w+)@@', lambda m: '/' + PAGES[m.group(1)]['paths'][lang], out)
    out = re.sub(r'§(\w+)§', lambda m: html.escape(S[m.group(1)][i], quote=True), out)
    # Citations: [[n]] -> superscript link to source n in the guide's source list.
    out = re.sub(r'\s*\[\[(\d)\]\]', lambda m: f'<sup class="cite">[<a href="#fuente-{m.group(1)}"><span class="bdv-sr-only">{html.escape(S["gSrcAria"][i])} </span>{m.group(1)}</a>]</sup>', out)
    assert '@@' not in out and '§' not in out and '[[' not in out
    if page == 'home':
        assert 'class="cite"' not in out
    out, n_assets = re.subn(r'(href|src)="/((?:css|js)/[\w.-]+\.(?:css|js))"', versioned, out)
    assert n_assets == cfg['assets'], (page, n_assets)
    return out

for page, cfg in PAGES.items():
    for lang, path in cfg['paths'].items():
        os.makedirs(os.path.join(REPO, path), exist_ok=True)
        open(os.path.join(REPO, path, 'index.html'), 'w').write(render(page, lang))

# 404 page (GitHub Pages serves /404.html for any missing URL), in both languages, not indexed.
nf = re.sub(r'§(\w+)§', lambda m: html.escape(S[m.group(1)][0], quote=True), re.sub(r'§(\w+)\.en§', lambda m: html.escape(S[m.group(1)][1], quote=True), NF))
nf, n_nf = re.subn(r'(href|src)="/((?:css|js)/[\w.-]+\.(?:css|js))"', versioned, nf)
assert n_nf == 1 and '§' not in nf
open(os.path.join(REPO, '404.html'), 'w').write(nf)

# Sitemap: every page in both languages, each with its hreflang alternates.
urls = []
for cfg in PAGES.values():
    alts = ''.join(f'\n    <xhtml:link rel="alternate" hreflang="{h}" href="{SITE + cfg["paths"][l]}" />' for h, l in (('es', 'es'), ('en', 'en'), ('x-default', 'es')))
    urls += [f'\n  <url>\n    <loc>{SITE + path}</loc>{alts}\n  </url>' for path in cfg['paths'].values()]
open(os.path.join(REPO, 'sitemap.xml'), 'w').write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">{"".join(urls)}\n</urlset>\n')
print('ok', len(S), 'keys,', len(js_used), 'in bdv-i18n.js,', sum(len(c['paths']) for c in PAGES.values()), 'pages + 404 + sitemap')
