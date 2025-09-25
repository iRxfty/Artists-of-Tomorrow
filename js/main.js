document.addEventListener('DOMContentLoaded', function() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateGroups = document.querySelectorAll('[data-animate-group]');
    animateGroups.forEach(group => {
        const scopedElements = Array.from(group.querySelectorAll('[data-animate]')).filter(element => {
            const nearestGroup = element.closest('[data-animate-group]');
            return nearestGroup === group;
        });

        scopedElements.forEach((element, index) => {
            if (!element.style.getPropertyValue('--reveal-delay')) {
                const delay = Math.min(index * 0.12, 0.6);
                element.style.setProperty('--reveal-delay', `${delay}s`);
            }
        });
    });

    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -10%',
            threshold: 0.1
        });

        animatedElements.forEach((element, index) => {
            if (!element.style.getPropertyValue('--reveal-delay')) {
                const delay = Math.min(index * 0.08, 0.4);
                element.style.setProperty('--reveal-delay', `${delay}s`);
            }
            observer.observe(element);
        });
    } else {
        animatedElements.forEach(element => element.classList.add('is-visible'));
    }

    // Add scroll event for header styling and back-to-top button
    const header = document.querySelector('header');
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    let lastKnownScrollY = 0;
    let scrollTicking = false;

    function updateScrollEffects(scrollPosition) {
        // Header scroll effect
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollPosition > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    function requestScrollTick() {
        if (!scrollTicking) {
            scrollTicking = true;
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(() => {
                    updateScrollEffects(lastKnownScrollY);
                    scrollTicking = false;
                });
            } else {
                updateScrollEffects(lastKnownScrollY);
                scrollTicking = false;
            }
        }
    }

    function onScroll() {
        lastKnownScrollY = window.scrollY || window.pageYOffset || 0;
        requestScrollTick();
    }

    const supportsPassiveListeners = (() => {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get() {
                    supportsPassive = true;
                    return false;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {
            supportsPassive = false;
        }
        return supportsPassive;
    })();

    window.addEventListener('scroll', onScroll, supportsPassiveListeners ? { passive: true } : false);
    lastKnownScrollY = window.scrollY || window.pageYOffset || 0;
    updateScrollEffects(lastKnownScrollY); // Initialize

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
        const submenuToggles = mainNav.querySelectorAll('.submenu-toggle');

        const openActiveSubmenu = () => {
            const activeSubLink = mainNav.querySelector('.submenu a[aria-current="page"], .submenu a.active');
            if (!activeSubLink) {
                return;
            }

            const parentItem = activeSubLink.closest('.has-submenu');
            if (!parentItem) {
                return;
            }

            parentItem.classList.add('open');

            const activeToggle = parentItem.querySelector('.submenu-toggle');
            if (activeToggle) {
                activeToggle.setAttribute('aria-expanded', 'true');
                activeToggle.classList.add('active');
            }
        };

        const closeAllSubmenus = () => {
            submenuToggles.forEach(toggle => {
                const parentItem = toggle.closest('.has-submenu');
                if (parentItem) {
                    parentItem.classList.remove('open');
                }
                toggle.setAttribute('aria-expanded', 'false');
            });
        };

        submenuToggles.forEach(toggle => {
            toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'true' ? 'true' : 'false');

            toggle.addEventListener('click', function(event) {
                event.stopPropagation();
                const parentItem = toggle.closest('.has-submenu');
                const isOpen = parentItem.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen);

                submenuToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        const otherParent = otherToggle.closest('.has-submenu');
                        if (otherParent) {
                            otherParent.classList.remove('open');
                        }
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });

                if (isOpen) {
                    const firstSubLink = parentItem.querySelector('.submenu a');
                    if (firstSubLink) {
                        firstSubLink.focus();
                    }
                } else {
                    toggle.focus();
                }
            });

            toggle.addEventListener('keydown', function(event) {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    const parentItem = toggle.closest('.has-submenu');
                    if (!parentItem.classList.contains('open')) {
                        closeAllSubmenus();
                        parentItem.classList.add('open');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                    const firstSubLink = parentItem.querySelector('.submenu a');
                    if (firstSubLink) {
                        firstSubLink.focus();
                    }
                }

                if (event.key === 'Escape') {
                    const parentItem = toggle.closest('.has-submenu');
                    if (parentItem && parentItem.classList.contains('open')) {
                        parentItem.classList.remove('open');
                        toggle.setAttribute('aria-expanded', 'false');
                        toggle.focus();
                    }
                }
            });
        });

        // Close menu when a nav link is clicked (for mobile)
        const navLinks = mainNav.querySelectorAll('a');
        
        navToggle.addEventListener('click', function() {
            const isExpanded = mainNav.classList.toggle('expanded');
            navToggle.classList.toggle('active');

            // Toggle body scroll (only lock on smaller viewports)
            const lockScroll = window.innerWidth <= 768;
            document.body.style.overflow = isExpanded && lockScroll ? 'hidden' : '';

            // Accessibility
            navToggle.setAttribute('aria-expanded', isExpanded);

            // Focus management
            if (isExpanded) {
                openActiveSubmenu();
                // Move focus to first nav item when opening
                const firstNavItem = mainNav.querySelector('a');
                if (firstNavItem) firstNavItem.focus();
            } else {
                // Return focus to menu button when closing
                navToggle.focus();
                closeAllSubmenus();
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
                    closeAllSubmenus();
                }
            });
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (mainNav.classList.contains('expanded')) {
                    mainNav.classList.remove('expanded');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.focus();
                }
                closeAllSubmenus();
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

        document.addEventListener('click', function(event) {
            const clickInsideNav = event.target.closest('nav');
            const clickOnToggle = event.target.closest('.nav-toggle');

            if (!event.target.closest('.has-submenu')) {
                closeAllSubmenus();
            }

            if (mainNav.classList.contains('expanded') && !clickInsideNav && !clickOnToggle) {
                mainNav.classList.remove('expanded');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

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
            const submissionNumberField = document.getElementById('submissionNumber');

            if (uploadSection) {
                uploadSection.classList.remove('hidden');
            }

            if (submissionNumberField) {
                submissionNumberField.value = submissionNumber;
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
    
    // Fade-in elements when they enter the viewport
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .card, .prize-card, .step, .judge-card, .prize, .contact-method').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
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

    // Photo gallery enhancements
    const galleryContainers = document.querySelectorAll('[data-gallery]');
    if (galleryContainers.length) {
        const body = document.body;
        const galleryModal = document.createElement('div');
        galleryModal.className = 'photo-gallery-modal';
        galleryModal.setAttribute('aria-hidden', 'true');
        galleryModal.innerHTML = `
            <div class="photo-gallery-modal__backdrop" data-gallery-close></div>
            <div class="photo-gallery-modal__dialog" role="dialog" aria-modal="true" aria-label="Expanded gallery image">
                <button type="button" class="photo-gallery-modal__close" data-gallery-close aria-label="Close gallery view">&times;</button>
                <figure class="photo-gallery-modal__figure">
                    <img alt="">
                    <figcaption></figcaption>
                </figure>
            </div>
        `;
        body.appendChild(galleryModal);

        const modalImage = galleryModal.querySelector('img');
        const modalCaption = galleryModal.querySelector('figcaption');
        const closeControls = galleryModal.querySelectorAll('[data-gallery-close]');
        let previouslyFocusedElement = null;

        const closeModal = () => {
            galleryModal.classList.remove('is-active');
            galleryModal.setAttribute('aria-hidden', 'true');
            body.classList.remove('gallery-open');
            modalImage.removeAttribute('src');
            modalImage.removeAttribute('alt');
            modalCaption.textContent = '';
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
                previouslyFocusedElement = null;
            }
        };

        const openModal = (image) => {
            if (!image) {
                return;
            }

            modalImage.src = image.currentSrc || image.src;
            modalImage.alt = image.alt || '';
            modalCaption.textContent = image.alt || '';
            previouslyFocusedElement = document.activeElement;
            galleryModal.classList.add('is-active');
            galleryModal.setAttribute('aria-hidden', 'false');
            body.classList.add('gallery-open');
            const closeButton = galleryModal.querySelector('.photo-gallery-modal__close');
            if (closeButton) {
                closeButton.focus();
            }
        };

        closeControls.forEach(control => {
            control.addEventListener('click', closeModal);
        });

        galleryModal.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

        galleryModal.addEventListener('click', event => {
            if (event.target === galleryModal || event.target.classList.contains('photo-gallery-modal__backdrop')) {
                closeModal();
            }
        });

        const activateFigure = figure => {
            if (!figure) {
                return;
            }

            figure.setAttribute('role', 'button');
            figure.setAttribute('tabindex', '0');

            const figureImage = figure.querySelector('img');
            const activate = () => {
                openModal(figureImage);
            };

            if (figureImage) {
                const label = figureImage.alt || 'View gallery image';
                figure.setAttribute('aria-label', label);
            }

            figure.addEventListener('click', activate);
            figure.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activate();
                }
            });
        };

        galleryContainers.forEach(container => {
            const galleryLabel = container.getAttribute('data-gallery-label');
            if (galleryLabel) {
                container.setAttribute('aria-label', galleryLabel);
            }
            container.setAttribute('role', 'list');

            const baseFigures = Array.from(container.querySelectorAll('[data-gallery-item]'));
            if (!baseFigures.length) {
                return;
            }
            const sentinel = document.createElement('div');
            sentinel.className = 'photo-gallery-sentinel';
            sentinel.setAttribute('aria-hidden', 'true');
            container.appendChild(sentinel);

            const templateFigures = baseFigures.map(figure => figure.cloneNode(true));

            const appendClones = () => {
                const fragment = document.createDocumentFragment();
                templateFigures.forEach(templateFigure => {
                    const clone = templateFigure.cloneNode(true);
                    activateFigure(clone);
                    fragment.appendChild(clone);
                });
                container.insertBefore(fragment, sentinel);
            };

            let loadingMore = false;
            let observer;
            const scheduleAppend = () => {
                if (loadingMore) {
                    return;
                }
                loadingMore = true;
                requestAnimationFrame(() => {
                    appendClones();
                    loadingMore = false;
                    if (observer) {
                        observer.observe(sentinel);
                    }
                });
            };

            observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        observer.unobserve(sentinel);
                        scheduleAppend();
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px 200px',
                threshold: 0.1
            });

            baseFigures.forEach(figure => activateFigure(figure));
            observer.observe(sentinel);
        });
    }

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
                amount.style.textAlign = 'left';
                amount.style.margin = '5px 0';
            });
        }
    };
    
    fixMobilePrizes();
    window.addEventListener('resize', fixMobilePrizes);
});
