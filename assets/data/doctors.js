/* ==========================================================================
   CARE - DOCTOR DATA
   --------------------------------------------------------------------------
   WHY THIS FILE EXISTS
   The previous build fetched assets/data/doctors/<id>.json at runtime.
   That works over http:// but fails silently over file:// - the browser
   blocks the cross-origin request, fetch() rejects, and every visitor who
   opened the site by double-clicking index.html got "Profile Not Available"
   when they pressed View Profile. That was the profile bug.

   Embedding the same records in a plain <script> removes the network call
   entirely, so profiles render identically from a hard disk, a USB stick,
   a staging server or production.

   The .json files are kept alongside this one as the editable source of
   truth. After editing them, regenerate this file (see README.md).
   ========================================================================== */

window.CARE_DOCTORS = {
    "abrar-khan": {
        "id": "abrar-khan",
        "name": "Dr. Abrar Khan",
        "designation": "Consultant ENT Physician & Healthcare Management Specialist",
        "specialty": "ENT Specialist",
        "photo": "images/doctors/doctor1.jpg",
        "shortDescription": "Providing comprehensive ENT care with over 18 years of clinical experience, specializing in nasal endoscopy, microscopic ear procedures, vertigo management, hearing disorders, and minimally invasive ENT treatments for patients of all ages.",
        "about": "Dr. Abrar Khan is an experienced ENT Physician with more than 18 years of clinical practice. Along with extensive experience in ear, nose and throat disorders, he holds a Master's degree in Healthcare Management from Università Cattolica del Sacro Cuore, Rome, Italy. He combines modern diagnostic techniques, evidence-based treatment, and compassionate patient care to deliver high-quality healthcare. His expertise includes advanced nasal endoscopy, microscopic ear procedures, vertigo evaluation, allergy management, hearing disorders, pediatric ENT care, and emergency foreign body removal.",
        "experience": "18+",
        "patients": "20,000+",
        "procedures": "10,000+",
        "phone": "+919370111449",
        "whatsapp": "919370111449",
        "languages": [
            "English",
            "Hindi",
            "Marathi",
            "Urdu"
        ],
        "highlights": [
            {
                "icon": "fa-solid fa-user-doctor",
                "number": "18+",
                "title": "Years of Experience",
                "text": "Extensive experience in comprehensive ENT diagnosis and treatment."
            },
            {
                "icon": "fa-solid fa-hospital-user",
                "number": "20,000+",
                "title": "Patients Treated",
                "text": "Successfully treated patients across a wide range of ENT conditions."
            },
            {
                "icon": "fa-solid fa-graduation-cap",
                "number": "Master's",
                "title": "Healthcare Management",
                "text": "Master's degree from Università Cattolica del Sacro Cuore, Rome, Italy."
            },
            {
                "icon": "fa-solid fa-award",
                "number": "Advanced",
                "title": "ENT Procedures",
                "text": "Skilled in modern ENT diagnostics and minimally invasive procedures."
            }
        ],
        "education": [
            {
                "year": "2018 – 2020",
                "degree": "Master in Healthcare Management",
                "institute": "Università Cattolica del Sacro Cuore, Rome, Italy",
                "description": "Completed postgraduate education in healthcare management with emphasis on hospital administration, healthcare systems, quality improvement, leadership, and strategic healthcare planning."
            },
            {
                "year": "Rome, Italy",
                "degree": "Former Assistant Doctor",
                "institute": "The Gemelli University Hospital, Rome, Italy",
                "description": "Served as Assistant Doctor at one of Europe's leading university teaching hospitals, gaining international clinical exposure alongside postgraduate training in healthcare management."
            }
        ],
        "expertise": [
            "ENT Consultation",
            "Diagnostic Nasal Endoscopy",
            "Microscopic Ear Procedures",
            "Vertigo Evaluation",
            "Hearing Loss Assessment",
            "Ear Wax Removal",
            "Foreign Body Removal",
            "Sinusitis Treatment",
            "Allergic Rhinitis",
            "Tonsillitis",
            "Voice Disorders",
            "Pediatric ENT Care",
            "Nasal Allergy Management",
            "Snoring Evaluation"
        ],
        "treatments": [
            {
                "icon": "fa-solid fa-ear-listen",
                "title": "Comprehensive Ear Care",
                "description": "Diagnosis and treatment of acute and chronic ear disorders using modern examination techniques.",
                "procedures": [
                    "Ear Wax Removal",
                    "Otomycosis Management",
                    "Ear Infection Treatment",
                    "Microscopic Ear Examination",
                    "Hearing Assessment"
                ]
            },
            {
                "icon": "fa-solid fa-nose",
                "title": "Nasal & Sinus Care",
                "description": "Advanced diagnosis and treatment for nasal obstruction, allergies, and sinus diseases.",
                "procedures": [
                    "Diagnostic Nasal Endoscopy",
                    "Allergic Rhinitis Management",
                    "Sinusitis Treatment",
                    "Epistaxis Management",
                    "Nasal Obstruction Evaluation"
                ]
            },
            {
                "icon": "fa-solid fa-head-side-cough",
                "title": "Throat & Voice Disorders",
                "description": "Evaluation and treatment of throat infections, swallowing disorders, and voice-related conditions.",
                "procedures": [
                    "Tonsillitis Management",
                    "Pharyngitis Treatment",
                    "Voice Disorder Assessment",
                    "Laryngitis Care",
                    "GERD / LPR Evaluation"
                ]
            },
            {
                "icon": "fa-solid fa-person-circle-plus",
                "title": "Emergency ENT Procedures",
                "description": "Prompt management of ENT emergencies and minor procedures.",
                "procedures": [
                    "Foreign Body Removal (Ear)",
                    "Foreign Body Removal (Nose)",
                    "Foreign Body Removal (Throat)",
                    "Nasal Packing",
                    "Emergency ENT Evaluation"
                ]
            },
            {
                "icon": "fa-solid fa-child",
                "title": "Pediatric ENT",
                "description": "Specialized ENT care for infants and children with a patient-friendly approach.",
                "procedures": [
                    "Pediatric Ear Infections",
                    "Adenoid Assessment",
                    "Tonsil Disorders",
                    "Hearing Evaluation",
                    "Nasal Allergy Care"
                ]
            },
            {
                "icon": "fa-solid fa-stethoscope",
                "title": "General ENT Consultation",
                "description": "Comprehensive evaluation and personalized treatment planning for all ENT conditions.",
                "procedures": [
                    "Complete ENT Examination",
                    "Preventive ENT Care",
                    "Lifestyle Counseling",
                    "Follow-up Care",
                    "Second Opinion Consultation"
                ]
            }
        ],
        "schedule": [
            {
                "day": "Monday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Tuesday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Wednesday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Thursday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Friday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Saturday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Sunday",
                "time": "Emergency Consultation / By Appointment"
            }
        ],
        "testimonials": [
            {
                "name": "Mr. Rahul P.",
                "rating": 5,
                "comment": "Dr. Abrar Khan explained my condition very clearly and the treatment worked perfectly."
            },
            {
                "name": "Mrs. Farzana S.",
                "rating": 5,
                "comment": "Very caring doctor. My child's ear infection was treated quickly."
            },
            {
                "name": "Mr. Imran K.",
                "rating": 5,
                "comment": "Excellent diagnosis and modern ENT care."
            }
        ],
        "faq": [
            {
                "question": "Do I need an appointment?",
                "answer": "Appointments are recommended, but walk-in patients are accommodated whenever possible."
            },
            {
                "question": "Do you treat children?",
                "answer": "Yes. Pediatric ENT consultations are available."
            },
            {
                "question": "Is nasal endoscopy painful?",
                "answer": "It is generally well tolerated and performed with appropriate precautions to minimize discomfort."
            },
            {
                "question": "Do you remove foreign bodies from the ear and nose?",
                "answer": "Yes. Emergency foreign body removal is one of our routine ENT procedures."
            }
        ],
        "slug": "abrar-khan"
    },
    "zainab-khan": {
        "id": "zainab-khan",
        "name": "Dr. Zainab Khan",
        "designation": "Consultant Obstetrician & Gynecologist",
        "specialty": "Women's Health Specialist",
        "photo": "images/doctors/doctor2.jpg",
        "shortDescription": "Dedicated to providing comprehensive women's healthcare with a compassionate, patient-centered approach. Experienced in pregnancy care, infertility management, PCOS/PCOD, menstrual disorders, adolescent gynecology, menopause care, cosmetic gynecology, and skin & hair treatments.",
        "about": "Dr. Zainab Khan is committed to delivering personalized healthcare for women at every stage of life. With extensive clinical experience, she provides evidence-based obstetric and gynecological care while ensuring every patient feels comfortable, respected, and well-informed. Her approach combines preventive healthcare, early diagnosis, modern treatment protocols, and long-term wellness planning for women of all ages.",
        "experience": "18+",
        "patients": "20,000+",
        "procedures": "12,000+",
        "phone": "+919370111449",
        "whatsapp": "919370111449",
        "languages": [
            "English",
            "Hindi",
            "Marathi",
            "Urdu"
        ],
        "highlights": [
            {
                "icon": "fa-solid fa-user-doctor",
                "number": "18+",
                "title": "Years Experience",
                "text": "Dedicated to comprehensive women's healthcare."
            },
            {
                "icon": "fa-solid fa-heart-circle-check",
                "number": "20,000+",
                "title": "Patients Treated",
                "text": "Trusted by thousands of women for compassionate medical care."
            },
            {
                "icon": "fa-solid fa-baby",
                "number": "High Risk",
                "title": "Pregnancy Care",
                "text": "Management of routine and high-risk pregnancies."
            },
            {
                "icon": "fa-solid fa-award",
                "number": "Advanced",
                "title": "Women's Wellness",
                "text": "Focused on preventive care and long-term reproductive health."
            }
        ],
        "education": [
            {
                "year": "Indore, MP",
                "degree": "Former Assistant Gynaecologist",
                "institute": "Life Care Hospital and Infertility Centre, Indore, MP",
                "description": "Practised as Assistant Gynaecologist at a dedicated infertility centre, building focused experience in fertility evaluation, assisted conception and high-risk obstetric care."
            },
            {
                "year": "Clinical Practice",
                "degree": "Women's Health & Obstetrics",
                "institute": "Clinical Experience",
                "description": "Extensive experience in pregnancy care, infertility management, gynecological disorders, preventive care, and cosmetic gynecology."
            }
        ],
        "expertise": [
            "Pregnancy Care",
            "High-Risk Pregnancy",
            "Normal Delivery",
            "Infertility Management",
            "PCOS / PCOD",
            "Menstrual Disorders",
            "Family Planning",
            "Adolescent Gynecology",
            "Menopause Management",
            "Cervical Cancer Screening",
            "Breast Health",
            "Cosmetic Gynecology",
            "Hair Treatment",
            "Skin Care"
        ],
        "treatments": [
            {
                "icon": "fa-solid fa-baby",
                "title": "Pregnancy Care",
                "description": "Comprehensive antenatal, delivery planning, and postnatal care.",
                "procedures": [
                    "Routine Pregnancy Checkups",
                    "High-Risk Pregnancy",
                    "Ultrasound Guidance",
                    "Nutrition Counseling",
                    "Postnatal Follow-up"
                ]
            },
            {
                "icon": "fa-solid fa-venus",
                "title": "Gynecological Care",
                "description": "Diagnosis and treatment of common and complex gynecological conditions.",
                "procedures": [
                    "Menstrual Disorders",
                    "Pelvic Pain Evaluation",
                    "Fibroid Management",
                    "Ovarian Cyst Evaluation",
                    "Hormonal Disorders"
                ]
            },
            {
                "icon": "fa-solid fa-seedling",
                "title": "Infertility Management",
                "description": "Evidence-based fertility assessment and treatment planning.",
                "procedures": [
                    "Couple Evaluation",
                    "Ovulation Assessment",
                    "PCOS Management",
                    "Hormonal Evaluation",
                    "Fertility Counseling"
                ]
            },
            {
                "icon": "fa-solid fa-heart",
                "title": "Women's Wellness",
                "description": "Preventive healthcare designed to promote lifelong wellness.",
                "procedures": [
                    "Annual Checkups",
                    "Cancer Screening",
                    "Breast Examination",
                    "Vaccination Advice",
                    "Lifestyle Counseling"
                ]
            },
            {
                "icon": "fa-solid fa-spa",
                "title": "Skin & Hair Care",
                "description": "Medical solutions for common skin and hair concerns affecting women.",
                "procedures": [
                    "Hair Loss Management",
                    "Acne Treatment",
                    "Pigmentation Care",
                    "Anti-Aging Advice",
                    "Medical Skin Consultation"
                ]
            },
            {
                "icon": "fa-solid fa-hand-holding-heart",
                "title": "Family Planning",
                "description": "Personalized reproductive health counseling for every stage of life.",
                "procedures": [
                    "Contraceptive Counseling",
                    "Preconception Planning",
                    "Menopause Counseling",
                    "Adolescent Counseling",
                    "Long-Term Women's Health Planning"
                ]
            }
        ],
        "schedule": [
            {
                "day": "Monday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Tuesday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Wednesday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Thursday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Friday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Saturday",
                "time": "10:00 AM – 8:00 PM"
            },
            {
                "day": "Sunday",
                "time": "Emergency Consultation / By Appointment"
            }
        ],
        "testimonials": [
            {
                "name": "Mr. Rahul P.",
                "rating": 5,
                "comment": "Dr. Abrar Khan explained my condition very clearly and the treatment worked perfectly."
            },
            {
                "name": "Mrs. Farzana S.",
                "rating": 5,
                "comment": "Very caring doctor. My child's ear infection was treated quickly."
            },
            {
                "name": "Mr. Imran K.",
                "rating": 5,
                "comment": "Excellent diagnosis and modern ENT care."
            }
        ],
        "faq": [
            {
                "question": "Do I need an appointment?",
                "answer": "Appointments are recommended, but walk-in patients are accommodated whenever possible."
            },
            {
                "question": "Do you treat children?",
                "answer": "Yes. Pediatric ENT consultations are available."
            },
            {
                "question": "Is nasal endoscopy painful?",
                "answer": "It is generally well tolerated and performed with appropriate precautions to minimize discomfort."
            },
            {
                "question": "Do you remove foreign bodies from the ear and nose?",
                "answer": "Yes. Emergency foreign body removal is one of our routine ENT procedures."
            }
        ],
        "slug": "zainab-khan"
    }
};

/* Display order on the "Other Specialists" strip and in search results */
window.CARE_DOCTOR_ORDER = ["abrar-khan", "zainab-khan"];

/* Legacy short ids used by older links (doctor.html?id=abrar) still resolve */
window.CARE_DOCTOR_ALIASES = {
    "abrar": "abrar-khan",
    "zainab": "zainab-khan",
    "dr-abrar-khan": "abrar-khan",
    "dr-zainab-khan": "zainab-khan"
};
