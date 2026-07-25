"use strict";

/* ==========================================================================
   CARE — SHARED HEADER & FOOTER
   --------------------------------------------------------------------------
   doctor.html shipped with an EMPTY <header id="header"> and
   <footer id="footer"> and nothing that filled them, so every secondary
   page rendered with no navigation at all — no logo, no menu, no way home.
   This module renders both, on any page that provides those two hooks.

   index.html keeps its navigation in the HTML itself (better for crawlers
   and for the largest-contentful-paint measurement); this file only fills
   in the pages that would otherwise be blank.

   `data-page` on <body> marks the current section for aria-current.
   ========================================================================== */

(function () {

    var PHONE = "+919370111449";
    var WHATSAPP = "919370111449";

    /* Anchor links have to be absolute-to-index from a sub-page, or they
       would just jump around the current page. */
    function link(hash) {
        return "index.html" + (hash ? "#" + hash : "");
    }

    /* ======================================================================
       HEADER
    ====================================================================== */

    function headerHTML() {

        return '' +
        '<div class="container nav-container">' +

            '<a href="' + link("") + '" class="logo" aria-label="CARE — Home">' +
                '<img src="images/logo.png" alt="CARE" width="72" height="72" decoding="async">' +
            '</a>' +

            '<nav id="main-navigation" class="nav" aria-label="Main Navigation">' +
                '<ul>' +
                    '<li><a href="' + link("") + '">Home</a></li>' +
                    '<li><a href="' + link("about") + '">About</a></li>' +
                    '<li><a href="' + link("doctors") + '" data-nav="doctors">Doctors</a></li>' +
                    '<li><a href="' + link("departments") + '">Departments</a></li>' +
                    '<li><a href="' + link("treatments") + '">Treatments</a></li>' +
                    '<li><a href="' + link("gallery") + '">Gallery</a></li>' +
                    '<li><a href="' + link("contact") + '">Contact</a></li>' +
                '</ul>' +

                langSwitcherMobileHTML() +
            '</nav>' +

            '<div class="nav-buttons">' +

                langSwitcherHTML() +

                '<a href="' + link("appointment") + '" class="btn-book">Book Appointment</a>' +

                '<a href="tel:' + PHONE + '" class="btn-emergency">Emergency</a>' +

                '<button class="hamburger" type="button" aria-label="Open main menu"' +
                       ' aria-expanded="false" aria-controls="main-navigation">' +
                    '<span></span><span></span><span></span>' +
                '</button>' +

            '</div>' +

        '</div>';
    }

    /* ======================================================================
       LANGUAGE SWITCHER
    ====================================================================== */

    function langSwitcherHTML() {

        return '' +
        '<div class="lang-switch">' +

            '<button class="lang-toggle" type="button" data-lang-toggle' +
                   ' aria-haspopup="true" aria-expanded="false" aria-label="Select language">' +
                '<i class="fa-solid fa-globe" aria-hidden="true"></i>' +
                '<span data-lang-current>English</span>' +
                '<i class="fa-solid fa-chevron-down lang-caret" aria-hidden="true"></i>' +
            '</button>' +

            '<div class="lang-menu" role="menu">' +
                langOption("en", "English", "English") +
                langOption("hi", "\u0939\u093F\u0928\u094D\u0926\u0940", "Hindi") +
                langOption("ur", "\u0627\u0631\u062F\u0648", "Urdu") +
            '</div>' +

        '</div>';
    }

    function langSwitcherMobileHTML() {

        return '' +
        '<div class="lang-switch-mobile">' +
            '<span class="lang-mobile-label">Language</span>' +
            '<div class="lang-mobile-options">' +
                langOption("en", "English", "English") +
                langOption("hi", "\u0939\u093F\u0928\u094D\u0926\u0940", "Hindi") +
                langOption("ur", "\u0627\u0631\u062F\u0648", "Urdu") +
            '</div>' +
        '</div>';
    }

    function langOption(code, native, latin) {
        return '<button class="lang-option" type="button" role="menuitemradio"' +
                      ' aria-checked="false" data-lang-option="' + code + '"' +
                      ' lang="' + code + '">' +
                   '<span class="lang-native" translate="no">' + native + '</span>' +
                   '<span class="lang-latin" translate="no">' + latin + '</span>' +
               '</button>';
    }

    /* ======================================================================
       FOOTER
    ====================================================================== */

    function footerHTML() {

        return '' +
        '<div class="container">' +

            '<div class="footer-top">' +

                '<div class="footer-about premium-card">' +
                    '<div class="card-shine"></div>' +
                    '<img src="images/logo.png" class="footer-logo" alt="CARE" loading="lazy">' +
                    '<p>CARE brings together experienced specialists, advanced technology ' +
                       'and compassionate healthcare for the entire family.</p>' +
                    '<div class="social-links">' +
                        '<a href="https://www.facebook.com/carehospital.in" target="_blank"' +
                           ' rel="noopener" aria-label="CARE on Facebook">' +
                            '<i class="fab fa-facebook-f"></i></a>' +
                        '<a href="https://www.instagram.com/" target="_blank"' +
                           ' rel="noopener" aria-label="CARE on Instagram">' +
                            '<i class="fab fa-instagram"></i></a>' +
                        '<a href="https://www.youtube.com/" target="_blank"' +
                           ' rel="noopener" aria-label="CARE on YouTube">' +
                            '<i class="fab fa-youtube"></i></a>' +
                    '</div>' +
                '</div>' +

                '<div class="footer-links">' +
                    '<h3>Quick Links</h3>' +
                    '<ul>' +
                        '<li><a href="' + link("") + '">Home</a></li>' +
                        '<li><a href="' + link("about") + '">About</a></li>' +
                        '<li><a href="' + link("doctors") + '">Doctors</a></li>' +
                        '<li><a href="' + link("departments") + '">Departments</a></li>' +
                        '<li><a href="' + link("gallery") + '">Gallery</a></li>' +
                        '<li><a href="' + link("contact") + '">Contact</a></li>' +
                    '</ul>' +
                '</div>' +

                '<div class="footer-links">' +
                    '<h3>Departments</h3>' +
                    '<ul>' +
                        '<li><a href="' + link("departments") + '">ENT — Ear, Nose &amp; Throat</a></li>' +
                        '<li><a href="' + link("departments") + '">Maternity Care</a></li>' +
                        '<li><a href="' + link("departments") + '">Gynaecology</a></li>' +
                        '<li><a href="' + link("departments") + '">Diagnostics &amp; Laboratory</a></li>' +
                        '<li><a href="' + link("departments") + '">Skin, Hair &amp; Unani Care</a></li>' +
                    '</ul>' +
                '</div>' +

                '<div class="footer-contact">' +
                    '<h3>Contact</h3>' +
                    '<ul>' +
                        '<li>Police Station Road, Chikhli, Buldhana District, Maharashtra – 443201</li>' +
                        '<li><a href="tel:' + PHONE + '">+91 9370111449</a></li>' +
                        '<li><a href="mailto:careclinic.admin@gmail.com">careclinic.admin@gmail.com</a></li>' +
                        '<li>Mon – Sat : 11:30 AM – 9:00 PM</li>' +
                        '<li>Sunday : Emergency Only</li>' +
                    '</ul>' +
                '</div>' +

            '</div>' +

            '<p class="footer-disclaimer">' +
                'For medical emergencies, please call us directly rather than messaging ' +
                'online. This website does not replace emergency medical services.' +
            '</p>' +

            '<div class="footer-bottom">' +
                '<p>&copy; ' + new Date().getFullYear() + ' CARE. All Rights Reserved.</p>' +
                '<p>Emergency : <a href="tel:' + PHONE + '">+91 9370111449</a></p>' +
            '</div>' +

        '</div>';
    }

    /* ======================================================================
       FLOATING BUTTONS
    ====================================================================== */

    function floatingHTML() {

        return '' +
        '<a href="https://wa.me/' + WHATSAPP + '" class="float-whatsapp" target="_blank"' +
           ' rel="noopener" aria-label="Chat with CARE on WhatsApp">' +
            '<i class="fab fa-whatsapp"></i></a>' +

        '<a href="tel:' + PHONE + '" class="float-call" aria-label="Call CARE">' +
            '<i class="fas fa-phone"></i></a>' +

        '<button id="backToTop" type="button" aria-label="Back to top">' +
            '<i class="fas fa-arrow-up"></i></button>';
    }

    /* ======================================================================
       MOUNT
    ====================================================================== */

    function mount() {

        var header = document.getElementById("header");
        var footer = document.getElementById("footer");
        var floating = document.querySelector(".floating-buttons");

        if (header && !header.children.length) {
            header.className = "header";
            header.innerHTML = headerHTML();
        }

        if (footer && !footer.children.length) {
            /* Keep the element's own id. An earlier version reassigned it to
               "contact", which silently broke every #footer reference on the
               page (and any stylesheet or test hanging off that id). The
               contact anchor lives on index.html, which is a different
               document, so nothing here needs to claim that id. */
            footer.className = "footer";
            footer.innerHTML = footerHTML();
        }

        if (floating && !floating.children.length) {
            floating.innerHTML = floatingHTML();
        }

        /* Mark the current section in the nav */
        var page = document.body.getAttribute("data-page");
        if (page) {
            var current = document.querySelector('.nav a[data-nav="' + page + '"]');
            if (current) current.setAttribute("aria-current", "page");
        }

        document.dispatchEvent(new CustomEvent("care:chromeready"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mount);
    } else {
        mount();
    }

})();
