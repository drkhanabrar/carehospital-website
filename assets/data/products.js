/* ==========================================================================
   CARE — PRODUCT CATALOGUE
   --------------------------------------------------------------------------
   Single source of truth for the Products hub (products.html) and every
   product detail page (product.html?id=…).

   TO ADD A FUTURE PRODUCT
     1. Copy any block below and change the fields.
     2. Add its id to CARE_PRODUCT_ORDER at the bottom.
     3. Drop an illustration at images/products/<id>.svg (or .png/.jpg).
     4. Optional: add the new strings to assets/i18n/dictionary-products.js
        so the Hindi and Urdu editions stay complete.
   Nothing else needs editing — both pages build themselves from this file.

   FIELD NOTES
     status      "available" | "development" | "planned"
                 Shown as a badge. Keep it honest: a clinic deciding whether
                 to wait for a release needs to know what is actually
                 shipping today.
     learning    true  -> the page shows the "Learning system" explainer and
                 the product is listed under Adaptive / AI on the hub.
     regulatory  true  -> the clinical-decision-support notice is rendered on
                 that product's page. Set it for anything that suggests
                 clinical content (findings, impressions, prescriptions).
   ========================================================================== */

window.CARE_PRODUCTS = {

/* ======================================================================
   1. ENT SCOPE AI PRO
   ====================================================================== */

"ent-scope-ai-pro": {
    id: "ent-scope-ai-pro",
    name: "ENT Scope AI Pro",
    tagline: "Endoscopy reporting that learns how your clinic writes.",
    category: "ENT / Reporting",
    categoryKey: "ENT & Reporting",
    status: "available",
    learning: true,
    regulatory: true,
    platforms: ["Windows (installer)", "Windows (portable)", "Android"],

    /* 15-day free trial. `url` is a PLACEHOLDER — paste the real download
       link over the "#" and the button becomes live automatically.
       Set `trial: null` to hide the trial button for this product. */
    trial: { days: 15, url: "#", note: "No payment details needed." },
    icon: "fa-solid fa-microscope",
    image: "images/products/ent-scope-ai-pro.svg",
    imageAlt: "ENT Scope AI Pro — endoscopy report screen with findings and an AI assistant panel",

    summary:
        "A complete post-procedure reporting tool for ENT endoscopy. Write the " +
        "report, generate a numbered PDF offline, and let the built-in assistant " +
        "suggest wording drawn from how your own clinic has reported similar " +
        "findings before.",

    highlights: [
        { icon: "fa-solid fa-file-pdf",      title: "Offline PDF reports",   text: "Reports are generated on the machine itself. No internet needed to finish a clinic list." },
        { icon: "fa-solid fa-hashtag",       title: "Sequential numbering",  text: "Every report carries its own running number, so nothing is duplicated or lost." },
        { icon: "fa-solid fa-brain",         title: "Learns your phrasing",  text: "The assistant adapts to the vocabulary and report style your clinic actually uses." },
        { icon: "fa-solid fa-prescription",  title: "Prescription tab",      text: "Move from findings to a printed prescription without leaving the report." }
    ],

    features: [
        { title: "Structured endoscopy reporting",
          text: "Dedicated fields for nasal, ear and throat findings, so reports stay consistent between doctors and across visits." },
        { title: "AI Endoscopy Assistant",
          text: "Drafts suggested wording for findings and impressions. Every suggestion is editable and is shown with its reasoning, so the clinician reviews and decides before anything is saved." },
        { title: "Clinic learning over time",
          text: "The more reports your clinic writes, the closer the assistant's suggestions sit to your own house style and common diagnoses." },
        { title: "Works offline",
          text: "Reporting and PDF export run locally. Only the optional AI features need a connection." },
        { title: "Installable or portable",
          text: "Install it on the clinic PC, or run the portable build from a USB stick on a machine you cannot install software on." },
        { title: "Android edition",
          text: "The same reporting workflow on a tablet, for clinicians who review cases away from the endoscopy room." }
    ],

    audience: [
        "ENT clinics running regular diagnostic endoscopy lists",
        "Single-doctor practices that need professional reports without a typist",
        "Hospitals standardising endoscopy reporting between several ENT surgeons"
    ],

    specs: [
        ["Platform",        "Windows 10 / 11 — installer and portable builds; Android"],
        ["Works offline",   "Yes, for reporting and PDF export"],
        ["AI provider",     "Google Gemini, with OpenRouter as an alternative"],
        ["Data storage",    "On your own machine"],
        ["Report output",   "PDF, with sequential report numbering"],
        ["Languages",       "English interface"]
    ],

    faq: [
        { q: "Does the AI replace the doctor's judgement?",
          a: "No. It drafts wording for you to review, edit or discard. The report is not saved until the clinician accepts it, and the responsibility for the clinical content stays with the clinician." },
        { q: "Can it run without internet?",
          a: "Yes. Writing reports and exporting PDFs work entirely offline. Only the AI assistant needs a connection." },
        { q: "Where is patient data stored?",
          a: "On the clinic's own computer. Reports are not uploaded anywhere by the application." },
        { q: "What does 'learning' actually mean here?",
          a: "The assistant takes account of the reports your clinic has already written, so its suggested phrasing drifts towards your own style instead of generic textbook wording. It does not change any report on its own." }
    ]
},

/* ======================================================================
   2. CARE HOSPITAL WORKSTATION
   ====================================================================== */

"hospital-workstation": {
    id: "hospital-workstation",
    name: "CARE Hospital Workstation",
    tagline: "Every clinic application behind one window.",
    category: "Platform",
    categoryKey: "Clinic Platform",
    status: "available",
    learning: false,
    regulatory: false,
    platforms: ["Windows — server + client PCs"],

    /* 15-day free trial. `url` is a PLACEHOLDER — paste the real download
       link over the "#" and the button becomes live automatically.
       Set `trial: null` to hide the trial button for this product. */
    trial: { days: 15, url: "#", note: "No payment details needed." },
    icon: "fa-solid fa-display",
    image: "images/products/hospital-workstation.svg",
    imageAlt: "CARE Hospital Workstation — tabbed shell holding reporting, camera and EMR tabs",

    summary:
        "One tabbed workspace that holds your reporting software, scope camera, " +
        "dose calculator and EMR logins together. Staff stop hunting through a " +
        "dozen open windows, and the same patient stays selected across every tab.",

    highlights: [
        { icon: "fa-solid fa-table-columns", title: "One window, many tools", text: "Each application becomes a tab instead of a separate window to find and arrange." },
        { icon: "fa-solid fa-id-card",       title: "Shared patient bar",     text: "Select the patient once; every tab follows. No re-typing the same name five times." },
        { icon: "fa-solid fa-lock",          title: "Doctor PIN lock",        text: "Each doctor unlocks their own session, so cabins can share a machine safely." },
        { icon: "fa-solid fa-puzzle-piece",  title: "Add your own modules",   text: "New applications can be added later from the settings area as the clinic grows." }
    ],

    features: [
        { title: "Tabbed application shell",
          text: "Holds ENT Scope AI Pro, the scope camera viewer, the dose calculator and your web EMR logins side by side in a single window." },
        { title: "Shared patient context",
          text: "One patient identity bar across the top. Choosing a patient there carries through to the tools that support it, instead of entering details separately in each." },
        { title: "Multiple EMR logins",
          text: "Several doctor accounts stay signed in at once in separate sessions, so each consultant lands in their own EMR without logging the others out." },
        { title: "OPD token and queue display",
          text: "A waiting-list and token view for reception and the waiting area." },
        { title: "Consent and procedure templates",
          text: "ENT audiometry, tympanometry and consent forms in English, Hindi and Marathi." },
        { title: "Voice dictation",
          text: "Dictate into report fields instead of typing between patients." },
        { title: "Automatic daily backup",
          text: "Clinic data is copied on a daily schedule without anyone remembering to run it." },
        { title: "Hospital branding",
          text: "Your hospital name, address, logo and contact details appear throughout the interface and on printed output." },
        { title: "Per-PC licence activation",
          text: "Licensed by activation key per machine, with tiers for a small clinic, a medium hospital or a large multi-cabin site." }
    ],

    audience: [
        "Hospitals running several clinical applications on the same PCs",
        "Clinics with doctor cabins, an endoscopy room, a scope camera and a reception desk to keep in step",
        "Practices that want one administrator account overseeing every workstation"
    ],

    specs: [
        ["Architecture",    "Server PC with client machines in cabins, endoscopy and reception"],
        ["Client PCs",      "Tiered — small clinic, medium hospital, large hospital"],
        ["Licensing",       "Activation key per PC"],
        ["Branding",        "Hospital name, address, logo and contact customised per site"],
        ["Backup",          "Automatic, daily"],
        ["Template languages", "English, Hindi, Marathi"]
    ],

    faq: [
        { q: "Do my existing applications have to change?",
          a: "No. The workstation holds them as they are. It adds the shared patient bar and the single window around them without altering how each application works." },
        { q: "How many computers can use it?",
          a: "Licensing is tiered by the number of client PCs, from a single-room clinic up to a hospital with cabins, endoscopy, a scope camera station and reception." },
        { q: "Can we add our own software later?",
          a: "Yes. The settings area is built so further applications can be added as modules as the clinic adds them." },
        { q: "How does installation work?",
          a: "It is available now. We set it up on your server PC, connect the client machines in the cabins, endoscopy room and reception, add your hospital branding and activate the licence for each PC. Tell us how many machines you run and we will quote on that basis." }
    ]
},

/* ======================================================================
   3. HISTOPATH AI PRO
   ====================================================================== */

"histopath-ai-pro": {
    id: "histopath-ai-pro",
    name: "HistoPath AI Pro",
    tagline: "Slide analysis and report drafting for histopathology.",
    category: "Pathology / AI",
    categoryKey: "Pathology & AI",
    status: "development",
    learning: true,
    regulatory: true,
    platforms: ["Windows desktop"],

    /* 15-day free trial. `url` is a PLACEHOLDER — paste the real download
       link over the "#" and the button becomes live automatically.
       Set `trial: null` to hide the trial button for this product. */
    trial: { days: 15, url: "#", note: "No payment details needed." },
    icon: "fa-solid fa-dna",
    image: "images/products/histopath-ai-pro.svg",
    imageAlt: "HistoPath AI Pro — histopathology slide view beside a drafted report",

    summary:
        "A desktop tool for histopathology that examines slide images and drafts " +
        "a structured pathology report for the pathologist to review, correct and " +
        "sign out. Built as its own application, not an add-on.",

    highlights: [
        { icon: "fa-solid fa-image",         title: "Slide image analysis", text: "Reads slide images and highlights the regions behind each observation." },
        { icon: "fa-solid fa-file-lines",    title: "Drafted reports",      text: "Produces a structured first draft in standard pathology report format." },
        { icon: "fa-solid fa-brain",         title: "Improves with use",    text: "Corrections made by the pathologist feed back into later suggestions." },
        { icon: "fa-solid fa-user-check",    title: "Pathologist signs out", text: "Nothing is final until the pathologist has reviewed and approved it." }
    ],

    features: [
        { title: "Whole-slide and field image support",
          text: "Works from the slide images your laboratory already produces." },
        { title: "Structured report drafting",
          text: "Specimen, gross description, microscopy and impression laid out in the order a pathology report expects." },
        { title: "Shows its reasoning",
          text: "Each observation points back to the region of the slide behind it, so the pathologist can judge the basis for a suggestion rather than accepting it blind." },
        { title: "Learns from corrections",
          text: "Edits made during sign-out inform later drafts, so the tool moves towards your department's reporting conventions." },
        { title: "Runs on local hardware",
          text: "Designed for a desktop with a consumer NVIDIA GPU rather than requiring laboratory server hardware." }
    ],

    audience: [
        "Histopathology laboratories with a heavy routine reporting load",
        "Pathologists who want a structured first draft to correct instead of a blank page",
        "Teaching departments comparing drafted findings against their own reporting"
    ],

    specs: [
        ["Platform",       "Windows desktop"],
        ["Graphics",       "NVIDIA GPU, around 8 GB VRAM"],
        ["Input",          "Histopathology slide images"],
        ["Output",         "Structured draft pathology report"],
        ["Review",         "Pathologist review and sign-out required"]
    ],

    faq: [
        { q: "Does it make the diagnosis?",
          a: "No. It drafts observations and a suggested structure for a pathologist to examine, correct and sign out. The diagnosis is the pathologist's, and the tool is built so the basis for every suggestion can be inspected." },
        { q: "Does it need a laboratory server?",
          a: "No. It is designed to run on a desktop with a consumer NVIDIA graphics card." },
        { q: "What happens to the slides I load?",
          a: "They are processed for the report you are drafting. Talk to us about your laboratory's data-handling requirements before deployment." },
        { q: "When will it be available?",
          a: "It is in development. Register your interest and we will contact you when a laboratory pilot opens." }
    ]
},

/* ======================================================================
   4. CARE PEDIATRIC DOSE CALCULATOR
   ====================================================================== */

"pediatric-dose-calculator": {
    id: "pediatric-dose-calculator",
    name: "CARE Pediatric Dose Calculator",
    tagline: "Weight-based paediatric dosing, native on Windows.",
    category: "Clinical Tools",
    categoryKey: "Clinical Tools",
    status: "available",
    learning: false,
    regulatory: true,
    platforms: ["Windows desktop"],

    /* 15-day free trial. `url` is a PLACEHOLDER — paste the real download
       link over the "#" and the button becomes live automatically.
       Set `trial: null` to hide the trial button for this product. */
    trial: { days: 15, url: "#", note: "No payment details needed." },
    icon: "fa-solid fa-calculator",
    image: "images/products/pediatric-dose-calculator.svg",
    imageAlt: "CARE Pediatric Dose Calculator — weight entry with calculated dose and volume",

    summary:
        "Enter the child's weight, pick the drug, read the dose. A full paediatric " +
        "drug list running natively on the clinic PC — no Android emulator, no " +
        "phone in your hand during a consultation.",

    highlights: [
        { icon: "fa-solid fa-weight-scale", title: "Weight-based dosing", text: "Dose and volume calculated from the child's weight as you type." },
        { icon: "fa-solid fa-list-check",   title: "Full drug list",      text: "The complete working list a paediatric OPD needs, not a token starter set." },
        { icon: "fa-solid fa-bolt",         title: "Native Windows",      text: "Opens instantly on the clinic PC. No emulator, no phone, no waiting." },
        { icon: "fa-solid fa-syringe",      title: "Syrup volumes",       text: "Shows the millilitres to give for the available strength, not just milligrams." }
    ],

    features: [
        { title: "Runs natively on Windows",
          text: "Built for the clinic PC. It replaces running an Android dosing app through an emulator, which is slow to open and awkward mid-consultation." },
        { title: "Complete paediatric drug list",
          text: "Carries the full list used in practice, so you are not falling back to a second reference for the drug you actually need." },
        { title: "Dose and volume together",
          text: "Gives the calculated dose and the corresponding syrup volume for the strength you have on the shelf." },
        { title: "Fast keyboard entry",
          text: "Designed to be driven from the keyboard between patients rather than by hunting with a mouse." }
    ],

    audience: [
        "Paediatric and general OPDs prescribing by weight all day",
        "Clinics where the dosing reference currently lives on someone's phone",
        "Casualty and emergency rooms needing a dose in seconds"
    ],

    specs: [
        ["Platform",     "Windows 10 / 11"],
        ["Works offline", "Yes"],
        ["Input",        "Child's weight, drug, available strength"],
        ["Output",       "Calculated dose and syrup volume"],
        ["Drug list",    "Full paediatric working list"]
    ],

    faq: [
        { q: "Does it replace checking the dose?",
          a: "No. It is a calculator that removes the arithmetic, not the clinical decision. The prescribing doctor remains responsible for confirming that the drug, dose and route suit the child in front of them." },
        { q: "Can the drug list be extended?",
          a: "Yes. Tell us what your department prescribes and the list can be adjusted for your site." },
        { q: "Does it need internet?",
          a: "No. It runs entirely on the clinic computer." }
    ]
},

/* ======================================================================
   5. CARE ENT SCOPE CAMERA
   ====================================================================== */

"ent-scope-camera": {
    id: "ent-scope-camera",
    name: "CARE ENT Scope Camera",
    tagline: "Live view and recording for USB otoscope and endoscope cameras.",
    category: "Imaging",
    categoryKey: "Imaging",
    status: "available",
    learning: false,
    regulatory: false,
    platforms: ["Windows desktop"],

    /* 15-day free trial. `url` is a PLACEHOLDER — paste the real download
       link over the "#" and the button becomes live automatically.
       Set `trial: null` to hide the trial button for this product. */
    trial: { days: 15, url: "#", note: "No payment details needed." },
    icon: "fa-solid fa-video",
    image: "images/products/ent-scope-camera.svg",
    imageAlt: "CARE ENT Scope Camera — live scope view with capture and record controls",

    summary:
        "A clean viewer and recorder for the USB scope camera on your examination " +
        "trolley. Full-screen live view for showing the patient what you can see, " +
        "with one-press capture and recording for the notes.",

    highlights: [
        { icon: "fa-solid fa-tower-broadcast", title: "Live full-screen view", text: "Show the patient the eardrum or the nasal cavity on the spot." },
        { icon: "fa-solid fa-camera",          title: "One-press capture",     text: "Still images saved straight to the patient's folder." },
        { icon: "fa-solid fa-circle-dot",      title: "Video recording",       text: "Record the examination when a still will not carry the finding." },
        { icon: "fa-solid fa-plug",            title: "Standard USB scopes",   text: "Works with the USB otoscope and endoscope cameras already in clinics." }
    ],

    features: [
        { title: "Live examination view",
          text: "A large, uncluttered live image — useful for explaining a finding to a patient or parent during the consultation." },
        { title: "Still capture and video recording",
          text: "Capture images or record the examination, saved locally for the patient record." },
        { title: "Works with standard USB cameras",
          text: "Built around the USB otoscope and endoscope cameras commonly used in ENT practice." },
        { title: "Pairs with the reporting software",
          text: "Captured images sit alongside the endoscopy reports written in ENT Scope AI Pro, and both run as tabs inside CARE Hospital Workstation." }
    ],

    audience: [
        "ENT clinics with a USB otoscope or endoscope on the examination trolley",
        "Practices that show patients their own findings to explain treatment",
        "Clinics keeping an image record of ear and nasal examinations"
    ],

    specs: [
        ["Platform",     "Windows 10 / 11"],
        ["Camera",       "Standard USB otoscope and endoscope cameras"],
        ["Capture",      "Still images and video"],
        ["Storage",      "Local, on the clinic machine"],
        ["Works offline", "Yes"]
    ],

    faq: [
        { q: "Which cameras does it support?",
          a: "Standard USB scope cameras of the kind used in ENT clinics. Tell us the model you have and we will confirm before you buy." },
        { q: "Where do recordings go?",
          a: "To the clinic computer, under the patient's folder. Nothing is uploaded." },
        { q: "Does it work with the other CARE software?",
          a: "Yes. It is designed to sit alongside ENT Scope AI Pro and to run as a tab inside CARE Hospital Workstation." }
    ]
},

/* ======================================================================
   6. ENT ENDOSCOPE & OTOSCOPE WiFi CAMERA   (hardware)
   ----------------------------------------------------------------------
   NOTE — PLEASE COMPLETE BEFORE SELLING FROM THIS PAGE
   The specification rows below deliberately contain only facts that hold
   for the camera as a category. The numbers a buyer will ask for —
   sensor resolution, probe diameter, cable or probe length, battery life,
   IP rating, what is in the box, warranty — depend on the exact unit you
   supply, so they are NOT stated here rather than guessed. Add them to
   `specs` once the model is fixed, and the page will show them.
   ====================================================================== */

"wifi-scope-camera": {
    id: "wifi-scope-camera",
    name: "ENT Endoscope & Otoscope WiFi Camera",
    tagline: "Wireless scope camera, matched to our software.",
    category: "Hardware",
    categoryKey: "Hardware",
    status: "available",
    learning: false,
    regulatory: false,
    platforms: ["Wi-Fi", "Pairs with CARE software"],
    icon: "fa-solid fa-wifi",
    image: "images/products/wifi-scope-camera.svg",
    imageAlt: "ENT endoscope and otoscope Wi-Fi camera with its live view on a laptop and a phone",

    /* Hardware — nothing to download, so no trial button. */
    trial: null,

    summary:
        "A wireless endoscope and otoscope camera that connects over Wi-Fi, " +
        "supplied set up and tested against our own software. No capture card, " +
        "no trailing USB lead across the examination trolley — the live view " +
        "appears on the consulting-room PC, and on a phone or tablet when that " +
        "is easier to hold.",

    highlights: [
        { icon: "fa-solid fa-wifi",          title: "No cable to the PC",    text: "Connects over Wi-Fi, so the scope is not tethered to the computer." },
        { icon: "fa-solid fa-plug-circle-check", title: "Tested with our software", text: "Supplied working with CARE ENT Scope Camera, not left for you to configure." },
        { icon: "fa-solid fa-ear-listen",    title: "Ear and nasal use",     text: "For otoscopy and nasal examination in a routine ENT clinic." },
        { icon: "fa-solid fa-mobile-screen", title: "Phone or PC view",      text: "Show the patient the finding on whichever screen is closest to hand." }
    ],

    features: [
        { title: "Wireless live view",
          text: "The camera creates its own Wi-Fi connection, so the examination image reaches the PC, phone or tablet without a cable running back to the machine." },
        { title: "Supplied configured",
          text: "We pair it with CARE ENT Scope Camera and confirm capture and recording work before it reaches you, rather than shipping a box and a driver disc." },
        { title: "Capture and record through our software",
          text: "Stills and video save into the patient's folder on the clinic machine, alongside the endoscopy reports written in ENT Scope AI Pro." },
        { title: "Works inside the Workstation",
          text: "Runs as a tab in CARE Hospital Workstation, so the camera sits beside reporting, dosing and the EMR in one window." },
        { title: "Patient-facing explanation",
          text: "A large live image is often the quickest way to explain an ear or nasal finding to a patient or a parent during the consultation." }
    ],

    audience: [
        "ENT clinics setting up scope imaging for the first time",
        "Practices replacing a tethered USB scope that restricts movement",
        "Clinics buying the CARE software and wanting hardware known to work with it"
    ],

    /* Add resolution, probe diameter, length, battery, box contents and
       warranty here once the supplied model is fixed. */
    specs: [
        ["Type",          "Endoscope and otoscope camera"],
        ["Connection",    "Wi-Fi"],
        ["Viewing on",    "Windows PC, phone or tablet"],
        ["Works with",    "CARE ENT Scope Camera, CARE Hospital Workstation"],
        ["Capture",       "Still images and video, saved on your own machine"],
        ["Supplied",      "Configured and tested with the CARE software"]
    ],

    faq: [
        { q: "Do I have to buy the camera from you?",
          a: "No. CARE ENT Scope Camera works with standard USB scope cameras as well. We offer this one for clinics that would rather receive hardware already known to work with the software than source and configure it themselves." },
        { q: "Which exact model do you supply?",
          a: "Availability changes, so tell us what you need — ear only, or ear and nasal — and we will confirm the current model, its full specification and the price before you order." },
        { q: "Does it work without the CARE software?",
          a: "It can be viewed on a phone or tablet on its own. Capturing into the patient record and recording alongside endoscopy reports is what our software adds." },
        { q: "Is there a trial?",
          a: "Not for hardware. Ask us for a demonstration, or trial the software first with a scope camera you already own." }
    ]
}
};

/* ==========================================================================
   DISPLAY ORDER on the hub page.
   Add future product ids here.
   ========================================================================== */

window.CARE_PRODUCT_ORDER = [
    "ent-scope-ai-pro",
    "hospital-workstation",
    "histopath-ai-pro",
    "pediatric-dose-calculator",
    "ent-scope-camera",
    "wifi-scope-camera"
];

/* Older or alternative links still resolve to the right page. */
window.CARE_PRODUCT_ALIASES = {
    "ent-scope-ai":        "ent-scope-ai-pro",
    "ent-scope":           "ent-scope-ai-pro",
    "workstation":         "hospital-workstation",
    "care-workstation":    "hospital-workstation",
    "histopath":           "histopath-ai-pro",
    "histopath-ai":        "histopath-ai-pro",
    "dose-calculator":     "pediatric-dose-calculator",
    "paediatric-dose-calculator": "pediatric-dose-calculator",
    "scope-camera":        "ent-scope-camera",
    "care-ent-scope-camera": "ent-scope-camera",
    "wifi-camera":           "wifi-scope-camera",
    "scope-camera-hardware": "wifi-scope-camera",
    "otoscope-camera":       "wifi-scope-camera"
};

/* ==========================================================================
   ENQUIRY CONTACTS — used by the hub, every product page and the
   enquiry panel. Change here and it changes everywhere.
   ========================================================================== */

window.CARE_PRODUCT_CONTACT = {
    emails: ["dr.khanabrar@gmail.com", "admin@carehospital.in"],
    phone: "+919370111449",
    phoneDisplay: "+91 93701 11449",
    whatsapp: "919370111449"
};
