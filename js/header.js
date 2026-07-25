"use strict";

/* ==========================================================================
   CARE — HEADER, MOBILE NAVIGATION & BACK-TO-TOP
   --------------------------------------------------------------------------
   Changes over the previous version:

   • Runs after js/site-chrome.js has injected the header, instead of
     querying for elements that did not exist yet on doctor.html.
   • aria-expanded on the hamburger is now actually updated (it was
     hard-coded to "false" in the markup and never changed, so screen
     readers always announced the menu as collapsed).
   • The drawer locks background scrolling, traps focus, closes on Escape,
     on outside click, and on resize back to desktop.
   • The sticky header's height is published as --header-h so anchored
     sections stop landing underneath it — previously clicking a nav link
     scrolled the target heading behind the fixed bar.
   • Back-to-top respects prefers-reduced-motion.
   ========================================================================== */

(function () {

    var MOBILE_BREAKPOINT = 1250;   /* must match the drawer breakpoint in css/responsive.css */

    function init() {

        var header = document.querySelector(".header");
        var nav = document.querySelector(".nav");
        var hamburger = document.querySelector(".hamburger");
        var backToTop = document.getElementById("backToTop");

        var scrollY = 0;

        /* ==================================================================
           STICKY HEADER + SCROLL-PADDING
        ================================================================== */

        if (header) {

            var applyScrolled = function () {
                header.classList.toggle("scrolled", window.scrollY > 80);
            };

            var publishHeight = function () {
                var h = header.offsetHeight || 88;
                document.documentElement.style.setProperty("--header-h", h + "px");
                /* Anchors land below the fixed bar instead of behind it */
                document.documentElement.style.scrollPaddingTop = (h + 16) + "px";
            };

            applyScrolled();
            publishHeight();

            window.addEventListener("scroll", applyScrolled, { passive: true });
            window.addEventListener("resize", publishHeight);

            if ("ResizeObserver" in window) {
                new ResizeObserver(publishHeight).observe(header);
            }
        }

        /* ==================================================================
           MOBILE DRAWER
        ================================================================== */

        if (hamburger && nav) {

            var lockScroll = function () {
                scrollY = window.scrollY || 0;
                document.body.style.position = "fixed";
                document.body.style.top = "-" + scrollY + "px";
                document.body.style.width = "100%";
            };

            var unlockScroll = function () {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                window.scrollTo(0, scrollY);
            };

            var isOpen = function () {
                return nav.classList.contains("active");
            };

            var openNav = function () {
                nav.classList.add("active");
                hamburger.classList.add("active");
                hamburger.setAttribute("aria-expanded", "true");
                hamburger.setAttribute("aria-label", "Close menu");
                document.body.classList.add("nav-open");
                lockScroll();
            };

            var closeNav = function (returnFocus) {
                if (!isOpen()) return;
                nav.classList.remove("active");
                hamburger.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.setAttribute("aria-label", "Open main menu");
                document.body.classList.remove("nav-open");
                unlockScroll();
                if (returnFocus) hamburger.focus();
            };

            hamburger.addEventListener("click", function (event) {
                event.stopPropagation();
                if (isOpen()) closeNav();
                else openNav();
            });

            /* Any nav link closes the drawer */
            nav.addEventListener("click", function (event) {
                if (event.target.closest("a")) closeNav();
            });

            /* Click outside */
            document.addEventListener("click", function (event) {
                if (!isOpen()) return;
                if (event.target.closest(".nav") || event.target.closest(".hamburger")) return;
                closeNav();
            });

            /* Escape */
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape" && isOpen()) closeNav(true);
            });

            /* Keep focus inside the open drawer */
            document.addEventListener("keydown", function (event) {

                if (event.key !== "Tab" || !isOpen()) return;

                var items = nav.querySelectorAll('a[href], button:not([disabled])');
                if (!items.length) return;

                var first = items[0];
                var last = items[items.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    hamburger.focus();
                }
            });

            /* Rotating the phone to landscape can cross the breakpoint */
            var resizeTimer;
            window.addEventListener("resize", function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    if (window.innerWidth > MOBILE_BREAKPOINT) closeNav();
                }, 120);
            });
        }

        /* ==================================================================
           BACK TO TOP
        ================================================================== */

        if (backToTop) {

            window.addEventListener("scroll", function () {
                backToTop.classList.toggle("show", window.scrollY > 500);
            }, { passive: true });

            backToTop.addEventListener("click", function () {

                var reduced = window.matchMedia &&
                              window.matchMedia("(prefers-reduced-motion: reduce)").matches;

                window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
            });
        }

        /* ==================================================================
           FLOATING "BOOK" BUTTON
           Hidden while the appointment form itself is on screen.
        ================================================================== */

        var floatingBook = document.querySelector(".floating-book");
        var appointment = document.getElementById("appointment");

        if (floatingBook && appointment && "IntersectionObserver" in window) {

            new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    floatingBook.classList.toggle("hide", entry.isIntersecting);
                });
            }, { threshold: 0.15 }).observe(appointment);
        }

        /* ==================================================================
           SCROLL-SPY
           Highlights the section you are actually looking at.
        ================================================================== */

        var navLinks = document.querySelectorAll('.nav a[href*="#"]');
        var sections = [];

        navLinks.forEach(function (a) {
            var hash = a.getAttribute("href").split("#")[1];
            if (!hash) return;
            var section = document.getElementById(hash);
            if (section) sections.push({ link: a, section: section });
        });

        if (sections.length && "IntersectionObserver" in window) {

            var spy = new IntersectionObserver(function (entries) {

                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;

                    navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });

                    var match = sections.filter(function (item) {
                        return item.section === entry.target;
                    })[0];

                    if (match) match.link.setAttribute("aria-current", "page");
                });

            }, { rootMargin: "-45% 0px -50% 0px" });

            sections.forEach(function (item) { spy.observe(item.section); });
        }
    }

    /* On index.html the header is in the HTML; on sub-pages site-chrome.js
       injects it. Run for whichever arrives. */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    document.addEventListener("care:chromeready", init);

})();
