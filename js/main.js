document.addEventListener('DOMContentLoaded', function() {
    // Add scroll event for header styling and back-to-top button
    const header = document.querySelector('header');
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    function handleScroll() {
        // Header scroll effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize

    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Enhanced Navigation Toggle Functionality
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (navToggle && mainNav) {
        // Close menu when a nav link is clicked (for mobile)
        const navLinks = mainNav.querySelectorAll('a');
        
        navToggle.addEventListener('click', function() {
            const isExpanded = mainNav.classList.toggle('expanded');
            navToggle.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = isExpanded ? 'hidden' : '';
            
            // Accessibility
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Focus management
            if (isExpanded) {
                // Move focus to first nav item when opening
                const firstNavItem = mainNav.querySelector('a');
                if (firstNavItem) firstNavItem.focus();
            } else {
                // Return focus to menu button when closing
                navToggle.focus();
            }
        });
        
        // Close menu when clicking on a nav link (for single page navigation)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mainNav.classList.contains('expanded')) {
                    mainNav.classList.remove('expanded');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('expanded')) {
                mainNav.classList.remove('expanded');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
        
        // Add accessibility attributes
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'mainNav');
        
        // Add tab trapping for better keyboard navigation
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableContent = mainNav.querySelectorAll(focusableElements);
        
        if (focusableContent.length > 0) {
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];
            
            mainNav.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstFocusableElement) {
                            e.preventDefault();
                            lastFocusableElement.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastFocusableElement) {
                            e.preventDefault();
                            firstFocusableElement.focus();
                        }
                    }
                }
            });
        }
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
    
    // Contact form submission with validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add form validation
        const formFields = contactForm.querySelectorAll('input[required], textarea[required]');
        
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                validateField(this);
            });
        });

        function validateField(field) {
            const errorElement = field.nextElementSibling;
            if (field.validity.valid) {
                field.classList.remove('error');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.style.display = 'none';
                }
            } else {
                field.classList.add('error');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.style.display = 'block';
                }
            }
        }

        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Validate all fields
            let isValid = true;
            formFields.forEach(field => {
                validateField(field);
                if (!field.validity.valid) {
                    isValid = false;
                }
            });

            if (!isValid) {
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <span class="loading"></span>';

            try {
                // Simulate form submission (replace with actual form submission)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                const successMessage = contactForm.querySelector('.success-message');
                if (successMessage) {
                    successMessage.classList.add('visible');
                }
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successMessage) {
                        successMessage.classList.remove('visible');
                    }
                }, 5000);
                
            } catch (error) {
                alert('There was an error sending your message. Please try again later.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
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
