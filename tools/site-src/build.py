import hashlib, html, json, re, sys
sys.path.insert(0, '.')
from strings import S
import os
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
os.chdir(HERE)
T = open('template.html').read().replace(' aria-hidden="false"', '')

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
 'ext': '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
}

def t(k):  # data-i18n element content placeholder
    return f'§{k}§'

# Holiday offer: one source of truth for its end. Offer prices (keys ending in "Offer") and every
# .offer-only element are shown by js/bdv-site.js only before this instant; otherwise the page shows
# the normal prices. End of January 6, 2027, Pacific time (PST, UTC-8).
OFFER_END = '2027-01-07T00:00:00-08:00'
T = T.replace('@@OFFER_END@@', OFFER_END)

def price(key, tag='strong'):
    """Normal price; during the offer it is struck through and followed by the offer price."""
    if key + 'Offer' not in S:
        return f'<{tag} data-i18n="{key}Price">{t(key + "Price")}</{tag}>'
    normal = f'<{tag} class="price-normal"><span class="bdv-sr-only offer-only" data-i18n="priceNormalSr">{t("priceNormalSr")}</span> <span data-i18n="{key}Price">{t(key + "Price")}</span></{tag}>'
    offer = f'<{tag} class="price-offer offer-only"><span class="bdv-sr-only" data-i18n="priceOfferSr">{t("priceOfferSr")}</span> <span data-i18n="{key}Offer">{t(key + "Offer")}</span></{tag}>'
    return f'{normal} {offer}'

# services
svc = []
for n, (icon, qv) in enumerate([('phone','app'),('monitor','web'),('grid','system'),('wrench','repair')], 1):
    badge = f'<span class="svc-badge" data-i18n="svc{n}Badge">{t(f"svc{n}Badge")}</span>' if f'svc{n}Badge' in S else ''
    lis = ''.join(f'<li>@@ICON:check@@<span><span data-i18n="svc{n}{x}">{t(f"svc{n}{x}")}</span>' + (' ' + price(f'svc{n}{x}', 'span') if f'svc{n}{x}Price' in S else '') + '</span></li>'
                  for x in 'abcde' if f'svc{n}{x}' in S)
    typical = f'<p class="svc-typical" data-i18n="svc{n}Typical">{t(f"svc{n}Typical")}</p>' if f'svc{n}Typical' in S else ''
    svc.append(f'''          <article class="service-card{' service-card-new' if badge else ''}">
            <div class="svc-top"><span class="svc-ico" aria-hidden="true">@@ICON:{icon}@@</span>{badge}</div>
            <h3 data-i18n="svc{n}Title">{t(f"svc{n}Title")}</h3>
            <p data-i18n="svc{n}Desc">{t(f"svc{n}Desc")}</p>
            <ul class="check-list">{lis}</ul>
            <div class="svc-foot">
              <p class="svc-price"><span data-i18n="svcFrom">{t("svcFrom")}</span> {price(f"svc{n}")} <small data-i18n="svc{n}Unit">{t(f"svc{n}Unit")}</small></p>{typical}
              <a class="btn btn-secondary btn-block" href="#cotizar" data-quote-service="{qv}" data-i18n="svcQuoteBtn">{t("svcQuoteBtn")}</a>
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
            img = f'<img src="./{P}{name}.webp" width="440" height="954" loading="lazy" decoding="async" alt="{t(key)}" data-i18n-alt="{key}" />'
            figs.append(f'              <figure class="shot shot-framed">{img}<figcaption data-i18n="{key}">{t(key)}</figcaption></figure>')
        else:
            h = it[2] if len(it) > 2 else 644
            img = f'<img src="./{P}{name}.webp" width="360" height="{h}" loading="lazy" decoding="async" alt="{t(key)}" data-i18n-alt="{key}" />'
            figs.append(f'              <figure class="shot"><div class="phone">{img}</div><figcaption data-i18n="{key}">{t(key)}</figcaption></figure>')
    note = f'\n            <p class="demo-note" data-i18n="{note_key}">{t(note_key)}</p>' if note_key else ''
    return f'''          <div class="gallery" data-gallery>
            <button type="button" class="gallery-btn gallery-prev" data-gallery-prev aria-controls="{gid}" aria-label="{t("galleryPrev")}" data-i18n-aria="galleryPrev">‹</button>
            <div class="gallery-track" id="{gid}" tabindex="0" role="region" aria-label="{label}">
{chr(10).join(figs)}
            </div>
            <button type="button" class="gallery-btn gallery-next" data-gallery-next aria-controls="{gid}" aria-label="{t("galleryNext")}" data-i18n-aria="galleryNext">›</button>{note}
          </div>'''

def project(pid, name, kind, badge_key, badge_cls, desc, status, link_key, url, gal, case=''):
    return f'''        <article class="project" id="{pid}">
          <div class="project-info">
            <div class="project-badges"><span class="status-badge {badge_cls}" data-i18n="{badge_key}">{t(badge_key)}</span></div>
            <p class="kicker" data-i18n="{kind}">{t(kind)}</p>
            <h3 class="project-title">{name}</h3>
            <p class="project-desc" data-i18n="{desc}">{t(desc)}</p>{case}
            <p class="project-status" data-i18n="{status}">{t(status)}</p>
            <a class="text-link" href="{url}" target="_blank" rel="noopener noreferrer"><span data-i18n="{link_key}">{t(link_key)}</span> @@ICON:ext@@</a>
          </div>
{gal}
        </article>'''


# GY Roadside testimonial (published with the owner's approval). To credit the owner by name,
# set it here; it is shown before the translated role ("gyQuoteBy").
GY_QUOTE_NAME = ''
GY_QUOTE_SIGNER = (f'<strong>{html.escape(GY_QUOTE_NAME)}</strong>, ' if GY_QUOTE_NAME else '') + '<span data-i18n="gyQuoteBy">§gyQuoteBy§</span>'

CASE_GY = """
            <div class="case-study">
              <h4 class="case-h" data-i18n="gyChallengeH">§gyChallengeH§</h4>
              <p data-i18n="gyChallenge">§gyChallenge§</p>
              <h4 class="case-h" data-i18n="gyDidH">§gyDidH§</h4>
              <ul class="check-list">
""" + "\n".join(f'                <li>@@ICON:check@@<span data-i18n="gyDid{i}">§gyDid{i}§</span></li>' for i in range(1, 7)) + """
              </ul>
              <h4 class="case-h" data-i18n="gyNextH">§gyNextH§</h4>
              <p data-i18n="gyNext">§gyNext§</p>
              <blockquote class="case-quote">
                <p data-i18n="gyQuote">§gyQuote§</p>
                <footer>""" + GY_QUOTE_SIGNER + """</footer>
              </blockquote>
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
            <div class="stage-head"><span class="stage-num">{i}</span><span class="stage-pct"><span data-i18n="procProgress">{t("procProgress")}</span> {p}%</span></div>
            <h3 data-i18n="st{i}Title">{t(f"st{i}Title")}</h3>
            <p data-i18n="st{i}Text">{t(f"st{i}Text")}</p>
            <div class="stage-bar" aria-hidden="true"><span></span></div>
          </li>''')
T = T.replace('@@STAGES@@', '\n'.join(st))

faq = []
for i in range(1, 7):
    faq.append(f'''          <details class="faq-item"{' open' if i == 1 else ''}>
            <summary data-i18n="q{i}">{t(f"q{i}")}</summary>
            <p data-i18n="a{i}">{t(f"a{i}")}</p>{f'''
            <p class="offer-only offer-note" data-i18n="a{i}Offer">{t(f"a{i}Offer")}</p>''' if f"a{i}Offer" in S else ""}
          </details>''')
T = T.replace('@@FAQ@@', '\n'.join(faq))

T = re.sub(r'@@ICON:(\w+)@@', lambda m: ICONS[m.group(1)], T)

used = set(re.findall(r'§(\w+)§', T))
missing = used - set(S)
assert not missing, missing
# Keys used only from JavaScript (passed to BDV_t / tr as quoted strings) count as used too.
js_used = set()
for js_file in ('bdv-site.js', 'bdv-ops-panel.js', 'brand-media.js', 'bdv-sow-signer.js'):
    js_used |= set(re.findall(r'["\'](\w+)["\']', open(os.path.join(REPO, 'js', js_file)).read()))
unused = set(S) - used - js_used
assert not unused, f'unused i18n keys: {sorted(unused)}'
T = re.sub(r'§(\w+)§', lambda m: html.escape(S[m.group(1)][0], quote=True), T)
assert '@@' not in T
es = {k: v[0] for k, v in S.items()}
en = {k: v[1] for k, v in S.items()}
js = open('i18n-runtime.js').read().replace('/*__DICT__*/', json.dumps({'es': es, 'en': en}, ensure_ascii=False, indent=2))
open(os.path.join(REPO, 'js', 'bdv-i18n.js'), 'w').write(js)

# Cache busting: every local stylesheet/script URL gets ?v=<content hash>, so a deploy never
# serves new HTML with stale CSS/JS from the CDN cache.
def versioned(m):
    path = m.group(2)
    digest = hashlib.sha1(open(os.path.join(REPO, path), 'rb').read()).hexdigest()[:10]
    return f'{m.group(1)}="./{path}?v={digest}"'
T, n_assets = re.subn(r'(href|src)="\./((?:css|js)/[\w.-]+\.(?:css|js))"', versioned, T)
assert n_assets == 8, n_assets
open(os.path.join(REPO, 'index.html'), 'w').write(T)
print('ok', len(S), 'keys,', n_assets, 'versioned assets')
