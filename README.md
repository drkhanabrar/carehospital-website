# CARE — Website

Production build for CARE, Chikhli. Static site: no build step, no
dependencies, no server-side code. Upload the folder and it runs.

---

## Quick start

**Locally** — double-click `index.html`. Everything works from `file://`,
including doctor profiles and language switching.

**Hosting** — upload every file to the web root. If you are on Apache, the
included `.htaccess` handles HTTPS, compression, caching, video range
requests and the 404 page. On Nginx / Netlify / Vercel / Cloudflare Pages,
`.htaccess` is ignored — set the equivalents in that platform's own config.

Before going live, change `https://carehospital.in/` to the real domain in:
`index.html` (canonical + Open Graph), `doctor.html`, `sitemap.xml`,
`robots.txt`.

---

## Layout

```
index.html            home page
doctor.html           doctor profile (driven by ?id=)
404.html              not-found page

css/
  base.css            variables, reset
  header.css          header + nav
  hero.css            …one file per section…
  video-modal.css     procedure video player (incl. full-screen rules)
  doctor-profile.css  profile page
  findus.css          address block + embedded Google Map
  i18n.css            language switcher, script fonts, RTL mirroring
  animations.css      shared keyframes
  responsive.css      ALL breakpoints + print styles

js/
  i18n.js             language engine
  site-chrome.js      shared header/footer for sub-pages
  header.js           sticky header, mobile drawer, scroll-spy
  scroll-effects.js   reveal animations, stat counters
  gallery.js          filter + lightbox
  video-modal.js      procedure player
  search.js           site search
  appointment.js      booking form + WhatsApp handoff

assets/
  i18n/dictionary.js          UI strings (English → Hindi/Urdu)
  i18n/dictionary-doctors.js  doctor biographical strings
  data/doctors.js             doctor records used by the site
  data/doctors/*.json         editable source for the above
  js/doctor-profile.js        profile renderer

images/  videos/  images/posters/
```

---

## Editing content

### Text on the page
Edit the HTML normally. To keep Hindi and Urdu complete, add the new English
string as a key to **both** maps in `assets/i18n/dictionary.js`. Anything
without an entry simply stays English — nothing breaks.

### Doctors
1. Edit `assets/data/doctors/<id>.json`.
2. Regenerate the embedded copy:

```bash
python3 - <<'PY'
import json, glob, os
data={}
for f in glob.glob('assets/data/doctors/*.json'):
    d=json.load(open(f, encoding='utf-8')); data[d['id']]=d
head=open('assets/data/doctors.js', encoding='utf-8').read().split('window.CARE_DOCTORS =')[0]
tail='''

window.CARE_DOCTOR_ORDER = %s;

window.CARE_DOCTOR_ALIASES = {
    "abrar": "abrar-khan",
    "zainab": "zainab-khan"
};
''' % json.dumps(sorted(data))
open('assets/data/doctors.js','w',encoding='utf-8').write(
    head + 'window.CARE_DOCTORS = ' + json.dumps(data, ensure_ascii=False, indent=4) + ';' + tail)
print('regenerated')
PY
```

3. Add the new doctor's strings to `assets/i18n/dictionary-doctors.js`.

**Why the data is duplicated:** the previous build fetched the JSON at
runtime. `fetch()` is blocked over `file://`, so anyone opening the site from
a disk or USB stick saw "Profile Not Available" on every profile. The JSON
files remain the editable source; `doctors.js` is the copy the browser reads.

### Procedure videos
Each `.procedure-card` in `index.html` carries `data-video`, `data-poster`,
`data-title`, `data-category`, `data-subtitle`, `data-meta` and
`data-features`. `data-meta` and `data-features` are `|`-separated. A card
with an empty `data-video` shows a "Video Coming Soon" panel instead of a
broken player.

Videos were re-encoded for the web (the folder was 120 MB, now 31 MB;
`nasal.mp4` alone went from 56 MB to 4.7 MB). To match when adding more:

```bash
ffmpeg -i input.mp4 -vf "scale='min(720,iw)':-2" -c:v libx264 -crf 27 \
       -preset veryfast -pix_fmt yuv420p -movflags +faststart \
       -c:a aac -b:a 96k videos/name.mp4

ffmpeg -ss 1 -i videos/name.mp4 -frames:v 1 -vf scale=640:-2 \
       -q:v 5 images/posters/name.jpg
```

`-movflags +faststart` matters: without it the browser must download the
whole file before playback starts.

---

## Languages

Three: English, हिन्दी, اردو. Urdu switches the document to `dir="rtl"`.

The engine caches each node's original English, so switching
en → hi → ur → en any number of times never degrades the text. A
MutationObserver re-translates content injected later (doctor profiles,
search results), so dynamic content is covered automatically.

The visitor's choice is stored in `localStorage` under `care-lang`. On a
first visit the browser's own language is honoured if it is one of the three.

Numerals, phone numbers and e-mail addresses deliberately stay in Latin
script and LTR so they remain scannable and tappable.

---

## Browser support

Chrome / Edge / Firefox / Safari, current versions, desktop and mobile.
Full screen is handled through the standard Fullscreen API with a
`webkitEnterFullscreen()` fallback for iPhone Safari, which does not
implement the standard API on non-video elements.

---

## Known limitations

- **Social links** for Instagram, YouTube and LinkedIn point at the platform
  home pages. Replace them in `index.html` and `js/site-chrome.js` with the
  real CARE profiles once they exist.
- **`ear.mp4` and `wax-removal.mp4` are byte-identical.** They are presented
  as two different procedures. Supply a genuine wax-removal clip when one is
  recorded.
- **Testimonials on the home page are hard-coded** in `index.html`, unlike
  the profile testimonials which come from the doctor JSON.
- **The booking form does not send anything to a server.** It validates,
  then hands off to WhatsApp. Appointments are not recorded anywhere until
  someone replies on WhatsApp.
- Dr. Zainab Khan's JSON reuses Dr. Abrar Khan's experience figures
  (18+ years / 20,000+ patients). Worth confirming these are correct.

---

## The map

The "Visit Us" section embeds Google Maps through the **keyless** public
endpoint:

```
https://www.google.com/maps?q=<address>&z=16&output=embed
```

No API key, no billing account, nothing that can expire or start charging.
To move the pin, edit the `q=` value in the `<iframe>` in `index.html`
(URL-encoded address) and the `destination=` value on the "Get Directions"
link beside it. Raising `z=` zooms in.

If you ever want the official Maps Embed API instead (custom styling,
place cards), that one *does* need a key and a billing account — the current
approach is deliberately the one that cannot break unattended.

The embed always renders in Latin script regardless of site language, so it
is excluded from translation rather than being half-translated at the edges.
