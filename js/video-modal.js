"use strict";

/* ==========================================================================
   CARE — PROCEDURE VIDEO MODAL
   --------------------------------------------------------------------------
   Fixes over the previous version:

   1. FULL SCREEN NOW WORKS.
      Previously the player kept `max-height:68vh; max-width:100%` while
      full screen, so a "full screen" portrait clip appeared as a small
      rectangle floating in a black void. The element is now explicitly
      re-sized by `:fullscreen` rules (css/video-modal.css) and we request
      full screen on the FRAME, not the raw <video>, so the loading and
      placeholder layers travel with it.

   2. TRUE ASPECT RATIO instead of a portrait/landscape guess.
      The old code had only two buckets, so a 1:1 clip (ear.mp4 and
      wax-removal.mp4 are both 480x480) was letterboxed into a 16:9 box.
      The frame now takes the video's real ratio via a CSS custom property.

   3. iOS SAFARI SUPPORT.
      iPhone Safari does not implement the standard Fullscreen API on
      arbitrary elements, only `video.webkitEnterFullscreen()`. Handled.

   4. The custom button and the browser's own full-screen control stay in
      sync, and Escape exits full screen before it closes the modal.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================================
       DOM
    ====================================================================== */

    var modal = document.getElementById("videoModal");
    if (!modal) return;

    var frame       = modal.querySelector(".video-frame");
    var player      = document.getElementById("videoModalPlayer");
    var source      = player ? player.querySelector("source") : null;
    var loading     = document.getElementById("videoLoading");
    var placeholder = document.getElementById("videoModalPlaceholder");
    var categoryEl  = document.getElementById("videoModalCategory");
    var titleEl     = document.getElementById("videoModalTitle");
    var subtitleEl  = document.getElementById("videoModalSubtitle");
    var metaEl      = document.getElementById("videoModalMeta");
    var featuresEl  = document.getElementById("videoModalFeatures");
    var closeBtn    = document.getElementById("videoModalClose");
    var fsBtn       = document.getElementById("videoModalFullscreen");

    if (!player || !frame || !closeBtn) return;

    var cards = document.querySelectorAll(".procedure-card");

    var lastFocused = null;
    var scrollY = 0;

    function t(str) {
        return (window.CARE && window.CARE.i18n) ? window.CARE.i18n.t(str) : str;
    }

    /* ======================================================================
       SCROLL LOCK
       Fixed-body technique: on iOS `overflow:hidden` alone does not stop
       the page behind a modal from scrolling.
    ====================================================================== */

    function lockScroll() {
        scrollY = window.scrollY || window.pageYOffset || 0;
        document.body.style.position = "fixed";
        document.body.style.top = "-" + scrollY + "px";
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
    }

    function unlockScroll() {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
    }

    /* ======================================================================
       LOADING / PLACEHOLDER
    ====================================================================== */

    function showLoading() { if (loading) loading.classList.remove("hidden"); }
    function hideLoading() { if (loading) loading.classList.add("hidden"); }

    function showPlaceholder() {
        if (placeholder) placeholder.hidden = false;
        player.hidden = true;
        if (fsBtn) fsBtn.hidden = true;
        hideLoading();
        frame.classList.add("is-placeholder");
    }

    function hidePlaceholder() {
        if (placeholder) placeholder.hidden = true;
        player.hidden = false;
        if (fsBtn) fsBtn.hidden = false;
        frame.classList.remove("is-placeholder");
    }

    /* ======================================================================
       TEXT CONTENT
    ====================================================================== */

    function setText(el, value, fallback) {
        if (!el) return;
        el.textContent = t(value || fallback);
    }

    function renderPills(container, value, iconClass) {

        if (!container) return;
        container.innerHTML = "";

        if (!value || !value.trim()) return;

        value.split("|").forEach(function (item) {

            var label = item.trim();
            if (!label) return;

            var span = document.createElement("span");

            var icon = document.createElement("i");
            icon.className = iconClass;
            span.appendChild(icon);

            span.appendChild(document.createTextNode(" " + t(label)));
            container.appendChild(span);
        });
    }

    /* ======================================================================
       ASPECT RATIO
       Sets the real ratio so 16:9, 9:16 and 1:1 clips all sit flush inside
       the frame with no letterboxing.
    ====================================================================== */

    function applyAspectRatio() {

        var w = player.videoWidth;
        var h = player.videoHeight;

        modal.classList.remove("portrait-video", "landscape-video", "square-video");

        if (!w || !h) return;

        frame.style.setProperty("--video-ar", w + " / " + h);

        var ratio = w / h;

        if (ratio > 1.05)      modal.classList.add("landscape-video");
        else if (ratio < 0.95) modal.classList.add("portrait-video");
        else                   modal.classList.add("square-video");
    }

    /* ======================================================================
       FULL SCREEN
    ====================================================================== */

    function fullscreenElement() {
        return document.fullscreenElement ||
               document.webkitFullscreenElement ||
               document.mozFullScreenElement ||
               document.msFullscreenElement ||
               null;
    }

    function isFullscreen() {
        return !!fullscreenElement() || !!player.webkitDisplayingFullscreen;
    }

    function requestFullscreen() {

        /* iPhone Safari: the Fullscreen API is unavailable on a <div>, so
           the only route is the proprietary video-element call. */
        if (typeof player.webkitEnterFullscreen === "function" &&
            !document.fullscreenEnabled && !document.webkitFullscreenEnabled) {
            try { player.webkitEnterFullscreen(); return; } catch (e) { /* fall through */ }
        }

        var target = frame;

        var fn = target.requestFullscreen ||
                 target.webkitRequestFullscreen ||
                 target.mozRequestFullScreen ||
                 target.msRequestFullscreen;

        if (fn) {
            var result = fn.call(target, { navigationUI: "hide" });
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    if (typeof player.webkitEnterFullscreen === "function") {
                        try { player.webkitEnterFullscreen(); } catch (e) {}
                    }
                });
            }
            return;
        }

        if (typeof player.webkitEnterFullscreen === "function") {
            try { player.webkitEnterFullscreen(); } catch (e) {}
        }
    }

    function exitFullscreen() {

        var fn = document.exitFullscreen ||
                 document.webkitExitFullscreen ||
                 document.mozCancelFullScreen ||
                 document.msExitFullscreen;

        if (fn && fullscreenElement()) { try { fn.call(document); } catch (e) {} }

        if (player.webkitDisplayingFullscreen &&
            typeof player.webkitExitFullscreen === "function") {
            try { player.webkitExitFullscreen(); } catch (e) {}
        }
    }

    function toggleFullscreen() {
        if (isFullscreen()) exitFullscreen();
        else requestFullscreen();
    }

    function syncFullscreenButton() {

        var active = isFullscreen();

        modal.classList.toggle("is-fullscreen", active);
        frame.classList.toggle("is-fullscreen", active);

        if (!fsBtn) return;

        var icon = fsBtn.querySelector("i");
        if (icon) {
            icon.className = active ? "fa-solid fa-compress" : "fa-solid fa-expand";
        }

        var label = active ? "Exit full screen" : "Enter full screen";
        fsBtn.setAttribute("aria-label", t(label));
        fsBtn.setAttribute("title", t(label));
        fsBtn.setAttribute("aria-pressed", active ? "true" : "false");
    }

    ["fullscreenchange", "webkitfullscreenchange",
     "mozfullscreenchange", "MSFullscreenChange"].forEach(function (evt) {
        document.addEventListener(evt, syncFullscreenButton);
    });

    /* iOS-specific events for the native video full-screen view */
    player.addEventListener("webkitbeginfullscreen", syncFullscreenButton);
    player.addEventListener("webkitendfullscreen", syncFullscreenButton);

    if (fsBtn) {
        fsBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggleFullscreen();
        });
    }

    /* Double-clicking the frame toggles full screen, as users expect */
    frame.addEventListener("dblclick", function (event) {
        if (player.hidden) return;
        event.preventDefault();
        toggleFullscreen();
    });

    /* ======================================================================
       FOCUS TRAP
    ====================================================================== */

    function focusables() {
        return Array.prototype.filter.call(
            modal.querySelectorAll(
                'button:not([disabled]), a[href], input, select, textarea, video, [tabindex]:not([tabindex="-1"])'
            ),
            function (el) { return !el.hidden && el.offsetParent !== null; }
        );
    }

    function trapFocus(event) {

        if (event.key !== "Tab") return;

        var list = focusables();
        if (!list.length) return;

        var first = list[0];
        var last = list[list.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    /* ======================================================================
       OPEN
    ====================================================================== */

    function openModal(card) {

        lastFocused = document.activeElement;

        var data = card.dataset;

        setText(categoryEl, data.category, "Medical Procedure");
        setText(titleEl,    data.title,    "Procedure Video");
        setText(subtitleEl, data.subtitle,
                "Performed using modern equipment and evidence-based techniques.");

        renderPills(metaEl,     data.meta,     "fa-solid fa-circle-info");
        renderPills(featuresEl, data.features, "fa-solid fa-check");

        modal.classList.remove("portrait-video", "landscape-video", "square-video");
        frame.style.removeProperty("--video-ar");

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        lockScroll();

        closeBtn.focus();

        var src = (data.video || "").trim();

        if (!src) {
            showPlaceholder();
            return;
        }

        hidePlaceholder();
        showLoading();

        if (data.poster) player.setAttribute("poster", data.poster);
        else player.removeAttribute("poster");

        if (source) source.src = src;
        player.setAttribute("src", src);
        player.load();

        player.onloadedmetadata = applyAspectRatio;

        player.oncanplay = function () {
            hideLoading();
            player.hidden = false;
            applyAspectRatio();
            var p = player.play();
            if (p && typeof p.catch === "function") {
                p.catch(function () { /* autoplay blocked, controls are there */ });
            }
        };

        player.onerror = showPlaceholder;

        syncFullscreenButton();
    }

    /* ======================================================================
       CLOSE
    ====================================================================== */

    function closeModal() {

        if (isFullscreen()) exitFullscreen();

        modal.classList.remove("active", "portrait-video", "landscape-video",
                               "square-video", "is-fullscreen");
        modal.setAttribute("aria-hidden", "true");

        unlockScroll();
        hideLoading();

        player.pause();
        try { player.currentTime = 0; } catch (e) {}

        player.onloadedmetadata = null;
        player.oncanplay = null;
        player.onerror = null;

        player.removeAttribute("src");
        player.removeAttribute("poster");
        if (source) source.src = "";
        player.load();
        player.hidden = true;

        if (placeholder) placeholder.hidden = true;
        frame.style.removeProperty("--video-ar");
        frame.classList.remove("is-placeholder", "is-fullscreen");

        if (metaEl) metaEl.innerHTML = "";
        if (featuresEl) featuresEl.innerHTML = "";

        if (lastFocused && typeof lastFocused.focus === "function") {
            lastFocused.focus();
        }
    }

    /* ======================================================================
       TRIGGERS
    ====================================================================== */

    cards.forEach(function (card) {

        var thumb = card.querySelector(".video-thumb");
        var button = card.querySelector(".doctor-btn");

        if (!card.dataset.video && thumb) thumb.classList.add("no-video");

        function handler(event) {
            event.preventDefault();
            openModal(card);
        }

        if (thumb) {
            thumb.addEventListener("click", handler);
            thumb.setAttribute("role", "button");
            thumb.setAttribute("tabindex", "0");
            thumb.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") handler(event);
            });
        }

        if (button) button.addEventListener("click", handler);
    });

    /* ======================================================================
       CLOSE INTERACTIONS
    ====================================================================== */

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {

        if (!modal.classList.contains("active")) return;

        if (event.key === "Escape") {
            /* Let the browser take Escape out of full screen first; only
               close the modal on a second press. */
            if (isFullscreen()) return;
            closeModal();
            return;
        }

        /* "f" toggles full screen, like every other video player */
        if ((event.key === "f" || event.key === "F") &&
            !event.metaKey && !event.ctrlKey && !event.altKey &&
            !player.hidden &&
            document.activeElement.tagName !== "INPUT") {
            event.preventDefault();
            toggleFullscreen();
            return;
        }

        trapFocus(event);
    });

    modal.addEventListener("touchmove", function (event) {
        if (event.target === modal) event.preventDefault();
    }, { passive: false });

    player.addEventListener("ended", function () {
        try { player.currentTime = 0; } catch (e) {}
    });

    window.addEventListener("resize", function () {
        if (modal.classList.contains("active") && player.videoWidth) {
            applyAspectRatio();
        }
    });

    /* Re-label the full-screen button when the site language changes */
    document.addEventListener("care:languagechange", syncFullscreenButton);

    /* ======================================================================
       INITIAL STATE
    ====================================================================== */

    hideLoading();
    player.hidden = true;
    if (placeholder) placeholder.hidden = true;
    if (fsBtn) fsBtn.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    syncFullscreenButton();

});
