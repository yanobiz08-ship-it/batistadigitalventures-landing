import re, json, html, sys
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

# services
svc = []
for n, (icon, qv) in enumerate([('phone','app'),('monitor','web'),('grid','system'),('wrench','repair')], 1):
    badge = f'<span class="svc-badge" data-i18n="svc{n}Badge">{t(f"svc{n}Badge")}</span>' if f'svc{n}Badge' in S else ''
    lis = ''.join(f'<li>@@ICON:check@@<span data-i18n="svc{n}{x}">{t(f"svc{n}{x}")}</span></li>' for x in 'abcd')
    svc.append(f'''          <article class="service-card{' service-card-new' if badge else ''}">
            <div class="svc-top"><span class="svc-ico" aria-hidden="true">@@ICON:{icon}@@</span>{badge}</div>
            <h3 data-i18n="svc{n}Title">{t(f"svc{n}Title")}</h3>
            <p data-i18n="svc{n}Desc">{t(f"svc{n}Desc")}</p>
            <ul class="check-list">{lis}</ul>
            <div class="svc-foot">
              <p class="svc-price"><span data-i18n="svcFrom">{t("svcFrom")}</span> <strong data-i18n="svc{n}Price">{t(f"svc{n}Price")}</strong> <small data-i18n="svc{n}Unit">{t(f"svc{n}Unit")}</small></p>
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

def gallery(gid, items, framed, label):
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
    return f'''          <div class="gallery" data-gallery>
            <button type="button" class="gallery-btn gallery-prev" data-gallery-prev aria-controls="{gid}" aria-label="{t("galleryPrev")}" data-i18n-aria="galleryPrev">‹</button>
            <div class="gallery-track" id="{gid}" tabindex="0" role="region" aria-label="{label}">
{chr(10).join(figs)}
            </div>
            <button type="button" class="gallery-btn gallery-next" data-gallery-next aria-controls="{gid}" aria-label="{t("galleryNext")}" data-i18n-aria="galleryNext">›</button>
          </div>'''

def project(pid, name, kind, badge_key, badge_cls, desc, extra, status, link_key, url, gal):
    return f'''        <article class="project" id="{pid}">
          <div class="project-info">
            <div class="project-badges"><span class="status-badge {badge_cls}" data-i18n="{badge_key}">{t(badge_key)}</span>{extra}</div>
            <p class="kicker" data-i18n="{kind}">{t(kind)}</p>
            <h3 class="project-title">{name}</h3>
            <p class="project-desc" data-i18n="{desc}">{t(desc)}</p>
            <p class="project-status" data-i18n="{status}">{t(status)}</p>
            <a class="text-link" href="{url}" target="_blank" rel="noopener noreferrer"><span data-i18n="{link_key}">{t(link_key)}</span> @@ICON:ext@@</a>
          </div>
{gal}
        </article>'''

PROJ = [
 project('proyecto-merqox','MERQOX','mqKind','badgeSoon','is-soon','mqDesc',
         '<span class="status-badge is-live" data-i18n="mqLiveNote">§mqLiveNote§</span>','mqStatusNote','mqLink','https://merqox.com',
         gallery('merqox-gallery', MQ, False, 'MERQOX')),
 project('proyecto-trivlo','TRIVLO','trKind','badgeSoon','is-soon','trDesc','','trStatusNote','trLink','https://trivlopro.com',
         gallery('trivlo-gallery', TR, True, 'TRIVLO')),
 project('proyecto-gy','GY Roadside Solutions','gyKind','badgeLiveClient','is-live','gyDesc','','gyStatusNote','gyLink','https://gyroadsidesolutions.com',
         gallery('gy-gallery', GY, False, 'GY Roadside Solutions') + '\n          <!-- TODO (Yano): add a real testimonial from GY Roadside Solutions here (quote + name + role), only with their written permission. -->'),
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
            <p data-i18n="a{i}">{t(f"a{i}")}</p>
          </details>''')
T = T.replace('@@FAQ@@', '\n'.join(faq))

T = re.sub(r'@@ICON:(\w+)@@', lambda m: ICONS[m.group(1)], T)

used = set(re.findall(r'§(\w+)§', T))
missing = used - set(S)
assert not missing, missing
unused = set(S) - used
print('unused keys:', sorted(unused))
T = re.sub(r'§(\w+)§', lambda m: html.escape(S[m.group(1)][0], quote=True), T)
assert '@@' not in T
open(os.path.join(REPO, 'index.html'), 'w').write(T)

es = {k: v[0] for k, v in S.items()}
en = {k: v[1] for k, v in S.items()}
js = open('i18n-runtime.js').read().replace('/*__DICT__*/', json.dumps({'es': es, 'en': en}, ensure_ascii=False, indent=2))
open(os.path.join(REPO, 'js', 'bdv-i18n.js'), 'w').write(js)
print('ok', len(S), 'keys')
