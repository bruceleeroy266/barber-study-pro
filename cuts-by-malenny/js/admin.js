// Admin Dashboard JavaScript

// Mark appointment as completed
function markAsCompleted(button) {
    showModal(
        'Mark as Completed',
        'Confirm that the customer showed up and the service was completed. The deposit will be applied to their payment.',
        function() {
            const card = button.closest('.appointment-card');
            updateStatus(card, 'status-completed', 'Completed');
            button.disabled = true;
            button.closest('.appointment-actions').querySelectorAll('button').forEach(btn => {
                if (btn !== button) btn.style.display = 'none';
            });
            closeModal();
        }
    );
}

// Mark appointment as no-show
function markAsNoShow(button) {
    showModal(
        'Mark as No-Show',
        'Customer did not arrive within 15 minutes. The $10 deposit will be forfeited. You can optionally charge an additional no-show fee.',
        function() {
            const card = button.closest('.appointment-card');
            updateStatus(card, 'status-noshow', 'No-Show');
            
            // Add to no-show table (in real implementation, this would update the database)
            addToNoShowList(card);
            
            button.disabled = true;
            button.closest('.appointment-actions').querySelectorAll('button').forEach(btn => {
                if (btn !== button) btn.style.display = 'none';
            });
            closeModal();
        }
    );
}

// Cancel appointment
function cancelAppointment(button) {
    showModal(
        'Cancel Appointment',
        'Are you sure you want to cancel this appointment? Check cancellation policy: 24+ hrs = refund deposit, <24 hrs = forfeit deposit.',
        function() {
            const card = button.closest('.appointment-card');
            updateStatus(card, 'status-cancelled', 'Cancelled');
            button.disabled = true;
            button.closest('.appointment-actions').querySelectorAll('button').forEach(btn => {
                if (btn !== button) btn.style.display = 'none';
            });
            closeModal();
        }
    );
}

// Update status display
function updateStatus(card, statusClass, statusText) {
    const statusDiv = card.querySelector('.appointment-status');
    statusDiv.className = 'appointment-status ' + statusClass;
    statusDiv.innerHTML = `<i class="fas fa-${statusClass === 'status-completed' ? 'check-circle' : statusClass === 'status-noshow' ? 'times-circle' : 'ban'}"></i> ${statusText}`;
}

// Add to no-show list (demo function)
function addToNoShowList(card) {
    // In real implementation, this would add to the database and update the no-show table
    console.log('Added to no-show list:', {
        name: card.querySelector('h3').textContent,
        service: card.querySelector('.service').textContent,
        time: new Date().toLocaleDateString()
    });
}

// Modal functions
function showModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Remove old event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', onConfirm);
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('confirmation-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Customer lookup (demo)
document.querySelector('.lookup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.querySelector('.lookup-input').value;
    alert(`Searching for: ${query}\n\nIn the full version, this would search the customer database and show booking history, no-show count, and contact info.`);
});

// NOTE FOR CLAUDE CODE BACKEND INTEGRATION:
// - Connect to database to fetch real appointments
// - Update appointment status in real-time
// - Handle no-show fee charging via Stripe
// - Send notifications to customers on status changes
// - Track customer history and no-show patterns
// - Generate reports (daily/weekly revenue, no-show rates)
