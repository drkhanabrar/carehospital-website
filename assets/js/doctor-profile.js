"use strict";

/* ==========================================================================
   CARE — DOCTOR PROFILE
   --------------------------------------------------------------------------
   WHAT WAS WRONG BEFORE

   1. The page fetched assets/data/doctors/<id>.json. Over file:// the
      browser refuses that request, fetch() rejects, and every visitor got
      "Profile Not Available". Data now comes from window.CARE_DOCTORS
      (assets/data/doctors.js), with fetch kept only as a fallback.

   2. buildProfile() was declared three times in one file. Only the last
      definition survived hoisting, so the earlier two were dead code —
      confusing to maintain and easy to break.

   3. Six sections in doctor.html had containers but no renderer:
      #doctorTestimonials, #doctorFaq, #relatedDoctors, #shareProfile,
      #stickyBooking and #doctorSchema all stayed permanently empty.

   4. The <img> error handler pointed at images/doctors/default-doctor.jpg,
      which does not exist — so a missing photo triggered an infinite
      error → set src → error loop.

   5. `updateTitle = function(){...}` reassigned a function declaration
      under "use strict". Replaced with an ordinary call.

   6. Content was injected with += inside a loop (re-parsing the whole
      container on every iteration) and interpolated unescaped. Now built
      once per section and HTML-escaped.
   ========================================================================== */

(function () {

    /* ======================================================================
       HELPERS
    ====================================================================== */

    var $ = function (id) { return document.getElementById(id); };

    function escapeHTML(value) {
        return String(value === undefined || value === null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    /* Shorten AFTER translating.
       Previously this sliced the English sentence to 150 characters and then
       let the translation pass run over the result — but a half-sentence is
       not a dictionary key, so the related-doctor blurb was the one string on
       the site that always stayed English. Translating first, then cutting,
       fixes that. Also cuts on a word boundary and escapes AFTER slicing, so
       an HTML entity can never be sliced in half. */
    function truncate(value, limit) {
        var str = String(value || "");
        if (str.length <= limit) return str;
        var cut = str.slice(0, limit);
        var space = cut.lastIndexOf(" ");
        if (space > limit * 0.6) cut = cut.slice(0, space);
        return cut.replace(/[\s,;:.\u2014\u2013-]+$/, "") + "\u2026";
    }

    /* Only allow Font Awesome class strings through to `class="…"` */
    function safeIcon(value) {
        return /^[a-z0-9 \-]+$/i.test(value || "") ? value : "fa-solid fa-circle-check";
    }

    function t(str) {
        return (window.CARE && window.CARE.i18n) ? window.CARE.i18n.t(str) : str;
    }

    /* Translate a sentence template, THEN substitute the placeholders.
       Composing the English sentence first and translating afterwards would
       never match a dictionary key, because the doctor's name is baked into
       it — which is why "About Dr. Abrar Khan" stayed in English. */
    function tf(template, values) {
        var out = t(template);
        Object.keys(values).forEach(function (key) {
            out = out.split("{" + key + "}").join(values[key]);
        });
        return out;
    }

    function refreshI18n(root) {
        if (window.CARE && window.CARE.i18n) window.CARE.i18n.refresh(root);
    }

    function initials(name) {
        return String(name || "")
            .replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "")
            .split(/\s+/)
            .slice(0, 2)
            .map(function (part) { return part.charAt(0).toUpperCase(); })
            .join("");
    }

    function stars(rating) {
        var n = Math.max(0, Math.min(5, parseInt(rating, 10) || 5));
        return new Array(n + 1).join("\u2605") + new Array(6 - n).join("\u2606");
    }

    /* ======================================================================
       WHICH DOCTOR?
    ====================================================================== */

    function resolveId() {

        var raw = new URLSearchParams(window.location.search).get("id");

        if (!raw) return null;

        raw = raw.trim().toLowerCase();

        var aliases = window.CARE_DOCTOR_ALIASES || {};
        if (aliases[raw]) return aliases[raw];

        return raw;
    }

    /* ======================================================================
       DATA ACCESS
       Embedded object first (works everywhere), network second.
    ====================================================================== */

    function getDoctor(id) {

        var store = window.CARE_DOCTORS || {};

        if (store[id]) return Promise.resolve(store[id]);

        /* Fallback for a doctor added as JSON but not yet regenerated into
           doctors.js. Only reachable over http(s). */
        if (window.location.protocol === "file:") return Promise.resolve(null);

        return fetch("assets/data/doctors/" + encodeURIComponent(id) + ".json")
            .then(function (response) {
                return response.ok ? response.json() : null;
            })
            .catch(function () { return null; });
    }

    /* ======================================================================
       RENDERERS
    ====================================================================== */

    function renderHero(doctor) {

        var hero = $("doctorHero");
        if (!hero) return;

        hero.innerHTML =
            '<div class="profile-photo fade-up">' +
                '<img src="' + escapeHTML(doctor.photo) + '"' +
                     ' alt="' + escapeHTML(doctor.name + ", " + doctor.specialty) + '"' +
                     ' width="420" height="520" decoding="async">' +
            '</div>' +

            '<div class="profile-content">' +

                '<span class="profile-tag">' +
                    '<i class="fa-solid fa-user-doctor"></i> ' +
                    escapeHTML(doctor.specialty) +
                '</span>' +

                '<h1 class="profile-name">' + escapeHTML(doctor.name) + '</h1>' +

                '<div class="profile-designation">' +
                    escapeHTML(doctor.designation) +
                '</div>' +

                '<p class="profile-description">' +
                    escapeHTML(doctor.shortDescription) +
                '</p>' +

                '<div class="profile-stats">' +
                    statCard(doctor.experience, "Years Experience") +
                    statCard(doctor.patients, "Patients Treated") +
                    statCard(doctor.procedures, "Procedures") +
                    statCard((doctor.languages || []).length, "Languages") +
                '</div>' +

                '<div class="profile-buttons">' +

                    '<a href="index.html#appointment" class="btn-book">' +
                        '<i class="fa-solid fa-calendar-check"></i> Book Appointment' +
                    '</a>' +

                    '<a href="tel:' + escapeHTML(doctor.phone) + '" class="btn-call">' +
                        '<i class="fa-solid fa-phone"></i> Call Now' +
                    '</a>' +

                    '<a href="https://wa.me/' + escapeHTML(doctor.whatsapp) + '"' +
                       ' target="_blank" rel="noopener" class="btn-whatsapp">' +
                        '<i class="fa-brands fa-whatsapp"></i> WhatsApp' +
                    '</a>' +

                '</div>' +

            '</div>';
    }

    function statCard(value, label) {
        return '<div class="stat-card">' +
                   '<h3>' + escapeHTML(value) + '</h3>' +
                   '<p>' + escapeHTML(label) + '</p>' +
               '</div>';
    }

    /* ---------------------------------------------------------------- */

    function renderStickyBooking(doctor) {

        var box = $("stickyBooking");
        if (!box) return;

        var today = (doctor.schedule || []).filter(function (row) {
            var day = new Date().toLocaleDateString("en-US", { weekday: "long" });
            return row.day === day;
        })[0];

        box.className = "sticky-booking";

        box.innerHTML =
            '<div class="sticky-card">' +

                '<span class="sticky-label">Availability</span>' +

                '<div class="sticky-today">' +
                    '<i class="fa-regular fa-clock"></i>' +
                    '<span>' + escapeHTML(today ? today.time : "Mon–Sat : 11:30 AM – 9:00 PM") + '</span>' +
                '</div>' +

                '<a href="index.html#appointment" class="btn-book sticky-btn">' +
                    'Book Appointment' +
                '</a>' +

                '<a href="tel:' + escapeHTML(doctor.phone) + '" class="sticky-call">' +
                    '<i class="fa-solid fa-phone"></i> ' + escapeHTML(doctor.phone) +
                '</a>' +

            '</div>';
    }

    /* ---------------------------------------------------------------- */

    function renderAbout(doctor) {

        var about = $("doctorAbout");
        if (!about) return;

        about.innerHTML =
            '<div class="about-card fade-up">' +
                '<h2>' + escapeHTML(tf("About {name}", { name: t(doctor.name) })) + '</h2>' +
                '<p>' + escapeHTML(doctor.about) + '</p>' +
            '</div>';
    }

    /* ---------------------------------------------------------------- */

    function renderHighlights(doctor) {

        var box = $("doctorHighlights");
        if (!box || !doctor.highlights) return;

        box.innerHTML = doctor.highlights.map(function (item) {
            return '<div class="highlight-card fade-up">' +
                       '<div class="highlight-icon">' +
                           '<i class="' + safeIcon(item.icon) + '"></i>' +
                       '</div>' +
                       '<div class="highlight-number">' + escapeHTML(item.number) + '</div>' +
                       '<div class="highlight-title">' + escapeHTML(item.title) + '</div>' +
                       '<div class="highlight-text">' + escapeHTML(item.text) + '</div>' +
                   '</div>';
        }).join("");
    }

    /* ---------------------------------------------------------------- */

    function renderEducation(doctor) {

        var box = $("doctorEducation");
        if (!box || !doctor.education) return;

        box.innerHTML = doctor.education.map(function (item) {
            return '<div class="timeline-item fade-up">' +
                       '<div class="timeline-dot"></div>' +
                       '<div class="timeline-card">' +
                           '<div class="timeline-year">' + escapeHTML(item.year) + '</div>' +
                           '<h3>' + escapeHTML(item.degree) + '</h3>' +
                           '<h4>' + escapeHTML(item.institute) + '</h4>' +
                           '<p>' + escapeHTML(item.description) + '</p>' +
                       '</div>' +
                   '</div>';
        }).join("");
    }

    /* ---------------------------------------------------------------- */

    function renderExpertise(doctor) {

        var box = $("doctorExpertise");
        if (!box || !doctor.expertise) return;

        box.innerHTML = doctor.expertise.map(function (item) {
            return '<div class="expertise-item fade-up">' +
                       '<i class="fa-solid fa-circle-check"></i>' +
                       '<span>' + escapeHTML(item) + '</span>' +
                   '</div>';
        }).join("");
    }

    /* ---------------------------------------------------------------- */

    function renderTreatments(doctor) {

        var box = $("doctorTreatments");
        if (!box || !doctor.treatments) return;

        box.innerHTML = doctor.treatments.map(function (item) {

            var list = (item.procedures || []).map(function (procedure) {
                return '<li><i class="fa-solid fa-check"></i><span>' +
                       escapeHTML(procedure) + '</span></li>';
            }).join("");

            return '<div class="treatment-card fade-up">' +
                       '<div class="treatment-icon">' +
                           '<i class="' + safeIcon(item.icon) + '"></i>' +
                       '</div>' +
                       '<h3>' + escapeHTML(item.title) + '</h3>' +
                       '<p>' + escapeHTML(item.description) + '</p>' +
                       '<ul>' + list + '</ul>' +
                   '</div>';
        }).join("");
    }

    /* ---------------------------------------------------------------- */

    function renderLanguages(doctor) {

        var box = $("doctorLanguages");
        if (!box || !doctor.languages) return;

        box.innerHTML = doctor.languages.map(function (language) {
            return '<div class="expertise-item fade-up">' +
                       '<i class="fa-solid fa-language"></i>' +
                       '<span>' + escapeHTML(language) + '</span>' +
                   '</div>';
        }).join("");
    }

    /* ---------------------------------------------------------------- */

    function renderSchedule(doctor) {

        var box = $("consultationSchedule");
        if (!box || !doctor.schedule) return;

        var todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

        var rows = doctor.schedule.map(function (item) {
            var isToday = item.day === todayName;
            return '<div class="schedule-row' + (isToday ? " is-today" : "") + '">' +
                       '<div class="schedule-day">' + escapeHTML(item.day) +
                           (isToday ? ' <span class="today-pill">Today</span>' : "") +
                       '</div>' +
                       '<div class="schedule-time">' + escapeHTML(item.time) + '</div>' +
                   '</div>';
        }).join("");

        box.innerHTML = '<div class="schedule-card fade-up">' + rows + '</div>';
    }

    /* ---------------------------------------------------------------- */

    function renderTestimonials(doctor) {

        var box = $("doctorTestimonials");
        if (!box) return;

        var list = doctor.testimonials || [];

        if (!list.length) {
            var section = box.closest("section");
            if (section) section.hidden = true;
            return;
        }

        box.innerHTML = list.map(function (item) {
            return '<article class="testimonial-card fade-up">' +
                       '<div class="testimonial-quote">\u275D</div>' +
                       '<div class="testimonial-stars" aria-label="' +
                           escapeHTML(tf("{rating} out of 5", { rating: item.rating || 5 })) + '">' +
                           stars(item.rating) +
                       '</div>' +
                       '<p class="testimonial-text">' + escapeHTML(item.comment) + '</p>' +
                       '<div class="testimonial-author">' +
                           '<span class="author-avatar">' + escapeHTML(initials(item.name)) + '</span>' +
                           '<div>' +
                               '<strong>' + escapeHTML(item.name) + '</strong>' +
                               '<span class="author-tag">\u2713 Verified Patient</span>' +
                           '</div>' +
                       '</div>' +
                   '</article>';
        }).join("");
    }

    /* ---------------------------------------------------------------- */

    function renderFaq(doctor) {

        var box = $("doctorFaq");
        if (!box) return;

        var list = doctor.faq || [];

        if (!list.length) {
            var section = box.closest("section");
            if (section) section.hidden = true;
            return;
        }

        box.className = "faq-list";

        box.innerHTML = list.map(function (item, index) {
            var id = "faq-panel-" + index;
            return '<div class="faq-item fade-up">' +
                       '<button class="faq-question" type="button"' +
                              ' aria-expanded="false" aria-controls="' + id + '">' +
                           '<span>' + escapeHTML(item.question) + '</span>' +
                           '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>' +
                       '</button>' +
                       '<div class="faq-answer" id="' + id + '" hidden>' +
                           '<p>' + escapeHTML(item.answer) + '</p>' +
                       '</div>' +
                   '</div>';
        }).join("");

        box.addEventListener("click", function (event) {

            var button = event.target.closest(".faq-question");
            if (!button) return;

            var panel = document.getElementById(button.getAttribute("aria-controls"));
            var open = button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", open ? "false" : "true");
            button.closest(".faq-item").classList.toggle("is-open", !open);
            if (panel) panel.hidden = open;
        });
    }

    /* ---------------------------------------------------------------- */

    function renderRelated(doctor) {

        var box = $("relatedDoctors");
        if (!box) return;

        var store = window.CARE_DOCTORS || {};
        var order = window.CARE_DOCTOR_ORDER || Object.keys(store);

        var others = order
            .filter(function (id) { return id !== doctor.id && store[id]; })
            .map(function (id) { return store[id]; });

        if (!others.length) {
            var section = box.closest("section");
            if (section) section.hidden = true;
            return;
        }

        box.innerHTML = others.map(function (other) {
            return '<article class="related-card fade-up">' +
                       '<div class="related-photo">' +
                           '<img src="' + escapeHTML(other.photo) + '"' +
                                ' alt="' + escapeHTML(other.name) + '"' +
                                ' loading="lazy" decoding="async">' +
                       '</div>' +
                       '<div class="related-info">' +
                           '<h3>' + escapeHTML(other.name) + '</h3>' +
                           '<span class="designation">' + escapeHTML(other.specialty) + '</span>' +
                           '<p>' + escapeHTML(truncate(t(other.shortDescription), 150)) + '</p>' +
                           '<div class="related-actions">' +
                               '<a class="doctor-btn" href="doctor.html?id=' +
                                   encodeURIComponent(other.id) + '">View Profile</a>' +
                               '<a class="doctor-outline" href="index.html#appointment">Book Consultation</a>' +
                           '</div>' +
                       '</div>' +
                   '</article>';
        }).join("");
    }

    /* ---------------------------------------------------------------- */

    function renderShare(doctor) {

        var box = $("shareProfile");
        if (!box) return;

        var url = window.location.href;
        var text = doctor.name + " — " + doctor.designation + ", CARE";

        box.className = "share-profile";

        box.innerHTML =
            '<span class="share-label">Share this profile</span>' +
            '<div class="share-buttons">' +

                '<a class="share-btn" target="_blank" rel="noopener"' +
                   ' aria-label="Share on WhatsApp"' +
                   ' href="https://wa.me/?text=' + encodeURIComponent(text + " " + url) + '">' +
                    '<i class="fa-brands fa-whatsapp"></i></a>' +

                '<a class="share-btn" target="_blank" rel="noopener"' +
                   ' aria-label="Share on Facebook"' +
                   ' href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '">' +
                    '<i class="fa-brands fa-facebook-f"></i></a>' +

                '<a class="share-btn" target="_blank" rel="noopener"' +
                   ' aria-label="Share on X"' +
                   ' href="https://twitter.com/intent/tweet?text=' +
                       encodeURIComponent(text) + '&url=' + encodeURIComponent(url) + '">' +
                    '<i class="fa-brands fa-x-twitter"></i></a>' +

                '<button class="share-btn" type="button" id="copyProfileLink"' +
                        ' aria-label="Copy link">' +
                    '<i class="fa-solid fa-link"></i></button>' +

            '</div>' +
            '<span class="share-feedback" id="shareFeedback" role="status"></span>';

        var copy = $("copyProfileLink");
        var feedback = $("shareFeedback");

        if (!copy) return;

        copy.addEventListener("click", function () {

            var done = function () {
                if (!feedback) return;
                feedback.textContent = t("Link copied");
                feedback.classList.add("visible");
                setTimeout(function () { feedback.classList.remove("visible"); }, 2200);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(done, done);
            } else {
                var input = document.createElement("input");
                input.value = url;
                document.body.appendChild(input);
                input.select();
                try { document.execCommand("copy"); } catch (e) {}
                document.body.removeChild(input);
                done();
            }
        });
    }

    /* ---------------------------------------------------------------- */

    function renderSchema(doctor) {

        var node = $("doctorSchema");
        if (!node) return;

        var schema = {
            "@context": "https://schema.org",
            "@type": "Physician",
            "name": doctor.name,
            "medicalSpecialty": doctor.specialty,
            "description": doctor.shortDescription,
            "image": new URL(doctor.photo, window.location.href).href,
            "url": window.location.href,
            "telephone": doctor.phone,
            "knowsLanguage": doctor.languages,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Police Station Road",
                "addressLocality": "Chikhli",
                "addressRegion": "Maharashtra",
                "postalCode": "443201",
                "addressCountry": "IN"
            },
            "worksFor": {
                "@type": "MedicalOrganization",
                "name": "CARE"
            }
        };

        if (doctor.faq && doctor.faq.length) {
            schema.subjectOf = {
                "@type": "FAQPage",
                "mainEntity": doctor.faq.map(function (item) {
                    return {
                        "@type": "Question",
                        "name": item.question,
                        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
                    };
                })
            };
        }

        node.textContent = JSON.stringify(schema);
    }

    /* ---------------------------------------------------------------- */

    function renderMeta(doctor) {

        document.title = doctor.name + " | " + doctor.specialty + " | CARE";

        var meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute("content",
                doctor.name + " — " + doctor.designation +
                " at CARE, Chikhli. Qualifications, expertise, treatments and consultation timings.");
        }

        var crumb = $("breadcrumb-name");
        if (crumb) crumb.textContent = doctor.name;

        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute("href", window.location.href);

        var ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", doctor.name + " | CARE");

        var ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute("content", new URL(doctor.photo, window.location.href).href);
    }

    /* ---------------------------------------------------------------- */

    function personaliseCTA(doctor) {

        var heading = document.querySelector(".cta-box h2");
        var text = document.querySelector(".cta-box p");

        if (heading) {
            heading.textContent = tf("Book an Appointment with {name}", { name: t(doctor.name) });
        }

        if (text) {
            text.textContent = tf(
                "Schedule your consultation with {name}, {designation}, and receive " +
                "compassionate, evidence-based care tailored to your needs.",
                { name: t(doctor.name), designation: t(doctor.designation) }
            );
        }

        /* Point the floating buttons at this doctor */
        var call = $("floatCall");
        var whatsapp = $("floatWhatsapp");

        if (call) {
            call.setAttribute("href", "tel:" + doctor.phone);
            call.setAttribute("aria-label", "Call " + doctor.name);
        }

        if (whatsapp) {
            whatsapp.setAttribute("href", "https://wa.me/" + doctor.whatsapp);
            whatsapp.setAttribute("target", "_blank");
            whatsapp.setAttribute("rel", "noopener");
            whatsapp.setAttribute("aria-label", "WhatsApp " + doctor.name);
        }
    }

    /* ======================================================================
       REVEAL ANIMATION
    ====================================================================== */

    function initReveal() {

        var items = document.querySelectorAll(".fade-up");
        if (!items.length) return;

        if (!("IntersectionObserver" in window)) {
            items.forEach(function (el) { el.classList.add("show"); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        items.forEach(function (el) { observer.observe(el); });
    }

    /* ======================================================================
       ERROR STATE
    ====================================================================== */

    function showError(message) {

        var main = document.querySelector("main");
        if (!main) return;

        main.innerHTML =
            '<section class="doctor-section profile-error">' +
                '<div class="container">' +
                    '<div class="about-card">' +
                        '<div class="error-icon"><i class="fa-solid fa-user-slash"></i></div>' +
                        '<h2>Profile Not Available</h2>' +
                        '<p>' + escapeHTML(message) + '</p>' +
                        '<a href="index.html#doctors" class="btn-book">Back to Doctors</a>' +
                    '</div>' +
                '</div>' +
            '</section>';

        refreshI18n(main);
    }

    /* ======================================================================
       IMAGE FALLBACK
       The old handler pointed at a file that does not exist, so a broken
       photo looped forever. This swaps in an inline SVG avatar once and
       then removes itself.
    ====================================================================== */

    var FALLBACK_AVATAR =
        "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520">' +
            '<rect width="420" height="520" fill="#E8F4F6"/>' +
            '<circle cx="210" cy="200" r="78" fill="#B9DBE1"/>' +
            '<path d="M60 470c0-83 67-150 150-150s150 67 150 150z" fill="#B9DBE1"/>' +
            '</svg>'
        );

    document.addEventListener("error", function (event) {

        var el = event.target;

        if (!el || el.tagName !== "IMG") return;
        if (el.dataset.fallbackApplied) return;

        el.dataset.fallbackApplied = "1";
        el.src = FALLBACK_AVATAR;

    }, true);

    /* ======================================================================
       BUILD
    ====================================================================== */

    var currentDoctor = null;

    /* Sentences that embed the doctor's name are composed at render time, so
       they cannot be re-translated by walking text nodes later — the finished
       sentence is not a dictionary key. Re-run just those pieces whenever the
       visitor changes language. */
    document.addEventListener("care:languagechange", function () {
        if (!currentDoctor) return;
        renderAbout(currentDoctor);
        personaliseCTA(currentDoctor);
        /* The related-doctor blurb is translated then truncated inside
           renderRelated, so it has to be rebuilt too — the generic text-node
           pass cannot re-expand an already-shortened sentence. */
        renderRelated(currentDoctor);
    });

    function build(doctor) {

        currentDoctor = doctor;

        renderMeta(doctor);
        renderHero(doctor);
        renderStickyBooking(doctor);
        renderAbout(doctor);
        renderHighlights(doctor);
        renderEducation(doctor);
        renderExpertise(doctor);
        renderTreatments(doctor);
        renderLanguages(doctor);
        renderSchedule(doctor);
        renderTestimonials(doctor);
        renderFaq(doctor);
        renderRelated(doctor);
        renderShare(doctor);
        renderSchema(doctor);
        personaliseCTA(doctor);

        refreshI18n(document.body);
        initReveal();

        document.body.classList.add("profile-ready");
    }

    /* ======================================================================
       START
    ====================================================================== */

    function start() {

        var id = resolveId();

        if (!id) {
            showError("Doctor profile not found.");
            return;
        }

        getDoctor(id).then(function (doctor) {
            if (!doctor) {
                showError("Unable to load doctor profile.");
                return;
            }
            build(doctor);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }

})();
