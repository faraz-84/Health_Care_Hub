// Home page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Stats counter animation
    function animateStats() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            const numberElement = item.querySelector('.stat-number');
            const targetValue = parseInt(item.getAttribute('data-count'));
            const suffix = numberElement.textContent.includes('+') ? '+' : '';
            
            let currentValue = 0;
            const increment = Math.ceil(targetValue / 100);
            const duration = 2000; // 2 seconds
            const stepTime = duration / (targetValue / increment);
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                numberElement.textContent = currentValue.toLocaleString() + suffix;
            }, stepTime);
        });
    }

    // Trigger stats animation on scroll
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // Testimonials slider
    let currentSlide = 0;
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');

    function showSlide(n) {
        // Hide all slides
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current slide
        if (testimonialCards[n]) {
            testimonialCards[n].classList.add('active');
        }
        
        // Activate current dot
        if (dots[n]) {
            dots[n].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        showSlide(currentSlide);
    }

    // Make currentSlide function global for dot navigation
    window.currentSlide = function(n) {
        currentSlide = n - 1;
        showSlide(currentSlide);
    };

    // Auto-advance testimonials
    if (testimonialCards.length > 0) {
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Add click handlers for navigation dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Hero floating cards animation stagger
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });

    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (hero && heroContent && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${rate * 0.5}px)`;
                heroImage.style.transform = `translateY(${rate * 0.3}px)`;
            }
        });
    }

    // CTA section entrance animation
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const ctaObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.3 });

        ctaSection.style.transform = 'translateY(50px)';
        ctaSection.style.opacity = '0';
        ctaSection.style.transition = 'all 0.8s ease-out';
        ctaObserver.observe(ctaSection);
    }

    // Add hover effect to gradient text
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        gradientText.addEventListener('mouseenter', function() {
            this.style.backgroundImage = 'linear-gradient(135deg, #e53e3e, #3182ce)';
        });

        gradientText.addEventListener('mouseleave', function() {
            this.style.backgroundImage = 'linear-gradient(135deg, #3182ce, #e53e3e)';
        });
    }

    // Smooth reveal animation for service cards
    const serviceCardsObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        serviceCardsObserver.observe(card);
    });

    console.log('Home page functionality loaded successfully!');
});