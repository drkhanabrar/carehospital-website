"use strict";

/* ==========================================================
   GALLERY: FILTER + LIGHTBOX
   - Filter buttons show/hide gallery items by data-category
   - Clicking an item opens a lightbox with prev/next/keyboard
     navigation. Navigation only cycles through the images that
     are currently visible under the active filter.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (!galleryItems.length) return;

    /* ---------- Filter ---------- */

    let activeFilter = "all";

    const applyFilter = (filter) => {

        activeFilter = filter;

        galleryItems.forEach((item) => {
            const categories = (item.dataset.category || "").split(" ");
            const matches = filter === "all" || categories.includes(filter);
            item.style.display = matches ? "" : "none";
        });
    };

    filterButtons.forEach((button) => {

        button.addEventListener("click", function () {

            filterButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");

            applyFilter(this.dataset.filter);
        });
    });

    /* ---------- Lightbox ---------- */

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");

    if (!lightbox || !lightboxImage) return;

    const prevButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");
    const closeButton = lightbox.querySelector(".lightbox-close");

    let visibleItems = [];
    let currentIndex = 0;

    // Only the images currently visible under the active filter
    // are eligible for prev/next navigation.
    const getVisibleItems = () =>
        [...galleryItems].filter((item) =>
            activeFilter === "all" ||
            (item.dataset.category || "").split(" ").includes(activeFilter)
        );

    const updateLightbox = () => {
        const img = visibleItems[currentIndex]?.querySelector("img");
        if (!img) return;

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || "Gallery image";
    };

    const openLightbox = (item) => {

        visibleItems = getVisibleItems();
        currentIndex = visibleItems.indexOf(item);

        if (currentIndex === -1) currentIndex = 0;

        updateLightbox();
        lightbox.classList.add("show");
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        lightbox.classList.remove("show");
        document.body.style.overflow = "";
    };

    const showPrev = () => {
        if (!visibleItems.length) return;
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightbox();
    };

    const showNext = () => {
        if (!visibleItems.length) return;
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightbox();
    };

    galleryItems.forEach((item) => {
        item.addEventListener("click", () => openLightbox(item));
    });

    if (prevButton) {
        prevButton.addEventListener("click", (e) => {
            e.stopPropagation();
            showPrev();
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", (e) => {
            e.stopPropagation();
            showNext();
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {

        if (!lightbox.classList.contains("show")) return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
    });

});
