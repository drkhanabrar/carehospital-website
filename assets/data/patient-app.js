/* ==========================================================================
   CARE — the patient app "Care-Connect" (used by app.html, the home page band
   and the 💬 assistant). CARE Workstation → Settings → 🌐 Website → "Publish"
   rewrites this file and downloads/Care-Connect.apk by itself.
   ========================================================================== */
window.CARE_APP = {
    name: "Care-Connect",
    apk: "downloads/Care-Connect.apk",      // the Android app, on this website
    version: "3.24.0",
    size: "2.1 MB",
    // the hospital's app address (the CARE server; the Android app uses the same). Empty = "printed on your prescription".
    address: "https://emr.carehospital.in/p/",
    // the iPhone / iPad app file — ONLY for jailbroken devices (or sideloading with an Apple ID)
    ipa: "downloads/Care-Connect-iOS-arm64.ipa"
};
