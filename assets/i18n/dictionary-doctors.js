/* ==========================================================================
   CARE — DOCTOR PROFILE TRANSLATIONS
   --------------------------------------------------------------------------
   The biographical content on doctor.html comes from assets/data/doctors.js,
   which is written in English. Those strings therefore never appeared in the
   main dictionary and the profile pages stayed ~65% English after switching
   language. This file supplies them.

   It MERGES into window.CARE_I18N, so it must load after
   assets/i18n/dictionary.js and before js/i18n.js.

   Medical convention followed here: established clinical terms that Indian
   patients encounter in English on prescriptions and reports (PCOS, GERD,
   endoscopy, PCOD) are kept recognisable, with the explanatory sense
   carried by the surrounding translated text. Translating them into
   unfamiliar coinages would make the page harder to use, not easier.
   ========================================================================== */

(function () {

    var extra = {

/* ======================================================================
   HINDI
   ====================================================================== */

hi: {


/* --- Runtime-composed sentences. {name} / {designation} are substituted
       by assets/js/doctor-profile.js after translation. --- */
"About {name}": "{name} के बारे में",
"Book an Appointment with {name}": "{name} के साथ अपॉइंटमेंट बुक करें",
"Schedule your consultation with {name}, {designation}, and receive compassionate, evidence-based care tailored to your needs.": "{name}, {designation} के साथ अपना परामर्श तय करें और अपनी आवश्यकताओं के अनुरूप संवेदनशील, प्रमाण-आधारित देखभाल प्राप्त करें।",
"{rating} out of 5": "5 में से {rating}",

/* --- Titles & designations --- */
"ENT Specialist & Clinic Administration": "ENT विशेषज्ञ एवं क्लिनिक प्रशासन",
"Leads the ENT department and clinic administration, with postgraduate training in Health Services Management from Università Cattolica del Sacro Cuore, Rome. Provides complete ear, nose and throat care — from routine hearing tests to endoscopy and hearing aid fittings.": "ENT विभाग और क्लिनिक प्रशासन का नेतृत्व करते हैं; यूनिवर्सिटा कैटोलिका डेल सैक्रो कुओरे, रोम से हेल्थ सर्विसेज़ मैनेजमेंट में स्नातकोत्तर प्रशिक्षण। नियमित श्रवण जाँच से लेकर एंडोस्कोपी और श्रवण यंत्र फ़िटिंग तक — संपूर्ण कान, नाक और गला देखभाल।",
"Clinic Administration": "क्लिनिक प्रशासन",
"Consultant ENT Physician & Healthcare Management Specialist": "कंसल्टेंट ENT चिकित्सक एवं हेल्थकेयर मैनेजमेंट विशेषज्ञ",
"Consultant Obstetrician & Gynecologist": "कंसल्टेंट प्रसूति एवं स्त्री रोग विशेषज्ञ",

/* --- Languages --- */
"English": "अंग्रेज़ी",
"Hindi": "हिन्दी",
"Marathi": "मराठी",
"Urdu": "उर्दू",

/* --- Highlights --- */
"Years of Experience": "वर्षों का अनुभव",
"Master's": "मास्टर्स",
"Healthcare Management": "हेल्थकेयर मैनेजमेंट",
"Advanced": "उन्नत",
"ENT Procedures": "ENT प्रक्रियाएँ",
"High Risk": "उच्च जोखिम",
"Women's Wellness": "महिला स्वास्थ्य",
"Clinical Experience": "नैदानिक अनुभव",
"Extensive experience in comprehensive ENT diagnosis and treatment.": "संपूर्ण ENT निदान और उपचार में व्यापक अनुभव।",
"Successfully treated patients across a wide range of ENT conditions.": "विविध ENT रोगों से पीड़ित मरीज़ों का सफल उपचार।",
"Master's degree from Università Cattolica del Sacro Cuore, Rome, Italy.": "यूनिवर्सिटा कैटोलिका डेल सैक्रो कुओरे, रोम, इटली से मास्टर्स डिग्री।",
"Skilled in modern ENT diagnostics and minimally invasive procedures.": "आधुनिक ENT निदान और न्यूनतम चीरा-रहित प्रक्रियाओं में दक्ष।",
"Dedicated to comprehensive women's healthcare.": "संपूर्ण महिला स्वास्थ्य सेवा के प्रति समर्पित।",
"Trusted by thousands of women for compassionate medical care.": "संवेदनशील चिकित्सा देखभाल हेतु हज़ारों महिलाओं का विश्वास।",
"Focused on preventive care and long-term reproductive health.": "निवारक देखभाल और दीर्घकालिक प्रजनन स्वास्थ्य पर केंद्रित।",
"Management of routine and high-risk pregnancies.": "सामान्य एवं उच्च जोखिम वाली गर्भावस्था का प्रबंधन।",

/* --- Descriptions --- */
"Providing comprehensive ENT care with over 18 years of clinical experience, specializing in nasal endoscopy, microscopic ear procedures, vertigo management, hearing disorders, and minimally invasive ENT treatments for patients of all ages.": "18 वर्षों से अधिक नैदानिक अनुभव के साथ संपूर्ण ENT देखभाल; नेज़ल एंडोस्कोपी, सूक्ष्मदर्शी कान प्रक्रियाओं, चक्कर के उपचार, श्रवण विकारों तथा हर आयु के मरीज़ों हेतु न्यूनतम चीरा-रहित ENT उपचार में विशेषज्ञता।",
"Dr. Abrar Khan is an experienced ENT Physician with more than 18 years of clinical practice. Along with extensive experience in ear, nose and throat disorders, he holds a Master's degree in Healthcare Management from Università Cattolica del Sacro Cuore, Rome, Italy. He combines modern diagnostic techniques, evidence-based treatment, and compassionate patient care to deliver high-quality healthcare. His expertise includes advanced nasal endoscopy, microscopic ear procedures, vertigo evaluation, allergy management, hearing disorders, pediatric ENT care, and emergency foreign body removal.": "डॉ. अबरार खान 18 वर्षों से अधिक नैदानिक अभ्यास वाले अनुभवी ENT चिकित्सक हैं। कान, नाक और गले के विकारों में व्यापक अनुभव के साथ-साथ उन्होंने यूनिवर्सिटा कैटोलिका डेल सैक्रो कुओरे, रोम, इटली से हेल्थकेयर मैनेजमेंट में मास्टर्स डिग्री प्राप्त की है। वे आधुनिक निदान तकनीक, प्रमाण-आधारित उपचार और संवेदनशील रोगी देखभाल के संगम से उच्च गुणवत्ता की स्वास्थ्य सेवा प्रदान करते हैं। उनकी विशेषज्ञता में उन्नत नेज़ल एंडोस्कोपी, सूक्ष्मदर्शी कान प्रक्रियाएँ, चक्कर का मूल्यांकन, एलर्जी प्रबंधन, श्रवण विकार, बाल ENT देखभाल तथा आपातकालीन बाहरी वस्तु निष्कासन सम्मिलित हैं।",
"Dedicated to providing comprehensive women's healthcare with a compassionate, patient-centered approach. Experienced in pregnancy care, infertility management, PCOS/PCOD, menstrual disorders, adolescent gynecology, menopause care, cosmetic gynecology, and skin & hair treatments.": "संवेदनशील और रोगी-केंद्रित दृष्टिकोण के साथ संपूर्ण महिला स्वास्थ्य सेवा के प्रति समर्पित। गर्भावस्था देखभाल, निःसंतानता उपचार, PCOS/PCOD, मासिक धर्म विकार, किशोरी स्त्री रोग, रजोनिवृत्ति देखभाल, कॉस्मेटिक गायनेकोलॉजी तथा त्वचा एवं बाल उपचार में अनुभवी।",
"Dr. Zainab Khan is committed to delivering personalized healthcare for women at every stage of life. With extensive clinical experience, she provides evidence-based obstetric and gynecological care while ensuring every patient feels comfortable, respected, and well-informed. Her approach combines preventive healthcare, early diagnosis, modern treatment protocols, and long-term wellness planning for women of all ages.": "डॉ. ज़ैनब खान जीवन के हर चरण में महिलाओं को व्यक्तिगत स्वास्थ्य सेवा देने हेतु प्रतिबद्ध हैं। व्यापक नैदानिक अनुभव के साथ वे प्रमाण-आधारित प्रसूति एवं स्त्री रोग देखभाल प्रदान करती हैं और यह सुनिश्चित करती हैं कि हर मरीज़ सहज, सम्मानित और पूर्ण जानकार महसूस करे। उनका दृष्टिकोण निवारक स्वास्थ्य सेवा, शीघ्र निदान, आधुनिक उपचार प्रोटोकॉल तथा हर आयु की महिलाओं हेतु दीर्घकालिक स्वास्थ्य योजना का संगम है।",

/* --- Education & professional experience --- */
"Rome, Italy": "रोम, इटली",
"Former Assistant Doctor": "पूर्व असिस्टेंट डॉक्टर",
"The Gemelli University Hospital, Rome, Italy": "द जेमेल्ली यूनिवर्सिटी हॉस्पिटल, रोम, इटली",
"Served as Assistant Doctor at one of Europe's leading university teaching hospitals, gaining international clinical exposure alongside postgraduate training in healthcare management.": "यूरोप के अग्रणी विश्वविद्यालय शिक्षण अस्पतालों में से एक में असिस्टेंट डॉक्टर के रूप में सेवा दी, जहाँ हेल्थकेयर मैनेजमेंट के स्नातकोत्तर प्रशिक्षण के साथ-साथ अंतरराष्ट्रीय नैदानिक अनुभव प्राप्त हुआ।",
"Indore, MP": "इंदौर, मध्य प्रदेश",
"Former Assistant Gynaecologist": "पूर्व असिस्टेंट स्त्री रोग विशेषज्ञ",
"Life Care Hospital and Infertility Centre, Indore, MP": "लाइफ़ केयर हॉस्पिटल एंड इनफ़र्टिलिटी सेंटर, इंदौर, मध्य प्रदेश",
"Practised as Assistant Gynaecologist at a dedicated infertility centre, building focused experience in fertility evaluation, assisted conception and high-risk obstetric care.": "एक समर्पित निःसंतानता केंद्र में असिस्टेंट स्त्री रोग विशेषज्ञ के रूप में कार्य किया, जहाँ प्रजनन मूल्यांकन, सहायक गर्भधारण और उच्च जोखिम प्रसूति देखभाल में केंद्रित अनुभव प्राप्त हुआ।",
"Education & Professional Experience": "शिक्षा एवं व्यावसायिक अनुभव",
"Master in Healthcare Management": "हेल्थकेयर मैनेजमेंट में मास्टर्स",
"Università Cattolica del Sacro Cuore, Rome, Italy": "यूनिवर्सिटा कैटोलिका डेल सैक्रो कुओरे, रोम, इटली",
"Clinical Practice": "नैदानिक अभ्यास",
"Women's Health & Obstetrics": "महिला स्वास्थ्य एवं प्रसूति",
"Completed postgraduate education in healthcare management with emphasis on hospital administration, healthcare systems, quality improvement, leadership, and strategic healthcare planning.": "अस्पताल प्रशासन, स्वास्थ्य प्रणालियों, गुणवत्ता सुधार, नेतृत्व और सामरिक स्वास्थ्य नियोजन पर बल देते हुए हेल्थकेयर मैनेजमेंट में स्नातकोत्तर शिक्षा पूर्ण की।",
"Extensive experience in pregnancy care, infertility management, gynecological disorders, preventive care, and cosmetic gynecology.": "गर्भावस्था देखभाल, निःसंतानता उपचार, स्त्री रोग विकार, निवारक देखभाल तथा कॉस्मेटिक गायनेकोलॉजी में व्यापक अनुभव।",

/* --- Expertise (ENT) --- */
"Diagnostic Nasal Endoscopy": "नैदानिक नेज़ल एंडोस्कोपी",
"Microscopic Ear Procedures": "सूक्ष्मदर्शी कान प्रक्रियाएँ",
"Vertigo Evaluation": "चक्कर का मूल्यांकन",
"Hearing Loss Assessment": "श्रवण हानि जाँच",
"Ear Wax Removal": "कान का मैल निष्कासन",
"Sinusitis Treatment": "साइनसाइटिस उपचार",
"Allergic Rhinitis": "एलर्जिक राइनाइटिस",
"Tonsillitis": "टॉन्सिलाइटिस",
"Voice Disorders": "स्वर विकार",
"Pediatric ENT Care": "बाल ENT देखभाल",
"Nasal Allergy Management": "नाक की एलर्जी प्रबंधन",
"Snoring Evaluation": "खर्राटों का मूल्यांकन",

/* --- Treatments (ENT) --- */
"Comprehensive Ear Care": "संपूर्ण कान देखभाल",
"Diagnosis and treatment of acute and chronic ear disorders using modern examination techniques.": "आधुनिक परीक्षण तकनीकों से तीव्र एवं दीर्घकालिक कान विकारों का निदान व उपचार।",
"Otomycosis Management": "ओटोमाइकोसिस प्रबंधन",
"Ear Infection Treatment": "कान संक्रमण उपचार",
"Microscopic Ear Examination": "सूक्ष्मदर्शी कान परीक्षण",
"Nasal & Sinus Care": "नाक एवं साइनस देखभाल",
"Advanced diagnosis and treatment for nasal obstruction, allergies, and sinus diseases.": "नाक की रुकावट, एलर्जी और साइनस रोगों का उन्नत निदान व उपचार।",
"Allergic Rhinitis Management": "एलर्जिक राइनाइटिस प्रबंधन",
"Epistaxis Management": "नकसीर (एपिस्टैक्सिस) प्रबंधन",
"Nasal Obstruction Evaluation": "नाक की रुकावट का मूल्यांकन",
"Throat & Voice Disorders": "गला एवं स्वर विकार",
"Evaluation and treatment of throat infections, swallowing disorders, and voice-related conditions.": "गले के संक्रमण, निगलने की समस्या और स्वर संबंधी स्थितियों का मूल्यांकन व उपचार।",
"Tonsillitis Management": "टॉन्सिलाइटिस प्रबंधन",
"Pharyngitis Treatment": "फैरिंजाइटिस उपचार",
"Voice Disorder Assessment": "स्वर विकार जाँच",
"Laryngitis Care": "लैरिंजाइटिस देखभाल",
"GERD / LPR Evaluation": "GERD / LPR मूल्यांकन",
"Emergency ENT Procedures": "आपातकालीन ENT प्रक्रियाएँ",
"Prompt management of ENT emergencies and minor procedures.": "ENT आपात स्थितियों और छोटी प्रक्रियाओं का शीघ्र प्रबंधन।",
"Foreign Body Removal (Ear)": "बाहरी वस्तु निष्कासन (कान)",
"Foreign Body Removal (Nose)": "बाहरी वस्तु निष्कासन (नाक)",
"Foreign Body Removal (Throat)": "बाहरी वस्तु निष्कासन (गला)",
"Nasal Packing": "नेज़ल पैकिंग",
"Emergency ENT Evaluation": "आपातकालीन ENT मूल्यांकन",
"Pediatric ENT": "बाल ENT",
"Specialized ENT care for infants and children with a patient-friendly approach.": "शिशुओं और बच्चों हेतु मैत्रीपूर्ण दृष्टिकोण के साथ विशेष ENT देखभाल।",
"Pediatric Ear Infections": "बच्चों में कान संक्रमण",
"Adenoid Assessment": "एडेनॉइड जाँच",
"Tonsil Disorders": "टॉन्सिल विकार",
"Hearing Evaluation": "श्रवण मूल्यांकन",
"Nasal Allergy Care": "नाक एलर्जी देखभाल",
"General ENT Consultation": "सामान्य ENT परामर्श",
"Comprehensive evaluation and personalized treatment planning for all ENT conditions.": "सभी ENT स्थितियों हेतु संपूर्ण मूल्यांकन और व्यक्तिगत उपचार योजना।",
"Complete ENT Examination": "संपूर्ण ENT परीक्षण",
"Preventive ENT Care": "निवारक ENT देखभाल",
"Lifestyle Counseling": "जीवनशैली परामर्श",
"Follow-up Care": "फ़ॉलो-अप देखभाल",
"Second Opinion Consultation": "द्वितीय राय परामर्श",

/* --- Expertise & treatments (Women's health) --- */
"High-Risk Pregnancy": "उच्च जोखिम गर्भावस्था",
"Normal Delivery": "सामान्य प्रसव",
"Infertility Management": "निःसंतानता प्रबंधन",
"PCOS / PCOD": "PCOS / PCOD",
"Menstrual Disorders": "मासिक धर्म विकार",
"Family Planning": "परिवार नियोजन",
"Adolescent Gynecology": "किशोरी स्त्री रोग",
"Menopause Management": "रजोनिवृत्ति प्रबंधन",
"Cervical Cancer Screening": "सर्वाइकल कैंसर स्क्रीनिंग",
"Breast Health": "स्तन स्वास्थ्य",
"Cosmetic Gynecology": "कॉस्मेटिक गायनेकोलॉजी",
"Comprehensive antenatal, delivery planning, and postnatal care.": "संपूर्ण प्रसवपूर्व देखभाल, प्रसव नियोजन और प्रसवोत्तर देखभाल।",
"Routine Pregnancy Checkups": "नियमित गर्भावस्था जाँच",
"Ultrasound Guidance": "अल्ट्रासाउंड मार्गदर्शन",
"Nutrition Counseling": "पोषण परामर्श",
"Postnatal Follow-up": "प्रसवोत्तर फ़ॉलो-अप",
"Gynecological Care": "स्त्री रोग देखभाल",
"Diagnosis and treatment of common and complex gynecological conditions.": "सामान्य एवं जटिल स्त्री रोग स्थितियों का निदान व उपचार।",
"Pelvic Pain Evaluation": "पेल्विक दर्द मूल्यांकन",
"Fibroid Management": "फ़ाइब्रॉएड प्रबंधन",
"Ovarian Cyst Evaluation": "ओवेरियन सिस्ट मूल्यांकन",
"Hormonal Disorders": "हार्मोनल विकार",
"Evidence-based fertility assessment and treatment planning.": "प्रमाण-आधारित प्रजनन क्षमता जाँच और उपचार योजना।",
"Couple Evaluation": "दंपति मूल्यांकन",
"Ovulation Assessment": "ओव्यूलेशन जाँच",
"PCOS Management": "PCOS प्रबंधन",
"Hormonal Evaluation": "हार्मोनल मूल्यांकन",
"Fertility Counseling": "प्रजनन परामर्श",
"Preventive healthcare designed to promote lifelong wellness.": "आजीवन स्वस्थता को बढ़ावा देने हेतु निवारक स्वास्थ्य सेवा।",
"Annual Checkups": "वार्षिक जाँच",
"Cancer Screening": "कैंसर स्क्रीनिंग",
"Breast Examination": "स्तन परीक्षण",
"Vaccination Advice": "टीकाकरण सलाह",
"Skin & Hair Care": "त्वचा एवं बाल देखभाल",
"Medical solutions for common skin and hair concerns affecting women.": "महिलाओं की सामान्य त्वचा और बाल संबंधी समस्याओं के चिकित्सकीय समाधान।",
"Hair Loss Management": "बाल झड़ना प्रबंधन",
"Acne Treatment": "मुँहासे उपचार",
"Pigmentation Care": "पिगमेंटेशन देखभाल",
"Anti-Aging Advice": "एंटी-एजिंग सलाह",
"Medical Skin Consultation": "चिकित्सकीय त्वचा परामर्श",
"Personalized reproductive health counseling for every stage of life.": "जीवन के हर चरण हेतु व्यक्तिगत प्रजनन स्वास्थ्य परामर्श।",
"Contraceptive Counseling": "गर्भनिरोधक परामर्श",
"Preconception Planning": "गर्भधारण-पूर्व नियोजन",
"Menopause Counseling": "रजोनिवृत्ति परामर्श",
"Adolescent Counseling": "किशोरी परामर्श",
"Long-Term Women's Health Planning": "दीर्घकालिक महिला स्वास्थ्य नियोजन",

/* --- Schedule --- */
"Monday": "सोमवार",
"Tuesday": "मंगलवार",
"Wednesday": "बुधवार",
"Thursday": "गुरुवार",
"Friday": "शुक्रवार",
"Saturday": "शनिवार",
"Sunday": "रविवार",
"Today": "आज",
"10:00 AM – 8:00 PM": "सुबह 10:00 – रात 8:00",
"11:30 AM – 9:00 PM": "सुबह 11:30 – रात 9:00",
"Emergency Only": "केवल आपातकालीन",
"Emergency Consultation / By Appointment": "आपातकालीन परामर्श / अपॉइंटमेंट द्वारा",

/* --- Testimonials --- */
"Mr. Rahul P.": "श्री राहुल पी.",
"Mrs. Farzana S.": "श्रीमती फ़रज़ाना एस.",
"Mr. Imran K.": "श्री इमरान के.",
"Dr. Abrar Khan explained my condition very clearly and the treatment worked perfectly.": "डॉ. अबरार खान ने मेरी स्थिति बहुत स्पष्ट रूप से समझाई और उपचार पूरी तरह कारगर रहा।",
"Very caring doctor. My child's ear infection was treated quickly.": "बहुत ध्यान रखने वाले डॉक्टर। मेरे बच्चे के कान का संक्रमण शीघ्र ठीक हो गया।",
"Excellent diagnosis and modern ENT care.": "उत्कृष्ट निदान और आधुनिक ENT देखभाल।",

/* --- FAQ --- */
"Do I need an appointment?": "क्या अपॉइंटमेंट आवश्यक है?",
"Appointments are recommended, but walk-in patients are accommodated whenever possible.": "अपॉइंटमेंट लेना उचित रहता है, किंतु बिना अपॉइंटमेंट आए मरीज़ों को भी यथासंभव देखा जाता है।",
"Do you treat children?": "क्या आप बच्चों का उपचार करते हैं?",
"Yes. Pediatric ENT consultations are available.": "जी हाँ। बाल ENT परामर्श उपलब्ध है।",
"Is nasal endoscopy painful?": "क्या नेज़ल एंडोस्कोपी दर्दनाक होती है?",
"It is generally well tolerated and performed with appropriate precautions to minimize discomfort.": "यह प्रायः सहज रूप से सहन हो जाती है और असुविधा न्यूनतम रखने हेतु उचित सावधानियों के साथ की जाती है।",
"Do you remove foreign bodies from the ear and nose?": "क्या आप कान और नाक से बाहरी वस्तुएँ निकालते हैं?",
"Yes. Emergency foreign body removal is one of our routine ENT procedures.": "जी हाँ। आपातकालीन बाहरी वस्तु निष्कासन हमारी नियमित ENT प्रक्रियाओं में से एक है।"

},

/* ======================================================================
   URDU
   ====================================================================== */

ur: {


/* --- Runtime-composed sentences --- */
"About {name}": "{name} کے بارے میں",
"Book an Appointment with {name}": "{name} کے ساتھ اپائنٹمنٹ بک کریں",
"Schedule your consultation with {name}, {designation}, and receive compassionate, evidence-based care tailored to your needs.": "{name}، {designation} کے ساتھ اپنی مشاورت طے کریں اور اپنی ضروریات کے مطابق ہمدردانہ، شواہد پر مبنی نگہداشت حاصل کریں۔",
"{rating} out of 5": "5 میں سے {rating}",

/* --- Titles & designations --- */
"ENT Specialist & Clinic Administration": "ENT ماہر و انتظامِ کلینک",
"Leads the ENT department and clinic administration, with postgraduate training in Health Services Management from Università Cattolica del Sacro Cuore, Rome. Provides complete ear, nose and throat care — from routine hearing tests to endoscopy and hearing aid fittings.": "ENT شعبے اور کلینک کے انتظام کی قیادت کرتے ہیں؛ یونیورسٹا کیتھولیکا ڈیل سیکرو کورے، روم سے ہیلتھ سروسز مینجمنٹ میں پوسٹ گریجویٹ تربیت۔ معمول کے سماعتی ٹیسٹ سے لے کر اینڈوسکوپی اور سماعتی آلات کی فٹنگ تک — مکمل کان، ناک اور گلے کی نگہداشت۔",
"Clinic Administration": "انتظامِ کلینک",
"Consultant ENT Physician & Healthcare Management Specialist": "کنسلٹنٹ ENT معالج و ہیلتھ کیئر مینجمنٹ ماہر",
"Consultant Obstetrician & Gynecologist": "کنسلٹنٹ ماہرِ زچگی و امراضِ نسواں",

/* --- Languages --- */
"English": "انگریزی",
"Hindi": "ہندی",
"Marathi": "مراٹھی",
"Urdu": "اردو",

/* --- Highlights --- */
"Years of Experience": "سالہ تجربہ",
"Master's": "ماسٹرز",
"Healthcare Management": "ہیلتھ کیئر مینجمنٹ",
"Advanced": "جدید",
"ENT Procedures": "ENT طریقہ ہائے علاج",
"High Risk": "زیادہ خطرہ",
"Women's Wellness": "خواتین کی صحت",
"Clinical Experience": "طبی تجربہ",
"Extensive experience in comprehensive ENT diagnosis and treatment.": "مکمل ENT تشخیص اور علاج میں وسیع تجربہ۔",
"Successfully treated patients across a wide range of ENT conditions.": "ENT کے مختلف امراض میں مبتلا مریضوں کا کامیاب علاج۔",
"Master's degree from Università Cattolica del Sacro Cuore, Rome, Italy.": "یونیورسٹا کیتھولیکا ڈیل سیکرو کورے، روم، اٹلی سے ماسٹرز ڈگری۔",
"Skilled in modern ENT diagnostics and minimally invasive procedures.": "جدید ENT تشخیص اور کم مداخلت والے طریقوں میں مہارت۔",
"Dedicated to comprehensive women's healthcare.": "خواتین کی مکمل طبی نگہداشت کے لیے وقف۔",
"Trusted by thousands of women for compassionate medical care.": "ہمدردانہ طبی نگہداشت کے لیے ہزاروں خواتین کا اعتماد۔",
"Focused on preventive care and long-term reproductive health.": "احتیاطی نگہداشت اور دیرپا تولیدی صحت پر مرکوز۔",
"Management of routine and high-risk pregnancies.": "عام اور زیادہ خطرے والے حمل کا انتظام۔",

/* --- Descriptions --- */
"Providing comprehensive ENT care with over 18 years of clinical experience, specializing in nasal endoscopy, microscopic ear procedures, vertigo management, hearing disorders, and minimally invasive ENT treatments for patients of all ages.": "اٹھارہ سال سے زائد طبی تجربے کے ساتھ مکمل ENT نگہداشت؛ ناک کی اینڈوسکوپی، خوردبینی کان کے طریقۂ علاج، چکر کے علاج، سماعت کی خرابیوں اور ہر عمر کے مریضوں کے لیے کم مداخلت والے ENT علاج میں مہارت۔",
"Dr. Abrar Khan is an experienced ENT Physician with more than 18 years of clinical practice. Along with extensive experience in ear, nose and throat disorders, he holds a Master's degree in Healthcare Management from Università Cattolica del Sacro Cuore, Rome, Italy. He combines modern diagnostic techniques, evidence-based treatment, and compassionate patient care to deliver high-quality healthcare. His expertise includes advanced nasal endoscopy, microscopic ear procedures, vertigo evaluation, allergy management, hearing disorders, pediatric ENT care, and emergency foreign body removal.": "ڈاکٹر ابرار خان اٹھارہ سال سے زائد طبی تجربے کے حامل ماہر ENT معالج ہیں۔ کان، ناک اور گلے کے امراض میں وسیع تجربے کے ساتھ انہوں نے یونیورسٹا کیتھولیکا ڈیل سیکرو کورے، روم، اٹلی سے ہیلتھ کیئر مینجمنٹ میں ماسٹرز کی ڈگری حاصل کی ہے۔ وہ جدید تشخیصی تکنیک، شواہد پر مبنی علاج اور ہمدردانہ نگہداشت کو یکجا کر کے اعلیٰ معیار کی طبی سہولت فراہم کرتے ہیں۔ ان کی مہارت میں جدید ناک کی اینڈوسکوپی، خوردبینی کان کے طریقۂ علاج، چکر کا جائزہ، الرجی کا علاج، سماعت کی خرابیاں، بچوں کی ENT نگہداشت اور ہنگامی طور پر بیرونی اشیاء کا اخراج شامل ہیں۔",
"Dedicated to providing comprehensive women's healthcare with a compassionate, patient-centered approach. Experienced in pregnancy care, infertility management, PCOS/PCOD, menstrual disorders, adolescent gynecology, menopause care, cosmetic gynecology, and skin & hair treatments.": "ہمدردانہ اور مریض پر مرکوز رویّے کے ساتھ خواتین کی مکمل طبی نگہداشت کے لیے وقف۔ حمل کی نگہداشت، بانجھ پن کے علاج، PCOS/PCOD، ماہواری کی خرابیوں، نوعمر لڑکیوں کے امراضِ نسواں، سنِ یاس کی نگہداشت، کاسمیٹک گائنی اور جلد و بالوں کے علاج میں تجربہ کار۔",
"Dr. Zainab Khan is committed to delivering personalized healthcare for women at every stage of life. With extensive clinical experience, she provides evidence-based obstetric and gynecological care while ensuring every patient feels comfortable, respected, and well-informed. Her approach combines preventive healthcare, early diagnosis, modern treatment protocols, and long-term wellness planning for women of all ages.": "ڈاکٹر زینب خان زندگی کے ہر مرحلے میں خواتین کو ذاتی نوعیت کی طبی سہولت دینے کے لیے پُرعزم ہیں۔ وسیع طبی تجربے کے ساتھ وہ شواہد پر مبنی زچگی اور امراضِ نسواں کی نگہداشت فراہم کرتی ہیں اور اس بات کو یقینی بناتی ہیں کہ ہر مریضہ آرام دہ، باوقار اور مکمل باخبر محسوس کرے۔ ان کا طریقۂ کار احتیاطی نگہداشت، بروقت تشخیص، جدید طریقۂ علاج اور ہر عمر کی خواتین کے لیے دیرپا صحت کی منصوبہ بندی کا امتزاج ہے۔",

/* --- Education & professional experience --- */
"Rome, Italy": "روم، اٹلی",
"Former Assistant Doctor": "سابق اسسٹنٹ ڈاکٹر",
"The Gemelli University Hospital, Rome, Italy": "دی جیمیلی یونیورسٹی ہسپتال، روم، اٹلی",
"Served as Assistant Doctor at one of Europe's leading university teaching hospitals, gaining international clinical exposure alongside postgraduate training in healthcare management.": "یورپ کے صفِ اوّل کے یونیورسٹی تدریسی ہسپتالوں میں سے ایک میں بطور اسسٹنٹ ڈاکٹر خدمات انجام دیں، جہاں ہیلتھ کیئر مینجمنٹ کی پوسٹ گریجویٹ تربیت کے ساتھ بین الاقوامی طبی تجربہ حاصل ہوا۔",
"Indore, MP": "اندور، مدھیہ پردیش",
"Former Assistant Gynaecologist": "سابق اسسٹنٹ ماہرِ امراضِ نسواں",
"Life Care Hospital and Infertility Centre, Indore, MP": "لائف کیئر ہسپتال اینڈ انفرٹیلیٹی سینٹر، اندور، مدھیہ پردیش",
"Practised as Assistant Gynaecologist at a dedicated infertility centre, building focused experience in fertility evaluation, assisted conception and high-risk obstetric care.": "ایک مخصوص بانجھ پن مرکز میں بطور اسسٹنٹ ماہرِ امراضِ نسواں خدمات انجام دیں، جہاں زرخیزی کے جائزے، معاون حمل اور زیادہ خطرے والی زچگی کی نگہداشت میں مرکوز تجربہ حاصل ہوا۔",
"Education & Professional Experience": "تعلیم اور پیشہ ورانہ تجربہ",
"Master in Healthcare Management": "ہیلتھ کیئر مینجمنٹ میں ماسٹرز",
"Università Cattolica del Sacro Cuore, Rome, Italy": "یونیورسٹا کیتھولیکا ڈیل سیکرو کورے، روم، اٹلی",
"Clinical Practice": "طبی پریکٹس",
"Women's Health & Obstetrics": "خواتین کی صحت و زچگی",
"Completed postgraduate education in healthcare management with emphasis on hospital administration, healthcare systems, quality improvement, leadership, and strategic healthcare planning.": "ہسپتال کے انتظام، نظامِ صحت، معیار کی بہتری، قیادت اور طبی منصوبہ بندی پر زور دیتے ہوئے ہیلتھ کیئر مینجمنٹ میں پوسٹ گریجویٹ تعلیم مکمل کی۔",
"Extensive experience in pregnancy care, infertility management, gynecological disorders, preventive care, and cosmetic gynecology.": "حمل کی نگہداشت، بانجھ پن کے علاج، امراضِ نسواں، احتیاطی نگہداشت اور کاسمیٹک گائنی میں وسیع تجربہ۔",

/* --- Expertise (ENT) --- */
"Diagnostic Nasal Endoscopy": "تشخیصی ناک کی اینڈوسکوپی",
"Microscopic Ear Procedures": "خوردبینی کان کے طریقۂ علاج",
"Vertigo Evaluation": "چکر کا جائزہ",
"Hearing Loss Assessment": "سماعت کی کمی کا جائزہ",
"Ear Wax Removal": "کان کے میل کا اخراج",
"Sinusitis Treatment": "سائناسائٹس کا علاج",
"Allergic Rhinitis": "الرجک رائناٹس",
"Tonsillitis": "ٹانسلائٹس",
"Voice Disorders": "آواز کی خرابیاں",
"Pediatric ENT Care": "بچوں کی ENT نگہداشت",
"Nasal Allergy Management": "ناک کی الرجی کا علاج",
"Snoring Evaluation": "خراٹوں کا جائزہ",

/* --- Treatments (ENT) --- */
"Comprehensive Ear Care": "مکمل کان کی نگہداشت",
"Diagnosis and treatment of acute and chronic ear disorders using modern examination techniques.": "جدید معائنے کی تکنیک سے شدید اور دائمی کان کے امراض کی تشخیص و علاج۔",
"Otomycosis Management": "اوٹومائیکوسس کا علاج",
"Ear Infection Treatment": "کان کے انفیکشن کا علاج",
"Microscopic Ear Examination": "خوردبینی کان کا معائنہ",
"Nasal & Sinus Care": "ناک و سائنس کی نگہداشت",
"Advanced diagnosis and treatment for nasal obstruction, allergies, and sinus diseases.": "ناک کی بندش، الرجی اور سائنس کے امراض کی جدید تشخیص و علاج۔",
"Allergic Rhinitis Management": "الرجک رائناٹس کا علاج",
"Epistaxis Management": "نکسیر (ایپی اسٹیکسس) کا علاج",
"Nasal Obstruction Evaluation": "ناک کی بندش کا جائزہ",
"Throat & Voice Disorders": "گلے اور آواز کی خرابیاں",
"Evaluation and treatment of throat infections, swallowing disorders, and voice-related conditions.": "گلے کے انفیکشن، نگلنے کی خرابی اور آواز سے متعلق کیفیات کا جائزہ و علاج۔",
"Tonsillitis Management": "ٹانسلائٹس کا علاج",
"Pharyngitis Treatment": "فیرنجائٹس کا علاج",
"Voice Disorder Assessment": "آواز کی خرابی کا جائزہ",
"Laryngitis Care": "لیرنجائٹس کی نگہداشت",
"GERD / LPR Evaluation": "GERD / LPR کا جائزہ",
"Emergency ENT Procedures": "ہنگامی ENT طریقہ ہائے علاج",
"Prompt management of ENT emergencies and minor procedures.": "ENT کی ہنگامی صورتوں اور معمولی طریقوں کا فوری انتظام۔",
"Foreign Body Removal (Ear)": "بیرونی شے کا اخراج (کان)",
"Foreign Body Removal (Nose)": "بیرونی شے کا اخراج (ناک)",
"Foreign Body Removal (Throat)": "بیرونی شے کا اخراج (گلا)",
"Nasal Packing": "نیزل پیکنگ",
"Emergency ENT Evaluation": "ہنگامی ENT جائزہ",
"Pediatric ENT": "بچوں کی ENT",
"Specialized ENT care for infants and children with a patient-friendly approach.": "شیرخوار بچوں اور بچوں کے لیے دوستانہ انداز میں خصوصی ENT نگہداشت۔",
"Pediatric Ear Infections": "بچوں میں کان کے انفیکشن",
"Adenoid Assessment": "ایڈینائڈ کا جائزہ",
"Tonsil Disorders": "ٹانسل کے امراض",
"Hearing Evaluation": "سماعت کا جائزہ",
"Nasal Allergy Care": "ناک کی الرجی کی نگہداشت",
"General ENT Consultation": "عمومی ENT مشاورت",
"Comprehensive evaluation and personalized treatment planning for all ENT conditions.": "تمام ENT کیفیات کے لیے مکمل جائزہ اور ذاتی نوعیت کی علاج کی منصوبہ بندی۔",
"Complete ENT Examination": "مکمل ENT معائنہ",
"Preventive ENT Care": "احتیاطی ENT نگہداشت",
"Lifestyle Counseling": "طرزِ زندگی کی مشاورت",
"Follow-up Care": "فالو اپ نگہداشت",
"Second Opinion Consultation": "دوسری رائے کی مشاورت",

/* --- Expertise & treatments (Women's health) --- */
"High-Risk Pregnancy": "زیادہ خطرے والا حمل",
"Normal Delivery": "قدرتی زچگی",
"Infertility Management": "بانجھ پن کا علاج",
"PCOS / PCOD": "PCOS / PCOD",
"Menstrual Disorders": "ماہواری کی خرابیاں",
"Family Planning": "خاندانی منصوبہ بندی",
"Adolescent Gynecology": "نوعمری کے امراضِ نسواں",
"Menopause Management": "سنِ یاس کا علاج",
"Cervical Cancer Screening": "سرویکل کینسر کی اسکریننگ",
"Breast Health": "چھاتی کی صحت",
"Cosmetic Gynecology": "کاسمیٹک گائنی",
"Comprehensive antenatal, delivery planning, and postnatal care.": "مکمل قبل از ولادت نگہداشت، زچگی کی منصوبہ بندی اور بعد از ولادت نگہداشت۔",
"Routine Pregnancy Checkups": "حمل کے معمول کے معائنے",
"Ultrasound Guidance": "الٹراساؤنڈ رہنمائی",
"Nutrition Counseling": "غذائی مشاورت",
"Postnatal Follow-up": "بعد از ولادت فالو اپ",
"Gynecological Care": "امراضِ نسواں کی نگہداشت",
"Diagnosis and treatment of common and complex gynecological conditions.": "عام اور پیچیدہ امراضِ نسواں کی تشخیص و علاج۔",
"Pelvic Pain Evaluation": "پیڑو کے درد کا جائزہ",
"Fibroid Management": "فائبرائیڈ کا علاج",
"Ovarian Cyst Evaluation": "بیضہ دانی کی رسولی کا جائزہ",
"Hormonal Disorders": "ہارمونی خرابیاں",
"Evidence-based fertility assessment and treatment planning.": "شواہد پر مبنی زرخیزی کا جائزہ اور علاج کی منصوبہ بندی۔",
"Couple Evaluation": "میاں بیوی کا جائزہ",
"Ovulation Assessment": "بیضہ سازی کا جائزہ",
"PCOS Management": "PCOS کا علاج",
"Hormonal Evaluation": "ہارمونی جائزہ",
"Fertility Counseling": "زرخیزی کی مشاورت",
"Preventive healthcare designed to promote lifelong wellness.": "تاحیات صحت کے فروغ کے لیے احتیاطی طبی نگہداشت۔",
"Annual Checkups": "سالانہ معائنے",
"Cancer Screening": "کینسر کی اسکریننگ",
"Breast Examination": "چھاتی کا معائنہ",
"Vaccination Advice": "ویکسینیشن کا مشورہ",
"Skin & Hair Care": "جلد اور بالوں کی نگہداشت",
"Medical solutions for common skin and hair concerns affecting women.": "خواتین کی عام جلدی اور بالوں کی شکایات کے طبی حل۔",
"Hair Loss Management": "بال گرنے کا علاج",
"Acne Treatment": "کیل مہاسوں کا علاج",
"Pigmentation Care": "جلد کی رنگت کی نگہداشت",
"Anti-Aging Advice": "اینٹی ایجنگ مشورہ",
"Medical Skin Consultation": "طبی جِلدی مشاورت",
"Personalized reproductive health counseling for every stage of life.": "زندگی کے ہر مرحلے کے لیے ذاتی نوعیت کی تولیدی صحت کی مشاورت۔",
"Contraceptive Counseling": "مانع حمل مشاورت",
"Preconception Planning": "حمل سے قبل منصوبہ بندی",
"Menopause Counseling": "سنِ یاس کی مشاورت",
"Adolescent Counseling": "نوعمری کی مشاورت",
"Long-Term Women's Health Planning": "خواتین کی دیرپا صحت کی منصوبہ بندی",

/* --- Schedule --- */
"Monday": "پیر",
"Tuesday": "منگل",
"Wednesday": "بدھ",
"Thursday": "جمعرات",
"Friday": "جمعہ",
"Saturday": "ہفتہ",
"Sunday": "اتوار",
"Today": "آج",
"10:00 AM – 8:00 PM": "صبح 10:00 – رات 8:00",
"11:30 AM – 9:00 PM": "صبح 11:30 – رات 9:00",
"Emergency Only": "صرف ہنگامی صورت",
"Emergency Consultation / By Appointment": "ہنگامی مشاورت / اپائنٹمنٹ سے",

/* --- Testimonials --- */
"Mr. Rahul P.": "جناب راہول پی۔",
"Mrs. Farzana S.": "محترمہ فرزانہ ایس۔",
"Mr. Imran K.": "جناب عمران کے۔",
"Dr. Abrar Khan explained my condition very clearly and the treatment worked perfectly.": "ڈاکٹر ابرار خان نے میری کیفیت نہایت وضاحت سے سمجھائی اور علاج مکمل طور پر کارگر رہا۔",
"Very caring doctor. My child's ear infection was treated quickly.": "بہت خیال رکھنے والے ڈاکٹر۔ میرے بچے کے کان کا انفیکشن جلد ٹھیک ہو گیا۔",
"Excellent diagnosis and modern ENT care.": "بہترین تشخیص اور جدید ENT نگہداشت۔",

/* --- FAQ --- */
"Do I need an appointment?": "کیا اپائنٹمنٹ ضروری ہے؟",
"Appointments are recommended, but walk-in patients are accommodated whenever possible.": "اپائنٹمنٹ لینا بہتر ہے، تاہم بغیر اپائنٹمنٹ آنے والے مریضوں کو بھی حتی الامکان دیکھا جاتا ہے۔",
"Do you treat children?": "کیا آپ بچوں کا علاج کرتے ہیں؟",
"Yes. Pediatric ENT consultations are available.": "جی ہاں۔ بچوں کی ENT مشاورت دستیاب ہے۔",
"Is nasal endoscopy painful?": "کیا ناک کی اینڈوسکوپی تکلیف دہ ہوتی ہے؟",
"It is generally well tolerated and performed with appropriate precautions to minimize discomfort.": "یہ عموماً بآسانی برداشت ہو جاتی ہے اور تکلیف کم سے کم رکھنے کے لیے مناسب احتیاط کے ساتھ کی جاتی ہے۔",
"Do you remove foreign bodies from the ear and nose?": "کیا آپ کان اور ناک سے بیرونی اشیاء نکالتے ہیں؟",
"Yes. Emergency foreign body removal is one of our routine ENT procedures.": "جی ہاں۔ ہنگامی طور پر بیرونی شے کا اخراج ہمارے معمول کے ENT طریقوں میں شامل ہے۔"

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
