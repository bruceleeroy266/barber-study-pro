// Main JavaScript for Cuts by Malenny

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Set minimum date for booking to today
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Disable Tuesdays, Wednesdays, and Sundays
        dateInput.addEventListener('input', function() {
            const selectedDate = new Date(this.value);
            const dayOfWeek = selectedDate.getDay();
            
            // 0 = Sunday, 2 = Tuesday, 3 = Wednesday
            if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 3) {
                alert('We are closed on Sundays, Tuesdays, and Wednesdays. Please select another day.');
                this.value = '';
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });

    // Form validation helper
    window.validateField = function(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let message = '';

        switch(fieldName) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    isValid = false;
                    message = 'Name must be at least 2 characters';
                }
                break;
            case 'phone':
                const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    message = 'Please enter a valid phone number';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
                break;
        }

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            field.style.borderColor = '#dc3545';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#dc3545';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.style.borderColor = '#28a745';
        }

        return isValid;
    };
});
