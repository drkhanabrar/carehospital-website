/* ==========================================================================
   ⭐ Patient reviews — only real ones (assets/data/reviews.js)
   ========================================================================== */
(function () {
    "use strict";
    var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
    var ini = function (n) { return String(n || "").replace(/[^A-Za-zऀ-ॿ؀-ۿ ]/g, " ").trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase(); };
    var month = function (d) { if (!/^\d{4}-\d{2}/.test(d || "")) return d || ""; try { return new Date(d.slice(0, 7) + "-15").toLocaleDateString("en-IN", { month: "long", year: "numeric" }); } catch (e) { return d; } };
    function run() {
        var R = window.CARE_REVIEWS || { items: [] }, list = (R.items || []).filter(function (r) { return r && r.text && r.name; });
        var boxes = document.querySelectorAll("[data-reviews]");
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i], only = box.getAttribute("data-reviews"), L = only ? list.filter(function (r) { return r.doctor === only; }) : list;
            var google = R.googleUrl || "", write = R.writeUrl || google;
            if (!L.length) {
                box.classList.add("reviews-empty");
                box.innerHTML = '<div class="testimonial-card reviews-cta">' +
                    '<div class="stars" aria-hidden="true">★★★★★</div>' +
                    '<p>We show only real reviews from our patients. Read what patients say about CARE on Google, or share your own experience.</p>' +
                    '<div class="reviews-btns">' +
                    (google ? '<a class="btn-review" href="' + esc(google) + '" target="_blank" rel="noopener">⭐ Read our reviews on Google</a>' : "") +
                    (write ? '<a class="btn-review alt" href="' + esc(write) + '" target="_blank" rel="noopener">✍ Write a review</a>' : "") +
                    "</div></div>";
                continue;
            }
            box.innerHTML = L.slice(0, 9).map(function (r) {
                var n = Math.max(1, Math.min(5, +r.rating || 5));
                return '<div class="testimonial-card">' +
                    '<div class="quote-icon">❝</div>' +
                    '<div class="stars" aria-label="' + n + ' / 5">' + "★★★★★".slice(0, n) + '<span style="opacity:.25">' + "★★★★★".slice(n) + "</span></div>" +
                    "<p>" + esc(r.text) + "</p>" +
                    '<div class="patient"><div class="patient-avatar">' + esc(ini(r.name)) + "</div>" +
                    '<div class="patient-info"><h4>' + esc(r.name) + "</h4>" +
                    '<span class="verified">' + (r.source === "Google" ? "Google review" : "✓ Care-Connect patient") + "</span>" +
                    '<div class="patient-meta">' + (r.dept ? '<span class="department-tag">' + esc(r.dept) + "</span>" : "") + (r.date ? "<span>" + esc(month(r.date)) + "</span>" : "") + "</div>" +
                    "</div></div></div>";
            }).join("") + (google ? '<p class="reviews-more"><a href="' + esc(google) + '" target="_blank" rel="noopener">⭐ More reviews on Google</a></p>' : "");
        }
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
