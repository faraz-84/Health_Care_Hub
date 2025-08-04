// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('#hamburger');
    const navMenu = document.querySelector('#nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('#navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('[class*="fadeIn"], .service-card, .value-card, .team-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Form validation helper
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');

            if (!field.value.trim()) {
                formGroup.classList.add('error');
                formGroup.classList.remove('success');
                if (errorMessage) {
                    errorMessage.textContent = 'This field is required';
                }
                isValid = false;
            } else {
                formGroup.classList.remove('error');
                formGroup.classList.add('success');
            }

            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    formGroup.classList.add('error');
                    formGroup.classList.remove('success');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please enter a valid email address';
                    }
                    isValid = false;
                }
            }

            // Phone validation
            if (field.type === 'tel' && field.value.trim()) {
                const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                    formGroup.classList.add('error');
                    formGroup.classList.remove('success');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please enter a valid phone number';
                    }
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Expose validateForm globally for use in other scripts
    window.validateForm = validateForm;

    // Loading animation for buttons
    function showLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
        
        return function() {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }

    // Expose showLoading globally
    window.showLoading = showLoading;

    // Success message helper
    function showSuccessMessage(message, container) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        
        container.insertBefore(successDiv, container.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Expose showSuccessMessage globally
    window.showSuccessMessage = showSuccessMessage;

    // Format phone number as user types
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = `(${value}`;
                } else if (value.length <= 6) {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = formattedValue;
        });
    });

    // Set minimum date for appointment booking (today)
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        if (input.name === 'appointmentDate') {
            input.min = today;
        }
    });

    // Auto-resize textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    console.log('HealthSphere website loaded successfully!');
});