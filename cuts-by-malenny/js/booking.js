// Booking Form JavaScript
// NOTE FOR CLAUDE CODE BACKEND INTEGRATION:
// - Service durations: VIP (60min), all others (25-30min)
// - Time slots should be dynamically generated based on service duration
// - Block overlapping appointments (e.g., VIP at 9:00 blocks 9:00-10:00)
// - Add buffer time between appointments (5-10 mins recommended)
// - Fetch real availability from database/calendar
// - Disable already-booked time slots visually

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    let currentStep = 1;
    const totalSteps = 4;
    let formData = {
        service: '',
        serviceName: '',
        servicePrice: '',
        date: '',
        time: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        notes: '',
        reminders: [],
        futureReminders: false
    };

    // Service selection
    const serviceOptions = document.querySelectorAll('input[name="service"]');
    serviceOptions.forEach(option => {
        option.addEventListener('change', function() {
            formData.service = this.value;
            formData.serviceName = this.closest('.service-option').querySelector('.option-name').textContent;
            formData.servicePrice = this.dataset.price;
            updateNextButton(1);
        });
    });

    // Time slot selection
    const timeSlots = document.querySelectorAll('.time-slot');
    const selectedTimeInput = document.getElementById('selected-time');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all slots
            timeSlots.forEach(s => s.classList.remove('selected'));
            // Add selected class to clicked slot
            this.classList.add('selected');
            // Update hidden input
            selectedTimeInput.value = this.dataset.time;
            formData.time = this.textContent;
            updateNextButton(2);
        });
    });

    // Date selection
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            formData.date = this.value;
            updateNextButton(2);
        });
    }

    // Personal info fields
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const notesInput = document.getElementById('notes');

    [firstNameInput, lastNameInput, phoneInput, emailInput].forEach(field => {
        if (field) {
            field.addEventListener('blur', function() {
                window.validateField(this);
            });
            field.addEventListener('input', function() {
                updateFormData();
                updateNextButton(3);
            });
        }
    });

    if (notesInput) {
        notesInput.addEventListener('input', function() {
            formData.notes = this.value;
        });
    }

    // Reminder checkboxes
    const reminderCheckboxes = document.querySelectorAll('input[name="reminders"]');
    const futureReminderCheckbox = document.querySelector('input[name="future-reminders"]');

    reminderCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                formData.reminders.push(this.value);
            } else {
                formData.reminders = formData.reminders.filter(r => r !== this.value);
            }
        });
    });

    if (futureReminderCheckbox) {
        futureReminderCheckbox.addEventListener('change', function() {
            formData.futureReminders = this.checked;
        });
    }

    // Terms checkbox
    const termsCheckbox = document.getElementById('terms-agree');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            const submitBtn = document.getElementById('submit-booking');
            if (submitBtn) {
                submitBtn.disabled = !this.checked;
            }
        });
    }

    // Next step buttons
    const nextButtons = document.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    // Previous step buttons
    const prevButtons = document.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            goToStep(currentStep - 1);
        });
    });

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show confirmation message
        alert('Thank you for your booking request!\n\n' +
              'Service: ' + formData.serviceName + '\n' +
              'Date: ' + formData.date + '\n' +
              'Time: ' + formData.time + '\n\n' +
              'This is a demo site. In the full version, you would be redirected to payment processing.');
        
        // Reset form
        bookingForm.reset();
        goToStep(1);
        
        // Reset visual states
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        document.querySelectorAll('.service-option input').forEach(i => i.checked = false);
    });

    function updateFormData() {
        if (firstNameInput) formData.firstName = firstNameInput.value;
        if (lastNameInput) formData.lastName = lastNameInput.value;
        if (phoneInput) formData.phone = phoneInput.value;
        if (emailInput) formData.email = emailInput.value;
    }

    function validateStep(step) {
        switch(step) {
            case 1:
                return formData.service !== '';
            case 2:
                return formData.date !== '' && formData.time !== '';
            case 3:
                updateFormData();
                let valid = true;
                if (firstNameInput && !window.validateField(firstNameInput)) valid = false;
                if (lastNameInput && !window.validateField(lastNameInput)) valid = false;
                if (phoneInput && !window.validateField(phoneInput)) valid = false;
                if (emailInput && !window.validateField(emailInput)) valid = false;
                return valid;
            case 4:
                return document.getElementById('terms-agree').checked;
            default:
                return true;
        }
    }

    function updateNextButton(step) {
        const nextBtn = document.querySelector(`.form-step[data-step="${step}"] .next-step`);
        if (nextBtn) {
            nextBtn.disabled = !validateStep(step);
        }
    }

    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(s => {
            s.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            currentStep = step;
            
            // Update summary if going to step 4
            if (step === 4) {
                updateSummary();
            }
        }
        
        // Scroll to top of form
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateSummary() {
        document.getElementById('summary-service').textContent = formData.serviceName || '-';
        document.getElementById('summary-date').textContent = formData.date || '-';
        document.getElementById('summary-time').textContent = formData.time || '-';
        document.getElementById('summary-name').textContent = (formData.firstName + ' ' + formData.lastName).trim() || '-';
        document.getElementById('summary-contact').textContent = formData.phone || '-';
    }

    // Pre-select service from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
        const serviceInput = document.querySelector(`input[value="${serviceParam}"]`);
        if (serviceInput) {
            serviceInput.checked = true;
            serviceInput.dispatchEvent(new Event('change'));
        }
    }
});
