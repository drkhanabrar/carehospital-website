"use strict";

/* ==========================================================
   APPOINTMENT BOOKING
   Handles:
   - Department -> Doctor linking
   - Minimum bookable date + generated time slots
   - Removing past time slots / blocking Sundays
   - Form validation
   - Building the WhatsApp message & confirmation modal
   - "Book with this department/doctor" quick-fill buttons
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const appointmentForm = document.getElementById("appointmentForm");
    if (!appointmentForm) return;

    const departmentSelect = document.getElementById("department");
    const doctorSelect = document.getElementById("doctor");
    const appointmentDate = document.getElementById("appointmentDate");
    const appointmentTime = document.getElementById("appointmentTime");
    const appointmentMessage = document.getElementById("appointmentMessage");
    const bookButton = appointmentForm.querySelector(".btn-primary");

    const appointmentModal = document.getElementById("appointmentModal");
    const appointmentModalClose = document.getElementById("appointmentModalClose");
    const continueWhatsApp = document.getElementById("continueWhatsApp");
    const editAppointment = document.getElementById("editAppointment");

    let whatsappURL = "";

    /* ==========================================================
       DEPARTMENT -> DOCTOR LINKING
    ========================================================== */

    const doctors = {

        "ENT": [
            "Dr. Abrar Khan"
        ],

        "Maternity Care": [
            "Dr. Zainab Khan"
        ],

        "Gynaecology": [
            "Dr. Zainab Khan"
        ],

        "Diagnostics & Laboratory": [
            "Dr. Abrar Khan",
            "Dr. Zainab Khan"
        ],

        "Skin, Hair & Unani Care": [
            "Dr. Zainab Khan"
        ],

        "General Consultation": [
            "Dr. Abrar Khan",
            "Dr. Zainab Khan"
        ]
    };

    if (departmentSelect && doctorSelect) {

        departmentSelect.addEventListener("change", function () {

            const selectedDepartment = this.value;

            doctorSelect.innerHTML = "";

            if (!doctors[selectedDepartment]) {
                doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
                return;
            }

            if (doctors[selectedDepartment].length > 1) {
                doctorSelect.insertAdjacentHTML(
                    "afterbegin",
                    '<option value="" selected>Select Doctor</option>'
                );
            }

            doctors[selectedDepartment].forEach((doctor) => {
                const option = document.createElement("option");
                option.value = doctor;
                option.textContent = doctor;
                doctorSelect.appendChild(option);
            });

            // If there's only one doctor for this department, select it automatically.
            if (doctors[selectedDepartment].length === 1) {
                doctorSelect.selectedIndex = 0;
            }
        });
    }

    /* ==========================================================
       MINIMUM BOOKABLE DATE
    ========================================================== */

    if (appointmentDate) {

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        appointmentDate.min = `${year}-${month}-${day}`;
    }

    /* ==========================================================
       TIME SLOTS (11:30 AM - 9:00 PM, every 15 minutes)
       Clinic hours per the practice's own listing: Mon-Sat 11:30 AM - 9:00 PM,
       Sunday emergency only (Sundays are blocked separately below).
    ========================================================== */

    function generateTimeSlots() {

        if (!appointmentTime) return;

        appointmentTime.innerHTML = '<option value="">Select Time</option>';

        let startHour = 11;
        let startMinute = 30;
        const endHour = 21;
        const endMinute = 0;

        while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {

            const period = startHour >= 12 ? "PM" : "AM";
            let displayHour = startHour % 12;
            if (displayHour === 0) displayHour = 12;

            const displayMinute = String(startMinute).padStart(2, "0");
            const label = `${displayHour}:${displayMinute} ${period}`;
            const value = `${String(startHour).padStart(2, "0")}:${displayMinute}`;

            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            appointmentTime.appendChild(option);

            startMinute += 15;
            if (startMinute >= 60) {
                startMinute = 0;
                startHour++;
            }
        }
    }

    function updateAvailableTimeSlots() {

        if (!appointmentDate || !appointmentTime) return;

        generateTimeSlots();

        if (!appointmentDate.value) return;

        const today = new Date();
        const selectedDate = new Date(appointmentDate.value);
        const isToday = selectedDate.toDateString() === today.toDateString();

        if (!isToday) return;

        const cutoff = new Date(today.getTime() + 30 * 60000);

        [...appointmentTime.options].forEach((option, index) => {

            if (index === 0) return;

            const [hour, minute] = option.value.split(":").map(Number);
            const slotTime = new Date();
            slotTime.setHours(hour, minute, 0, 0);

            if (slotTime <= cutoff) option.remove();
        });

        if (appointmentTime.options.length === 1) {
            const noSlot = document.createElement("option");
            noSlot.textContent = "No slots available today";
            noSlot.value = "";
            appointmentTime.appendChild(noSlot);
        }
    }

    generateTimeSlots();

    /* ==========================================================
       SUNDAY CLOSURE + REFRESH SLOTS ON DATE CHANGE
    ========================================================== */

    if (appointmentDate) {

        appointmentDate.addEventListener("change", function () {

            updateAvailableTimeSlots();

            const day = new Date(this.value).getDay();
            const isSunday = day === 0;

            if (appointmentTime) appointmentTime.disabled = isSunday;
            if (bookButton) bookButton.disabled = isSunday;

            if (appointmentMessage) {
                appointmentMessage.textContent = isSunday
                    ? "Regular OPD is closed on Sundays. Emergency services are available 24×7. Please call +91 9370111449."
                    : "";
            }
        });
    }

    /* ==========================================================
       CONFIRMATION MODAL
    ========================================================== */

    function openAppointmentModal() {

        if (!appointmentModal) return;

        const set = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        set("summaryPatient", document.getElementById("patientName")?.value.trim() || "");
        set("summaryDepartment", departmentSelect?.value || "");
        set("summaryDoctor", doctorSelect?.value || "");

        set("summaryDate", appointmentDate?.value
            ? new Date(appointmentDate.value).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric"
            })
            : "");

        set("summaryTime", appointmentTime?.options[appointmentTime.selectedIndex]?.text || "");
        set("summaryMobile", document.getElementById("mobileNumber")?.value || "");

        appointmentModal.classList.add("active");
    }

    function closeAppointmentModal() {
        if (appointmentModal) appointmentModal.classList.remove("active");
    }

    if (appointmentModalClose) {
        appointmentModalClose.addEventListener("click", closeAppointmentModal);
    }

    if (appointmentModal) {
        appointmentModal.addEventListener("click", (e) => {
            if (e.target === appointmentModal) closeAppointmentModal();
        });
    }

    if (editAppointment) {
        editAppointment.addEventListener("click", closeAppointmentModal);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && appointmentModal?.classList.contains("active")) {
            closeAppointmentModal();
        }
    });

    /* ==========================================================
       FORM VALIDATION + SUBMIT
    ========================================================== */

    appointmentForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const patientName = document.getElementById("patientName")?.value.trim() || "";
        const mobileNumber = document.getElementById("mobileNumber")?.value.trim() || "";
        const department = departmentSelect?.value || "";
        const doctor = doctorSelect?.value || "";
        const date = appointmentDate?.value || "";
        const time = appointmentTime?.value || "";

        // Reset previous validation state
        document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
        document.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
        document.querySelectorAll(".input-success").forEach((el) => el.classList.remove("input-success"));

        let valid = true;

        const validateField = (field, isValid, errorId, message) => {

            const errorEl = document.getElementById(errorId);

            if (!isValid) {
                if (errorEl) errorEl.textContent = message;
                field?.classList.add("input-error");
                valid = false;
            } else {
                field?.classList.add("input-success");
            }
        };

        validateField(
            document.getElementById("patientName"),
            patientName.length >= 3,
            "patientNameError",
            "Please enter at least 3 characters."
        );

        validateField(
            document.getElementById("mobileNumber"),
            /^[0-9]{10}$/.test(mobileNumber),
            "mobileNumberError",
            "Please enter a valid 10-digit mobile number."
        );

        validateField(departmentSelect, department !== "", "departmentError", "Please select a department.");
        validateField(doctorSelect, doctor !== "", "doctorError", "Please select a doctor.");
        validateField(appointmentDate, date !== "", "appointmentDateError", "Please select an appointment date.");
        validateField(appointmentTime, time !== "", "appointmentTimeError", "Please select an appointment time.");

        if (!valid) return;

        const problem = document.getElementById("problem")?.value.trim() || "";

        const formattedDate = new Date(date).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric"
        });

        const [hours, minutes] = time.split(":");
        const timeObject = new Date();
        timeObject.setHours(hours, minutes);

        const formattedTime = timeObject.toLocaleTimeString("en-IN", {
            hour: "numeric", minute: "2-digit", hour12: true
        });

        const whatsappMessage = `====================================
      CARE HOSPITAL
   APPOINTMENT REQUEST
====================================

Patient Name
-------------
${patientName}

Mobile Number
-------------
${mobileNumber}

Department
----------
${department}

Doctor
------
${doctor}

Appointment Date
----------------
${formattedDate}

Preferred Time
--------------
${formattedTime}

Brief Problem
-------------
${problem || "Not Mentioned"}

====================================
Thank you for choosing CARE Hospital.
We will contact you shortly to confirm
your appointment.

Phone: +91 9370111449
====================================`;

        const whatsappNumber = "919370111449";
        whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        openAppointmentModal();
    });

    if (continueWhatsApp) {

        continueWhatsApp.addEventListener("click", () => {

            if (!whatsappURL) return;

            window.open(whatsappURL, "_blank");
            closeAppointmentModal();

            appointmentForm.reset();

            if (doctorSelect) doctorSelect.innerHTML = '<option value="">Select Doctor</option>';

            generateTimeSlots();

            if (appointmentMessage) appointmentMessage.textContent = "";

            document.querySelectorAll(".input-success").forEach((el) => el.classList.remove("input-success"));
            document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
        });
    }

    /* ==========================================================
       SMART DEPARTMENT / DOCTOR BOOKING BUTTONS
       ("Book ENT Appointment", "Book Consultation" on a doctor card, etc.)
    ========================================================== */

    document.querySelectorAll(".book-department").forEach((button) => {

        button.addEventListener("click", function () {

            if (!departmentSelect) return;

            departmentSelect.value = this.dataset.department;
            departmentSelect.dispatchEvent(new Event("change"));

            setTimeout(() => document.getElementById("patientName")?.focus(), 300);
        });
    });

    document.querySelectorAll(".book-doctor").forEach((button) => {

        button.addEventListener("click", function () {

            if (!departmentSelect) return;

            departmentSelect.value = this.dataset.department;
            departmentSelect.dispatchEvent(new Event("change"));

            setTimeout(() => {
                if (doctorSelect) doctorSelect.value = this.dataset.doctor;
                document.getElementById("patientName")?.focus();
            }, 100);
        });
    });

});
