"use strict";

/* ==========================================================
   SITE SEARCH
   Opened via the magnifying-glass icon in the header.
   The index is built straight from the DOM (doctor cards,
   department cards, procedure cards, plus the main page
   sections) so it never drifts out of sync with the content.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const openTrigger = document.querySelector(".btn-search");
    const overlay = document.getElementById("searchOverlay");

    if (!openTrigger || !overlay) return;

    const input = document.getElementById("searchInput");
    const resultsBox = document.getElementById("searchResults");
    const closeBtn = document.getElementById("searchClose");

    const ICONS = {
        Doctor: "fa-user-doctor",
        Department: "fa-hospital",
        Procedure: "fa-kit-medical",
        Page: "fa-circle-arrow-right"
    };

    /* ---------- Build the index ---------- */

    const buildIndex = () => {

        const index = [];

        document.querySelectorAll(".doctor-card").forEach((card) => {
            index.push({
                title: card.querySelector("h3")?.textContent.trim(),
                category: "Doctor",
                desc: card.querySelector(".designation")?.textContent.trim() || "",
                el: card
            });
        });

        document.querySelectorAll(".department-card").forEach((card) => {
            index.push({
                title: card.querySelector("h3")?.textContent.trim(),
                category: "Department",
                desc: [...card.querySelectorAll(".dept-services li")]
                    .map((li) => li.textContent.trim())
                    .join(", "),
                el: card
            });
        });

        document.querySelectorAll(".procedure-card").forEach((card) => {
            index.push({
                title: card.querySelector("h3")?.textContent.trim(),
                category: "Procedure",
                desc: card.querySelector(".procedure-tag")?.textContent.trim() || "",
                el: card
            });
        });

        const pages = [
            ["about", "About CARE", "Why patients choose us"],
            ["gallery", "Gallery", "Photos from inside the hospital"],
            ["appointment", "Book Appointment", "Schedule a visit with our specialists"],
            ["contact", "Contact Us", "Address, phone & working hours"]
        ];

        pages.forEach(([id, title, desc]) => {
            const el = document.getElementById(id);
            if (el) index.push({ title, category: "Page", desc, el });
        });

        return index;
    };

    let searchIndex = [];
    let activeResultIndex = -1;

    /* ---------- Rendering ---------- */

    const renderHint = () => {
        resultsBox.innerHTML = `
            <div class="search-hint">
                <i class="fa-solid fa-magnifying-glass"></i>
                Search doctors, departments, procedures & more
            </div>`;
    };

    const renderEmpty = (query) => {
        resultsBox.innerHTML = `
            <div class="search-empty">
                <i class="fa-solid fa-circle-question"></i>
                No results for "${query}"
            </div>`;
    };

    const renderResults = (matches) => {

        resultsBox.innerHTML = "";

        matches.forEach((match, i) => {

            const button = document.createElement("button");
            button.type = "button";
            button.className = "search-result-item";
            button.dataset.index = String(i);

            button.innerHTML = `
                <span class="search-result-icon">
                    <i class="fa-solid ${ICONS[match.category] || "fa-circle"}"></i>
                </span>
                <span class="search-result-text">
                    <h4>${match.title}</h4>
                    <p>${match.desc}</p>
                </span>
                <span class="search-result-tag">${match.category}</span>`;

            button.addEventListener("click", () => goToResult(match));
            button.addEventListener("mouseenter", () => setActive(i));

            resultsBox.appendChild(button);
        });
    };

    const setActive = (i) => {

        activeResultIndex = i;

        [...resultsBox.children].forEach((child, idx) => {
            child.classList.toggle("is-active", idx === i);
        });
    };

    /* ---------- Search behaviour ---------- */

    let currentMatches = [];

    const runSearch = (query) => {

        const q = query.trim().toLowerCase();
        activeResultIndex = -1;

        if (!q) {
            renderHint();
            currentMatches = [];
            return;
        }

        currentMatches = searchIndex.filter((item) =>
            item.title?.toLowerCase().includes(q) ||
            item.desc?.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );

        if (!currentMatches.length) {
            renderEmpty(query.trim());
            return;
        }

        renderResults(currentMatches);
    };

    const goToResult = (match) => {

        closeSearch();

        match.el.scrollIntoView({ behavior: "smooth", block: "center" });

        match.el.classList.add("search-highlight");
        setTimeout(() => match.el.classList.remove("search-highlight"), 1700);
    };

    /* ---------- Open / close ---------- */

    const openSearch = (e) => {

        if (e) e.preventDefault();

        searchIndex = buildIndex();
        renderHint();

        overlay.classList.add("active");
        document.body.style.overflow = "hidden";

        setTimeout(() => input?.focus(), 50);
    };

    const closeSearch = () => {

        overlay.classList.remove("active");
        document.body.style.overflow = "";

        if (input) input.value = "";
    };

    openTrigger.addEventListener("click", openSearch);

    if (closeBtn) closeBtn.addEventListener("click", closeSearch);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeSearch();
    });

    if (input) {

        input.addEventListener("input", (e) => runSearch(e.target.value));

        input.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {

                e.preventDefault();

                const target = activeResultIndex >= 0
                    ? currentMatches[activeResultIndex]
                    : currentMatches[0];

                if (target) goToResult(target);
            }

            if (e.key === "ArrowDown" && currentMatches.length) {
                e.preventDefault();
                setActive(Math.min(activeResultIndex + 1, currentMatches.length - 1));
            }

            if (e.key === "ArrowUp" && currentMatches.length) {
                e.preventDefault();
                setActive(Math.max(activeResultIndex - 1, 0));
            }
        });
    }

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape" && overlay.classList.contains("active")) {
            closeSearch();
        }

        // Quick-open shortcut: "/"
        if (e.key === "/" && !overlay.classList.contains("active") &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA") {
            openSearch(e);
        }
    });

});
