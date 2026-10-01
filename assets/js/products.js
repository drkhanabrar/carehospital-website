"use strict";

/* ==========================================================================
   CARE — RESEARCH & DEVELOPMENT RENDERER
   --------------------------------------------------------------------------
   Powers both pages from assets/data/products.js:

     products.html            the hub — every product as a card, filterable
     product.html?id=<id>     one product in full

   Same approach as assets/js/doctor-profile.js: the catalogue is embedded in
   a plain <script>, never fetched, so both pages work identically over
   http(s) and from a local file. Adding a product means editing the data
   file only — no HTML and no JS to touch.
   ========================================================================== */

(function () {

    /* ======================================================================
       HELPERS
    ====================================================================== */

    var $ = function (id) { return document.getElementById(id); };

    function esc(value) {
        return String(value === undefined || value === null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    /* Only Font Awesome class strings are allowed into class="…" */
    function safeIcon(value) {
        return /^[a-z0-9 \-]+$/i.test(value || "") ? value : "fa-solid fa-circle-check";
    }

    function t(str) {
        return (window.CARE && window.CARE.i18n) ? window.CARE.i18n.t(str) : str;
    }

    function refreshI18n(root) {
        if (window.CARE && window.CARE.i18n) window.CARE.i18n.refresh(root || document.body);
    }

    var STATUS = {
        available:   { cls: "is-available",   label: "Available now" },
        development: { cls: "is-development", label: "In development" },
        planned:     { cls: "is-planned",     label: "Planned" }
    };

    function statusOf(product) {
        return STATUS[product.status] || STATUS.planned;
    }

    var CONTACT = window.CARE_PRODUCT_CONTACT || {
        emails: ["dr.khanabrar@gmail.com", "admin@carehospital.in"],
        phone: "+919370111449",
        phoneDisplay: "+91 93701 11449",
        whatsapp: "919370111449"
    };

    /* ------------------------------------------------------------------
       FREE-TRIAL BUTTON
       `trial.url` is a placeholder ("#") until a real download link is
       pasted into assets/data/products.js. While it is a placeholder the
       button is rendered but marked data-trial-pending, so it cannot
       navigate anywhere and nobody lands on a dead download.
       ------------------------------------------------------------------ */

    function trialLabel(p) {
        var days = (p.trial && p.trial.days) || 15;
        return "Download " + days + "-day free trial";
    }

    function isTrialPending(p) {
        return !p.trial || !p.trial.url || p.trial.url === "#";
    }

    function trialButton(p, cls) {

        if (!p.trial) return "";

        var pending = isTrialPending(p);

        return '<a class="' + cls + ' trial-btn"' +
               ' href="' + (pending ? "#" : esc(p.trial.url)) + '"' +
               (pending ? ' data-trial-pending="true"'
                        : ' download rel="noopener"') +
               '><i class="fa-solid fa-download" aria-hidden="true"></i>' +
               esc(trialLabel(p)) + '</a>';
    }

    function products() { return window.CARE_PRODUCTS || {}; }

    function order() {
        var store = products();
        return (window.CARE_PRODUCT_ORDER || Object.keys(store))
            .filter(function (id) { return store[id]; });
    }

    /* ======================================================================
       ENQUIRY PANEL — shared by both pages
    ====================================================================== */

    function enquiryHTML(productName) {

        var subject = productName
            ? "Enquiry — " + productName
            : "Enquiry — CARE software";

        var mailLinks = CONTACT.emails.map(function (address, i) {
            return '<a href="mailto:' + esc(address) +
                        '?subject=' + encodeURIComponent(subject) + '">' +
                       '<i class="fa-solid fa-envelope" aria-hidden="true"></i>' +
                       '<span>' +
                           '<span class="ec-label">' + (i === 0 ? "Email" : "Alternate email") + '</span>' +
                           '<span class="ec-value" translate="no">' + esc(address) + '</span>' +
                       '</span>' +
                   '</a>';
        }).join("");

        return '' +
        '<div class="enquire-box">' +
            '<div class="enquire-grid">' +

                '<div>' +
                    '<h2>Purchase or enquire</h2>' +
                    '<p>Tell us about your clinic — how many computers, which ' +
                       'departments, and what you are using today. We will tell you ' +
                       'honestly whether this fits, what it costs, and what is ' +
                       'genuinely ready to install.</p>' +

                    '<ul class="enquire-points">' +
                        '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' +
                            '<span>Pricing and licensing for your number of PCs</span></li>' +
                        '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' +
                            '<span>A walkthrough before you commit to anything</span></li>' +
                        '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' +
                            '<span>Setup with your hospital name, logo and contact details</span></li>' +
                        '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' +
                            '<span>Built and supported by a practising clinician</span></li>' +
                    '</ul>' +
                '</div>' +

                '<div class="enquire-card">' +
                    '<h3>Talk to us</h3>' +
                    '<p>Write to either address, or message on WhatsApp. ' +
                       'Mention the product you are interested in.</p>' +

                    '<div class="enquire-contact">' +
                        mailLinks +

                        '<a href="https://wa.me/' + esc(CONTACT.whatsapp) + '" ' +
                           'target="_blank" rel="noopener">' +
                            '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>' +
                            '<span>' +
                                '<span class="ec-label">WhatsApp</span>' +
                                '<span class="ec-value" translate="no">' + esc(CONTACT.phoneDisplay) + '</span>' +
                            '</span>' +
                        '</a>' +

                        '<a href="tel:' + esc(CONTACT.phone) + '">' +
                            '<i class="fa-solid fa-phone" aria-hidden="true"></i>' +
                            '<span>' +
                                '<span class="ec-label">Call</span>' +
                                '<span class="ec-value" translate="no">' + esc(CONTACT.phoneDisplay) + '</span>' +
                            '</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +

            '</div>' +
        '</div>';
    }

    /* ======================================================================
       CLINICAL-USE NOTICE
       Rendered on products that suggest clinical content.
    ====================================================================== */

    function clinicalNoteHTML() {
        return '' +
        '<div class="clinical-note">' +
            '<i class="fa-solid fa-circle-info" aria-hidden="true"></i>' +
            '<div>' +
                '<strong>Clinical use</strong>' +
                '<p>This software supports a qualified clinician; it does not ' +
                   'practise medicine. Suggestions are drafts to be reviewed, ' +
                   'edited or rejected, and the basis for each one is shown so it ' +
                   'can be judged rather than accepted blindly. Responsibility for ' +
                   'diagnosis, prescribing and every clinical decision remains with ' +
                   'the treating clinician.</p>' +
            '</div>' +
        '</div>';
    }

    /* ======================================================================
       HUB PAGE
    ====================================================================== */

    function cardHTML(p) {

        var st = statusOf(p);

        var platforms = (p.platforms || []).slice(0, 3).map(function (x) {
            return '<span class="rd-plat">' + esc(x) + '</span>';
        }).join("");

        var learnTag = p.learning
            ? '<span class="rd-learn"><i class="fa-solid fa-brain" aria-hidden="true"></i> Learning</span>'
            : '';

        var href = "product.html?id=" + encodeURIComponent(p.id);

        return '' +
        '<article class="rd-card" data-category="' + esc(p.categoryKey || p.category) + '"' +
                ' data-status="' + esc(p.status) + '"' +
                ' data-learning="' + (p.learning ? "yes" : "no") + '">' +

            '<a class="rd-card-media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
                '<span class="rd-status ' + st.cls + '">' + esc(st.label) + '</span>' +
                learnTag +
                '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '"' +
                     ' loading="lazy" decoding="async" width="840" height="525">' +
            '</a>' +

            '<div class="rd-card-body">' +
                '<span class="rd-card-cat">' +
                    '<i class="' + safeIcon(p.icon) + '" aria-hidden="true"></i>' +
                    esc(p.category) +
                '</span>' +

                '<h3>' + esc(p.name) + '</h3>' +
                '<p class="rd-card-tagline">' + esc(p.tagline) + '</p>' +
                '<p class="rd-card-summary">' + esc(p.summary) + '</p>' +

                '<div class="rd-card-platforms">' + platforms + '</div>' +

                '<div class="rd-card-actions">' +
                    '<a class="doctor-btn" href="' + href + '">View details</a>' +
                    trialButton(p, "doctor-outline") +
                '</div>' +

                (p.trial
                    ? '<a class="rd-card-enquire" href="' + href + '#enquire">' +
                          'Purchase or enquire &rarr;</a>'
                    : '<div class="rd-card-actions">' +
                          '<a class="doctor-outline" href="' + href + '#enquire">Enquire</a>' +
                      '</div>') +
            '</div>' +

        '</article>';
    }

    function soonCardHTML() {
        return '' +
        '<article class="rd-card rd-card-soon">' +
            '<div class="rd-soon-icon"><i class="fa-solid fa-flask" aria-hidden="true"></i></div>' +
            '<h3>More in development</h3>' +
            '<p>We build these tools because our own clinic needed them. New ' +
               'projects are added here as they become usable by other ' +
               'practices. Tell us what would help in yours.</p>' +
            '<a class="doctor-outline" href="#enquire">Suggest a tool</a>' +
        '</article>';
    }

    function buildHub() {

        var grid = $("productGrid");
        if (!grid) return;

        var store = products();
        var ids = order();

        grid.innerHTML = ids.map(function (id) {
            return cardHTML(store[id]);
        }).join("") + soonCardHTML();

        /* ---------- Filters ---------- */

        var filterBar = $("productFilters");

        if (filterBar) {

            var cats = [];
            ids.forEach(function (id) {
                var c = store[id].categoryKey || store[id].category;
                if (cats.indexOf(c) === -1) cats.push(c);
            });

            var buttons = ['<button class="rd-filter is-active" type="button" data-filter="all">All tools</button>'];

            buttons.push('<button class="rd-filter" type="button" data-filter="__learning">' +
                         'Learning systems</button>');

            cats.forEach(function (c) {
                buttons.push('<button class="rd-filter" type="button" data-filter="' +
                             esc(c) + '">' + esc(c) + '</button>');
            });

            filterBar.innerHTML = buttons.join("");

            filterBar.addEventListener("click", function (event) {

                var btn = event.target.closest(".rd-filter");
                if (!btn) return;

                var value = btn.getAttribute("data-filter");

                filterBar.querySelectorAll(".rd-filter").forEach(function (b) {
                    b.classList.toggle("is-active", b === btn);
                });

                grid.querySelectorAll(".rd-card").forEach(function (card) {

                    if (card.classList.contains("rd-card-soon")) {
                        card.classList.toggle("is-hidden", value !== "all");
                        return;
                    }

                    var show =
                        value === "all" ? true :
                        value === "__learning" ? card.getAttribute("data-learning") === "yes" :
                        card.getAttribute("data-category") === value;

                    card.classList.toggle("is-hidden", !show);
                });
            });
        }

        /* ---------- Enquiry panel ---------- */

        var enquire = $("enquirePanel");
        if (enquire) enquire.innerHTML = enquiryHTML("");

        /* ---------- Counts in the hero ---------- */

        var countEl = $("rdCount");
        if (countEl) {
            var live = ids.filter(function (id) { return store[id].status === "available"; }).length;
            countEl.textContent = String(live);
        }

        refreshI18n(document.body);
        reveal();
    }

    /* ======================================================================
       DETAIL PAGE
    ====================================================================== */

    function resolveId() {

        var raw = new URLSearchParams(window.location.search).get("id");
        if (!raw) return null;

        raw = raw.trim().toLowerCase();

        var aliases = window.CARE_PRODUCT_ALIASES || {};
        return aliases[raw] || raw;
    }

    function buildDetail(p) {

        /* ---------- Head / meta ---------- */

        document.title = p.name + " | CARE Research & Development";

        var meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", p.summary.slice(0, 180));

        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute("href", window.location.href);

        var ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", p.name + " | CARE");

        var ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute("content", p.tagline);

        var crumb = $("crumbName");
        if (crumb) crumb.textContent = p.name;

        /* ---------- Hero ---------- */

        var st = statusOf(p);

        var hero = $("productHero");
        if (hero) {

            var platforms = (p.platforms || []).map(function (x) {
                return '<span><i class="fa-solid fa-desktop" aria-hidden="true"></i>' + esc(x) + '</span>';
            }).join("");

            hero.innerHTML =
                '<div class="product-hero-grid">' +

                    '<div>' +
                        '<div class="product-badges">' +
                            '<span class="product-badge ' + st.cls + '">' + esc(st.label) + '</span>' +
                            '<span class="product-badge">' + esc(p.category) + '</span>' +
                            (p.learning
                                ? '<span class="product-badge"><i class="fa-solid fa-brain" aria-hidden="true"></i> Learning system</span>'
                                : '') +
                        '</div>' +

                        '<h1>' + esc(p.name) + '</h1>' +
                        '<p class="product-tagline">' + esc(p.tagline) + '</p>' +
                        '<p class="product-summary">' + esc(p.summary) + '</p>' +

                        '<div class="product-hero-actions">' +
                            trialButton(p, "btn-primary") +
                            '<a class="btn-secondary" href="#enquire">Purchase or enquire</a>' +
                        '</div>' +

                        (p.trial
                            ? '<p class="trial-note">' +
                                  '<i class="fa-solid fa-circle-info" aria-hidden="true"></i>' +
                                  esc(p.trial.note || "No payment details needed.") +
                                  ' Full features for ' + esc((p.trial.days || 15)) +
                                  ' days.</p>'
                            : '') +

                        '<div class="product-platforms">' + platforms + '</div>' +
                    '</div>' +

                    '<div class="product-shot">' +
                        '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '"' +
                             ' width="840" height="525" decoding="async">' +
                    '</div>' +

                '</div>';
        }

        /* ---------- Highlights ---------- */

        var hl = $("productHighlights");
        if (hl && p.highlights) {
            hl.innerHTML = p.highlights.map(function (h) {
                return '<div class="highlight-tile fade-up">' +
                           '<div class="tile-icon"><i class="' + safeIcon(h.icon) + '" aria-hidden="true"></i></div>' +
                           '<h3>' + esc(h.title) + '</h3>' +
                           '<p>' + esc(h.text) + '</p>' +
                       '</div>';
            }).join("");
        }

        /* ---------- Features ---------- */

        var fl = $("productFeatures");
        if (fl && p.features) {
            fl.innerHTML = p.features.map(function (f) {
                return '<div class="feature-row fade-up">' +
                           '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>' +
                           '<div>' +
                               '<h3>' + esc(f.title) + '</h3>' +
                               '<p>' + esc(f.text) + '</p>' +
                           '</div>' +
                       '</div>';
            }).join("");
        }

        /* ---------- Learning explainer ---------- */

        var ln = $("productLearning");

        if (ln) {
            if (p.learning) {
                ln.innerHTML =
                    '<div class="learning-panel fade-up">' +
                        '<span class="rd-eyebrow"><i class="fa-solid fa-brain" aria-hidden="true"></i> Learning system</span>' +
                        '<h2>It gets better the more your clinic uses it</h2>' +
                        '<p>This is an adaptive tool, not a fixed template. It takes ' +
                           'account of the work your clinic has already done, so its ' +
                           'suggestions move towards your own vocabulary, your common ' +
                           'findings and your reporting conventions — while every ' +
                           'output still passes through you before it counts.</p>' +

                        '<div class="learning-steps">' +
                            '<div class="learning-step">' +
                                '<div class="step-no">1</div>' +
                                '<h3>You work normally</h3>' +
                                '<p>Write reports and sign them out the way you already do.</p>' +
                            '</div>' +
                            '<div class="learning-step">' +
                                '<div class="step-no">2</div>' +
                                '<h3>It observes patterns</h3>' +
                                '<p>Your accepted wording and your corrections both carry information.</p>' +
                            '</div>' +
                            '<div class="learning-step">' +
                                '<div class="step-no">3</div>' +
                                '<h3>Suggestions sharpen</h3>' +
                                '<p>Drafts start sounding like your clinic instead of a textbook.</p>' +
                            '</div>' +
                            '<div class="learning-step">' +
                                '<div class="step-no">4</div>' +
                                '<h3>You stay in charge</h3>' +
                                '<p>Nothing is saved or sent until you have reviewed and approved it.</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            } else {
                var sec = ln.closest("section");
                if (sec) sec.hidden = true;
            }
        }

        /* ---------- Audience ---------- */

        var au = $("productAudience");
        if (au && p.audience) {
            au.className = "audience-list";
            au.innerHTML = p.audience.map(function (a) {
                return '<li><i class="fa-solid fa-user-doctor" aria-hidden="true"></i><span>' +
                       esc(a) + '</span></li>';
            }).join("");
        }

        /* ---------- Specs ---------- */

        var sp = $("productSpecs");
        if (sp && p.specs) {
            sp.innerHTML = '<table class="spec-table"><tbody>' +
                p.specs.map(function (row) {
                    return '<tr><td>' + esc(row[0]) + '</td><td>' + esc(row[1]) + '</td></tr>';
                }).join("") +
            '</tbody></table>';
        }

        /* ---------- FAQ ---------- */

        var fq = $("productFaq");

        if (fq && p.faq && p.faq.length) {

            fq.className = "faq-list";

            fq.innerHTML = p.faq.map(function (item, i) {
                var id = "pfaq-" + i;
                return '<div class="faq-item fade-up">' +
                           '<button class="faq-question" type="button" aria-expanded="false" aria-controls="' + id + '">' +
                               '<span>' + esc(item.q) + '</span>' +
                               '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>' +
                           '</button>' +
                           '<div class="faq-answer" id="' + id + '" hidden><p>' + esc(item.a) + '</p></div>' +
                       '</div>';
            }).join("");

            fq.addEventListener("click", function (event) {
                var btn = event.target.closest(".faq-question");
                if (!btn) return;
                var panel = document.getElementById(btn.getAttribute("aria-controls"));
                var open = btn.getAttribute("aria-expanded") === "true";
                btn.setAttribute("aria-expanded", open ? "false" : "true");
                btn.closest(".faq-item").classList.toggle("is-open", !open);
                if (panel) panel.hidden = open;
            });

        } else if (fq) {
            var faqSec = fq.closest("section");
            if (faqSec) faqSec.hidden = true;
        }

        /* ---------- Clinical notice ---------- */

        var note = $("clinicalNote");
        if (note) {
            if (p.regulatory) note.innerHTML = clinicalNoteHTML();
            else {
                var noteSec = note.closest("section");
                if (noteSec) noteSec.hidden = true;
            }
        }

        /* ---------- Related ---------- */

        var rel = $("relatedProducts");
        if (rel) {
            var store = products();
            var others = order().filter(function (id) { return id !== p.id; }).slice(0, 3);

            rel.innerHTML = others.map(function (id) {
                var o = store[id];
                return '<article class="rp-card">' +
                           '<div class="rp-icon"><i class="' + safeIcon(o.icon) + '" aria-hidden="true"></i></div>' +
                           '<h3>' + esc(o.name) + '</h3>' +
                           '<p>' + esc(o.tagline) + '</p>' +
                           '<a href="product.html?id=' + encodeURIComponent(o.id) + '">' +
                               'View details &rarr;</a>' +
                       '</article>';
            }).join("");
        }

        /* ---------- Enquiry ---------- */

        var enq = $("enquirePanel");
        if (enq) enq.innerHTML = enquiryHTML(p.name);

        /* ---------- Structured data ---------- */

        var schemaNode = $("productSchema");
        if (schemaNode) {
            schemaNode.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": p.name,
                "applicationCategory": "HealthApplication",
                "description": p.summary,
                "operatingSystem": (p.platforms || []).join(", "),
                "url": window.location.href,
                "image": new URL(p.image, window.location.href).href,
                "author": {
                    "@type": "Organization",
                    "name": "CARE — Care ENT Clinic & Maternity Home",
                    "url": "https://carehospital.in/"
                },
                "offers": {
                    "@type": "Offer",
                    "availability": p.status === "available"
                        ? "https://schema.org/InStock"
                        : "https://schema.org/PreOrder",
                    "priceCurrency": "INR",
                    "url": window.location.href + "#enquire"
                }
            });
        }

        document.body.classList.add("product-ready");

        refreshI18n(document.body);
        reveal();
    }

    /* ======================================================================
       ERROR STATE
    ====================================================================== */

    function showError() {

        var main = document.querySelector("main");
        if (!main) return;

        main.innerHTML =
            '<section class="doctor-section profile-error">' +
                '<div class="container">' +
                    '<div class="about-card">' +
                        '<div class="error-icon"><i class="fa-solid fa-flask" aria-hidden="true"></i></div>' +
                        '<h2>Product not found</h2>' +
                        '<p>That product page does not exist, or has been renamed.</p>' +
                        '<a href="products.html" class="btn-book">See all R&amp;D projects</a>' +
                    '</div>' +
                '</div>' +
            '</section>';

        refreshI18n(main);
    }

    /* ======================================================================
       REVEAL ANIMATION — matches the rest of the site
    ====================================================================== */

    function reveal() {

        var items = document.querySelectorAll(".fade-up:not(.show)");
        if (!items.length) return;

        if (!("IntersectionObserver" in window)) {
            items.forEach(function (el) { el.classList.add("show"); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("show");
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        items.forEach(function (el) { io.observe(el); });
    }

    /* ======================================================================
       START
    ====================================================================== */

    /* A placeholder trial link must not navigate anywhere. */
    document.addEventListener("click", function (event) {
        var a = event.target.closest('a[data-trial-pending]');
        if (a) event.preventDefault();
    });

    function start() {

        if ($("productGrid")) {
            buildHub();
            return;
        }

        if ($("productHero")) {
            var id = resolveId();
            var p = products()[id];
            if (!p) { showError(); return; }
            buildDetail(p);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }

})();
