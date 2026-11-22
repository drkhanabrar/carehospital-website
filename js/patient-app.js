/* ==========================================================================
   📲 Care-Connect download links (home page band + app.html)
   Reads assets/data/patient-app.js (window.CARE_APP).
   ========================================================================== */
(function () {
    "use strict";
    function run() {
        var A = window.CARE_APP || { apk: "downloads/Care-Connect.apk" };
        var links = document.querySelectorAll("[data-app-apk]");
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute("href", A.apk);
            links[i].setAttribute("download", "Care-Connect.apk");
            links[i].setAttribute("type", "application/vnd.android.package-archive");
        }
        var meta = document.querySelectorAll("[data-app-meta]");
        for (var j = 0; j < meta.length; j++) meta[j].textContent = "Android · v" + (A.version || "") + (A.size ? " · " + A.size : "");
        var addr = document.querySelectorAll("[data-app-addr]");
        for (var k = 0; k < addr.length; k++) {
            var box = addr[k];
            if (!A.address) { box.hidden = true; continue; }
            box.hidden = false;
            var code = box.querySelector("code"), btn = box.querySelector("button");
            if (code) code.textContent = A.address;
            if (btn) btn.onclick = function () {
                var b = this;
                var done = function () { var t = b.textContent; b.textContent = "✓"; setTimeout(function () { b.textContent = t; }, 1500); };
                try { navigator.clipboard.writeText(A.address).then(done, done); } catch (e) { done(); }
            };
        }
        var ipa = document.querySelectorAll("[data-app-ipa]");
        for (var q = 0; q < ipa.length; q++) if (A.ipa) ipa[q].setAttribute("href", A.ipa);
        var iphone = document.querySelectorAll("[data-app-web]");
        for (var m = 0; m < iphone.length; m++) { if (A.address) { iphone[m].setAttribute("href", A.address); iphone[m].hidden = false; } else iphone[m].hidden = true; }
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
