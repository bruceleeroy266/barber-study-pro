// Booking Page JavaScript - Cuts by Malenny

// Available time slots (in production, this would come from the server)
const availableSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM'
];

let selectedTime = null;
let selectedService = { name: 'Regular Haircut', price: 30 };

// Initialize booking form
document.addEventListener('DOMContentLoaded', function() {
    initializeServiceSelection();
    initializeDatePicker();
    initializeFormSubmission();
});

// Service selection
function initializeServiceSelection() {
    const serviceOptions = document.querySelectorAll('input[name="service"]');
    
    serviceOptions.forEach(option => {
        option.addEventListener('change', function() {
            const optionContent = this.closest('.service-option').querySelector('.option-content');
            selectedService = {
                name: optionContent.querySelector('.option-name').textContent,
                price: parseInt(this.dataset.price)
            };
            updateSummary();
        });
    });
}

// Date picker
function initializeDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    
    dateInput?.addEventListener('change', function() {
        const selectedDate = this.value;
        if (selectedDate) {
            loadTimeSlots(selectedDate);
            updateSummary();
        }
    });
}

// Load time slots for selected date
function loadTimeSlots(date) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    
    // In production, this would fetch from server with double-booking protection
    // For demo, we'll show all slots with some randomly "booked"
    const bookedSlots = getBookedSlotsForDate(date);
    
    timeSlotsContainer.innerHTML = availableSlots.map(time => {
        const isBooked = bookedSlots.includes(time);
        const className = isBooked ? 'time-slot unavailable' : 'time-slot';
        const disabled = isBooked ? 'disabled' : '';
        return `<button type="button" class="${className}" ${disabled} onclick="selectTime('${time}')">${time}</button>`;
    }).join('');
}

// Get booked slots (simulated - in production, this comes from the database)
function getBookedSlotsForDate(date) {
    // Simulate some booked slots based on date
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    
    // Randomly "book" some slots for demo purposes
    const booked = [];
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend - more bookings
        booked.push('10:00 AM', '2:00 PM', '4:00 PM');
    } else {
        // Weekday
        booked.push('12:00 PM', '5:00 PM');
    }
    return booked;
}

// Select time slot
function selectTime(time) {
    selectedTime = time;
    
    // Update UI
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
        if (slot.textContent === time) {
            slot.classList.add('selected');
        }
    });
    
    updateSummary();
}

// Update booking summary
function updateSummary() {
    const dateInput = document.getElementById('appointmentDate');
    
    document.getElementById('summaryService').textContent = selectedService.name;
    document.getElementById('summaryDate').textContent = dateInput?.value ? formatDate(dateInput.value) : '-';
    document.getElementById('summaryTime').textContent = selectedTime || '-';
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Form submission
function initializeFormSubmission() {
    const form = document.getElementById('bookingForm');
    
    form?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validation
        if (!selectedTime) {
            alert('Please select a time slot');
            return;
        }
        
        const formData = {
            service: selectedService,
            date: document.getElementById('appointmentDate').value,
            time: selectedTime,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            notes: document.getElementById('notes')?.value || '',
            deposit: 10,
            // Consultation data
            consultation: {
                faceShape: document.getElementById('faceShape')?.value || '',
                hairType: document.getElementById('hairType')?.value || '',
                haircutFrequency: document.getElementById('haircutFrequency')?.value || '',
                stylingTime: document.getElementById('stylingTime')?.value || '',
                currentStyle: document.getElementById('currentStyle')?.value || '',
                desiredStyle: document.getElementById('desiredStyle')?.value || '',
                workEnvironment: document.getElementById('workEnvironment')?.value || '',
                concerns: Array.from(document.querySelectorAll('input[name="concerns"]:checked')).map(cb => cb.value),
                productPreference: document.getElementById('productPreference')?.value || '',
                additionalNotes: document.getElementById('additionalNotes')?.value || ''
            }
        };
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        try {
            // In production, this would be:
            // const response = await fetch('/api/bookings', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            
            // Simulate API call
            await simulateBookingRequest(formData);
            
            // Success
            showBookingConfirmation(formData);
            
        } catch (error) {
            if (error.message === 'Slot taken') {
                alert('Sorry, that time slot was just booked. Please select another time.');
                loadTimeSlots(formData.date); // Refresh slots
            } else {
                alert('Something went wrong. Please try again or call us at (405) 985-0600');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Simulate booking request with double-booking protection
async function simulateBookingRequest(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate occasional conflict (5% chance)
            if (Math.random() < 0.05) {
                reject(new Error('Slot taken'));
            } else {
                resolve({ success: true, bookingId: 'BK' + Date.now() });
            }
        }, 1500);
    });
}

// Show booking confirmation
function showBookingConfirmation(formData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
    `;
    
    // Check if consultation was filled out
    const hasConsultation = formData.consultation && (
        formData.consultation.hairType || 
        formData.consultation.desiredStyle || 
        formData.consultation.currentStyle
    );
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h2 style="margin-bottom: 1rem;">Booking Confirmed!</h2>
            <p style="color: #6B7280; margin-bottom: 1.5rem;">
                Thank you, ${formData.firstName}! Your appointment is scheduled.
            </p>
            <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: left;">
                <p><strong>Service:</strong> ${formData.service.name}</p>
                <p><strong>Date:</strong> ${formatDate(formData.date)}</p>
                <p><strong>Time:</strong> ${formData.time}</p>
                <p><strong>Deposit:</strong> $10.00 (paid)</p>
            </div>
            ${hasConsultation ? `
            <div style="background: #EDE9FE; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="color: #7C3AED; font-weight: 600; margin: 0;">💡 Malenny has your consultation info and will review it before your appointment!</p>
            </div>
            ` : ''}
            <p style="font-size: 0.875rem; color: #6B7280; margin-bottom: 1.5rem;">
                A confirmation text has been sent to ${formData.phone}
            </p>
            <button onclick="this.closest('.modal').remove(); window.location.href='index.html';" 
                style="
                    background: #8B5CF6;
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">Done</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.remove();
    }
});
