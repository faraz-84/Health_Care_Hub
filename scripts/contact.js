// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add error message elements to form groups
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            if (!group.querySelector('.error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                group.appendChild(errorDiv);
            }
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!window.validateForm(contactForm)) {
                return;
            }

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const resetLoading = window.showLoading(submitBtn);

            // Simulate API call
            setTimeout(() => {
                resetLoading();
                
                // Show success message
                window.showSuccessMessage(
                    'Thank you for your message! We will get back to you within 24 hours.',
                    contactForm
                );

                // Reset form
                contactForm.reset();
                
                // Remove validation classes
                formGroups.forEach(group => {
                    group.classList.remove('success', 'error');
                });

                console.log('Contact form submitted:', data);
            }, 2000);
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                const formGroup = this.closest('.form-group');
                const errorMessage = formGroup.querySelector('.error-message');

                if (this.hasAttribute('required') && !this.value.trim()) {
                    formGroup.classList.add('error');
                    formGroup.classList.remove('success');
                    if (errorMessage) {
                        errorMessage.textContent = 'This field is required';
                    }
                } else if (this.type === 'email' && this.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        formGroup.classList.add('error');
                        formGroup.classList.remove('success');
                        if (errorMessage) {
                            errorMessage.textContent = 'Please enter a valid email address';
                        }
                    } else {
                        formGroup.classList.remove('error');
                        formGroup.classList.add('success');
                    }
                } else if (this.value.trim()) {
                    formGroup.classList.remove('error');
                    formGroup.classList.add('success');
                }
            });

            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup.classList.contains('error') && this.value.trim()) {
                    formGroup.classList.remove('error');
                }
            });
        });
    }

    // Contact info animation
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = `opacity 0.6s ease-out ${index * 0.2}s, transform 0.6s ease-out ${index * 0.2}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
    });

    // Map placeholder interaction
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            // In a real application, this would open Google Maps or similar
            alert('Opening map directions... (This would integrate with Google Maps in a real application)');
        });

        mapPlaceholder.style.cursor = 'pointer';
    }

    // Directions button functionality
    const directionsBtn = document.querySelector('.directions-btn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real application, this would open Google Maps with directions
            const address = encodeURIComponent('123 Health Street, Medical City');
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
            window.open(mapsUrl, '_blank');
        });
    }

    // Form field focus effects
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Subject field change handler
    const subjectField = document.getElementById('subject');
    if (subjectField) {
        subjectField.addEventListener('change', function() {
            const messageField = document.getElementById('message');
            if (messageField) {
                const placeholders = {
                    'appointment': 'Please let us know your preferred date, time, and the type of appointment you need...',
                    'services': 'Please specify which medical service you would like to know more about...',
                    'billing': 'Please provide details about your billing inquiry, including any relevant account information...',
                    'feedback': 'We value your feedback! Please share your experience with our services...',
                    'other': 'Please provide details about your inquiry...'
                };
                
                messageField.placeholder = placeholders[this.value] || placeholders['other'];
            }
        });
    }

    console.log('Contact page functionality loaded successfully!');
});