document.addEventListener('DOMContentLoaded', function() {
    // Add scroll event for header styling
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Navigation Toggle Functionality
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('expanded');
            navToggle.classList.toggle('active');
            
            // Accessibility
            const expanded = mainNav.classList.contains('expanded');
            navToggle.setAttribute('aria-expanded', expanded);
        });
        
        // Add accessibility attributes
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'mainNav');
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mainNav && mainNav.classList.contains('expanded') && 
            !event.target.closest('nav') && 
            !event.target.closest('.nav-toggle')) {
            mainNav.classList.remove('expanded');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Registration form handling
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Generate a random submission number
            const submissionNumber = 'AOT-' + Math.floor(100000 + Math.random() * 900000);
            
            alert('Thank you for registering! Your submission number is: ' + submissionNumber + 
                  '\n\nPlease write this number on the back of your artwork along with your name, date, and grade level.');
            
            // Show the upload section
            const uploadSection = document.getElementById('uploadSection');
            if (uploadSection) {
                uploadSection.classList.remove('hidden');
                document.getElementById('submissionNumber').value = submissionNumber;
            }
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Add animation classes to elements when they become visible
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .prize-card, .step, .judge-card, .prize, .contact-method');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect();
            
            // Check if element is in viewport
            if (elementPosition.top < window.innerHeight * 0.9 && elementPosition.bottom > 0) {
                if (!element.classList.contains('animated')) {
                    element.classList.add('animated');
                    element.style.animation = 'fadeIn 0.8s ease forwards';
                }
            }
        });
    };
    
    // Run on scroll and on load
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('resize', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Add special effects to prizes section
    const enhancePrizes = function() {
        const prizeCards = document.querySelectorAll('.prize-card');
        if (prizeCards.length > 0) {
            prizeCards.forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Calculate rotation based on mouse position
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            });
        }
    };
    
    enhancePrizes();
    
    // Add particle effect to buttons
    const addButtonEffects = function() {
        const buttons = document.querySelectorAll('.cta-button, .secondary-button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
            });
            
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--x', x + 'px');
                this.style.setProperty('--y', y + 'px');
            });
        });
    };
    
    addButtonEffects();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Preload animations
    const preloadAnimations = function() {
        // Add a class to body when page is fully loaded
        window.addEventListener('load', function() {
            document.body.classList.add('page-loaded');
            
            // Animate main sections with a staggered delay
            const sections = document.querySelectorAll('section');
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('fade-in');
                }, index * 200);
            });
        });
    };
    
    preloadAnimations();
    
    // Fix for mobile prize display - ensure text is visible
    const fixMobilePrizes = function() {
        if (window.innerWidth <= 768) {
            const prizeAmounts = document.querySelectorAll('.prize-amount');
            prizeAmounts.forEach(amount => {
                amount.style.width = '100%';
                amount.style.textAlign = 'center';
                amount.style.margin = '5px 0';
            });
        }
    };
    
    fixMobilePrizes();
    window.addEventListener('resize', fixMobilePrizes);
});
