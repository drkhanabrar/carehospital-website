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
