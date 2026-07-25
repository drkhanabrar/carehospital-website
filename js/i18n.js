"use strict";

/* ==========================================================================
   CARE — MULTILINGUAL ENGINE  (English / हिन्दी / اردو)
   --------------------------------------------------------------------------
   How it works
     • Every text node and every user-visible attribute is captured ONCE, in
       its original English, into a cache keyed on the node itself.
     • Switching language re-renders from that cache, so you can move
       en → hi → ur → en any number of times without the text degrading.
     • A MutationObserver re-translates anything injected later (doctor
       profiles, search results, video-modal meta, form errors), so dynamic
       content is covered automatically.
     • Urdu flips the document to RTL (dir="rtl") and swaps in a
       Nastaliq-capable font stack; see css/i18n.css.
     • The choice is remembered in localStorage and re-applied before paint
       on the next visit.

   Public API
     CARE.i18n.set("hi")        switch language
     CARE.i18n.get()            current language code
     CARE.i18n.t("English")     translate a single string (for use in JS)
   ========================================================================== */

(function () {

    /* ======================================================================
       CONFIG
    ====================================================================== */

    var LANGS = {
        en: { label: "English",  native: "English", dir: "ltr", htmlLang: "en" },
        hi: { label: "Hindi",    native: "हिन्दी",   dir: "ltr", htmlLang: "hi" },
        ur: { label: "Urdu",     native: "اردو",     dir: "rtl", htmlLang: "ur" }
    };

    var STORAGE_KEY = "care-lang";
    var DEFAULT_LANG = "en";

    /* Never touch the contents of these */
    var SKIP_TAGS = {
        SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1,
        TEXTAREA: 1, SVG: 1, TEMPLATE: 1
    };

    /* Attributes that hold user-visible text */
    var ATTRS = ["placeholder", "aria-label", "title", "alt", "aria-placeholder", "value"];

    /* `value` is only translated on buttons, never on inputs the user types in */
    function attrAllowed(el, attr) {
        if (attr !== "value") return true;
        return el.tagName === "BUTTON" ||
               (el.tagName === "INPUT" && /^(button|submit|reset)$/i.test(el.type || ""));
    }

    /* ======================================================================
       STATE
    ====================================================================== */

    var dict = window.CARE_I18N || { hi: {}, ur: {} };
    var current = DEFAULT_LANG;

    /* Original-English caches. WeakMap => no leaks when nodes are replaced. */
    var textCache = new WeakMap();   // textNode -> original string
    var attrCache = new WeakMap();   // element  -> { attr: original string }

    var observer = null;
    var pendingNodes = [];
    var flushScheduled = false;

    /* ======================================================================
       LOOKUP
    ====================================================================== */

    function normalise(str) {
        return str.replace(/\s+/g, " ").trim();
    }

    function lookup(str, lang) {
        if (lang === "en") return null;
        var table = dict[lang];
        if (!table) return null;
        var key = normalise(str);
        if (!key) return null;
        return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : null;
    }

    /* Public single-string translator, for strings built inside JS */
    function t(str, lang) {
        var hit = lookup(str, lang || current);
        return hit === null ? str : hit;
    }

    /* ======================================================================
       SHOULD THIS NODE BE TRANSLATED?
    ====================================================================== */

    function isSkipped(el) {
        while (el && el.nodeType === 1) {
            if (SKIP_TAGS[el.tagName]) return true;
            if (el.hasAttribute("data-no-translate")) return true;
            if (el.getAttribute("translate") === "no") return true;
            el = el.parentElement;
        }
        return false;
    }

    /* ======================================================================
       APPLY TO A SINGLE TEXT NODE
    ====================================================================== */

    function applyText(node, lang) {

        var original = textCache.get(node);

        if (original === undefined) {
            /* First time we've seen this node — its current content is the
               English source of truth. */
            original = node.nodeValue;
            if (!normalise(original)) return;      // whitespace only
            textCache.set(node, original);
        }

        var hit = lookup(original, lang);

        /* Preserve the node's original leading/trailing whitespace so inline
           layout (e.g. "Emergency :" followed by a link) doesn't collapse. */
        if (hit === null) {
            if (node.nodeValue !== original) node.nodeValue = original;
            return;
        }

        var lead = (original.match(/^\s*/) || [""])[0];
        var tail = (original.match(/\s*$/) || [""])[0];
        var next = lead + hit + tail;

        if (node.nodeValue !== next) node.nodeValue = next;
    }

    /* ======================================================================
       APPLY TO AN ELEMENT'S ATTRIBUTES
    ====================================================================== */

    function applyAttrs(el, lang) {

        var store = attrCache.get(el);

        for (var i = 0; i < ATTRS.length; i++) {

            var attr = ATTRS[i];
            if (!el.hasAttribute(attr) || !attrAllowed(el, attr)) continue;

            if (!store) { store = {}; attrCache.set(el, store); }

            if (store[attr] === undefined) store[attr] = el.getAttribute(attr);

            var original = store[attr];
            var hit = lookup(original, lang);
            var next = hit === null ? original : hit;

            if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
        }
    }

    /* ======================================================================
       WALK A SUBTREE
    ====================================================================== */

    function translateTree(root, lang) {

        if (!root) return;

        if (root.nodeType === 3) {                       // text node
            if (!isSkipped(root.parentElement)) applyText(root, lang);
            return;
        }

        if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
        if (root.nodeType === 1 && isSkipped(root)) return;

        if (root.nodeType === 1) applyAttrs(root, lang);

        var walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function (node) {
                    var el = node.nodeType === 3 ? node.parentElement : node;
                    if (el && SKIP_TAGS[el.tagName]) return NodeFilter.FILTER_REJECT;
                    if (el && el.nodeType === 1 &&
                        (el.hasAttribute("data-no-translate") ||
                         el.getAttribute("translate") === "no")) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        var node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === 3) applyText(node, lang);
            else applyAttrs(node, lang);
        }
    }

    /* ======================================================================
       DOCUMENT-LEVEL CHROME (lang, dir, <title>, meta description)
    ====================================================================== */

    function applyDocumentChrome(lang) {

        var cfg = LANGS[lang] || LANGS.en;
        var html = document.documentElement;

        html.setAttribute("lang", cfg.htmlLang);
        html.setAttribute("dir", cfg.dir);
        html.setAttribute("data-lang", lang);

        /* <title> */
        if (!document.documentElement.dataset.titleEn) {
            document.documentElement.dataset.titleEn = document.title;
        }
        document.title = t(document.documentElement.dataset.titleEn, lang);

        /* meta description */
        var meta = document.querySelector('meta[name="description"]');
        if (meta) {
            if (!meta.dataset.en) meta.dataset.en = meta.getAttribute("content") || "";
            meta.setAttribute("content", t(meta.dataset.en, lang));
        }
    }

    /* ======================================================================
       MUTATION OBSERVER — covers dynamically injected content
    ====================================================================== */

    function flushPending() {

        flushScheduled = false;

        var nodes = pendingNodes;
        pendingNodes = [];

        if (current === "en") return;

        /* Pause the observer while we write, or we'd re-trigger ourselves */
        var wasObserving = !!observer;
        if (wasObserving) observer.disconnect();

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].isConnected) translateTree(nodes[i], current);
        }

        if (wasObserving) startObserving();
    }

    function queue(node) {
        pendingNodes.push(node);
        if (!flushScheduled) {
            flushScheduled = true;
            (window.requestAnimationFrame || setTimeout)(flushPending, 0);
        }
    }

    function startObserving() {
        if (!observer) return;
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: false
        });
    }

    function initObserver() {

        if (!("MutationObserver" in window)) return;

        observer = new MutationObserver(function (records) {
            if (current === "en") return;
            for (var i = 0; i < records.length; i++) {
                var added = records[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    var n = added[j];
                    if (n.nodeType === 1 || n.nodeType === 3) queue(n);
                }
            }
        });

        startObserving();
    }

    /* ======================================================================
       SET LANGUAGE
    ====================================================================== */

    function setLanguage(lang, opts) {

        if (!LANGS[lang]) lang = DEFAULT_LANG;

        opts = opts || {};
        current = lang;

        if (observer) observer.disconnect();

        applyDocumentChrome(lang);
        translateTree(document.body, lang);

        startObserving();

        if (opts.persist !== false) {
            try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
        }

        syncSwitcherUI(lang);

        document.dispatchEvent(new CustomEvent("care:languagechange", {
            detail: { lang: lang, dir: LANGS[lang].dir }
        }));
    }

    /* ======================================================================
       LANGUAGE SWITCHER UI
    ====================================================================== */

    function syncSwitcherUI(lang) {

        var cfg = LANGS[lang] || LANGS.en;

        document.querySelectorAll("[data-lang-current]").forEach(function (el) {
            el.textContent = cfg.native;
        });

        document.querySelectorAll("[data-lang-option]").forEach(function (btn) {
            var isActive = btn.getAttribute("data-lang-option") === lang;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-checked", isActive ? "true" : "false");
        });

        document.querySelectorAll(".lang-switch").forEach(function (sw) {
            sw.classList.remove("open");
            var toggle = sw.querySelector("[data-lang-toggle]");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
    }

    function initSwitcher() {

        document.addEventListener("click", function (event) {

            var toggle = event.target.closest("[data-lang-toggle]");

            if (toggle) {
                event.preventDefault();
                var wrap = toggle.closest(".lang-switch");
                if (!wrap) return;
                var open = wrap.classList.toggle("open");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
                return;
            }

            var option = event.target.closest("[data-lang-option]");

            if (option) {
                event.preventDefault();
                setLanguage(option.getAttribute("data-lang-option"));
                return;
            }

            /* Click outside closes any open dropdown */
            document.querySelectorAll(".lang-switch.open").forEach(function (sw) {
                sw.classList.remove("open");
                var tg = sw.querySelector("[data-lang-toggle]");
                if (tg) tg.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape") return;
            document.querySelectorAll(".lang-switch.open").forEach(function (sw) {
                sw.classList.remove("open");
                var tg = sw.querySelector("[data-lang-toggle]");
                if (tg) { tg.setAttribute("aria-expanded", "false"); tg.focus(); }
            });
        });
    }

    /* ======================================================================
       STARTUP
    ====================================================================== */

    function preferredLanguage() {

        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && LANGS[saved]) return saved;
        } catch (e) { /* ignore */ }

        /* First visit: honour the browser's language if we speak it */
        var nav = (navigator.language || "").toLowerCase();
        if (nav.indexOf("ur") === 0) return "ur";
        if (nav.indexOf("hi") === 0) return "hi";

        return DEFAULT_LANG;
    }

    function boot() {
        initObserver();
        initSwitcher();
        var lang = preferredLanguage();
        setLanguage(lang, { persist: false });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }

    /* ======================================================================
       EXPORT
    ====================================================================== */

    window.CARE = window.CARE || {};

    window.CARE.i18n = {
        set: setLanguage,
        get: function () { return current; },
        dir: function () { return (LANGS[current] || LANGS.en).dir; },
        t: function (str) { return t(str, current); },
        languages: LANGS,
        /* Call after injecting HTML if you want to translate it immediately
           rather than waiting for the observer's next frame. */
        refresh: function (root) {
            if (current === "en") return;
            translateTree(root || document.body, current);
        }
    };

})();
