/* ==========================================================================
   CARE — website assistant "Care Saathi" (💬 bottom-left)        v2 · 18 Nov 2026
   --------------------------------------------------------------------------
   A friendly virtual assistant for visitors of the hospital website.

   WHAT IT KNOWS (read from the website itself — nothing is typed twice)
     • doctors          assets/data/doctors.js   (profile, education, milestones,
                        expertise, treatments, timings, languages, reviews, FAQ)
     • research & dev.  assets/data/products.js  (CARE's own products, status, features, FAQ)
     • departments, procedures, facilities, why CARE, reviews, address, timings
                        (index.html — read once, also from the other pages)
     • answers the hospital approved from earlier visitors' questions (CARE server, see below)

   WHAT IT DOES
     • understands questions in English, हिन्दी, اردو (also Hinglish / Marathi words)
       and answers in the language chosen on the website (Hindi / Urdu translations
       come from the website's own dictionary);
     • remembers what you talked about ("what are HER timings?") and this visitor
       (name, language) on this browser only;
     • books an appointment in the chat (department → doctor → day → time → name →
       mobile) and sends it on WhatsApp — or straight into CARE when the hospital's
       CARE server allows website bookings;
     • 👍 / 👎 on every answer. With the CARE server connected, questions it could
       not answer are collected (phone numbers / e-mails removed) for the hospital to
       write an answer once — approved answers are then used for every visitor.
       That is how it learns, safely: nothing medical is "learnt" without a person.

   It is a VIRTUAL assistant and says so; it never gives a diagnosis, medicine or dose.

   OPTIONAL — the CARE server (smarter AI answers + learning + direct booking):
     <script src="js/care-assistant.js" data-server="https://emr.carehospital.in" defer></script>
     and CARE Workstation → Settings → 📱 Patient app → 🌐 Website assistant: ON.
     Without it everything above still works, from the website's own data.
   ========================================================================== */
(function () {
    "use strict";

    var SCRIPT = document.currentScript || (function () { var s = document.getElementsByTagName("script"); for (var i = s.length - 1; i >= 0; i--) if (/care-assistant\.js/.test(s[i].src)) return s[i]; return null; })();
    var SERVER = ((SCRIPT && SCRIPT.getAttribute("data-server")) || window.CARE_ASSISTANT_SERVER || "").replace(/\/+$/, "");
    function refreshServer() { if (!SERVER && window.CARE_ASSISTANT_SERVER) SERVER = String(window.CARE_ASSISTANT_SERVER).replace(/\/+$/, ""); }
    var BASE = SCRIPT && SCRIPT.src ? SCRIPT.src.replace(/js\/care-assistant\.js.*$/, "") : "";
    var PHONE = "+919370111449", PHONE_SHOW = "+91 93701 11449", WA = "919370111449";
    var NAME = { en: "Care Saathi", hi: "केयर साथी", ur: "کیئر ساتھی" };

    // ------------------------------------------------------------------ small helpers
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
    var txt = function (el) { return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : ""; };
    var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    var store = {
        get: function (k, d) { try { var v = localStorage.getItem("care-asst-" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
        set: function (k, v) { try { localStorage.setItem("care-asst-" + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
    };
    function siteLang() { try { var l = window.CARE && window.CARE.i18n && window.CARE.i18n.get(); if (l === "hi" || l === "ur") return l; } catch (e) { /* */ } return "en"; }
    var LANG = "en";   // the language of the current answer
    // the website's own dictionary translates data (doctor degrees, departments …) — unknown words stay as they are
    function tr(s) { if (LANG === "en" || s == null) return s; try { return window.CARE.i18n.t(String(s)) ; } catch (e) { return s; } }
    function loadScript(src) { return new Promise(function (ok) { var s = document.createElement("script"); s.src = BASE + src; s.onload = function () { ok(true); }; s.onerror = function () { ok(false); }; document.head.appendChild(s); }); }

    // ------------------------------------------------------------------ the words of the assistant (EN / HI / UR)
    var W = {
        en: {
            sub: "Virtual assistant · replies in seconds", type: "Ask me anything about the hospital…", send: "Send", call: "Call", wa: "WhatsApp", typing: "typing",
            hello: ["Hello! 👋 I'm {n}, the virtual assistant of CARE Hospital. Ask me about our doctors, departments, treatments, timings — or I can book your appointment right here.", "Namaste! 🙏 I'm {n}, CARE Hospital's virtual assistant. How can I help you today — a doctor, a treatment, our timings, or an appointment?"],
            back: "Welcome back, {v}! 😊 How can I help you today?",
            chips: ["👨‍⚕️ Our doctors", "🏥 Departments", "🕒 Timings", "📍 Location", "📅 Book appointment", "📲 Patient app", "🔬 Research & Development"],
            thanks: ["You're most welcome! 😊 Anything else I can help with?", "Happy to help! Take care. 🙏 Anything else?"],
            bye: ["Take care! Wishing you good health. 🙏 You can open me any time.", "Goodbye! Stay healthy. 😊"],
            who: "I'm {n}, the virtual assistant of CARE ENT Clinic & Maternity Home, Chikhli. I know our doctors, departments, treatments, timings and research — and I can book appointments. For medical advice, our doctors are the right people. 🙂",
            emergency: "🚑 This sounds urgent. Please don't wait for a chat — call us now on {p}, or call 108 / 112, or go to the nearest emergency department.",
            medical: "I'm not able to give medical advice, medicines or doses — our doctor needs to see you for that. I can book a consultation for you right now. Shall I?",
            records: "Your own reports, prescriptions and tokens are in the Care-Connect patient app (or ask the reception on {p}). I can only see the hospital's public information.",
            unsure: ["Hmm, I'm not fully sure about that one. 🤔 Our reception will know for sure — call or WhatsApp {p}.", "Good question! I don't have that detail with me. Please call or WhatsApp {p} — they'll help you right away."],
            didYouMean: "Did you mean one of these?",
            doctorsIntro: ["We have {k} specialists at CARE:", "Here are our doctors:"],
            yrs: "years of experience", patientsTreated: "patients treated", speaks: "Speaks", viewProfile: "View full profile",
            eduTitle: "Education & milestones of {d}:", expTitle: "{d} is especially experienced in:", treatTitle: "Treatments with {d}:", timeTitle: "{d}'s OPD timings:", revTitle: "What patients say about {d}:",
            deptIntro: "CARE has these departments:", deptDoctors: "Doctor(s)", servicesTitle: "Services", procIntro: "Our advanced procedures:", facIntro: "Facilities at CARE:",
            rndIntro: "Yes! 🔬 Besides patient care, CARE builds its own healthcare software & devices (Research & Development):", rndMore: "Ask me about any one of them for details.",
            status: { available: "Available", development: "In development", planned: "Planned" },
            hoursIntro: "🕒 Our timings:", addrIntro: "📍 We're at:", mapOpen: "🗺 Open in Google Maps", contactIntro: "📞 Phone & WhatsApp:", emailIntro: "✉ Email:",
            fees: "Consultation fees can change with the type of visit, so please confirm with the reception on {p} — they'll tell you exactly. 🙂",
            whyIntro: "Why patients choose CARE:", reviewsIntro: "A few words from our patients:",
            askBook: "Would you like me to book an appointment?", yesBook: "📅 Yes, book it", moreQ: "❓ Another question",
            // booking
            bStart: "Sure! Let's book your appointment. 📅 Which department do you need?", bDoctor: "Which doctor would you like to see?", bDay: "Which day suits you? (We're closed on Sunday except emergencies.)",
            bTime: "What time works for you on {d}?", bName: "May I have the patient's full name?", bMobile: "And a 10-digit mobile number to confirm the appointment?", bProblem: "In a few words, what is the problem? (or tap Skip)",
            bSkip: "Skip", bSummary: "Please check:", bSend: "✅ Confirm on WhatsApp", bBook: "✅ Confirm booking", bEdit: "✏️ Change", bCancel: "Cancel",
            bSunday: "Sunday is emergency-only, so please pick another day. 🙂", bNoSlots: "No more slots that day — please choose another day.", bBadMobile: "That doesn't look like a 10-digit mobile number. Could you type it again?", bBadName: "Please type the full name (at least 3 letters).",
            bDoneWa: "Great! 🎉 WhatsApp is opening with your request — just press Send there. The reception will confirm your appointment shortly.", bDone: "Done! 🎉 Your appointment is booked for {d} at {t} with {doc}. Please come 15 minutes early.",
            bDept: "Department", bDoc: "Doctor", bDate: "Date", bTimeL: "Time", bNameL: "Name", bMobL: "Mobile", bProbL: "Problem", today: "Today", tomorrow: "Tomorrow", pickDate: "📅 Another date",
            appIntro: "📲 Our free patient app <b>Care-Connect</b>: your prescriptions, lab reports, appointments, live OPD token, medicine reminders and online consultation — in English, Hindi, Marathi and Urdu.", appDl: "⬇ Download for Android", appHow: "How to install / iPhone", appCode: "You'll need your patient code (printed on your prescription) the first time.",
            langNote: "🌐 You can talk to me in your own language — English, हिन्दी or اردو (Marathi and Hinglish words are fine too). Tap a language or just type:",
            feedbackThanks: "Thank you for the feedback! 🙏", feedbackBad: "Sorry about that. I've noted it so the hospital can improve my answer. You can also call {p}.",
            note: "Virtual assistant · general information only, not medical advice. Please don't share personal health details here."
        },
        hi: {
            sub: "वर्चुअल सहायक · तुरंत जवाब", type: "अस्पताल के बारे में कुछ भी पूछें…", send: "भेजें", call: "कॉल", wa: "व्हाट्सऐप", typing: "लिख रही है",
            hello: ["नमस्ते! 🙏 मैं {n} हूँ, CARE हॉस्पिटल का वर्चुअल सहायक। हमारे डॉक्टर, विभाग, इलाज, समय के बारे में पूछिए — या मैं यहीं आपका अपॉइंटमेंट बुक कर दूँ।", "नमस्ते! 😊 मैं {n}, CARE हॉस्पिटल का वर्चुअल सहायक। आज आपकी क्या मदद करूँ — डॉक्टर, इलाज, समय या अपॉइंटमेंट?"],
            back: "फिर से स्वागत है, {v}! 😊 आज क्या मदद करूँ?",
            chips: ["👨‍⚕️ हमारे डॉक्टर", "🏥 विभाग", "🕒 समय", "📍 पता", "📅 अपॉइंटमेंट बुक करें", "📲 मरीज़ ऐप", "🔬 रिसर्च और डेवलपमेंट"],
            thanks: ["आपका स्वागत है! 😊 और कुछ मदद करूँ?", "खुशी हुई मदद करके! 🙏 और कुछ?"],
            bye: ["अपना ख़याल रखिए! 🙏 जब चाहें मुझसे फिर पूछ लीजिए।", "धन्यवाद! स्वस्थ रहिए। 😊"],
            who: "मैं {n} हूँ, CARE ENT क्लिनिक और मैटरनिटी होम, चिखली का वर्चुअल सहायक। मुझे हमारे डॉक्टर, विभाग, इलाज, समय और रिसर्च की जानकारी है — और मैं अपॉइंटमेंट बुक कर सकती हूँ। चिकित्सा सलाह के लिए हमारे डॉक्टर ही सही हैं। 🙂",
            emergency: "🚑 यह इमरजेंसी लगती है। चैट का इंतज़ार न करें — अभी {p} पर कॉल करें, या 108 / 112 पर कॉल करें, या नज़दीकी इमरजेंसी में जाएँ।",
            medical: "मैं चिकित्सा सलाह, दवा या खुराक नहीं बता सकती — इसके लिए डॉक्टर को आपको देखना ज़रूरी है। मैं अभी आपका परामर्श बुक कर दूँ?",
            records: "आपकी रिपोर्ट, पर्चे और टोकन Care-Connect मरीज़ ऐप में हैं (या रिसेप्शन {p} से पूछें)। मुझे केवल अस्पताल की सार्वजनिक जानकारी दिखती है।",
            unsure: ["हम्म, इस बारे में मुझे पक्का नहीं पता। 🤔 रिसेप्शन सही बताएगा — {p} पर कॉल या व्हाट्सऐप करें।", "अच्छा सवाल! यह जानकारी अभी मेरे पास नहीं है। कृपया {p} पर कॉल या व्हाट्सऐप करें।"],
            didYouMean: "क्या आप इनमें से कुछ पूछ रहे थे?",
            doctorsIntro: ["CARE में हमारे {k} विशेषज्ञ हैं:", "हमारे डॉक्टर:"],
            yrs: "साल का अनुभव", patientsTreated: "मरीज़ों का इलाज", speaks: "भाषाएँ", viewProfile: "पूरी प्रोफ़ाइल देखें",
            eduTitle: "{d} की शिक्षा और उपलब्धियाँ:", expTitle: "{d} का ख़ास अनुभव:", treatTitle: "{d} के साथ इलाज:", timeTitle: "{d} का ओपीडी समय:", revTitle: "{d} के बारे में मरीज़ क्या कहते हैं:",
            deptIntro: "CARE के विभाग:", deptDoctors: "डॉक्टर", servicesTitle: "सेवाएँ", procIntro: "हमारे आधुनिक प्रोसीजर:", facIntro: "CARE की सुविधाएँ:",
            rndIntro: "जी हाँ! 🔬 मरीज़ों की देखभाल के साथ CARE अपने खुद के हेल्थकेयर सॉफ़्टवेयर और डिवाइस भी बनाता है (रिसर्च और डेवलपमेंट):", rndMore: "किसी के बारे में विस्तार से पूछिए।",
            status: { available: "उपलब्ध", development: "विकास में", planned: "योजना में" },
            hoursIntro: "🕒 हमारा समय:", addrIntro: "📍 हमारा पता:", mapOpen: "🗺 गूगल मैप्स में खोलें", contactIntro: "📞 फ़ोन और व्हाट्सऐप:", emailIntro: "✉ ईमेल:",
            fees: "परामर्श फ़ीस विज़िट के प्रकार के अनुसार बदल सकती है, कृपया रिसेप्शन {p} से पुष्टि करें — वे सही बताएँगे। 🙂",
            whyIntro: "मरीज़ CARE क्यों चुनते हैं:", reviewsIntro: "हमारे मरीज़ों के कुछ शब्द:",
            askBook: "क्या मैं आपका अपॉइंटमेंट बुक कर दूँ?", yesBook: "📅 हाँ, बुक करें", moreQ: "❓ और सवाल",
            bStart: "ज़रूर! चलिए अपॉइंटमेंट बुक करते हैं। 📅 किस विभाग में दिखाना है?", bDoctor: "किस डॉक्टर को दिखाना चाहेंगे?", bDay: "कौन सा दिन ठीक रहेगा? (रविवार को सिर्फ़ इमरजेंसी।)",
            bTime: "{d} को कौन सा समय ठीक रहेगा?", bName: "मरीज़ का पूरा नाम बताइए?", bMobile: "अपॉइंटमेंट की पुष्टि के लिए 10 अंकों का मोबाइल नंबर?", bProblem: "कुछ शब्दों में तकलीफ़ बताइए (या छोड़ें दबाएँ)",
            bSkip: "छोड़ें", bSummary: "कृपया जाँच लें:", bSend: "✅ व्हाट्सऐप पर पक्का करें", bBook: "✅ बुकिंग पक्की करें", bEdit: "✏️ बदलें", bCancel: "रद्द करें",
            bSunday: "रविवार को सिर्फ़ इमरजेंसी होती है, कृपया दूसरा दिन चुनें। 🙂", bNoSlots: "उस दिन और समय नहीं बचा — कृपया दूसरा दिन चुनें।", bBadMobile: "यह 10 अंकों का मोबाइल नंबर नहीं लगता। फिर से लिखेंगे?", bBadName: "कृपया पूरा नाम लिखें (कम से कम 3 अक्षर)।",
            bDoneWa: "बढ़िया! 🎉 व्हाट्सऐप आपकी रिक्वेस्ट के साथ खुल रहा है — वहाँ बस भेजें दबाएँ। रिसेप्शन जल्द ही अपॉइंटमेंट पक्का करेगा।", bDone: "हो गया! 🎉 आपका अपॉइंटमेंट {d} को {t} बजे {doc} के साथ बुक है। कृपया 15 मिनट पहले आएँ।",
            bDept: "विभाग", bDoc: "डॉक्टर", bDate: "तारीख", bTimeL: "समय", bNameL: "नाम", bMobL: "मोबाइल", bProbL: "तकलीफ़", today: "आज", tomorrow: "कल", pickDate: "📅 दूसरी तारीख",
            appIntro: "📲 हमारा मुफ़्त मरीज़ ऐप <b>Care-Connect</b>: आपके पर्चे, लैब रिपोर्ट, अपॉइंटमेंट, लाइव ओपीडी टोकन, दवा की याद और ऑनलाइन परामर्श — English, हिन्दी, मराठी और اردو में।", appDl: "⬇ Android के लिए डाउनलोड करें", appHow: "इंस्टॉल कैसे करें / iPhone", appCode: "पहली बार आपको अपना मरीज़ कोड चाहिए होगा (पर्चे पर छपा है)।",
            langNote: "🌐 आप मुझसे अपनी भाषा में बात कर सकते हैं — हिन्दी, English या اردو (मराठी और Hinglish शब्द भी चलेंगे)। भाषा चुनें या सीधे लिखें:",
            feedbackThanks: "आपकी राय के लिए धन्यवाद! 🙏", feedbackBad: "माफ़ कीजिए। मैंने नोट कर लिया है ताकि अस्पताल मेरा जवाब बेहतर कर सके। आप {p} पर कॉल भी कर सकते हैं।",
            note: "वर्चुअल सहायक · सिर्फ़ सामान्य जानकारी, चिकित्सा सलाह नहीं। यहाँ अपनी निजी स्वास्थ्य जानकारी न लिखें।"
        },
        ur: {
            sub: "ورچوئل مددگار · فوری جواب", type: "اسپتال کے بارے میں کچھ بھی پوچھیں…", send: "بھیجیں", call: "کال", wa: "واٹس ایپ", typing: "لکھ رہی ہے",
            hello: ["السلام علیکم! 👋 میں {n} ہوں، CARE ہسپتال کا ورچوئل مددگار۔ ہمارے ڈاکٹر، شعبے، علاج، اوقات کے بارے میں پوچھیں — یا میں یہیں آپ کی اپائنٹمنٹ بک کر دوں۔", "آداب! 😊 میں {n}، CARE ہسپتال کا ورچوئل مددگار۔ آج کیا مدد کروں — ڈاکٹر، علاج، اوقات یا اپائنٹمنٹ؟"],
            back: "دوبارہ خوش آمدید، {v}! 😊 آج کیا مدد کروں؟",
            chips: ["👨‍⚕️ ہمارے ڈاکٹر", "🏥 شعبے", "🕒 اوقات", "📍 پتہ", "📅 اپائنٹمنٹ بک کریں", "📲 مریض ایپ", "🔬 ریسرچ اور ڈیولپمنٹ"],
            thanks: ["آپ کا شکریہ! 😊 اور کچھ مدد کروں؟", "مدد کر کے خوشی ہوئی! 🙏 اور کچھ؟"],
            bye: ["اپنا خیال رکھیں! 🙏 جب چاہیں مجھ سے پھر پوچھ لیں۔", "خدا حافظ! صحت مند رہیں۔ 😊"],
            who: "میں {n} ہوں، CARE ENT کلینک اینڈ میٹرنٹی ہوم، چکھلی کا ورچوئل مددگار۔ مجھے ہمارے ڈاکٹر، شعبوں، علاج، اوقات اور ریسرچ کی معلومات ہیں — اور میں اپائنٹمنٹ بک کر سکتی ہوں۔ طبی مشورے کے لیے ہمارے ڈاکٹر ہی صحیح ہیں۔ 🙂",
            emergency: "🚑 یہ ایمرجنسی لگتی ہے۔ چیٹ کا انتظار نہ کریں — ابھی {p} پر کال کریں، یا 108 / 112 پر کال کریں، یا قریبی ایمرجنسی میں جائیں۔",
            medical: "میں طبی مشورہ، دوا یا خوراک نہیں بتا سکتی — اس کے لیے ڈاکٹر کا آپ کو دیکھنا ضروری ہے۔ کیا میں ابھی آپ کا مشورہ بک کر دوں؟",
            records: "آپ کی رپورٹ، نسخے اور ٹوکن Care-Connect مریض ایپ میں ہیں (یا ریسیپشن {p} سے پوچھیں)۔ مجھے صرف ہسپتال کی عوامی معلومات دکھتی ہیں۔",
            unsure: ["ہمم، اس بارے میں مجھے یقین نہیں۔ 🤔 ریسیپشن صحیح بتائے گا — {p} پر کال یا واٹس ایپ کریں۔", "اچھا سوال! یہ معلومات ابھی میرے پاس نہیں۔ براہ کرم {p} پر کال یا واٹس ایپ کریں۔"],
            didYouMean: "کیا آپ ان میں سے کچھ پوچھ رہے تھے؟",
            doctorsIntro: ["CARE میں ہمارے {k} ماہرین ہیں:", "ہمارے ڈاکٹر:"],
            yrs: "سال کا تجربہ", patientsTreated: "مریضوں کا علاج", speaks: "زبانیں", viewProfile: "پوری پروفائل دیکھیں",
            eduTitle: "{d} کی تعلیم اور کامیابیاں:", expTitle: "{d} کا خاص تجربہ:", treatTitle: "{d} کے ساتھ علاج:", timeTitle: "{d} کے او پی ڈی اوقات:", revTitle: "{d} کے بارے میں مریض کیا کہتے ہیں:",
            deptIntro: "CARE کے شعبے:", deptDoctors: "ڈاکٹر", servicesTitle: "خدمات", procIntro: "ہمارے جدید پروسیجر:", facIntro: "CARE کی سہولیات:",
            rndIntro: "جی ہاں! 🔬 مریضوں کی دیکھ بھال کے ساتھ CARE اپنے ہیلتھ کیئر سافٹ ویئر اور آلات بھی بناتا ہے (ریسرچ اور ڈیولپمنٹ):", rndMore: "کسی کے بارے میں تفصیل سے پوچھیں۔",
            status: { available: "دستیاب", development: "تیاری میں", planned: "منصوبے میں" },
            hoursIntro: "🕒 ہمارے اوقات:", addrIntro: "📍 ہمارا پتہ:", mapOpen: "🗺 گوگل میپس میں کھولیں", contactIntro: "📞 فون اور واٹس ایپ:", emailIntro: "✉ ای میل:",
            fees: "مشورہ فیس ملاقات کی قسم کے مطابق بدل سکتی ہے، براہ کرم ریسیپشن {p} سے تصدیق کریں۔ 🙂",
            whyIntro: "مریض CARE کیوں چنتے ہیں:", reviewsIntro: "ہمارے مریضوں کے چند الفاظ:",
            askBook: "کیا میں آپ کی اپائنٹمنٹ بک کر دوں؟", yesBook: "📅 ہاں، بک کریں", moreQ: "❓ اور سوال",
            bStart: "ضرور! آئیے اپائنٹمنٹ بک کرتے ہیں۔ 📅 کس شعبے میں دکھانا ہے؟", bDoctor: "کس ڈاکٹر کو دکھانا چاہیں گے؟", bDay: "کون سا دن ٹھیک رہے گا؟ (اتوار کو صرف ایمرجنسی۔)",
            bTime: "{d} کو کون سا وقت ٹھیک رہے گا؟", bName: "مریض کا پورا نام بتائیں؟", bMobile: "اپائنٹمنٹ کی تصدیق کے لیے 10 ہندسوں کا موبائل نمبر؟", bProblem: "چند الفاظ میں تکلیف بتائیں (یا چھوڑیں دبائیں)",
            bSkip: "چھوڑیں", bSummary: "براہ کرم چیک کریں:", bSend: "✅ واٹس ایپ پر پکا کریں", bBook: "✅ بکنگ پکی کریں", bEdit: "✏️ بدلیں", bCancel: "منسوخ",
            bSunday: "اتوار کو صرف ایمرجنسی ہوتی ہے، براہ کرم دوسرا دن چنیں۔ 🙂", bNoSlots: "اس دن مزید وقت نہیں — براہ کرم دوسرا دن چنیں۔", bBadMobile: "یہ 10 ہندسوں کا موبائل نمبر نہیں لگتا۔ دوبارہ لکھیں گے؟", bBadName: "براہ کرم پورا نام لکھیں (کم از کم 3 حروف)۔",
            bDoneWa: "بہت خوب! 🎉 واٹس ایپ آپ کی درخواست کے ساتھ کھل رہا ہے — وہاں بس بھیجیں دبائیں۔ ریسیپشن جلد اپائنٹمنٹ کی تصدیق کرے گا۔", bDone: "ہو گیا! 🎉 آپ کی اپائنٹمنٹ {d} کو {t} بجے {doc} کے ساتھ بک ہے۔ براہ کرم 15 منٹ پہلے آئیں۔",
            bDept: "شعبہ", bDoc: "ڈاکٹر", bDate: "تاریخ", bTimeL: "وقت", bNameL: "نام", bMobL: "موبائل", bProbL: "تکلیف", today: "آج", tomorrow: "کل", pickDate: "📅 دوسری تاریخ",
            appIntro: "📲 ہماری مفت مریض ایپ <b>Care-Connect</b>: آپ کے نسخے، لیب رپورٹس، اپائنٹمنٹ، لائیو او پی ڈی ٹوکن، دوا کی یاد دہانی اور آن لائن مشورہ — English، हिन्दी، मराठी اور اردو میں۔", appDl: "⬇ Android کے لیے ڈاؤن لوڈ کریں", appHow: "انسٹال کیسے کریں / iPhone", appCode: "پہلی بار آپ کو اپنا مریض کوڈ چاہیے ہوگا (نسخے پر چھپا ہے)۔",
            langNote: "🌐 آپ مجھ سے اپنی زبان میں بات کر سکتے ہیں — اردو، हिन्दी یا English (مراٹھی اور Hinglish الفاظ بھی چلیں گے)۔ زبان چنیں یا سیدھا لکھیں:",
            feedbackThanks: "آپ کی رائے کا شکریہ! 🙏", feedbackBad: "معذرت۔ میں نے نوٹ کر لیا ہے تاکہ ہسپتال میرا جواب بہتر کر سکے۔ آپ {p} پر کال بھی کر سکتے ہیں۔",
            note: "ورچوئل مددگار · صرف عمومی معلومات، طبی مشورہ نہیں۔ یہاں اپنی ذاتی صحت کی معلومات نہ لکھیں۔"
        }
    };
    function TA(k) { var v = (W[LANG] && W[LANG][k]) || W.en[k]; return Array.isArray(v) ? v.slice() : [v]; }
    function T(k, vars) {
        var v = (W[LANG] && W[LANG][k] != null) ? W[LANG][k] : W.en[k];
        if (Array.isArray(v)) v = pick(v);
        if (typeof v !== "string") return v;
        vars = vars || {};
        return v.replace(/\{(\w)\}|\{(\w+)\}/g, function (m, a, b) { var key = a || b; return key === "p" ? PHONE_SHOW : key === "n" ? NAME[LANG] : (vars[key] != null ? vars[key] : m); });
    }

    // ------------------------------------------------------------------ understanding the question
    // words in Hindi / Urdu / Marathi / Hinglish → the English idea the knowledge uses
    var LEX = [
        [/डॉक्टर|डॉ\.?|डाक्टर|ڈاکٹر|doctr|daktar/g, " doctor "],
        [/कान|کان|kaan/g, " ear "], [/नाक|ناک|naak/g, " nose "], [/गला|गले|گلا|gala/g, " throat "], [/सुनाई|बहरा|سنائی|बहिरे|ऐकू/g, " hearing "],
        [/चक्कर|چکر|chakkar/g, " vertigo "], [/टॉन्सिल|ٹانسل/g, " tonsil "], [/साइनस|سائنس/g, " sinus "], [/एलर्जी|الرجی/g, " allergy "], [/थायराइड|تھائرائیڈ/g, " thyroid "],
        [/गर्भ|प्रेगनेंसी|प्रेग्नेंसी|حمل|गरोदर|pregnan/g, " pregnancy maternity "], [/डिलीवरी|प्रसूति|ڈیلیوری|زچگی|बाळंत/g, " delivery maternity "], [/स्त्री रोग|महिला रोग|गायनी|گائنی|زنانہ/g, " gynaecology "],
        [/मासिक|पीरियड|ماہواری|पाळी/g, " period gynaecology "], [/बांझ|निःसंतान|बच्चा नहीं|بانجھ|infertil/g, " infertility "], [/त्वचा|स्किन|جلد|skin/g, " skin "], [/बाल|ہیئر|بال|केस/g, " hair "],
        [/हिजामा|حجامہ|cupping/g, " hijama "], [/यूनानी|یونانی/g, " unani "], [/जाँच|जांच|लैब|ٹیسٹ|لیب|तपासणी/g, " test laboratory "], [/खून|ख़ून|blood|خون|रक्त/g, " blood "],
        [/समय|टाइम|कब|खुला|बंद|وقت|اوقات|کب|वेळ|उघड/g, " timing "], [/रविवार|اتوار|sunday/g, " sunday timing "], [/पता|कहाँ|कहां|लोकेशन|पत्ता|پتہ|کہاں|location|kaha/g, " address "],
        [/फ़ोन|फोन|नंबर|संपर्क|فون|نمبر|رابطہ|contact/g, " contact "], [/फ़ीस|फीस|शुल्क|चार्ज|पैसे|फी|فیس|charges|kharcha|खर्च/g, " fee "],
        [/बुक|अपॉइंटमेंट|अपॉइंटमेंट|दिखाना|मिलना|बुकिंग|اپائنٹمنٹ|بک|appoint|apoint|booking/g, " book appointment "],
        [/शिक्षा|पढ़ाई|डिग्री|योग्यता|تعلیم|ڈگری|शिक्षण|qualif|degree/g, " education qualification "], [/अनुभव|تجربہ|experien/g, " experience "],
        [/उपलब्धि|माइलस्टोन|अवार्ड|पुरस्कार|کامیابی|ایوارڈ|milestone|achiev|award/g, " milestone achievement "],
        [/रिसर्च|अनुसंधान|डेवलपमेंट|सॉफ्टवेयर|सॉफ़्टवेयर|ریسرچ|سافٹ ویئر|research|r ?& ?d|product|software/g, " research development product "],
        [/ऐप|एप|ایپ|ऍप|\bapk\b|mobile app|patient app|care-?connect|play ?store/g, " patientapp "],
        [/सुविधा|سہولت|سہولیات|सोय|facilit/g, " facility "], [/दवा|दवाई|फार्मेसी|میڈیکل|دوا|फार्मसी|pharmac|medical store/g, " pharmacy "], [/पार्किंग|پارکنگ/g, " parking "],
        [/भर्ती|एडमिट|داخلہ|admit/g, " admission bed "], [/इमरजेंसी|आपातकाल|ایمرجنسی|emergen/g, " emergency "], [/एंडोस्कोपी|اینڈوسکوپی/g, " endoscopy "], [/ऑडियोमेट्री|श्रवण/g, " audiometry hearing "],
        [/बच्च|बालक|बच्चे|बच्चों|بچ|मुल|child|kid/g, " child children "], [/रिव्यू|राय|समीक्षा|ریویو|رائے|review|feedback|testimon/g, " review "],
        [/भाषा|زبان|language/g, " language "], [/धन्यवाद|शुक्रिया|شکریہ|thank|dhanyavad|shukriya|आभार/g, " thanks "], [/नमस्ते|नमस्कार|हैलो|हाय|السلام|آداب|ہیلو|namaste|hello|\bhi\b|\bhey\b/g, " hello "],
        [/अलविदा|बाय|خدا حافظ|bye|goodbye/g, " bye "], [/कौन हो|तुम कौन|आप कौन|کون ہو|who are you/g, " who "]
    ];
    var STOP = " a an the is are am was were be to of in on at for and or with my me i you your our we us do does did can could would should please tell know about any some what which who whom whose when where why how this that these those it its from by as hai hain kya kaun kab kahan kaise ka ki ke ko se me mein aur bhi ho tha thi ".split(" ");
    var STOPSET = {}; STOP.forEach(function (w) { if (w) STOPSET[w] = 1; });
    function norm(q) {
        var s = " " + String(q || "").toLowerCase() + " ";
        LEX.forEach(function (r) { s = s.replace(r[0], r[1]); });
        return s.replace(/[^\wऀ-ॿ؀-ۿ\s]/g, " ").replace(/\s+/g, " ").trim();
    }
    function stem(w) { return w.length > 4 ? w.replace(/(ies)$/, "y").replace(/(ing|ed|es|s)$/, "") : w; }
    function tokens(q) { return norm(q).split(" ").filter(function (w) { return w && !STOPSET[w] && w.length > 1; }).map(stem); }

    // ------------------------------------------------------------------ the knowledge (built once from the website)
    var KB = { doctors: [], depts: [], procs: [], facil: [], why: [], reviews: [], products: [], faqs: [], learned: [], address: "", hours: [], emails: [], passages: [], df: {}, avg: 1, ready: false };
    function addPassage(p) { p.tok = tokens([p.title, p.title, p.text, (p.keys || []).join(" ")].join(" ")); KB.passages.push(p); }
    function cards(root, sel) {
        var out = []; if (!root) return out;
        var n = root.querySelectorAll(sel);
        for (var i = 0; i < n.length; i++) {
            var c = n[i];
            var title = c.getAttribute("data-title") || txt(c.querySelector("h3, h4"));
            if (!title) continue;
            var desc = c.getAttribute("data-subtitle") || txt(c.querySelector("p"));
            var li = []; var lis = c.querySelectorAll("li"); for (var j = 0; j < lis.length; j++) li.push(txt(lis[j]));
            var extra = [c.getAttribute("data-category"), c.getAttribute("data-meta"), c.getAttribute("data-features")].filter(Boolean).join(" · ").replace(/\|/g, " · ");
            out.push({ title: title, text: desc, items: li, extra: extra });
        }
        return out;
    }
    function fromDoc(doc) {
        KB.depts = cards(doc.querySelector("#departments"), ".department-card");
        KB.procs = cards(doc.querySelector("#treatments"), ".procedure-card");
        KB.facil = cards(doc, ".onsite-card, .facility-card");
        KB.why = cards(doc.querySelector("#about"), ".feature-card");
        var rv = doc.querySelectorAll(".testimonial-card, .testimonials .card, .testimonial");
        for (var i = 0; i < rv.length && KB.reviews.length < 8; i++) { var t = txt(rv[i].querySelector("p")) || txt(rv[i]); var who = txt(rv[i].querySelector("h4, h3, strong, .name")); if (t) KB.reviews.push({ text: t.slice(0, 220), who: who }); }
        var items = doc.querySelectorAll(".findus-item");
        for (var k = 0; k < items.length; k++) {
            var lab = txt(items[k].querySelector(".findus-label")).toLowerCase();
            if (/address/.test(lab)) KB.address = txt(items[k].querySelector("p"));
            if (/email/.test(lab)) { var a = items[k].querySelectorAll("a"); for (var m = 0; m < a.length; m++) KB.emails.push(txt(a[m])); }
            if (/hours/.test(lab)) { var rows = items[k].querySelectorAll("tr"); for (var r = 0; r < rows.length; r++) { var td = rows[r].querySelectorAll("td, th"); if (td.length >= 2) KB.hours.push([txt(td[0]), txt(td[1])]); } }
        }
    }
    function buildKB() {
        refreshServer();
        if (KB.ready) return Promise.resolve();
        var jobs = [];
        if (!window.CARE_DOCTORS) jobs.push(loadScript("assets/data/doctors.js"));
        if (!window.CARE_PRODUCTS) jobs.push(loadScript("assets/data/products.js"));
        if (!window.CARE_APP) jobs.push(loadScript("assets/data/patient-app.js"));
        // the home page in English (the visitor may be on another page, or the page may be shown in Hindi / Urdu)
        jobs.push(fetch(BASE + "index.html", { credentials: "omit" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (h) { if (h) fromDoc(new DOMParser().parseFromString(h, "text/html")); }).catch(function () { /* file:// */ }));
        return Promise.all(jobs).then(function () {
            if (!KB.depts.length) fromDoc(document);
            if (!KB.address) KB.address = "Care ENT Clinic & Maternity Home, Police Station Road, Chikhli, Buldhana District, Maharashtra – 443201";
            if (!KB.hours.length) KB.hours = [["Monday – Saturday", "11:30 AM – 9:00 PM"], ["Sunday", "Emergency only"], ["Emergency care", "24/7"]];
            var D = window.CARE_DOCTORS || {};
            Object.keys(D).forEach(function (id) {
                var d = D[id]; d.id = d.id || id;
                d._first = String(d.name || "").replace(/^Dr\.?\s*/i, "").split(" ")[0].toLowerCase();
                KB.doctors.push(d);
                addPassage({ type: "doctor", doc: d, title: d.name, text: [d.designation, d.specialty, d.shortDescription, d.about].join(" "), keys: ["doctor", d._first].concat(d.expertise || []) });
                addPassage({ type: "doc-edu", doc: d, title: d.name + " education", text: (d.education || []).map(function (e) { return [e.degree, e.institute, e.year, e.description].join(" "); }).join(" ") + " " + (d.highlights || []).map(function (h) { return h.number + " " + h.title + " " + h.text; }).join(" "), keys: ["education", "qualification", "milestone", "achievement", "experience", d._first] });
                addPassage({ type: "doc-exp", doc: d, title: d.name + " treatments", text: (d.expertise || []).join(" ") + " " + (d.treatments || []).map(function (t) { return t.title + " " + t.description + " " + (t.procedures || []).join(" "); }).join(" "), keys: ["treatment", d._first] });
                (d.faq || []).forEach(function (f) { KB.faqs.push({ q: f.question, a: f.answer, doc: d }); addPassage({ type: "faq", title: f.question, text: f.answer, faq: { q: f.question, a: f.answer, doc: d } }); });
            });
            var P = window.CARE_PRODUCTS || {}, order = window.CARE_PRODUCT_ORDER || Object.keys(P);
            order.forEach(function (id) {
                var p = P[id]; if (!p) return; KB.products.push(p);
                addPassage({ type: "product", prod: p, title: p.name, text: [p.tagline, p.category, p.summary].concat((p.features || []).map(function (f) { return f.title + " " + f.text; })).join(" "), keys: ["research", "development", "product"] });
                (p.faq || []).forEach(function (f) { addPassage({ type: "faq", title: f.q, text: f.a, faq: { q: f.q, a: f.a, prod: p } }); });
            });
            KB.depts.forEach(function (d) { addPassage({ type: "dept", item: d, title: d.title, text: d.text + " " + d.items.join(" "), keys: ["department"] }); });
            KB.procs.forEach(function (d) { addPassage({ type: "proc", item: d, title: d.title, text: d.text + " " + d.extra, keys: ["procedure", "treatment"] }); });
            KB.facil.forEach(function (d) { addPassage({ type: "facil", item: d, title: d.title, text: d.text + " " + d.items.join(" "), keys: ["facility"] }); });
            KB.why.forEach(function (d) { addPassage({ type: "why", item: d, title: d.title, text: d.text, keys: ["why"] }); });
            KB.ready = true; reindex();
            return loadLearned();
        });
    }
    function reindex() {
        var df = {}, total = 0;
        KB.passages.forEach(function (p) { total += p.tok.length; var seen = {}; p.tok.forEach(function (w) { if (!seen[w]) { seen[w] = 1; df[w] = (df[w] || 0) + 1; } }); });
        KB.df = df; KB.avg = total / Math.max(1, KB.passages.length);
    }
    // BM25: which passages of the website fit the question best
    function search(q, limit) {
        var qt = tokens(q); if (!qt.length) return [];
        var N = KB.passages.length, out = [];
        KB.passages.forEach(function (p) {
            var s = 0, tf = {}; p.tok.forEach(function (w) { tf[w] = (tf[w] || 0) + 1; });
            qt.forEach(function (w) {
                var f = tf[w] || 0;
                if (!f) { for (var k in tf) if (k.length > 4 && w.length > 4 && (k.indexOf(w) === 0 || w.indexOf(k) === 0)) { f = tf[k] * 0.6; break; } }
                if (!f) return;
                var idf = Math.log(1 + (N - (KB.df[w] || 0) + 0.5) / ((KB.df[w] || 0) + 0.5));
                s += idf * (f * 2.2) / (f + 1.2 * (0.25 + 0.75 * p.tok.length / KB.avg));
            });
            if (s > 0) out.push({ p: p, s: s });
        });
        var rnd = /\b(research|development|product|software|scope|histopath|calculator|workstation|camera)\b/.test(norm(q));
        if (!rnd) out.forEach(function (o) { if (o.p.type === "product" || o.p.faq && o.p.faq.prod) o.s *= o.p.type === "faq" ? 0.2 : 0.45; });
        out.sort(function (a, b) { return b.s - a.s; });
        return out.slice(0, limit || 5);
    }

    // ------------------------------------------------------------------ what the visitor means
    var CTX = { doctor: null, dept: null, topic: "" };
    function has(n, re) { return re.test(n); }
    function byName(n) {
        for (var i = 0; i < KB.doctors.length; i++) { var d = KB.doctors[i]; if (new RegExp("\\b" + d._first + "\\b").test(n) || /अबरार|ابرار/.test(n) && d._first === "abrar" || /ज़ैनब|जैनब|زینب/.test(n) && d._first === "zainab") return d; }
        if (/\b(he|him|his|she|her|unke|unka|unki)\b/.test(n) || /उनका|उनकी|उनके|ان کا|ان کی|ان کے/.test(n)) return CTX.doctor;
        return null;
    }
    function findDoctor(n) {
        var nm = byName(n); if (nm) return nm;
        if (/\b(ent|ear|nose|throat|hearing|vertigo|tonsil|sinus)\b/.test(n)) return KB.doctors.filter(function (d) { return /\bENT\b/i.test(d.specialty + " " + d.designation); })[0] || null;
        if (/\b(gyn\w*|pregnancy|maternity|delivery|infertility|period|lady|female|woman|women)\b/.test(n)) return KB.doctors.filter(function (d) { return /gyn|obst/i.test(d.specialty + d.designation); })[0] || null;
        if (/\b(skin|hair|hijama|unani)\b/.test(n)) return KB.doctors.filter(function (d) { return /skin|unani|derma|gyn/i.test(JSON.stringify(d.expertise || []) + d.designation); })[0] || null;
        if (/\b(he|him|his|she|her|unke|unka|unki|उनका|उनकी|उनके|ان)\b/.test(n) || /उनका|उनकी|उनके|ان کا|ان کی|ان کے/.test(n)) return CTX.doctor;
        return null;
    }
    var PCOMMON = { endoscope: 1, otoscope: 1, ent: 1, scope: 1, ai: 1, pro: 1, care: 1, camera: 1, hospital: 1, the: 1 };
    function findProduct(n) {
        if (/\bwi ?fi\b/.test(n)) return KB.products.filter(function (p) { return /wi-?fi/i.test(p.name); })[0] || null;
        var best = null, bs = 0;
        KB.products.forEach(function (p) {
            var w = p.name.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (x) { return x.length >= 4 && !PCOMMON[x]; });
            var s = w.filter(function (x) { return new RegExp("\\b" + x.slice(0, 6)).test(n); }).length;
            if (s > bs) { bs = s; best = p; }
        });
        if (!best && /\bscope ai\b|\bent scope\b/.test(n)) best = KB.products[0];
        return best;
    }
    function intent(q) {
        var n = norm(q);
        if (/chest pain|can t breathe|cannot breathe|breathless|unconscious|faint|seizure|fits|heavy bleeding|bleeding a lot|poison|suicid|सीने में दर्द|सांस नहीं|बेहोश|ज़हर|सینے میں درد|سانس نہیں|بے ہوش/.test(n + " " + q.toLowerCase())) return { k: "emergency" };
        if (/\b(my|meri|mera|मेरी|मेरा|میری|میرا)\b.*\b(report|prescription|token|bill)\b|रिपोर्ट आई|report ready/.test(n)) return { k: "records" };
        if (/(which|what) (medicine|tablet|dose)|should i take|medicine for|tablet for|dose of|दवा बताओ|कौन सी दवा|کون سی دوا|ilaj batao|इलाज बताओ/.test(n + " " + q.toLowerCase())) return { k: "medical" };
        if (/^\s*(hello|good (morning|evening|afternoon))\s*$/.test(n) || /^hello\b/.test(n) && n.split(" ").length <= 3) return { k: "hello" };
        if (/\bthanks\b/.test(n) && n.split(" ").length <= 5) return { k: "thanks" };
        if (/\bbye\b/.test(n) && n.split(" ").length <= 4) return { k: "bye" };
        if (/\bwho\b/.test(n) && /(you|bot|assistant)|\bwho\b$/.test(n)) return { k: "who" };
        if (/\bbook\b|\bappointment\b|\bslot\b|\bconsult (doctor|now)\b/.test(n) && !/how (to|do)|kaise/.test(n)) return { k: "book", doc: byName(n) };
        var d = byName(n) || (/\b(doctor|specialist|consult)\b/.test(n) ? findDoctor(n) : null);
        var GENERIC = { procedure: 1, surgery: 1, surgerie: 1, operation: 1, department: 1, service: 1, facility: 1, facilitie: 1, treatment: 1, specialty: 1, specialtie: 1, offer: 1, available: 1, hospital: 1, clinic: 1, care: 1, list: 1, all: 1, have: 1, provide: 1, there: 1, any: 1 };
        var specific = tokens(q).filter(function (w) { return !GENERIC[w]; }).length > 0;
        if (/\b(education|qualification|milestone|achievement|degree|studied|college)\b/.test(n)) return { k: "doc-edu", doc: d || CTX.doctor };
        if (d && /\btiming|available|sit|opd|days?\b/.test(n)) return { k: "doc-time", doc: d };
        if (d && /\breview|rating\b/.test(n)) return { k: "doc-rev", doc: d };
        if (d && /\btreat|expert|special|speciali|procedure|do\b/.test(n)) return { k: "doc-exp", doc: d };
        if (/\bexperience\b/.test(n) && (d || CTX.doctor)) return { k: "doc-edu", doc: d || CTX.doctor };
        if (/\bpatientapp\b/.test(n) || /\b(download|install)\b/.test(n) && /\b(app|application)\b/.test(n) || /^\s*app\s*$/.test(n)) return { k: "app" };
        if (/\b(research|development|product|software)\b/.test(n)) { var hit = findProduct(n); return hit ? { k: "product", prod: hit } : { k: "rnd" }; }
        if (/\b(doctor|doctors|specialist|staff)\b/.test(n) && !d) return { k: "doctors" };
        if (d && n.split(" ").length <= 4) return { k: "doctor", doc: d };
        if (/\bdepartment|specialt|service\b/.test(n) && !specific) return { k: "depts" };
        if (/\bprocedure|surger|operation\b/.test(n) && !specific) return { k: "procs" };
        if (/\b(facility|facilities)\b/.test(n) && !specific) return { k: "facil" };
        if (/\btiming|sunday|open|close\b/.test(n)) return { k: "hours" };
        if (/\baddress|direction|reach|map|chikhli|located|location\b/.test(n) || /\bwhere\b/.test(n) && !d) return { k: "address" };
        if (/\bcontact|whatsapp|email|mobile\b/.test(n)) return { k: "contact" };
        if (/\bfee|price|cost|rate|charge\b/.test(n)) return { k: "fees" };
        if (/\bwhy\b.*\b(care|choose)|\bbest\b/.test(n)) return { k: "why" };
        if (/\breview|rating\b/.test(n)) return { k: "reviews" };
        var hp = findProduct(n); if (hp) return { k: "product", prod: hp };
        if (d) return { k: "doctor", doc: d };
        return { k: "search" };
    }

    // ------------------------------------------------------------------ answers
    function ul(a) { return "<ul>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
    function docLink(d) { return '<a href="' + BASE + "doctor.html?id=" + encodeURIComponent(d.id) + '">' + esc(tr(d.name)) + "</a>"; }
    function docCard(d) {
        return "<p>" + docLink(d) + " — <b>" + esc(tr(d.designation || d.specialty)) + "</b></p>" +
            "<p>" + esc(tr(d.shortDescription || "")) + "</p>" +
            "<p>🎓 " + esc(d.experience || "") + " " + esc(T("yrs")) + (d.patients ? " · 👥 " + esc(d.patients) + " " + esc(T("patientsTreated")) : "") + (d.languages ? " · 🗣 " + esc(T("speaks")) + ": " + esc((d.languages || []).map(tr).join(", ")) : "") + "</p>";
    }
    var A = {
        hello: function () { var v = store.get("visitor", null); return { html: "<p>" + esc(v && v.name ? T("back", { v: v.name.split(" ")[0] }) : T("hello")) + "</p>", chips: TA("chips") }; },
        thanks: function () { return { html: "<p>" + esc(T("thanks")) + "</p>", chips: TA("chips").slice(0, 4) }; },
        bye: function () { return { html: "<p>" + esc(T("bye")) + "</p>" }; },
        who: function () { return { html: "<p>" + esc(T("who")) + "</p>", chips: TA("chips") }; },
        emergency: function () { return { html: '<p class="ca-urgent"><b>' + esc(T("emergency")) + '</b></p><p><a class="ca-btn" href="tel:' + PHONE + '">📞 ' + esc(T("call")) + " " + PHONE_SHOW + "</a></p>", urgent: true }; },
        medical: function () { return { html: "<p>" + esc(T("medical")) + "</p>", chips: [T("yesBook"), T("moreQ")] }; },
        records: function () { return { html: "<p>" + esc(T("records")) + "</p>" }; },
        doctors: function () { return { html: "<p>" + esc(T("doctorsIntro", { k: KB.doctors.length })) + "</p>" + KB.doctors.map(docCard).join("<hr>"), chips: KB.doctors.map(function (d) { return "🎓 " + tr(d.name); }).concat([T("yesBook")]) }; },
        doctor: function (it) { var d = it.doc; CTX.doctor = d; return { html: docCard(d), chips: [LANG === "en" ? "🎓 Education & milestones" : LANG === "hi" ? "🎓 शिक्षा और उपलब्धियाँ" : "🎓 تعلیم اور کامیابیاں", LANG === "en" ? "🩺 Treatments" : LANG === "hi" ? "🩺 इलाज" : "🩺 علاج", LANG === "en" ? "🕒 Timings" : LANG === "hi" ? "🕒 समय" : "🕒 اوقات", T("yesBook")], ctxDoc: d }; },
        "doc-edu": function (it) {
            var d = it.doc; if (!d) return A.doctors(); CTX.doctor = d;
            var edu = (d.education || []).map(function (e) { return "<b>" + esc(tr(e.degree)) + "</b> — " + esc(tr(e.institute)) + (e.year ? " <small>(" + esc(tr(e.year)) + ")</small>" : ""); });
            var hl = (d.highlights || []).map(function (h) { return "⭐ <b>" + esc(tr(h.number)) + "</b> " + esc(tr(h.title)) + " — " + esc(tr(h.text)); });
            return { html: "<p><b>" + esc(T("eduTitle", { d: tr(d.name) })) + "</b></p>" + ul(edu) + ul(hl), chips: [LANG === "en" ? "🩺 Treatments" : LANG === "hi" ? "🩺 इलाज" : "🩺 علاج", T("yesBook")] };
        },
        "doc-exp": function (it) {
            var d = it.doc; CTX.doctor = d;
            var tr2 = (d.treatments || []).map(function (t) { return "<b>" + esc(tr(t.title)) + "</b> — " + esc(tr(t.description)) + ((t.procedures || []).length ? "<br><small>" + (t.procedures || []).map(function (p) { return esc(tr(p)); }).join(" · ") + "</small>" : ""); });
            return { html: "<p><b>" + esc(T("expTitle", { d: tr(d.name) })) + "</b> " + (d.expertise || []).map(function (x) { return esc(tr(x)); }).join(", ") + "</p><p><b>" + esc(T("treatTitle", { d: tr(d.name) })) + "</b></p>" + ul(tr2), chips: [T("yesBook")] };
        },
        "doc-time": function (it) { var d = it.doc; CTX.doctor = d; return { html: "<p><b>" + esc(T("timeTitle", { d: tr(d.name) })) + "</b></p>" + ul((d.schedule || []).map(function (s) { return esc(tr(s.day)) + ": " + esc(tr(s.time)); })), chips: [T("yesBook")] }; },
        "doc-rev": function (it) { var d = it.doc; CTX.doctor = d; return { html: "<p><b>" + esc(T("revTitle", { d: tr(d.name) })) + "</b></p>" + ul((d.testimonials || []).slice(0, 4).map(function (t) { return "“" + esc(tr(t.comment)) + "” — <i>" + esc(t.name) + "</i> " + "★".repeat(Math.max(0, Math.min(5, t.rating || 5))); })), chips: [T("yesBook")] }; },
        depts: function () { return { html: "<p><b>" + esc(T("deptIntro")) + "</b></p>" + ul(KB.depts.map(function (d) { return "<b>" + esc(tr(d.title)) + "</b> — " + esc(tr(d.text)); })), chips: KB.depts.slice(0, 5).map(function (d) { return tr(d.title); }) }; },
        dept: function (it) {
            var d = it.item, docs = deptDoctors(d.title);
            CTX.dept = d; if (docs[0]) CTX.doctor = docs[0];
            return { html: "<p><b>" + esc(tr(d.title)) + "</b></p><p>" + esc(tr(d.text)) + "</p>" + (d.items.length ? "<p><b>" + esc(T("servicesTitle")) + ":</b> " + d.items.map(function (x) { return esc(tr(x)); }).join(" · ") + "</p>" : "") + (docs.length ? "<p><b>" + esc(T("deptDoctors")) + ":</b> " + docs.map(docLink).join(", ") + "</p>" : ""), chips: [T("yesBook")] };
        },
        procs: function () { return { html: "<p><b>" + esc(T("procIntro")) + "</b></p>" + ul(KB.procs.map(function (d) { return "<b>" + esc(tr(d.title)) + "</b> — " + esc(tr(d.text)); })), chips: [T("yesBook")] }; },
        proc: function (it) { var d = it.item; return { html: "<p><b>" + esc(tr(d.title)) + "</b></p><p>" + esc(tr(d.text)) + "</p>" + (d.extra ? "<p><small>" + esc(d.extra) + "</small></p>" : ""), chips: [T("yesBook")] }; },
        facil: function () { return { html: "<p><b>" + esc(T("facIntro")) + "</b></p>" + ul(KB.facil.map(function (d) { return "<b>" + esc(tr(d.title)) + "</b>" + (d.text ? " — " + esc(tr(d.text)) : ""); })) }; },
        why: function () { return { html: "<p><b>" + esc(T("whyIntro")) + "</b></p>" + ul(KB.why.map(function (d) { return "<b>" + esc(tr(d.title)) + "</b> — " + esc(tr(d.text)); })), chips: [T("yesBook")] }; },
        reviews: function () { var r = KB.reviews.length ? KB.reviews : [].concat.apply([], KB.doctors.map(function (d) { return (d.testimonials || []).map(function (t) { return { text: t.comment, who: t.name }; }); })); return { html: "<p><b>" + esc(T("reviewsIntro")) + "</b></p>" + ul(r.slice(0, 5).map(function (x) { return "“" + esc(tr(x.text)) + "”" + (x.who ? " — <i>" + esc(x.who) + "</i>" : ""); })) }; },
        rnd: function () { return { html: "<p>" + esc(T("rndIntro")) + "</p>" + ul(KB.products.map(function (p) { return '<a href="' + BASE + "product.html?id=" + encodeURIComponent(p.id) + '"><b>' + esc(tr(p.name)) + "</b></a> — " + esc(tr(p.tagline)) + ' <span class="ca-tag">' + esc((T("status") || {})[p.status] || p.status) + "</span>"; })) + "<p>" + esc(T("rndMore")) + "</p>", chips: KB.products.slice(0, 4).map(function (p) { return "🔬 " + p.name; }) }; },
        product: function (it) {
            var p = it.prod;
            return { html: '<p><a href="' + BASE + "product.html?id=" + encodeURIComponent(p.id) + '"><b>' + esc(tr(p.name)) + "</b></a> — " + esc(tr(p.tagline)) + ' <span class="ca-tag">' + esc((T("status") || {})[p.status] || p.status) + "</span></p><p>" + esc(tr(p.summary || "")) + "</p>" + ul((p.highlights || p.features || []).slice(0, 5).map(function (h) { return "<b>" + esc(tr(h.title)) + "</b> — " + esc(tr(h.text)); })) + ((p.platforms || []).length ? "<p><small>" + esc(p.platforms.join(" · ")) + "</small></p>" : "") };
        },
        hours: function () { return { html: "<p><b>" + esc(T("hoursIntro")) + "</b></p>" + ul(KB.hours.map(function (h) { return esc(tr(h[0])) + ": <b>" + esc(tr(h[1])) + "</b>"; })), chips: [T("yesBook")] }; },
        address: function () { return { html: "<p><b>" + esc(T("addrIntro")) + "</b> " + esc(tr(KB.address)) + '</p><p><a class="ca-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=20.3496273%2C76.2549318">' + esc(T("mapOpen")) + "</a></p>" }; },
        contact: function () { return { html: "<p><b>" + esc(T("contactIntro")) + '</b> <a href="tel:' + PHONE + '">' + PHONE_SHOW + "</a></p>" + (KB.emails.length ? "<p><b>" + esc(T("emailIntro")) + "</b> " + KB.emails.map(function (e) { return '<a href="mailto:' + esc(e) + '">' + esc(e) + "</a>"; }).join(", ") + "</p>" : "") }; },
        fees: function () { return { html: "<p>" + esc(T("fees")) + "</p>", chips: [T("yesBook")] }; },
        faq: function (it) { var f = it.faq; return { html: "<p><b>" + esc(tr(f.q)) + "</b></p><p>" + esc(tr(f.a)) + "</p>" + (f.doc ? "<p><small>— " + docLink(f.doc) + "</small></p>" : "") }; },
        app: function () {
            var P = window.CARE_APP || { apk: "downloads/Care-Connect.apk" };
            return { html: "<p>" + T("appIntro") + '</p><p><a class="ca-btn" href="' + esc(BASE + P.apk) + '" download="Care-Connect.apk">' + esc(T("appDl")) + "</a></p><p><small>" + esc(T("appCode")) + ' <a href="' + BASE + 'app.html">' + esc(T("appHow")) + "</a></small></p>" };
        },
        learned: function (it) { return { html: "<p>" + esc(it.a).replace(/\n/g, "<br>") + "</p>" }; }
    };
    function deptDoctors(title) {
        var t = String(title).toLowerCase();
        return KB.doctors.filter(function (d) {
            var s = (d.designation + " " + d.specialty + " " + (d.expertise || []).join(" ")).toLowerCase();
            if (/\bent\b|\bear\b/.test(t)) return /\bent\b/.test(s);
            if (/matern|gyn|women|obst/.test(t)) return /gyn|obst/.test(s);
            if (/skin|hair|unani|derma|hijama/.test(t)) return /skin|unani|derma|hijama|hair|gyn/.test(s);
            return true;
        });
    }
    // the best local answer for a question
    function localAnswer(q) {
        var it = intent(q);
        if (it.k === "book") return { book: true, doc: it.doc };
        if (it.k !== "search" && A[it.k] && (it.k.indexOf("doc") !== 0 || it.doc) && (it.k !== "product" || it.prod)) { var r = A[it.k](it); r.conf = 1; r.kind = it.k; return r; }
        // the visitor's question compared with approved answers of the hospital and the website's text
        var L = bestLearned(q);
        if (L && L.s > 0.6) { var lr = A.learned(L.item); lr.conf = 0.9; lr.kind = "learned"; return lr; }
        var hits = search(q, 4);
        if (!hits.length) return { conf: 0, kind: "none" };
        var top = hits[0], p = top.p, r2;
        if (p.type === "dept") r2 = A.dept({ item: p.item });
        else if (p.type === "proc") r2 = A.proc({ item: p.item });
        else if (p.type === "facil") r2 = { html: "<p><b>" + esc(tr(p.item.title)) + "</b></p><p>" + esc(tr(p.item.text)) + "</p>" + (p.item.items.length ? ul(p.item.items.map(function (x) { return esc(tr(x)); })) : "") };
        else if (p.type === "why") r2 = { html: "<p><b>" + esc(tr(p.item.title)) + "</b> — " + esc(tr(p.item.text)) + "</p>" };
        else if (p.type === "doctor") r2 = A.doctor({ doc: p.doc });
        else if (p.type === "doc-edu") r2 = A["doc-edu"]({ doc: p.doc });
        else if (p.type === "doc-exp") r2 = A["doc-exp"]({ doc: p.doc });
        else if (p.type === "product") r2 = A.product({ prod: p.prod });
        else if (p.type === "faq") r2 = A.faq({ faq: p.faq });
        else r2 = { html: "<p>" + esc(tr(p.text)) + "</p>" };
        r2.conf = Math.min(1, top.s / 6); r2.kind = p.type;
        if (hits.length > 1 && r2.conf < 0.55) r2.chips = hits.slice(1, 4).map(function (h) { return tr(h.p.title.replace(/ (education|treatments)$/, "")); });
        r2.ctxText = hits.map(function (h) { return h.p.title + ": " + String(h.p.text).slice(0, 500); });
        return r2;
    }

    // ------------------------------------------------------------------ learning: answers the hospital approved (CARE server)
    function loadLearned() {
        if (!SERVER || !window.fetch) return Promise.resolve();
        return fetch(SERVER + "/api/pt/siteai.kb", { credentials: "omit", mode: "cors" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
            if (j && Array.isArray(j.items)) KB.learned = j.items.filter(function (x) { return x && x.q && x.a; }).map(function (x) { return { q: String(x.q), a: String(x.a), lang: x.lang || "en", tok: tokens(x.q + " " + (x.keys || "")) }; });
            if (j && Array.isArray(j.popular) && j.popular.length) KB.popular = j.popular.slice(0, 4);
            SERVER_FEATURES = j && j.features || {};
        }).catch(function () { /* the hospital's server is not reachable — the website answers alone */ });
    }
    var SERVER_FEATURES = {};
    function bestLearned(q) {
        var qt = tokens(q); if (!qt.length || !KB.learned.length) return null;
        var best = null;
        KB.learned.forEach(function (it) {
            if (it.lang && it.lang !== LANG && it.lang !== "any") return;
            var hit = 0; qt.forEach(function (w) { if (it.tok.indexOf(w) >= 0) hit++; });
            var s = hit / Math.max(qt.length, it.tok.length * 0.7);
            if (!best || s > best.s) best = { s: s, item: it };
        });
        return best;
    }
    function tellServer(kind, body) {
        if (!SERVER || !window.fetch) return;
        try { fetch(SERVER + "/api/pt/siteai." + kind, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "omit", mode: "cors" }).catch(function () { /* optional */ }); } catch (e) { /* optional */ }
    }
    // phone numbers, e-mails and long numbers never leave the visitor's browser
    function scrub(s) { return String(s || "").replace(/\+?\d[\d\s-]{7,}\d/g, "[number]").replace(/\S+@\S+\.\S+/g, "[email]").slice(0, 500); }

    // ------------------------------------------------------------------ AI answers from the CARE server (optional)
    var history = [];
    function askServer(q, ctxText) {
        return new Promise(function (resolve) {
            if (!SERVER || !window.fetch) return resolve(null);
            var done = false, timer = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 10000);
            fetch(SERVER + "/api/pt/siteai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, history: history.slice(-6), lang: LANG, context: (ctxText || []).slice(0, 6) }), credentials: "omit", mode: "cors" })
                .then(function (r) { return r.json(); })
                .then(function (j) { if (done) return; done = true; clearTimeout(timer); resolve(j && j.ok && j.answer ? j.answer : null); })
                .catch(function () { if (done) return; done = true; clearTimeout(timer); resolve(null); });
        });
    }
    function mdHtml(a) {
        var lines = String(a).split("\n"), out = "", inList = false;
        var fmt = function (s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"); };
        for (var i = 0; i < lines.length; i++) {
            var m = lines[i].match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
            if (m) { if (!inList) { out += "<ul>"; inList = true; } out += "<li>" + fmt(m[1]) + "</li>"; continue; }
            if (inList) { out += "</ul>"; inList = false; }
            if (lines[i].trim()) out += "<p>" + fmt(lines[i].replace(/^#+\s*/, "")) + "</p>";
        }
        return out + (inList ? "</ul>" : "");
    }

    // ------------------------------------------------------------------ 📅 booking in the chat
    var BK = null;   // { step, dept, doctor, date, time, name, mobile, problem }
    var SLOTS = (function () { var s = [], h = 11, m = 30; while (h < 21 || (h === 21 && m === 0)) { s.push((h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m); m += 15; if (m >= 60) { m = 0; h++; } } return s; })();
    function isoDay(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    function niceDate(iso) { var d = new Date(iso + "T12:00:00"); try { return d.toLocaleDateString(LANG === "hi" ? "hi-IN" : LANG === "ur" ? "ur-IN" : "en-IN", { weekday: "long", day: "numeric", month: "long" }); } catch (e) { return iso; } }
    function niceTime(hm) { var p = hm.split(":"), h = +p[0], ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return h + ":" + p[1] + " " + ap; }
    function freeSlots(iso) {
        var now = new Date(), today = isoDay(now);
        return SLOTS.filter(function (s) { if (iso !== today) return true; var p = s.split(":"); return (+p[0]) * 60 + (+p[1]) > now.getHours() * 60 + now.getMinutes() + 30; });
    }
    function parseDay(q) {
        var n = q.toLowerCase(), d = new Date();
        if (/today|aaj|आज|آج/.test(n)) return isoDay(d);
        if (/day after|parso|परसों|پرسوں/.test(n)) { d.setDate(d.getDate() + 2); return isoDay(d); }
        if (/tomorrow|kal|कल|کل|उद्या/.test(n)) { d.setDate(d.getDate() + 1); return isoDay(d); }
        var m = n.match(/(\d{4})-(\d{2})-(\d{2})/); if (m) return m[0];
        m = n.match(/\b(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?\b/);
        if (m) { var y = m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : d.getFullYear(); var x = new Date(y, +m[2] - 1, +m[1]); if (x < new Date(new Date().toDateString())) x.setFullYear(x.getFullYear() + 1); return isoDay(x); }
        var days = [/sun|रवि|اتوار/, /mon|सोम|پیر/, /tue|मंगल|منگل/, /wed|बुध|بدھ/, /thu|गुरु|جمعرات/, /fri|शुक्र|جمعہ/, /sat|शनि|ہفتہ/];
        for (var i = 0; i < 7; i++) if (days[i].test(n)) { var t = new Date(); var add = (i - t.getDay() + 7) % 7 || 7; t.setDate(t.getDate() + add); return isoDay(t); }
        return "";
    }
    function parseTime(q) {
        var n = q.toLowerCase(), m = n.match(/\b(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|baje|बजे|بجے)?/);
        if (!m) return "";
        var h = +m[1], min = m[2] ? +m[2] : 0;
        if ((m[3] === "pm" || /shaam|शाम|شام|raat|रात|dopahar|दोपहर/.test(n)) && h < 12) h += 12;
        if (!m[3] && h >= 1 && h <= 9) h += 12;   // "5" in an OPD means 5 PM
        min = Math.round(min / 15) * 15; if (min === 60) { min = 0; h++; }
        var s = (h < 10 ? "0" : "") + h + ":" + (min < 10 ? "0" : "") + min;
        if (BK && BK._srv && BK._srv.slots) { var exact = (m[2] ? +m[2] : 0); var s2 = (h < 10 ? "0" : "") + h + ":" + (exact < 10 ? "0" : "") + exact; if (BK._srv.slots.indexOf(s2) >= 0) return s2; if (BK._srv.slots.indexOf(s) >= 0) return s; var near = BK._srv.slots.filter(function (x) { return +x.split(":")[0] === h; })[0]; return near || ""; }
        return SLOTS.indexOf(s) >= 0 ? s : "";
    }
    function deptList() { return KB.depts.length ? KB.depts.map(function (d) { return d.title; }) : ["ENT — Ear, Nose & Throat", "Maternity Care", "Gynaecology", "Skin, Hair & Unani Care", "General Consultation"]; }
    function startBooking(doc) {
        var v = store.get("visitor", {}) || {};
        BK = { step: "dept", name: v.name || "", mobile: v.mobile || "" };
        if (doc) { BK.doctor = doc.name; BK.dept = deptList().filter(function (t) { return deptDoctors(t).indexOf(doc) >= 0; })[0] || doc.specialty; BK.step = "day"; return askDay(); }
        return { html: "<p>" + esc(T("bStart")) + "</p>", chips: deptList().map(tr), bk: true };
    }
    function askDoctor() { var ds = deptDoctors(BK.dept); if (ds.length === 1) { BK.doctor = ds[0].name; BK.step = "day"; return askDay(); } return { html: "<p>" + esc(T("bDoctor")) + "</p>", chips: (ds.length ? ds : KB.doctors).map(function (d) { return tr(d.name); }), bk: true }; }
    function askDay() {
        BK.step = "day";
        var c = [], d = new Date(), labels = [T("today"), T("tomorrow")];
        for (var i = 0; c.length < 5 && i < 9; i++) { var x = new Date(d); x.setDate(d.getDate() + i); if (x.getDay() === 0) continue; if (i === 0 && !freeSlots(isoDay(x)).length) continue; c.push(i < 2 ? labels[i] : niceDate(isoDay(x)).split(",")[0] + " " + x.getDate()); }
        BK._dayChips = c;
        return { html: "<p>" + esc(T("bDay")) + "</p>", chips: c.concat([T("pickDate")]), bk: true };
    }
    function askTime() {
        BK.step = "time";
        if (SERVER && SERVER_FEATURES.book && !BK._srv) {
            // the hospital's real free times for that doctor (CARE Appointments)
            return fetch(SERVER + "/api/pt/siteai.slots?date=" + encodeURIComponent(BK.date) + "&doctor=" + encodeURIComponent(BK.doctor), { credentials: "omit", mode: "cors" })
                .then(function (r) { return r.json(); })
                .then(function (j) { BK._srv = { date: BK.date, slots: j && j.ok && !j.closed ? j.slots : [] }; return askTime(); })
                .catch(function () { BK._srv = { date: BK.date, slots: null }; return askTime(); });
        }
        var s = BK._srv && BK._srv.date === BK.date && BK._srv.slots ? BK._srv.slots : freeSlots(BK.date); if (!s.length) { BK.step = "day"; var r = askDay(); r.html = "<p>" + esc(T("bNoSlots")) + "</p>" + r.html; return r; }
        // a few well-spread suggestions: first free, then every hour
        var sug = [], lastH = -1; s.forEach(function (x, i) { var hh = +x.split(":")[0]; if (sug.length < 7 && (i === 0 || hh !== lastH)) { sug.push(x); lastH = hh; } });
        return { html: "<p>" + esc(T("bTime", { d: niceDate(BK.date) })) + "</p>", chips: sug.map(niceTime), bk: true };
    }
    function summary() {
        BK.step = "confirm";
        var rows = [[T("bDept"), tr(BK.dept)], [T("bDoc"), tr(BK.doctor)], [T("bDate"), niceDate(BK.date)], [T("bTimeL"), niceTime(BK.time)], [T("bNameL"), BK.name], [T("bMobL"), BK.mobile], [T("bProbL"), BK.problem || "—"]];
        var direct = SERVER && SERVER_FEATURES.book;
        return { html: "<p><b>" + esc(T("bSummary")) + "</b></p><table class=\"ca-sum\">" + rows.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td><b>" + esc(r[1]) + "</b></td></tr>"; }).join("") + "</table>", chips: [direct ? T("bBook") : T("bSend"), T("bEdit"), T("bCancel")], bk: true };
    }
    function bookingStep(q) {
        var n = q.toLowerCase().trim();
        if (n === String(T("bCancel")).toLowerCase() || /^(cancel|stop|रद्द|منسوخ|nahi|नहीं)$/.test(n)) { BK = null; return { html: "<p>" + esc(T("thanks")) + "</p>", chips: TA("chips").slice(0, 4) }; }
        if (BK.step === "dept") {
            var list = deptList(), hit = list.filter(function (t) { return tr(t).toLowerCase() === n || t.toLowerCase() === n; })[0];
            if (!hit) { var nn = norm(q); hit = list.filter(function (t) { var tt = t.toLowerCase(); return /ent|ear|nose|throat|hearing/.test(nn) && /ent/.test(tt) || /pregnan|matern|delivery/.test(nn) && /matern/.test(tt) || /gyn|period|infert/.test(nn) && /gyn/.test(tt) || /skin|hair|hijama|unani/.test(nn) && /skin/.test(tt) || /general|fever|bukhar|बुखार/.test(nn) && /general/.test(tt); })[0]; }
            if (!hit) return { html: "<p>" + esc(T("bStart")) + "</p>", chips: list.map(tr), bk: true };
            BK.dept = hit; BK.step = "doctor"; return askDoctor();
        }
        if (BK.step === "doctor") {
            var d = KB.doctors.filter(function (x) { return n.indexOf(x._first) >= 0 || tr(x.name).toLowerCase() === n || x.name.toLowerCase() === n; })[0];
            if (!d) return askDoctor();
            BK.doctor = d.name; return askDay();
        }
        if (BK.step === "day") {
            var iso = "";
            if (BK._dayChips) { var idx = BK._dayChips.map(function (x) { return String(x).toLowerCase(); }).indexOf(n); if (idx >= 0) { var x2 = new Date(), k = 0; for (var i = 0; i < 12; i++) { var y = new Date(x2); y.setDate(x2.getDate() + i); if (y.getDay() === 0 || (i === 0 && !freeSlots(isoDay(y)).length)) continue; if (k === idx) { iso = isoDay(y); break; } k++; } } }
            if (n === String(T("pickDate")).toLowerCase()) return { html: '<p>' + esc(T("bDay")) + '</p><p><input type="date" class="ca-date" min="' + isoDay(new Date()) + '"></p>', bk: true, datePick: true };
            iso = iso || parseDay(q);
            if (!iso) return askDay();
            if (new Date(iso + "T12:00:00").getDay() === 0) { var r = askDay(); r.html = "<p>" + esc(T("bSunday")) + "</p>" + r.html; return r; }
            if (iso < isoDay(new Date())) return askDay();
            BK.date = iso; BK._srv = null; return askTime();
        }
        if (BK.step === "time") {
            var t = parseTime(q) || SLOTS.filter(function (s) { return niceTime(s).toLowerCase() === n; })[0];
            var free = BK._srv && BK._srv.date === BK.date && BK._srv.slots ? BK._srv.slots : freeSlots(BK.date);
            if (!t || free.indexOf(t) < 0) return askTime();
            BK.time = t; BK.step = "name";
            return BK.name ? { html: "<p>" + esc(T("bName")) + "</p>", chips: [BK.name], bk: true } : { html: "<p>" + esc(T("bName")) + "</p>", bk: true };
        }
        if (BK.step === "name") {
            var nm = q.trim().replace(/\s+/g, " ").replace(/^(my name is|name is|मेरा नाम|میرا نام)\s*/i, "");
            if (nm.replace(/[^A-Za-zऀ-ॿ؀-ۿ]/g, "").length < 3) return { html: "<p>" + esc(T("bBadName")) + "</p>", bk: true };
            BK.name = nm.slice(0, 60); BK.step = "mobile";
            return BK.mobile ? { html: "<p>" + esc(T("bMobile")) + "</p>", chips: [BK.mobile], bk: true } : { html: "<p>" + esc(T("bMobile")) + "</p>", bk: true };
        }
        if (BK.step === "mobile") {
            var mob = q.replace(/\D/g, "").replace(/^(91|0)(\d{10})$/, "$2");
            if (!/^[6-9]\d{9}$/.test(mob)) return { html: "<p>" + esc(T("bBadMobile")) + "</p>", bk: true };
            BK.mobile = mob; BK.step = "problem";
            return { html: "<p>" + esc(T("bProblem")) + "</p>", chips: [T("bSkip")], bk: true };
        }
        if (BK.step === "problem") { BK.problem = n === String(T("bSkip")).toLowerCase() ? "" : q.trim().slice(0, 200); return summary(); }
        if (BK.step === "confirm") {
            if (n === String(T("bEdit")).toLowerCase()) { BK.step = "dept"; return { html: "<p>" + esc(T("bStart")) + "</p>", chips: deptList().map(tr), bk: true }; }
            if (n === String(T("bSend")).toLowerCase() || n === String(T("bBook")).toLowerCase() || /^(yes|ok|haan|हाँ|हां|جی|ہاں|confirm)/.test(n)) return finishBooking();
            return summary();
        }
        return null;
    }
    function waMessage(b) {
        return "====================================\n      CARE HOSPITAL\n   APPOINTMENT REQUEST\n====================================\n\nPatient Name\n-------------\n" + b.name +
            "\n\nMobile Number\n-------------\n" + b.mobile + "\n\nDepartment\n----------\n" + b.dept + "\n\nDoctor\n------\n" + b.doctor +
            "\n\nAppointment Date\n----------------\n" + new Date(b.date + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) +
            "\n\nPreferred Time\n--------------\n" + niceTime(b.time) + "\n\nBrief Problem\n-------------\n" + (b.problem || "Not Mentioned") +
            "\n\n(booked through the website assistant)\n====================================\nThank you for choosing CARE Hospital.\nWe will contact you shortly to confirm\nyour appointment.\n\nPhone: +91 9370111449\n====================================";
    }
    function finishBooking() {
        var b = BK; BK = null;
        store.set("visitor", { name: b.name, mobile: b.mobile, at: Date.now() });   // filled in next time (this browser only)
        var wa = function () { window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(waMessage(b)), "_blank"); return { html: "<p>" + esc(T("bDoneWa")) + "</p>", chips: [T("moreQ")] }; };
        if (!(SERVER && SERVER_FEATURES.book)) return wa();
        // straight into CARE (when the hospital switched on website bookings) — WhatsApp if it does not answer
        return fetch(SERVER + "/api/pt/siteai.book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: b.name, mobile: b.mobile, dept: b.dept, doctor: b.doctor, date: b.date, time: b.time, problem: b.problem, lang: LANG }), credentials: "omit", mode: "cors" })
            .then(function (r) { return r.json(); })
            .then(function (j) { if (j && j.taken) { BK = b; BK.step = "time"; BK._srv = null; var r = askTime(); return Promise.resolve(r).then(function (x) { x.html = "<p>" + esc(j.error || "") + "</p>" + x.html; return x; }); } if (j && j.ok) return { html: "<p>" + esc(T("bDone", { d: niceDate(b.date), t: niceTime(b.time), doc: tr(b.doctor) })) + "</p>" + (j.ref ? "<p><small>#" + esc(j.ref) + "</small></p>" : ""), chips: [T("moreQ")] }; return wa(); })
            .catch(wa);
    }


    // ------------------------------------------------------------------ 🔊 voice: a soft, gentle Indian female voice (the visitor's own phone / PC voice — free, nothing is sent anywhere)
    var VOICE = {
        on: store.get("voice", false), list: [],
        ok: !!(window.speechSynthesis && window.SpeechSynthesisUtterance),
        load: function () { try { VOICE.list = window.speechSynthesis.getVoices() || []; } catch (e) { VOICE.list = []; } },
        // the best voice for the language: Indian + female first (Microsoft Neerja / Swara / Heera / Kalpana, Google हिन्दी, Apple Lekha / Veena / Rishi …)
        pick: function (lang) {
            var L = VOICE.list; if (!L.length) VOICE.load(); L = VOICE.list;
            var want = lang === "hi" ? /^hi/i : lang === "ur" ? /^ur/i : /^en[-_]IN/i;
            var female = /neerja|swara|heera|kalpana|aarti|ananya|kavya|lekha|veena|sangeeta|priya|female|woman|zira|google हिन्दी|google hindi|uzma|gul/i;
            var male = /hemant|madhur|ravi|prabhat|rishi|asad|salman|male\b/i;
            var score = function (v) { var s = 0; if (want.test(v.lang)) s += 10; else if (/IN$/i.test(v.lang)) s += 4; else if (lang !== "en" && /^hi/i.test(v.lang)) s += 6; else if (/^en/i.test(v.lang)) s += 1; if (female.test(v.name)) s += 5; if (male.test(v.name)) s -= 6; if (/natural|neural|online/i.test(v.name)) s += 2; return s; };
            var best = null, bs = -99; L.forEach(function (v) { var x = score(v); if (x > bs) { bs = x; best = v; } });
            return bs >= 1 ? best : null;
        },
        clean: function (html) {
            var d = document.createElement("div"); d.innerHTML = html;
            return (d.textContent || "").replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, " ").replace(/https?:\S+/g, "").replace(/\s+/g, " ").trim().slice(0, 900);
        },
        say: function (html) {
            if (!VOICE.on || !VOICE.ok) return;
            try {
                window.speechSynthesis.cancel();
                var t = VOICE.clean(html); if (!t) return;
                var u = new SpeechSynthesisUtterance(t), v = VOICE.pick(LANG);
                if (v) { u.voice = v; u.lang = v.lang; } else u.lang = LANG === "hi" ? "hi-IN" : LANG === "ur" ? "ur-IN" : "en-IN";
                u.rate = 0.9; u.pitch = 1.15; u.volume = 0.9;   // slow, soft and warm
                window.speechSynthesis.speak(u);
            } catch (e) { /* no voice on this device */ }
        },
        stop: function () { try { window.speechSynthesis.cancel(); } catch (e) { /* */ } }
    };
    if (VOICE.ok) { VOICE.load(); try { window.speechSynthesis.onvoiceschanged = VOICE.load; } catch (e) { /* */ } }
    // 🎤 speak the question (Chrome / Edge / Android; the browser asks the visitor first)
    var REC = window.SpeechRecognition || window.webkitSpeechRecognition;
    function listen(btn) {
        if (!REC) return;
        try {
            VOICE.stop();
            var r = new REC(); r.lang = LANG === "hi" ? "hi-IN" : LANG === "ur" ? "ur-IN" : "en-IN"; r.interimResults = false; r.maxAlternatives = 1;
            btn.classList.add("on");
            r.onresult = function (e) { var q = e.results[0][0].transcript; if (q) send(q); };
            r.onend = r.onerror = function () { btn.classList.remove("on"); };
            r.start();
        } catch (e) { btn.classList.remove("on"); }
    }

    // ------------------------------------------------------------------ the chat window
    var root, logEl, input, opened = false, busy = false;
    function build() {
        root = document.createElement("div");
        root.className = "care-asst";
        root.innerHTML =
            '<button type="button" class="care-asst-fab" aria-label="Chat"><span class="ca-fab-ic" aria-hidden="true">💬</span><span class="ca-fab-dot" aria-hidden="true"></span></button>' +
            '<div class="ca-teaser" hidden></div>' +
            '<div class="care-asst-panel" role="dialog" aria-modal="false" hidden>' +
            '<div class="care-asst-head"><div class="ca-avatar" aria-hidden="true">🩺</div><div class="ca-who"><b class="ca-title"></b><small class="ca-sub"><span class="ca-online"></span><span class="ca-subt"></span></small></div><button type="button" class="ca-voice" aria-label="Voice" hidden>🔈</button><button type="button" class="care-asst-x" aria-label="Close">✕</button></div>' +
            '<div class="care-asst-log" aria-live="polite"></div>' +
            '<div class="care-asst-chips"></div>' +
            '<form class="care-asst-form"><button type="button" class="ca-mic" aria-label="Speak" hidden>🎤</button><input type="text" maxlength="500" autocomplete="off"><button type="submit" class="ca-send" aria-label="Send">➤</button></form>' +
            '<div class="care-asst-foot"><a class="ca-call" href="tel:' + PHONE + '"></a><a class="ca-wa" href="https://wa.me/' + WA + '" target="_blank" rel="noopener"></a><small class="ca-note"></small></div>' +
            "</div>";
        document.body.appendChild(root);
        logEl = $(".care-asst-log", root); input = $("input", root);
        $(".care-asst-fab", root).onclick = toggle;
        $(".care-asst-x", root).onclick = toggle;
        var vb = $(".ca-voice", root), mb = $(".ca-mic", root);
        if (VOICE.ok) { vb.hidden = false; vb.textContent = VOICE.on ? "🔊" : "🔈"; vb.onclick = function () { VOICE.on = !VOICE.on; store.set("voice", VOICE.on); vb.textContent = VOICE.on ? "🔊" : "🔈"; vb.classList.toggle("on", VOICE.on); if (VOICE.on) { var last = logEl.querySelector(".ca-bot:last-of-type"); VOICE.say(last ? last.innerHTML.replace(/<div class="ca-fb">[\s\S]*$/, "") : T("hello")); } else VOICE.stop(); }; vb.classList.toggle("on", VOICE.on); }
        if (REC) { mb.hidden = false; mb.onclick = function () { listen(mb); }; }
        $("form", root).onsubmit = function (e) { e.preventDefault(); send(input.value); };
        logEl.addEventListener("click", onLogClick);
        logEl.addEventListener("change", function (e) { if (e.target.classList.contains("ca-date") && e.target.value) send(e.target.value); });
        document.addEventListener("keydown", function (e) { if (opened && e.key === "Escape") toggle(); });
        paintText();
        try { new MutationObserver(function () { var l = siteLang(); if (l !== LANG) { LANG = l; paintText(); } }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir"] }); } catch (e) { /* old browser */ }
        // a gentle hello after a few seconds (once per visit)
        setTimeout(function () {
            if (opened || store.get("teased", 0) > Date.now() - 6 * 3600000) return;
            var t = $(".ca-teaser", root); t.textContent = LANG === "hi" ? "नमस्ते! 👋 कुछ पूछना है?" : LANG === "ur" ? "السلام علیکم! 👋 کچھ پوچھنا ہے؟" : "Hi! 👋 Need help or an appointment?";
            t.hidden = false; t.onclick = toggle; store.set("teased", Date.now());
            setTimeout(function () { t.hidden = true; }, 9000);
        }, 6000);
        buildKB();
    }
    function paintText() {
        if (!root) return;
        LANG = siteLang();
        root.setAttribute("dir", LANG === "ur" ? "rtl" : "ltr");
        $(".ca-title", root).textContent = NAME[LANG];
        $(".ca-subt", root).textContent = T("sub");
        $(".ca-call", root).textContent = "📞 " + T("call");
        $(".ca-wa", root).textContent = "💬 " + T("wa");
        $(".ca-note", root).textContent = T("note");
        input.placeholder = T("type");
        var vb2 = $(".ca-voice", root); if (vb2) vb2.title = LANG === "hi" ? "आवाज़ में जवाब चालू / बंद" : LANG === "ur" ? "آواز میں جواب آن / آف" : "Spoken replies on / off";
        var mb2 = $(".ca-mic", root); if (mb2) mb2.title = LANG === "hi" ? "बोलकर पूछें" : LANG === "ur" ? "بول کر پوچھیں" : "Ask by speaking";
        if (!BK) chips(TA("chips"));
    }
    function chips(list) {
        var ch = $(".care-asst-chips", root); ch.innerHTML = "";
        (list || []).forEach(function (x) { var b = document.createElement("button"); b.type = "button"; b.textContent = x; b.onclick = function () { send(String(x).replace(/^[^\wऀ-ॿ؀-ۿ]+/, "") || x, x); }; ch.appendChild(b); });
    }
    var msgId = 0;
    function add(cls, html, opts) {
        var d = document.createElement("div"); d.className = "ca-msg " + cls; d.innerHTML = html;
        if (opts && opts.fb) { var id = "m" + (++msgId); d.setAttribute("data-mid", id); d.insertAdjacentHTML("beforeend", '<div class="ca-fb"><button type="button" data-fb="up" aria-label="Good answer">👍</button><button type="button" data-fb="down" aria-label="Not helpful">👎</button></div>'); d._q = opts.q; d._kind = opts.kind; }
        logEl.appendChild(d); logEl.scrollTop = logEl.scrollHeight; return d;
    }
    function onLogClick(e) {
        var lb = e.target.closest && e.target.closest("[data-lang]");
        if (lb) { setLang(lb.getAttribute("data-lang")); return; }
        var b = e.target.closest && e.target.closest("[data-fb]"); if (!b) return;
        var m = b.closest(".ca-msg"); if (!m || m._fbDone) return; m._fbDone = true;
        var good = b.getAttribute("data-fb") === "up";
        $(".ca-fb", m).innerHTML = "<small>" + esc(good ? T("feedbackThanks") : T("feedbackBad")) + "</small>";
        tellServer("feedback", { q: scrub(m._q), kind: m._kind || "", good: good, lang: LANG });
    }
    function typing() { return add("ca-bot ca-typing", '<span class="ca-dots"><i></i><i></i><i></i></span>'); }
    function toggle() {
        opened = !opened;
        $(".care-asst-panel", root).hidden = !opened;
        $(".ca-teaser", root).hidden = true;
        root.classList.toggle("open", opened);
        try { document.documentElement.classList.toggle("care-asst-lock", opened && window.innerWidth <= 600); } catch (e) { /* */ }
        if (!opened) VOICE.stop();
        if (opened && !logEl.children.length) { LANG = siteLang(); buildKB().then(function () { var r = A.hello(); add("ca-bot", r.html); VOICE.say(r.html); setTimeout(function () { add("ca-bot ca-lang", "<p>" + esc(T("langNote")) + '</p><p class="ca-langs" translate="no" data-no-translate><button type="button" data-lang="en">English</button><button type="button" data-lang="hi">हिन्दी</button><button type="button" data-lang="ur">اردو</button></p>'); }, 700); chips(KB.popular && KB.popular.length ? KB.popular.concat([TA("chips")[4]]) : r.chips); }); }
        if (opened) setTimeout(function () { try { input.focus(); } catch (e) { /* */ } }, 50);
    }
    // the visitor chose a language in the chat: the whole website switches too (its own language menu)
    function setLang(l) {
        try { if (window.CARE && window.CARE.i18n && window.CARE.i18n.set) window.CARE.i18n.set(l); } catch (e) { /* */ }
        LANG = l; paintText();
        var r = A.hello(); add("ca-bot", r.html); VOICE.say(r.html); chips(r.chips);
    }
    function detectLang(q) {
        // the website's language; Hindi / Urdu letters in the question win (a visitor who types in Hindi gets Hindi)
        var l = siteLang();
        if (/[؀-ۿ]/.test(q)) return "ur";
        if (/[ऀ-ॿ]/.test(q)) return "hi";
        return l;
    }
    function send(q, label) {
        q = String(q || "").trim().slice(0, 500);
        if (!q || busy) return;
        input.value = ""; busy = true;
        add("ca-me", esc(label || q));
        LANG = detectLang(q);
        var dots = typing();
        buildKB().then(function () { return answer(q); }).then(function (r) {
            var delay = Math.min(1400, 350 + String(r.html || "").replace(/<[^>]+>/g, "").length * 4);   // a short "typing…" like a person
            setTimeout(function () {
                dots.remove();
                add("ca-bot" + (r.urgent ? " ca-urgent-box" : ""), r.html, r.bk || r.noFb ? null : { fb: true, q: q, kind: r.kind });
                VOICE.say(r.html);
                chips(r.chips || (BK ? [] : TA("chips").slice(0, 4)));
                history.push({ who: "me", text: q }, { who: "ai", text: String(r.html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 600) });
                history = history.slice(-10);
                busy = false;
                if (r.datePick) { var dp = logEl.querySelector(".ca-msg:last-child .ca-date"); if (dp) try { dp.showPicker ? dp.showPicker() : dp.focus(); } catch (e) { dp.focus(); } }
            }, delay);
        }).catch(function () { dots.remove(); add("ca-bot", "<p>" + esc(T("unsure")) + "</p>"); busy = false; });
    }
    function answer(q) {
        if (BK) { var b = bookingStep(q); if (b) return Promise.resolve(b); }
        var yes = String(T("yesBook")).replace(/^[^\wऀ-ॿ؀-ۿ]+/, "").toLowerCase();
        if (q.toLowerCase() === yes || /^(yes|haan|हाँ|हां|ہاں)\b/i.test(q) && history.length && /book|बुक|بک/.test(history[history.length - 1].text)) return Promise.resolve(startBooking(CTX.doctor));
        var r = localAnswer(q);
        if (r.book) return Promise.resolve(startBooking(r.doc));
        if (r.kind === "emergency" || r.kind === "medical" || r.kind === "records") return Promise.resolve(r);
        // a clear answer from the website's own data: show it (fast, exact). Otherwise ask the hospital's AI with the best passages.
        // the website's own data first — instant and exact (doctors, departments, timings …). Only questions the website
        // cannot answer well go to the hospital's AI (with the best website passages), and never wait more than 10 s.
        if (r.conf >= 0.5 || !SERVER || SERVER_FEATURES.ai === false) {
            if (r.conf < 0.25) { tellServer("log", { q: scrub(q), lang: LANG }); return Promise.resolve({ html: "<p>" + esc(T("unsure")) + "</p>", chips: (r.chips || []).concat([T("yesBook")]), kind: "none" }); }
            if (r.conf < 0.5) r.html = "<p>" + esc(T("didYouMean")) + "</p>" + r.html;
            return Promise.resolve(r);
        }
        return askServer(q, r.ctxText).then(function (a) {
            if (a) return { html: mdHtml(a), chips: [T("yesBook"), T("moreQ")], kind: "ai" };
            if (r.conf >= 0.25) { r.html = "<p>" + esc(T("didYouMean")) + "</p>" + r.html; return r; }
            tellServer("log", { q: scrub(q), lang: LANG });
            return { html: "<p>" + esc(T("unsure")) + "</p>", chips: [T("yesBook")], kind: "none" };
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
    var API = { voice: VOICE, open: function () { if (!opened) toggle(); }, ask: function (q) { if (!opened) toggle(); setTimeout(function () { send(q); }, 300); }, _local: function (q) { return buildKB().then(function () { return localAnswer(q); }); }, _kb: KB };
    window.CARE_ASSISTANT = API;
    var attach = function () { try { window.CARE = window.CARE || {}; window.CARE.assistant = API; } catch (e) { /* */ } };
    attach(); if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attach); window.addEventListener("load", attach);
})();
