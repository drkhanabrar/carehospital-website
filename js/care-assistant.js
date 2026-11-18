/* ==========================================================================
   CARE — website assistant (💬 bottom-left button)
   --------------------------------------------------------------------------
   Answers visitors' questions about the clinic: departments, doctors,
   timings, address, phone, how to book.

   • Basic mode (always works, even offline / from file://): the answers come
     from THIS page — the address, hours, departments, procedures, facilities
     and window.CARE_DOCTORS. Nothing is sent anywhere.
   • AI mode (optional): set data-server on the <script> tag to the CARE
     server's internet address, e.g.
        <script src="js/care-assistant.js" data-server="https://care.example.in" defer></script>
     and switch on Settings → 📱 Patient app → 🌐 Website assistant on the
     CARE server. Questions then go to /api/pt/siteai, which knows only clinic
     facts — never patient records or staff tools. If the server is off or
     unreachable, the basic answers are used.

   It never asks for or stores names, phone numbers or health details.
   ========================================================================== */
(function () {
    "use strict";

    var SCRIPT = document.currentScript || (function () { var s = document.getElementsByTagName("script"); for (var i = s.length - 1; i >= 0; i--) if (/care-assistant\.js/.test(s[i].src)) return s[i]; return null; })();
    var SERVER = ((SCRIPT && SCRIPT.getAttribute("data-server")) || window.CARE_ASSISTANT_SERVER || "").replace(/\/+$/, "");
    var PHONE = "+919370111449", WA = "919370111449";

    var L = {
        en: { title: "CARE Assistant", sub: "Clinic information · not medical advice", hello: "Hello! 👋 Ask me about our doctors, departments, timings, address or how to book an appointment.", type: "Type your question…", send: "Send", call: "Call", wa: "WhatsApp", book: "Book appointment",
              chips: ["Timings", "Address", "Doctors", "Departments", "Book appointment"],
              timings: "🕒 Our timings:", address: "📍 Address:", doctors: "👨‍⚕️ Our doctors:", depts: "🏥 Departments:", procs: "🔬 Procedures:", facil: "🏨 Facilities:", bookTxt: "📅 You can book with the “Book Appointment” form on this page, or call / WhatsApp us.", phoneTxt: "📞 Phone & WhatsApp:", email: "✉ Email:",
              unsure: "I'm not sure about that. Please call or WhatsApp us — the reception will help you.", medical: "I can't give medical advice here. Please book a consultation so the doctor can examine you.", records: "For your own prescriptions, reports, token or bookings please use the Care-Connect patient app, or call the reception.",
              emergency: "🚑 This may be an emergency. Please call us now, or call 108 / 112, or go to the nearest emergency department.", thinking: "…", note: "Answers are general clinic information. Do not share personal health details here." },
        hi: { title: "CARE सहायक", sub: "क्लिनिक की जानकारी · चिकित्सा सलाह नहीं", hello: "नमस्ते! 👋 हमारे डॉक्टर, विभाग, समय, पता या अपॉइंटमेंट के बारे में पूछिए।", type: "अपना सवाल लिखें…", send: "भेजें", call: "कॉल", wa: "व्हाट्सऐप", book: "अपॉइंटमेंट बुक करें",
              chips: ["समय", "पता", "डॉक्टर", "विभाग", "अपॉइंटमेंट"],
              timings: "🕒 हमारा समय:", address: "📍 पता:", doctors: "👨‍⚕️ हमारे डॉक्टर:", depts: "🏥 विभाग:", procs: "🔬 प्रोसीजर:", facil: "🏨 सुविधाएँ:", bookTxt: "📅 इस पेज पर “Book Appointment” फ़ॉर्म से बुक करें, या कॉल / व्हाट्सऐप करें।", phoneTxt: "📞 फ़ोन और व्हाट्सऐप:", email: "✉ ईमेल:",
              unsure: "इसके बारे में मुझे पक्का नहीं पता। कृपया कॉल या व्हाट्सऐप करें — रिसेप्शन आपकी मदद करेगा।", medical: "यहाँ मैं चिकित्सा सलाह नहीं दे सकता। कृपया डॉक्टर से परामर्श बुक करें।", records: "अपने पर्चे, रिपोर्ट, टोकन या बुकिंग के लिए Care-Connect मरीज़ ऐप का उपयोग करें, या रिसेप्शन को कॉल करें।",
              emergency: "🚑 यह इमरजेंसी हो सकती है। अभी हमें कॉल करें, या 108 / 112 पर कॉल करें, या नज़दीकी इमरजेंसी में जाएँ।", thinking: "…", note: "जवाब क्लिनिक की सामान्य जानकारी हैं। यहाँ अपनी निजी स्वास्थ्य जानकारी न लिखें।" },
        ur: { title: "CARE مددگار", sub: "کلینک کی معلومات · طبی مشورہ نہیں", hello: "السلام علیکم! 👋 ہمارے ڈاکٹر، شعبے، اوقات، پتہ یا اپائنٹمنٹ کے بارے میں پوچھیں۔", type: "اپنا سوال لکھیں…", send: "بھیجیں", call: "کال", wa: "واٹس ایپ", book: "اپائنٹمنٹ بک کریں",
              chips: ["اوقات", "پتہ", "ڈاکٹر", "شعبے", "اپائنٹمنٹ"],
              timings: "🕒 ہمارے اوقات:", address: "📍 پتہ:", doctors: "👨‍⚕️ ہمارے ڈاکٹر:", depts: "🏥 شعبے:", procs: "🔬 پروسیجر:", facil: "🏨 سہولیات:", bookTxt: "📅 اس صفحے پر “Book Appointment” فارم سے بک کریں، یا کال / واٹس ایپ کریں۔", phoneTxt: "📞 فون اور واٹس ایپ:", email: "✉ ای میل:",
              unsure: "مجھے اس کا یقین نہیں۔ براہ کرم کال یا واٹس ایپ کریں — ریسیپشن آپ کی مدد کرے گا۔", medical: "یہاں میں طبی مشورہ نہیں دے سکتا۔ براہ کرم ڈاکٹر سے مشورہ بک کریں۔", records: "اپنے نسخے، رپورٹ، ٹوکن یا بکنگ کے لیے Care-Connect مریض ایپ استعمال کریں، یا ریسیپشن کو کال کریں۔",
              emergency: "🚑 یہ ایمرجنسی ہو سکتی ہے۔ ابھی ہمیں کال کریں، یا 108 / 112 پر کال کریں، یا قریبی ایمرجنسی میں جائیں۔", thinking: "…", note: "جوابات کلینک کی عمومی معلومات ہیں۔ یہاں اپنی ذاتی صحت کی تفصیل نہ لکھیں۔" }
    };
    function lang() { try { var l = window.CARE && window.CARE.i18n && window.CARE.i18n.get(); if (L[l]) return l; } catch (e) { /* */ } return "en"; }
    function T(k) { return (L[lang()] || L.en)[k] || L.en[k]; }
    function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
    function txt(el) { return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : ""; }
    function list(sel, root) { var out = [], n = (root || document).querySelectorAll(sel); for (var i = 0; i < n.length; i++) { var t = txt(n[i]); if (t && out.indexOf(t) < 0) out.push(t); } return out; }

    // ---- what the page itself says (read once from the page, in the language it was loaded in)
    var F = null;
    function facts() {
        if (F) return F;
        F = { address: "", hours: [], phone: PHONE, emails: [], depts: [], procs: [], facil: [], doctors: [] };
        var items = document.querySelectorAll(".findus-item");
        for (var i = 0; i < items.length; i++) {
            var lab = txt(items[i].querySelector(".findus-label")).toLowerCase();
            if (/address/.test(lab)) F.address = txt(items[i].querySelector("p"));
            if (/email/.test(lab)) F.emails = list("a", items[i]);
            if (/hours/.test(lab)) { var rows = items[i].querySelectorAll("tr"); for (var r = 0; r < rows.length; r++) F.hours.push(list("td", rows[r]).join(": ")); }
        }
        if (!F.hours.length) F.hours = ["Monday – Saturday: 11:30 AM – 9:00 PM", "Sunday: Emergency only", "Emergency care: 24/7"];
        if (!F.address) F.address = "Care ENT Clinic & Maternity Home, Police Station Road, Chikhli, Buldhana District, Maharashtra – 443201";
        F.depts = list("#departments .department-card h3");
        F.procs = list(".procedure-card h3").slice(0, 12);
        F.facil = list(".onsite-card h3, .facility-card h3").slice(0, 14);
        var D = window.CARE_DOCTORS || {};
        for (var k in D) if (Object.prototype.hasOwnProperty.call(D, k)) F.doctors.push({ id: k, name: D[k].name, what: D[k].designation || D[k].specialty || "" });
        if (!F.doctors.length) {   // the home page: the doctor cards
            var cards = document.querySelectorAll(".doctor-info");
            for (var c = 0; c < cards.length; c++) {
                var a = cards[c].parentNode && cards[c].parentNode.querySelector('a[href*="doctor.html?id="]');
                var id = a ? (a.getAttribute("href").split("id=")[1] || "").split("&")[0] : "";
                F.doctors.push({ id: id, name: txt(cards[c].querySelector("h3")), what: txt(cards[c].querySelector(".designation")) });
            }
        }
        return F;
    }

    // ---- basic answers (no server)
    var RX = {
        emergency: /chest\s*pain|can'?t\s*breathe|breathless|unconscious|faint|seizure|heavy\s*bleeding|poison|suicid|सीने\s*में\s*दर्द|सांस\s*नहीं|बेहोश|ज़हर|जहर|سینے\s*میں\s*درد|سانس\s*نہیں|بے\s*ہوش/i,
        records: /my\s*(report|prescription|token|booking|appointment status|bill)|report\s*ready|मेरी\s*रिपोर्ट|मेरा\s*पर्चा|टोकन|میری\s*رپورٹ|ٹوکن/i,
        medical: /what\s*(medicine|tablet|dose)|which\s*medicine|should\s*i\s*take|treatment\s*for|cure\s*for|dosage|कौन\s*सी\s*दवा|दवा\s*बताओ|इलाज\s*बताओ|کون\s*سی\s*دوا|علاج\s*بتائیں/i,
        hours: /time|timing|hour|open|close|sunday|when|समय|टाइम|कब|खुला|रविवार|اوقات|وقت|کب|اتوار/i,
        address: /address|where|location|map|direction|reach|chikhli|पता|कहाँ|कहां|लोकेशन|पता\s*बताओ|پتہ|کہاں|لوکیشن/i,
        phone: /phone|call|number|contact|whatsapp|mobile|email|फ़ोन|फोन|नंबर|संपर्क|व्हाट्सऐप|فون|نمبر|رابطہ|واٹس/i,
        book: /book|appointment|consult|visit|token|बुक|अपॉइंटमेंट|अपॉइंटमेंट|दिखाना|بک|اپائنٹمنٹ/i,
        doctors: /doctor|dr\.?|specialist|surgeon|gyn|ent\b|डॉक्टर|डॉ|ڈاکٹر/i,
        depts: /department|service|treat|ent|ear|nose|throat|matern|pregnan|gyn|skin|hair|hijama|lab|test|डिपार्टमेंट|विभाग|सेवा|कान|नाक|गला|डिलीवरी|गर्भ|त्वचा|बाल|जाँच|شعب|سروس|کان|ناک|گلا|جلد/i,
        procs: /procedure|endoscop|wax|mole|derma|foreign|प्रोसीजर|एंडोस्कोपी|मैल|مسہ|پروسیجر/i,
        facil: /facilit|pharmacy|medical\s*store|bed|admit|ecg|doppler|सुविधा|दवाखाना|फार्मेसी|भर्ती|سہولت|فارمیسی|داخلہ/i
    };
    function ul(a) { return "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
    function basic(q) {
        var f = facts(), out = [];
        if (RX.emergency.test(q)) return "<p><b>" + esc(T("emergency")) + "</b></p>";
        if (RX.records.test(q)) return "<p>" + esc(T("records")) + "</p>";
        if (RX.medical.test(q)) out.push("<p>" + esc(T("medical")) + "</p>");
        if (RX.hours.test(q)) out.push("<p><b>" + esc(T("timings")) + "</b></p>" + ul(f.hours));
        if (RX.address.test(q)) out.push("<p><b>" + esc(T("address")) + "</b> " + esc(f.address) + "</p><p><a href=\"https://www.google.com/maps/dir/?api=1&destination=20.3496273%2C76.2549318\" target=\"_blank\" rel=\"noopener\">🗺 Google Maps</a></p>");
        if (RX.phone.test(q)) out.push("<p><b>" + esc(T("phoneTxt")) + "</b> <a href=\"tel:" + PHONE + "\">+91 93701 11449</a></p>" + (f.emails.length ? "<p><b>" + esc(T("email")) + "</b> " + f.emails.map(function (e) { return "<a href=\"mailto:" + esc(e) + "\">" + esc(e) + "</a>"; }).join(", ") + "</p>" : ""));
        if (RX.doctors.test(q) && f.doctors.length) out.push("<p><b>" + esc(T("doctors")) + "</b></p><ul>" + f.doctors.map(function (d) { return "<li>" + (d.id ? "<a href=\"doctor.html?id=" + encodeURIComponent(d.id) + "\">" + esc(d.name) + "</a>" : "<b>" + esc(d.name) + "</b>") + (d.what ? " — " + esc(d.what) : "") + "</li>"; }).join("") + "</ul>");
        if (RX.procs.test(q) && f.procs.length) out.push("<p><b>" + esc(T("procs")) + "</b></p>" + ul(f.procs));
        else if (RX.depts.test(q) && f.depts.length) out.push("<p><b>" + esc(T("depts")) + "</b></p>" + ul(f.depts));
        if (RX.facil.test(q) && f.facil.length) out.push("<p><b>" + esc(T("facil")) + "</b></p>" + ul(f.facil));
        if (RX.book.test(q)) out.push("<p>" + esc(T("bookTxt")) + "</p>");
        return out.length ? out.join("") : "<p>" + esc(T("unsure")) + "</p>";
    }

    // ---- AI answers from the CARE server (clinic facts only), basic answers if it is off / unreachable
    var history = [];
    function askServer(q) {
        return new Promise(function (resolve) {
            if (!SERVER || !window.fetch) return resolve(null);
            var done = false, timer = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 25000);
            fetch(SERVER + "/api/pt/siteai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, history: history.slice(-4), lang: lang() }), credentials: "omit", mode: "cors" })
                .then(function (r) { return r.json(); })
                .then(function (j) { if (done) return; done = true; clearTimeout(timer); resolve(j && j.ok && j.answer ? j.answer : null); })
                .catch(function () { if (done) return; done = true; clearTimeout(timer); resolve(null); });
        });
    }
    function aiHtml(a) {
        var lines = String(a).split("\n"), out = "", inList = false;
        for (var i = 0; i < lines.length; i++) {
            var ln = lines[i], m = ln.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
            var fmt = function (s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"); };
            if (m) { if (!inList) { out += "<ul>"; inList = true; } out += "<li>" + fmt(m[1]) + "</li>"; continue; }
            if (inList) { out += "</ul>"; inList = false; }
            if (ln.trim()) out += "<p>" + fmt(ln.replace(/^#+\s*/, "")) + "</p>";
        }
        return out + (inList ? "</ul>" : "");
    }

    // ---- the widget
    var root, logEl, input, opened = false;
    function build() {
        facts();
        root = document.createElement("div");
        root.className = "care-asst";
        root.setAttribute("data-no-translate", "");
        root.innerHTML =
            '<button type="button" class="care-asst-fab" aria-label="Chat"><span aria-hidden="true">💬</span></button>' +
            '<div class="care-asst-panel" role="dialog" aria-modal="false" hidden>' +
            '<div class="care-asst-head"><div><b class="ca-title"></b><small class="ca-sub"></small></div><button type="button" class="care-asst-x" aria-label="Close">✕</button></div>' +
            '<div class="care-asst-log" aria-live="polite"></div>' +
            '<div class="care-asst-chips"></div>' +
            '<form class="care-asst-form"><input type="text" maxlength="500" autocomplete="off"><button type="submit" class="ca-send"></button></form>' +
            '<div class="care-asst-foot"><a class="ca-call" href="tel:' + PHONE + '"></a><a class="ca-wa" href="https://wa.me/' + WA + '" target="_blank" rel="noopener"></a><small class="ca-note"></small></div>' +
            "</div>";
        document.body.appendChild(root);
        logEl = root.querySelector(".care-asst-log"); input = root.querySelector("input");
        root.querySelector(".care-asst-fab").onclick = toggle;
        root.querySelector(".care-asst-x").onclick = toggle;
        root.querySelector("form").onsubmit = function (e) { e.preventDefault(); send(input.value); };
        document.addEventListener("keydown", function (e) { if (opened && e.key === "Escape") toggle(); });
        paintText();
        // the language switch of the page also switches the widget
        try { new MutationObserver(paintText).observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir"] }); } catch (e) { /* old browser */ }
    }
    function paintText() {
        if (!root) return;
        var l = lang();
        root.setAttribute("dir", l === "ur" ? "rtl" : "ltr");
        root.querySelector(".ca-title").textContent = T("title");
        root.querySelector(".ca-sub").textContent = T("sub");
        root.querySelector(".ca-send").textContent = T("send");
        root.querySelector(".ca-call").textContent = "📞 " + T("call");
        root.querySelector(".ca-wa").textContent = "💬 " + T("wa");
        root.querySelector(".ca-note").textContent = T("note");
        input.placeholder = T("type");
        var ch = root.querySelector(".care-asst-chips"), c = T("chips");
        ch.innerHTML = c.map(function (x) { return '<button type="button">' + esc(x) + "</button>"; }).join("");
        var b = ch.querySelectorAll("button"); for (var i = 0; i < b.length; i++) b[i].onclick = (function (x) { return function () { send(x); }; })(c[i]);
    }
    function add(cls, html) { var d = document.createElement("div"); d.className = "ca-msg " + cls; d.innerHTML = html; logEl.appendChild(d); logEl.scrollTop = logEl.scrollHeight; return d; }
    function toggle() {
        opened = !opened;
        root.querySelector(".care-asst-panel").hidden = !opened;
        root.classList.toggle("open", opened);
        if (opened && !logEl.children.length) add("ca-bot", "<p>" + esc(T("hello")) + "</p>");
        if (opened) setTimeout(function () { try { input.focus(); } catch (e) { /* */ } }, 50);
    }
    var busy = false;
    function send(q) {
        q = String(q || "").trim().slice(0, 500);
        if (!q || busy) return;
        input.value = ""; busy = true;
        add("ca-me", esc(q));
        var wait = add("ca-bot", "<p>" + esc(T("thinking")) + "</p>");
        if (RX.emergency.test(q)) { wait.innerHTML = basic(q); busy = false; return; }
        askServer(q).then(function (a) {
            wait.innerHTML = a ? aiHtml(a) : basic(q);
            history.push({ who: "me", text: q }, { who: "ai", text: a || wait.textContent.slice(0, 600) });
            history = history.slice(-8);
            logEl.scrollTop = logEl.scrollHeight; busy = false;
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
    window.CARE = window.CARE || {};
    window.CARE.assistant = { open: function () { if (!opened) toggle(); }, ask: function (q) { if (!opened) toggle(); send(q); }, _basic: basic };
})();
