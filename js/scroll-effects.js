"use strict";

/* ==========================================================
   SCROLL REVEAL & COUNTER ANIMATION
   - Fades/slides ".reveal" sections in as they enter the viewport
   - Counts the hero stat numbers up once the hero has scrolled
     past the top of the screen
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- Scroll reveal ---------- */

    const reveals = document.querySelectorAll(".reveal");

    if (reveals.length) {

        const revealSections = () => {
            const windowHeight = window.innerHeight;

            reveals.forEach((section) => {
                const top = section.getBoundingClientRect().top;

                if (top < windowHeight - 120) {
                    section.classList.add("active");
                }
            });
        };

        window.addEventListener("scroll", revealSections, { passive: true });
        revealSections();
    }

    /* ---------- Counter animation ---------- */

    const counters = document.querySelectorAll(".counter");
    const hero = document.querySelector(".hero");

    if (counters.length && hero) {

        let counterStarted = false;

        const runCounters = () => {

            if (counterStarted) return;

            const heroBottom = hero.getBoundingClientRect().bottom;

            if (heroBottom <= 100) return;

            counterStarted = true;

            counters.forEach((counter) => {

                const target = +counter.dataset.target;
                const increment = Math.max(1, Math.ceil(target / 120));
                let current = 0;

                const updateCounter = () => {

                    current += increment;

                    if (current >= target) {
                        counter.textContent = target.toLocaleString() + "+";
                        return;
                    }

                    counter.textContent = current.toLocaleString();
                    requestAnimationFrame(updateCounter);
                };

                updateCounter();
            });
        };

        window.addEventListener("scroll", runCounters, { passive: true });
        window.addEventListener("load", runCounters);
    }

});
