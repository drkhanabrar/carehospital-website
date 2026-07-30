# What was wrong, and what changed

Every item below was reproduced in a browser before being changed, and
re-tested afterwards.

---

## 1. Clicking Home or the logo showed a file listing

**Cause.** The logo, the Home nav item and the footer's Quick Links all used
`href="/"`. On any host where the site is not at the server root — and when
opened locally — `/` resolves to a *directory*, so the server answered with
a directory index. That was the "file hierarchy".

**Fix.** `href="#home"`, with a matching `id="home"` on the hero section.
Sub-pages use `index.html#…` so their links resolve across documents.

---

## 2. "View Profile" did not work

This had five separate causes stacked on top of each other.

**a. The data could not load.** `doctor-profile.js` called
`fetch("assets/data/doctors/<id>.json")`. Browsers block that request over
`file://`, so the promise rejected and *every* visitor opening the site from
disk got "Profile Not Available". Data now comes from
`assets/data/doctors.js`, embedded in a `<script>`. Verified working over
`file://`.

**b. The page had no navigation.** `doctor.html` shipped with an empty
`<header id="header">` and `<footer id="footer">` and nothing that filled
them. Added `js/site-chrome.js`.

**c. `buildProfile()` was declared three times** in the same file. Only the
last survived hoisting; the first two were dead code.

**d. Six sections had containers but no renderer** — `#doctorTestimonials`,
`#doctorFaq`, `#relatedDoctors`, `#shareProfile`, `#stickyBooking` and
`#doctorSchema` were permanently empty. All are now rendered, and all now
have CSS, which they also lacked.

**e. A broken-image loop.** The error handler set `src` to
`images/doctors/default-doctor.jpg`, which does not exist — so a missing
photo triggered error → set src → error, forever. Replaced with an inline
SVG avatar applied once.

Also fixed: `updateTitle = function(){…}` reassigned a function declaration
under `"use strict"`; content was built with `+=` inside loops (re-parsing
the container on every iteration) and interpolated unescaped.

---

## 3. Videos would not open properly in full screen

**Cause.** `.video-modal-player` kept `max-height:68vh; max-width:100%` and
`.video-frame` kept a fixed `aspect-ratio`, `border-radius` and
`overflow:hidden`. None of it was undone in the top layer, so "full screen"
produced a small rectangle marooned in a black field.

**Fix.** Explicit `:fullscreen` rules that reset the sizing, plus a
`::backdrop`. Full screen is requested on the *frame*, so the loading and
placeholder layers travel with it. Measured after the fix at 1440×900:
frame 1440×900, video 1438×898.

**Also wrong: the portrait/landscape logic.** It had only two buckets, so a
square clip was letterboxed into 16:9 — and `ear.mp4` and `wax-removal.mp4`
are both 480×480. The frame now takes the clip's real ratio. Verified flush
at 480×480, 1080×1920 and 848×480.

**Added:** a visible full-screen button, `f` as a keyboard shortcut,
double-click to toggle, and `webkitEnterFullscreen()` for iPhone Safari,
which does not implement the standard API on a `<div>`.

---

## 4. Tablet and mobile layout

**Cause.** The hamburger only appeared below **768px**. But the header holds
a 72px logo, 7 nav links, a search button, "Book Appointment" and
"Emergency" — measured at about **1,320px**. Every tablet and every small
laptop rendered a header whose buttons ran off the page.

**Fix.** Drawer breakpoint moved to **1250px**, with a compact tier up to
1499px. The drawer is now a real off-canvas panel with a backdrop, scroll
lock, focus trap and Escape-to-close, instead of a `max-height` animation
that could not scroll on a short screen.

**A second overflow:** `.doctor-hero` used
`grid-template-columns: 420px 1fr`. A `1fr` track carries an implicit
`min-width:auto`, so the text column refused to shrink below its content and
pushed 33px off-screen on an iPad in landscape. Now `minmax(0, 1fr)`.

**A stacking bug** introduced during this work and caught in testing: the
drawer backdrop sat above the drawer and swallowed every tap, so menu links
did nothing on a phone. `.header` creates a stacking context at
`z-index:9999`, which clamps the drawer's `10001` inside it. Backdrop moved
below the header.

Result: **zero horizontal scroll across 13 viewports × 3 pages**, from
iPhone SE to 1920px desktop, including landscape phones.

---

## 5. Hindi and Urdu

Full translation of the interface and all doctor content — roughly 400
strings per language. Urdu switches the document to `dir="rtl"`, with all 60
direction-sensitive CSS rules mirrored and a Nastaliq font stack.

Verified: en → hi → ur → en round-trips with no text degradation.
Coverage is 100% of translatable strings; what stays in Latin script is
deliberate — numerals, times, phone numbers, e-mail, and "WhatsApp".

---

## 6. Other defects found along the way

- **Literal markup on screen.** A malformed `<img>` on Dr. Zainab Khan's
  card rendered the text `loading="lazy" decoding="async">` visibly on the
  home page.
- **Three empty sections.** Related Doctors, Testimonials and FAQs from the
  profile page had been pasted into `index.html`, where nothing filled them —
  three headed sections with nothing underneath.
- **Six dead links.** The "Watch Procedure" controls were `<a href="#">`.
  They open a dialog, so announcing them to assistive technology as links
  was wrong; they are now `<button>`s. Social links pointed at `#`.
- **Video weight.** 120 MB → 31 MB. `nasal.mp4` alone: 56 MB → 4.7 MB, at
  roughly 21 Mbps before re-encoding. Poster frames added so cards show a
  still instead of a black rectangle.
- **Accessibility.** `aria-expanded` on the hamburger was hard-coded to
  `false` and never updated, so screen readers always announced the menu as
  collapsed. Added a skip link, focus rings, 44px minimum tap targets, and
  focus trapping in the drawer and video modal.
- **Anchor offset.** Nav links scrolled the target heading *behind* the
  fixed header. The header now publishes its height as `--header-h` and sets
  `scroll-padding-top`.

---

## Production files added

`robots.txt`, `sitemap.xml`, `site.webmanifest`, `404.html`, `.htaccess`
(HTTPS redirect, compression, caching, security headers, byte-range support
for video seeking), JSON-LD `Physician` structured data per doctor, Open
Graph and Twitter Card tags, and `loading="lazy"` on 19 below-the-fold
images.

---

## Verified in-browser

JS syntax across all 12 files · no runtime errors on any page · no duplicate
IDs · no missing assets · no dead anchors · profiles over both `http://` and
`file://` · unknown and legacy `?id=` values · language round-trip · full
screen at three aspect ratios · booking form validation, confirmation modal,
and exactly one WhatsApp tab (an old duplicate-listener bug) · search ·
gallery · mobile drawer · 13 viewports × 3 pages.

---

## Content revision (requested after the first build)

### Dr. Abrar Khan
- **Removed** the 1996–2001 BAMS entry (Rajiv Gandhi University of Health
  Sciences, Karnataka) and its description.
- **Added** *Former Assistant Doctor — The Gemelli University Hospital,
  Rome, Italy.*

  Gemelli is the teaching hospital of Università Cattolica del Sacro Cuore,
  where the Master's in Healthcare Management was taken, so the two entries
  now read as one coherent period in Rome rather than two unrelated facts.

### Dr. Zainab Khan
- **Removed** the placeholder entry *Medical Education / Bachelor of
  Medicine / Recognized Medical Institution* and its description. It named
  no actual institution, which reads as unverified on a clinical site.
- **Added** *Former Assistant Gynaecologist — Life Care Hospital and
  Infertility Centre, Indore, MP.*

### Section renamed
The timeline heading was **"Education"**, but it now carries hospital
appointments as well as degrees. Changed to **"Education & Professional
Experience"**, in all three languages.

### Translations
Seven obsolete keys were deleted from `dictionary-doctors.js` (they
described content that no longer exists), and nine new keys were added per
language — place names, post titles, institution names, the two new
descriptions and the new section heading. Verified rendering in English,
Hindi and Urdu.

No colour, font, icon or layout changes were made — this was a data and
translation edit only.

---

## Merge from carehospitals.gt.tc

Content taken from the practice's own site and folded into this build.

### Departments rebuilt — four became five
The build previously listed *ENT / Women's Health / Skin & Beauty / Hair
Clinic*. The practice actually runs five departments, and two of them were
missing entirely:

| Department | Services listed |
|---|---|
| ENT — Ear, Nose & Throat | 11 |
| **Maternity Care** *(new)* | 5 |
| Gynaecology | 9 |
| **Diagnostics & Laboratory** *(new)* | 5 |
| Skin, Hair & Unani Care | 6 |

**Maternity was the significant omission.** The practice is a *Maternity
Home* with inpatient beds and conducts deliveries; the site did not mention
this anywhere. Service lists now use the practice's own wording — DNS,
Anosmia, Leucorrhoea, IUD Insertion (Cu-T), TORCH Test, Semen Analysis and
so on — rather than generic marketing terms.

**Unani care** (Hijama/cupping, Ilaj bil Tadbeer) was also absent. It is a
genuine differentiator and is now its own department alongside skin and hair.

### New section: "Everything On Site"
Seven concrete in-house capabilities — laboratory, pharmacy, inpatient beds,
fetal doppler, ECG, laser mole & wart removal, ear & nose endoscopy. For a
patient deciding whether to travel to Buldhana or Aurangabad, this is the
most persuasive content on the page, so it gets its own section. Built from
existing design tokens only.

### Doctors realigned
- **Dr. Abrar Khan** — "ENT Specialist & Clinic Administration". Expertise
  now mirrors the ENT department's actual service list.
- **Dr. Zainab Khan** — specialty corrected from "Women's Health Specialist"
  to **"Gynaecologist & Obstetrician"**, which is what the practice calls
  her, with maternity and infertility brought to the front.

### Positioning
Hero copy now states the real proposition: husband-and-wife specialist team,
on-site diagnostics, 18+ years, serving Chikhli and the wider Buldhana
district.

### Contact details — CONFLICTS RESOLVED IN FAVOUR OF THE LIVE SITE
| Field | Was | Now |
|---|---|---|
| Closing time | 8:30 PM | **9:00 PM** |
| E-mail | admin@carehospital.com | **careclinic.admin@gmail.com** |
| Address | Police Station Road, Chikhli 443201 | + Buldhana District, Maharashtra |
| Sunday | not stated | **Emergency Only** |

The booking form's time slots were regenerated to 9:00 PM (40 slots), and
both doctors' consultation schedules updated to match. **Please confirm
these two changes** — they were conflicts between two of your own sources,
not additions.

### Emergency disclaimer
Added to the footer, from the practice's own wording: a web form should not
imply it is a route to urgent care.

### Booking form
Department dropdown and the department-to-doctor mapping rebuilt around the
five real departments.

### Translations
Roughly 70 new keys per language covering every merged string. Verified in
English, Hindi and Urdu.

### Not merged
- **Site name.** The reference calls the practice "Care ENT Clinic &
  Maternity Home"; this build says "CARE" throughout, including the logo
  image. Renaming touches the logo asset, so it is left for you to decide.
- **"20,000+ patients" and "10,000+ procedures".** These appear in this
  build but not on the reference site. They have been left as-is, but if
  they cannot be substantiated they are worth removing from a medical site.

---

## Revision 3 — new artwork, hero fix, Hijama panel, map

### IMPORTANT: which index.html this build uses
The uploaded zip contained a **mixed state**. Its `assets/` and `js/` were
current (Gemelli/Life Care timeline, full-screen fix, dictionaries), but its
`index.html` had reverted to the pre-merge version: four departments, no
Maternity, no Diagnostics, no Unani, no "Everything On Site", 8:30 PM hours,
and the old e-mail address.

The live site in the screenshots shows the **merged** version, and the new
artwork includes a purpose-made **Maternity Care** banner — so the merge is
clearly what is wanted. This build therefore keeps the merged `index.html`
and imports the new images on top of it. If the reverted `index.html` was
deliberate, say so and it can be swapped back.

### New artwork imported
All 14 new/updated images: five department banners, `hero.jpg`,
`doctors/doctor2.jpg`, two facilities and four gallery photos.

### Hero gap — FIXED
`.hero` carried `padding:140px` **and** `.hero-grid` carried
`padding-top:120px` — 260px of padding beneath an 88px fixed header. The
headline began 260px down a 800px screen and the photo fell below the fold.

Now `padding:calc(var(--header-h) + 28px)` with the duplicate removed.
Measured on a 1440x800 laptop: badge top **260px → 106px**, and the hero
image is **fully visible on load** (previously it ran to 1013px on an 800px
screen). A `max-height:820px` tier compacts type and cards further so short
laptops still show both buttons above the fold.

### Department banners no longer cropped
The new banners are ~1900x820 (2.3:1) designed panels, but
`.department-image` forced a 260px-tall box with `object-fit:cover` — which
sliced the left-hand text panel and icon row off every one of them. The box
now takes the banner's own aspect ratio and uses `object-fit:contain`, so
each design shows whole. The 760px `min-height` floor on cards was also
removed; it was creating dead space under the shorter cards.

### Empty grid cell — FILLED
Five departments in a two-column grid left the fifth card alone with an
empty cell. That cell now holds a **Hijama & Regimental Therapy** feature
panel: female practitioner for women, single-use sterile cups, and a note
that it accompanies rather than replaces medical consultation.

Deliberately built as a feature panel, **not a sixth department** — Hijama
is a service *within* Skin, Hair & Unani Care, so a sixth card would
double-count it in the nav and the booking form.

### Google Map added
New "Visit Us" section with address, phone, e-mail, an opening-hours table
and an embedded map, laid out like the reference site.

The map uses Google's **keyless** embed endpoint (`output=embed`), so there
is no API key to leak, no billing account to attach, and nothing that can
expire or start charging. `loading="lazy"` keeps it off the critical path.
"Get Directions" opens turn-by-turn navigation. On narrow screens the map
moves above the details.

### Header
Adding a "Visit Us" nav link took the header to eight links, which needs
~1392px — but `.container` is capped at 1320px, so the full-size header did
not fit **even at 1920px**. The compact treatment is now unconditional
rather than living in a `max-width` query. Verified fitting from 1280px to
2560px.

### Translations
About 35 new keys per language for the Hijama panel and Visit Us section,
including the hours table. Verified in English, Hindi and Urdu.

---

## Revision 4 — translation gaps on the doctor profiles

Three bugs, all introduced by earlier edits in this project.

### 1. Reworded text, stale dictionary key
Dr. Zainab Khan's timeline description was reworded to end
*"…preventive care, and cosmetic gynecology."*, but the dictionary key still
read *"…and women's wellness."* A dictionary lookup is an exact string match,
so it missed and the sentence stayed in English while the three lines above
it translated correctly — exactly the symptom reported.

Fixed in both languages, and *cosmetic gynecology* is now translated properly
(कॉस्मेटिक गायनेकोलॉजी / کاسمیٹک گائنی) rather than folded into the generic
"women's health" wording it previously shared.

### 2. Longer text in the data than in the dictionary
Dr. Abrar Khan's `shortDescription` in the JSON carries a second sentence
("Provides complete ear, nose and throat care — …") that the home-page card
does not. The dictionary held only the shorter card version, so the profile
page's longer version never matched. Full-length keys added.

### 3. Truncate-before-translate — the structural one
`renderRelated()` built the "Other Specialists" blurb as

```js
escapeHTML(other.shortDescription).slice(0, 150) + '…'
```

Cutting the English sentence to 150 characters produced a fragment that is
not a dictionary key, so this blurb could never translate no matter how
complete the dictionary was. It now **translates first, then truncates**, and
cuts on a word boundary. Escaping also moved after the slice, so an HTML
entity can no longer be cut in half.

Because that string is shortened at render time, the generic text-node pass
cannot re-expand it on a language switch — `renderRelated()` is therefore
re-run on `care:languagechange` alongside the About and CTA blocks.

### Audit added
Rather than fixing only the reported line, every string in the doctor data
was checked against both dictionaries (181 strings — 0 now missing), and each
page was loaded in Hindi and scanned for any text node still holding English.

**Result: the only untranslated string left on any page is
`careclinic.admin@gmail.com`, which is correct — an e-mail address must not
be translated.**
