/* ==========================================================================
   CARE — RESEARCH & DEVELOPMENT TRANSLATIONS
   --------------------------------------------------------------------------
   Strings for products.html and product.html. Merges into window.CARE_I18N,
   so it must load AFTER assets/i18n/dictionary.js and BEFORE js/i18n.js.

   WHEN YOU ADD A PRODUCT: add its name, tagline, summary, highlights,
   features, audience lines, spec labels and FAQ entries here in both
   languages. Anything without an entry simply stays in English — the page
   still works, it is just not translated.

   Product NAMES are deliberately kept in Latin script. They are how the
   software is labelled on the installer, in the window title bar and in an
   email enquiry; transliterating them would make it harder, not easier, for
   a buyer to match the page to the product.
   ========================================================================== */

(function () {

    var extra = {

/* ======================================================================
   HINDI
   ====================================================================== */

hi: {

/* --- Navigation & page furniture --- */
"R&D": "अनुसंधान",
"Research & Development": "अनुसंधान एवं विकास",
"Our Research & Development": "हमारा अनुसंधान एवं विकास",
"Clinical software, built inside a working clinic": "कार्यरत क्लिनिक के भीतर विकसित चिकित्सा सॉफ़्टवेयर",
"Every tool here began as something our own practice needed and could not buy. They are written and used by a practising clinician, tested on real clinic days, and offered to other practices once they are genuinely ready. Several are adaptive systems that learn from how your clinic works.": "यहाँ प्रस्तुत हर उपकरण हमारी अपनी आवश्यकता से जन्मा है, जो बाज़ार में उपलब्ध नहीं था। इन्हें एक कार्यरत चिकित्सक ने लिखा और स्वयं उपयोग किया है, वास्तविक क्लिनिक दिनों में परखा है, और पूर्ण रूप से तैयार होने पर ही अन्य चिकित्सालयों को उपलब्ध कराया है। इनमें से कई अनुकूलनशील प्रणालियाँ हैं जो आपके क्लिनिक की कार्यशैली से सीखती हैं।",
"available today": "आज उपलब्ध",
"Learning systems": "सीखने वाली प्रणालियाँ",
"Built by clinicians": "चिकित्सकों द्वारा निर्मित",
"Your data stays local": "आपका डेटा आपके ही पास रहता है",
"The Projects": "परियोजनाएँ",
"What we have built so far": "अब तक हमने क्या बनाया है",
"Filter by what you need. Every project states plainly whether it is available today or still in development.": "अपनी आवश्यकता के अनुसार छाँटें। हर परियोजना स्पष्ट बताती है कि वह आज उपलब्ध है या अभी विकासाधीन।",
"All tools": "सभी उपकरण",

/* --- Status --- */
"Available now": "अभी उपलब्ध",
"In development": "विकासाधीन",
"Planned": "प्रस्तावित",
"Learning": "सीखने वाला",
"Learning system": "सीखने वाली प्रणाली",

/* --- Categories --- */
"ENT & Reporting": "ENT एवं रिपोर्टिंग",
"ENT / Reporting": "ENT / रिपोर्टिंग",
"Clinic Platform": "क्लिनिक प्लेटफ़ॉर्म",
"Platform": "प्लेटफ़ॉर्म",
"Pathology & AI": "पैथोलॉजी एवं AI",
"Pathology / AI": "पैथोलॉजी / AI",
"Clinical Tools": "चिकित्सा उपकरण",
"Imaging": "इमेजिंग",
"Hardware": "हार्डवेयर",
"ENT Endoscope & Otoscope WiFi Camera": "ENT एंडोस्कोप एवं ओटोस्कोप वाई-फ़ाई कैमरा",
"Wireless scope camera, matched to our software.": "वायरलेस स्कोप कैमरा, हमारे सॉफ़्टवेयर के अनुरूप।",
"Wi-Fi": "वाई-फ़ाई",
"Pairs with CARE software": "CARE सॉफ़्टवेयर के साथ जुड़ता है",

/* --- Card & detail furniture --- */
"View details": "विवरण देखें",
"Enquire": "पूछताछ करें",
"More in development": "और भी विकासाधीन",
"We build these tools because our own clinic needed them. New projects are added here as they become usable by other practices. Tell us what would help in yours.": "हम ये उपकरण इसलिए बनाते हैं क्योंकि हमारे अपने क्लिनिक को इनकी आवश्यकता थी। नई परियोजनाएँ यहाँ तब जुड़ती हैं जब वे अन्य चिकित्सालयों के उपयोग योग्य हो जाती हैं। बताइए आपके यहाँ क्या सहायक होगा।",
"Suggest a tool": "कोई उपकरण सुझाएँ",
"Capabilities": "क्षमताएँ",
"What it does": "यह क्या करता है",
"Suitability": "उपयुक्तता",
"Who it is for": "यह किसके लिए है",
"Details": "विवरण",
"Specifications": "विशिष्टताएँ",
"Questions clinics ask": "चिकित्सालयों के सामान्य प्रश्न",
"Also from our R&D": "हमारे अनुसंधान से और भी",
"Other projects": "अन्य परियोजनाएँ",
"All R&D projects": "सभी अनुसंधान परियोजनाएँ",
"Product not found": "उत्पाद नहीं मिला",
"That product page does not exist, or has been renamed.": "यह उत्पाद पृष्ठ मौजूद नहीं है, या इसका नाम बदल दिया गया है।",
"See all R&D projects": "सभी अनुसंधान परियोजनाएँ देखें",
"Product": "उत्पाद",
"Home": "होम",

/* --- Our approach --- */
"Our Approach": "हमारा दृष्टिकोण",
"Why a hospital writes its own software": "एक अस्पताल अपना सॉफ़्टवेयर स्वयं क्यों लिखता है",
"Built from the clinic floor": "क्लिनिक के अनुभव से उपजा",
"Each tool answers a problem we hit during a real OPD — a dosing reference stuck on a phone, reports taking too long, a dozen windows open at once.": "हर उपकरण उस समस्या का उत्तर है जो वास्तविक ओपीडी में सामने आई — फ़ोन में अटकी खुराक सूची, देर से बनती रिपोर्टें, एक साथ खुली दर्जनों विंडो।",
"Learning, not fixed templates": "निश्चित टेम्पलेट नहीं, सीखने वाली प्रणाली",
"Our AI tools adapt to the vocabulary and conventions of the clinic using them, instead of forcing every practice into one generic house style.": "हमारे AI उपकरण उपयोगकर्ता क्लिनिक की शब्दावली और परंपराओं के अनुरूप ढलते हैं, न कि हर चिकित्सालय पर एक सामान्य शैली थोपते हैं।",
"Patient data stays with you": "रोगी का डेटा आपके पास ही रहता है",
"These are desktop applications. Records live on your own machines, and the core work continues when the internet does not.": "ये डेस्कटॉप अनुप्रयोग हैं। रिकॉर्ड आपकी अपनी मशीनों पर रहते हैं, और इंटरनेट बंद होने पर भी मुख्य कार्य चलता रहता है।",
"The clinician stays in charge": "निर्णय चिकित्सक के ही हाथ में",
"Nothing diagnoses or prescribes on its own. Suggestions are drafts, shown with their basis, for you to accept, change or throw away.": "कोई भी उपकरण स्वयं निदान या नुस्ख़ा नहीं करता। सुझाव केवल प्रारूप हैं, अपने आधार सहित प्रस्तुत, जिन्हें आप स्वीकार करें, बदलें या अस्वीकार करें।",

/* --- Learning panel --- */
"It gets better the more your clinic uses it": "आपका क्लिनिक जितना उपयोग करेगा, यह उतना बेहतर होगा",
"This is an adaptive tool, not a fixed template. It takes account of the work your clinic has already done, so its suggestions move towards your own vocabulary, your common findings and your reporting conventions — while every output still passes through you before it counts.": "यह एक अनुकूलनशील उपकरण है, कोई निश्चित टेम्पलेट नहीं। यह आपके क्लिनिक के पूर्व कार्य को ध्यान में रखता है, जिससे इसके सुझाव आपकी शब्दावली, आपके सामान्य निष्कर्षों और आपकी रिपोर्टिंग परंपराओं की ओर बढ़ते हैं — और हर परिणाम मान्य होने से पूर्व आपसे होकर ही गुज़रता है।",
"You work normally": "आप सामान्य रूप से कार्य करें",
"Write reports and sign them out the way you already do.": "रिपोर्ट लिखें और वैसे ही अंतिम करें जैसे आप पहले से करते हैं।",
"It observes patterns": "यह प्रवृत्तियाँ देखता है",
"Your accepted wording and your corrections both carry information.": "आपके स्वीकृत शब्द और आपके सुधार, दोनों जानकारी देते हैं।",
"Suggestions sharpen": "सुझाव और सटीक होते हैं",
"Drafts start sounding like your clinic instead of a textbook.": "प्रारूप पाठ्यपुस्तक जैसे नहीं, आपके क्लिनिक जैसे लगने लगते हैं।",
"You stay in charge": "नियंत्रण आपके पास रहता है",
"Nothing is saved or sent until you have reviewed and approved it.": "आपकी समीक्षा और स्वीकृति से पहले कुछ भी सहेजा या भेजा नहीं जाता।",

/* --- Enquiry panel --- */
"Download 15-day free trial": "15 दिन का निःशुल्क परीक्षण डाउनलोड करें",
"No payment details needed.": "भुगतान विवरण की आवश्यकता नहीं।",
"Full features for": "पूर्ण सुविधाएँ",
"days.": "दिनों तक।",
"Purchase or enquire →": "ख़रीदें या पूछताछ करें →",
"soon": "शीघ्र",
"Purchase or enquire": "ख़रीदें या पूछताछ करें",
"Tell us about your clinic — how many computers, which departments, and what you are using today. We will tell you honestly whether this fits, what it costs, and what is genuinely ready to install.": "अपने क्लिनिक के बारे में बताइए — कितने कंप्यूटर, कौन-से विभाग, और वर्तमान में आप क्या उपयोग कर रहे हैं। हम ईमानदारी से बताएँगे कि यह उपयुक्त है या नहीं, लागत कितनी होगी, और वास्तव में क्या स्थापित करने योग्य तैयार है।",
"Pricing and licensing for your number of PCs": "आपके कंप्यूटरों की संख्या के अनुसार मूल्य एवं लाइसेंस",
"A walkthrough before you commit to anything": "किसी भी निर्णय से पहले पूरा प्रदर्शन",
"Setup with your hospital name, logo and contact details": "आपके अस्पताल के नाम, लोगो और संपर्क विवरण के साथ सेटअप",
"Built and supported by a practising clinician": "कार्यरत चिकित्सक द्वारा निर्मित एवं समर्थित",
"Talk to us": "हमसे बात करें",
"Write to either address, or message on WhatsApp. Mention the product you are interested in.": "किसी भी पते पर लिखें, या WhatsApp पर संदेश भेजें। जिस उत्पाद में रुचि है उसका उल्लेख करें।",
"Email": "ईमेल",
"Alternate email": "वैकल्पिक ईमेल",
"Call": "कॉल करें",

/* --- Clinical notice --- */
"Clinical use": "चिकित्सकीय उपयोग",
"This software supports a qualified clinician; it does not practise medicine. Suggestions are drafts to be reviewed, edited or rejected, and the basis for each one is shown so it can be judged rather than accepted blindly. Responsibility for diagnosis, prescribing and every clinical decision remains with the treating clinician.": "यह सॉफ़्टवेयर एक योग्य चिकित्सक की सहायता करता है; यह स्वयं चिकित्सा नहीं करता। सुझाव केवल प्रारूप हैं जिन्हें देखा, संशोधित या अस्वीकार किया जाना है, और प्रत्येक का आधार दिखाया जाता है ताकि उसे परखा जा सके, आँख मूँदकर स्वीकार न किया जाए। निदान, नुस्ख़े और हर चिकित्सकीय निर्णय का उत्तरदायित्व उपचार करने वाले चिकित्सक का ही रहता है।",

/* --- Taglines --- */
"Endoscopy reporting that learns how your clinic writes.": "एंडोस्कोपी रिपोर्टिंग जो आपके क्लिनिक की लेखन-शैली सीखती है।",
"Every clinic application behind one window.": "क्लिनिक के सभी अनुप्रयोग एक ही विंडो में।",
"Slide analysis and report drafting for histopathology.": "हिस्टोपैथोलॉजी हेतु स्लाइड विश्लेषण एवं रिपोर्ट प्रारूपण।",
"Weight-based paediatric dosing, native on Windows.": "वज़न-आधारित बाल खुराक गणना, Windows पर मूल रूप से।",
"Live view and recording for USB otoscope and endoscope cameras.": "USB ओटोस्कोप एवं एंडोस्कोप कैमरों हेतु सजीव दृश्य एवं रिकॉर्डिंग।"

},

/* ======================================================================
   URDU
   ====================================================================== */

ur: {

/* --- Navigation & page furniture --- */
"R&D": "تحقیق",
"Research & Development": "تحقیق و ترقی",
"Our Research & Development": "ہماری تحقیق و ترقی",
"Clinical software, built inside a working clinic": "ایک فعال کلینک کے اندر تیار کردہ طبی سافٹ ویئر",
"Every tool here began as something our own practice needed and could not buy. They are written and used by a practising clinician, tested on real clinic days, and offered to other practices once they are genuinely ready. Several are adaptive systems that learn from how your clinic works.": "یہاں موجود ہر آلہ ہماری اپنی ضرورت سے پیدا ہوا، جو بازار میں دستیاب نہیں تھا۔ انہیں ایک فعال معالج نے لکھا اور خود استعمال کیا، حقیقی کلینک کے دنوں میں آزمایا، اور مکمل طور پر تیار ہونے پر ہی دوسرے اداروں کو پیش کیا۔ ان میں سے کئی ایسے نظام ہیں جو آپ کے کلینک کے طریقۂ کار سے سیکھتے ہیں۔",
"available today": "آج دستیاب",
"Learning systems": "سیکھنے والے نظام",
"Built by clinicians": "معالجین کے ہاتھوں تیار",
"Your data stays local": "آپ کا ڈیٹا آپ ہی کے پاس رہتا ہے",
"The Projects": "منصوبے",
"What we have built so far": "اب تک ہم نے کیا بنایا ہے",
"Filter by what you need. Every project states plainly whether it is available today or still in development.": "اپنی ضرورت کے مطابق چھانٹیں۔ ہر منصوبہ واضح بتاتا ہے کہ وہ آج دستیاب ہے یا ابھی زیرِ تکمیل۔",
"All tools": "تمام آلات",

/* --- Status --- */
"Available now": "ابھی دستیاب",
"In development": "زیرِ تکمیل",
"Planned": "مجوزہ",
"Learning": "سیکھنے والا",
"Learning system": "سیکھنے والا نظام",

/* --- Categories --- */
"ENT & Reporting": "ENT اور رپورٹنگ",
"ENT / Reporting": "ENT / رپورٹنگ",
"Clinic Platform": "کلینک پلیٹ فارم",
"Platform": "پلیٹ فارم",
"Pathology & AI": "پیتھالوجی اور AI",
"Pathology / AI": "پیتھالوجی / AI",
"Clinical Tools": "طبی آلات",
"Imaging": "امیجنگ",
"Hardware": "ہارڈ ویئر",
"ENT Endoscope & Otoscope WiFi Camera": "ENT اینڈوسکوپ اور اوٹوسکوپ وائی فائی کیمرہ",
"Wireless scope camera, matched to our software.": "وائرلیس اسکوپ کیمرہ، ہمارے سافٹ ویئر کے مطابق۔",
"Wi-Fi": "وائی فائی",
"Pairs with CARE software": "CARE سافٹ ویئر کے ساتھ منسلک",

/* --- Card & detail furniture --- */
"View details": "تفصیلات دیکھیں",
"Enquire": "استفسار کریں",
"More in development": "مزید زیرِ تکمیل",
"We build these tools because our own clinic needed them. New projects are added here as they become usable by other practices. Tell us what would help in yours.": "ہم یہ آلات اس لیے بناتے ہیں کہ ہمارے اپنے کلینک کو ان کی ضرورت تھی۔ نئے منصوبے یہاں اسی وقت شامل ہوتے ہیں جب وہ دوسرے اداروں کے قابلِ استعمال ہو جائیں۔ بتائیے آپ کے ہاں کیا مددگار ہوگا۔",
"Suggest a tool": "کوئی آلہ تجویز کریں",
"Capabilities": "صلاحیتیں",
"What it does": "یہ کیا کرتا ہے",
"Suitability": "موزونیت",
"Who it is for": "یہ کس کے لیے ہے",
"Details": "تفصیلات",
"Specifications": "تفصیلی خصوصیات",
"Questions clinics ask": "کلینکس کے عام سوالات",
"Also from our R&D": "ہماری تحقیق سے مزید",
"Other projects": "دیگر منصوبے",
"All R&D projects": "تمام تحقیقی منصوبے",
"Product not found": "پروڈکٹ نہیں ملا",
"That product page does not exist, or has been renamed.": "یہ پروڈکٹ صفحہ موجود نہیں، یا اس کا نام بدل دیا گیا ہے۔",
"See all R&D projects": "تمام تحقیقی منصوبے دیکھیں",
"Product": "پروڈکٹ",
"Home": "ہوم",

/* --- Our approach --- */
"Our Approach": "ہمارا طریقۂ کار",
"Why a hospital writes its own software": "ایک ہسپتال اپنا سافٹ ویئر خود کیوں لکھتا ہے",
"Built from the clinic floor": "کلینک کے تجربے سے پیدا",
"Each tool answers a problem we hit during a real OPD — a dosing reference stuck on a phone, reports taking too long, a dozen windows open at once.": "ہر آلہ اس مسئلے کا جواب ہے جو حقیقی او پی ڈی میں سامنے آیا — فون میں اٹکی خوراک کی فہرست، دیر سے بنتی رپورٹیں، بیک وقت کھلی درجنوں ونڈوز۔",
"Learning, not fixed templates": "مقررہ سانچے نہیں، سیکھنے والا نظام",
"Our AI tools adapt to the vocabulary and conventions of the clinic using them, instead of forcing every practice into one generic house style.": "ہمارے AI آلات استعمال کرنے والے کلینک کی اصطلاحات اور روایات کے مطابق ڈھلتے ہیں، نہ کہ ہر ادارے پر ایک عمومی طرز مسلط کرتے ہیں۔",
"Patient data stays with you": "مریض کا ڈیٹا آپ ہی کے پاس رہتا ہے",
"These are desktop applications. Records live on your own machines, and the core work continues when the internet does not.": "یہ ڈیسک ٹاپ ایپلیکیشنز ہیں۔ ریکارڈ آپ کی اپنی مشینوں پر رہتے ہیں، اور انٹرنیٹ بند ہونے پر بھی بنیادی کام جاری رہتا ہے۔",
"The clinician stays in charge": "فیصلہ معالج ہی کے ہاتھ میں",
"Nothing diagnoses or prescribes on its own. Suggestions are drafts, shown with their basis, for you to accept, change or throw away.": "کوئی آلہ خود تشخیص یا نسخہ نہیں کرتا۔ تجاویز محض مسودے ہیں، اپنی بنیاد کے ساتھ پیش کیے گئے، جنہیں آپ قبول کریں، بدلیں یا رد کریں۔",

/* --- Learning panel --- */
"It gets better the more your clinic uses it": "آپ کا کلینک جتنا استعمال کرے گا، یہ اتنا بہتر ہوگا",
"This is an adaptive tool, not a fixed template. It takes account of the work your clinic has already done, so its suggestions move towards your own vocabulary, your common findings and your reporting conventions — while every output still passes through you before it counts.": "یہ ایک ڈھلنے والا آلہ ہے، کوئی مقررہ سانچہ نہیں۔ یہ آپ کے کلینک کے پچھلے کام کو مدِنظر رکھتا ہے، جس سے اس کی تجاویز آپ کی اصطلاحات، آپ کے عام نتائج اور آپ کی رپورٹنگ روایات کی طرف بڑھتی ہیں — اور ہر نتیجہ معتبر ہونے سے پہلے آپ ہی سے گزرتا ہے۔",
"You work normally": "آپ معمول کے مطابق کام کریں",
"Write reports and sign them out the way you already do.": "رپورٹیں لکھیں اور اسی طرح حتمی کریں جیسے آپ پہلے سے کرتے ہیں۔",
"It observes patterns": "یہ طرزیں دیکھتا ہے",
"Your accepted wording and your corrections both carry information.": "آپ کے منظور شدہ الفاظ اور آپ کی اصلاحات، دونوں معلومات دیتی ہیں۔",
"Suggestions sharpen": "تجاویز مزید درست ہوتی ہیں",
"Drafts start sounding like your clinic instead of a textbook.": "مسودے نصابی کتاب کے بجائے آپ کے کلینک جیسے لگنے لگتے ہیں۔",
"You stay in charge": "اختیار آپ ہی کے پاس رہتا ہے",
"Nothing is saved or sent until you have reviewed and approved it.": "آپ کے جائزے اور منظوری سے پہلے کچھ محفوظ یا ارسال نہیں ہوتا۔",

/* --- Enquiry panel --- */
"Download 15-day free trial": "15 دن کا مفت ٹرائل ڈاؤن لوڈ کریں",
"No payment details needed.": "ادائیگی کی تفصیلات درکار نہیں۔",
"Full features for": "مکمل سہولیات",
"days.": "دنوں تک۔",
"Purchase or enquire →": "خریدیں یا استفسار کریں →",
"soon": "جلد",
"Purchase or enquire": "خریدیں یا استفسار کریں",
"Tell us about your clinic — how many computers, which departments, and what you are using today. We will tell you honestly whether this fits, what it costs, and what is genuinely ready to install.": "اپنے کلینک کے بارے میں بتائیے — کتنے کمپیوٹر، کون سے شعبے، اور فی الحال آپ کیا استعمال کر رہے ہیں۔ ہم دیانت داری سے بتائیں گے کہ یہ موزوں ہے یا نہیں، لاگت کیا ہوگی، اور حقیقتاً کیا نصب کرنے کے لیے تیار ہے۔",
"Pricing and licensing for your number of PCs": "آپ کے کمپیوٹروں کی تعداد کے مطابق قیمت اور لائسنس",
"A walkthrough before you commit to anything": "کسی بھی فیصلے سے پہلے مکمل مظاہرہ",
"Setup with your hospital name, logo and contact details": "آپ کے ہسپتال کے نام، لوگو اور رابطہ تفصیلات کے ساتھ تنصیب",
"Built and supported by a practising clinician": "ایک فعال معالج کے ہاتھوں تیار اور معاون",
"Talk to us": "ہم سے بات کریں",
"Write to either address, or message on WhatsApp. Mention the product you are interested in.": "کسی بھی پتے پر لکھیں، یا WhatsApp پر پیغام بھیجیں۔ جس پروڈکٹ میں دلچسپی ہے اس کا ذکر کریں۔",
"Email": "ای میل",
"Alternate email": "متبادل ای میل",
"Call": "کال کریں",

/* --- Clinical notice --- */
"Clinical use": "طبی استعمال",
"This software supports a qualified clinician; it does not practise medicine. Suggestions are drafts to be reviewed, edited or rejected, and the basis for each one is shown so it can be judged rather than accepted blindly. Responsibility for diagnosis, prescribing and every clinical decision remains with the treating clinician.": "یہ سافٹ ویئر ایک مستند معالج کی معاونت کرتا ہے؛ یہ خود طبابت نہیں کرتا۔ تجاویز محض مسودے ہیں جنہیں دیکھا، درست یا رد کیا جانا ہے، اور ہر ایک کی بنیاد دکھائی جاتی ہے تاکہ اسے پرکھا جا سکے، آنکھ بند کر کے قبول نہ کیا جائے۔ تشخیص، نسخے اور ہر طبی فیصلے کی ذمہ داری علاج کرنے والے معالج ہی کی رہتی ہے۔",

/* --- Taglines --- */
"Endoscopy reporting that learns how your clinic writes.": "اینڈوسکوپی رپورٹنگ جو آپ کے کلینک کا اندازِ تحریر سیکھتی ہے۔",
"Every clinic application behind one window.": "کلینک کی تمام ایپلیکیشنز ایک ہی ونڈو میں۔",
"Slide analysis and report drafting for histopathology.": "ہسٹوپیتھالوجی کے لیے سلائیڈ تجزیہ اور رپورٹ کی تیاری۔",
"Weight-based paediatric dosing, native on Windows.": "وزن کی بنیاد پر بچوں کی خوراک، Windows پر براہِ راست۔",
"Live view and recording for USB otoscope and endoscope cameras.": "USB اوٹوسکوپ اور اینڈوسکوپ کیمروں کے لیے براہِ راست منظر اور ریکارڈنگ۔"

}

    };

    /* ---------------------------------------------------------------- */

    window.CARE_I18N = window.CARE_I18N || { hi: {}, ur: {} };

    ["hi", "ur"].forEach(function (lang) {
        window.CARE_I18N[lang] = window.CARE_I18N[lang] || {};
        for (var key in extra[lang]) {
            if (Object.prototype.hasOwnProperty.call(extra[lang], key)) {
                window.CARE_I18N[lang][key] = extra[lang][key];
            }
        }
    });

})();
