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

    const galleryModalElement = document.querySelector('[data-gallery-modal]');
    const galleryModalImage = galleryModalElement?.querySelector('[data-gallery-image]');
    const galleryModalCaption = galleryModalElement?.querySelector('[data-gallery-caption]');
    const galleryModalPrev = galleryModalElement?.querySelector('[data-gallery-prev]');
    const galleryModalNext = galleryModalElement?.querySelector('[data-gallery-next]');
    const galleryModalCloseElements = galleryModalElement ? galleryModalElement.querySelectorAll('[data-gallery-close]') : [];

    const galleryModalState = {
        items: [],
        index: 0,
        previousFocus: null,
        keyHandler: null
    };

    const renderGalleryModal = () => {
        if (!galleryModalElement || !galleryModalImage || !galleryModalState.items.length) {
            return;
        }

        const currentItem = galleryModalState.items[galleryModalState.index];
        galleryModalImage.src = currentItem.src;
        galleryModalImage.alt = currentItem.alt || '';

        if (galleryModalCaption) {
            if (currentItem.alt) {
                galleryModalCaption.textContent = currentItem.alt;
                galleryModalCaption.style.display = '';
            } else {
                galleryModalCaption.textContent = '';
                galleryModalCaption.style.display = 'none';
            }
        }
    };

    const closeGalleryModal = () => {
        if (!galleryModalElement) {
            return;
        }

        galleryModalElement.classList.remove('is-visible');
        galleryModalElement.setAttribute('aria-hidden', 'true');
        document.body.style.removeProperty('overflow');

        if (galleryModalState.keyHandler) {
            window.removeEventListener('keydown', galleryModalState.keyHandler);
            galleryModalState.keyHandler = null;
        }

        if (galleryModalImage) {
            galleryModalImage.src = '';
            galleryModalImage.alt = '';
        }

        if (galleryModalCaption) {
            galleryModalCaption.textContent = '';
        }

        const { previousFocus } = galleryModalState;
        if (previousFocus && typeof previousFocus.focus === 'function') {
            previousFocus.focus({ preventScroll: true });
        }

        galleryModalState.items = [];
        galleryModalState.previousFocus = null;
        galleryModalState.index = 0;
    };

    const showModalRelativeImage = direction => {
        if (!galleryModalState.items.length) {
            return;
        }

        const total = galleryModalState.items.length;
        galleryModalState.index = (galleryModalState.index + direction + total) % total;
        renderGalleryModal();
    };

    const openGalleryModal = (items, startIndex, triggerElement) => {
        if (!galleryModalElement || !items || !items.length) {
            return;
        }

        galleryModalState.items = items;
        galleryModalState.index = (startIndex + items.length) % items.length;
        galleryModalState.previousFocus = triggerElement || document.activeElement;

        galleryModalElement.classList.add('is-visible');
        galleryModalElement.setAttribute('aria-hidden', 'false');
        document.body.style.setProperty('overflow', 'hidden');

        renderGalleryModal();

        if (galleryModalState.keyHandler) {
            window.removeEventListener('keydown', galleryModalState.keyHandler);
        }

        galleryModalState.keyHandler = event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeGalleryModal();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                showModalRelativeImage(1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showModalRelativeImage(-1);
            } else if (event.key === 'Tab' && galleryModalElement) {
                const focusableElements = Array.from(galleryModalElement.querySelectorAll('button'));
                if (!focusableElements.length) {
                    return;
                }

                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];

                if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                } else if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            }
        };

        window.addEventListener('keydown', galleryModalState.keyHandler);

        const closeButton = galleryModalElement.querySelector('.gallery-modal__close');
        if (closeButton) {
            closeButton.focus({ preventScroll: true });
        }
    };

    if (galleryModalPrev) {
        galleryModalPrev.addEventListener('click', () => {
            showModalRelativeImage(-1);
        });
    }

    if (galleryModalNext) {
        galleryModalNext.addEventListener('click', () => {
            showModalRelativeImage(1);
        });
    }

    galleryModalCloseElements.forEach(closeElement => {
        closeElement.addEventListener('click', event => {
            event.preventDefault();
            closeGalleryModal();
        });
    });

    // Photo carousel controls
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const track = carousel.querySelector('[data-carousel-track]');
        if (!track) {
            return;
        }

        const carouselItems = Array.from(track.querySelectorAll('.carousel-item'));
        if (!carouselItems.length) {
            return;
        }

        const prevButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');

        let currentIndex = 0;
        let scrollFrame = null;

        const modalItems = carouselItems.map(item => {
            const image = item.querySelector('img');
            const src = image ? image.getAttribute('src') || image.currentSrc || '' : '';
            const alt = image ? image.getAttribute('alt') || '' : '';
            return { element: item, image, src, alt };
        });

        const goToIndex = index => {
            if (!carouselItems.length) {
                return;
            }

            currentIndex = (index + carouselItems.length) % carouselItems.length;
            const targetItem = carouselItems[currentIndex];
            if (!targetItem) {
                return;
            }

            targetItem.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        };

        const updateCurrentIndex = () => {
            const trackRect = track.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;

            let closestIndex = currentIndex;
            let closestDistance = Number.POSITIVE_INFINITY;

            carouselItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + (itemRect.width / 2);
                const distance = Math.abs(itemCenter - trackCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            currentIndex = closestIndex;
        };

        const scheduleIndexUpdate = () => {
            if (scrollFrame) {
                cancelAnimationFrame(scrollFrame);
            }
            scrollFrame = requestAnimationFrame(updateCurrentIndex);
        };

        if (prevButton) {
            prevButton.disabled = false;
            prevButton.addEventListener('click', () => {
                goToIndex(currentIndex - 1);
            });
        }

        if (nextButton) {
            nextButton.disabled = false;
            nextButton.addEventListener('click', () => {
                goToIndex(currentIndex + 1);
            });
        }

        track.addEventListener('scroll', scheduleIndexUpdate, { passive: true });

        track.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goToIndex(currentIndex - 1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                goToIndex(currentIndex + 1);
            }
        });

        window.addEventListener('resize', scheduleIndexUpdate);
        updateCurrentIndex();

        if (galleryModalElement) {
            const modalData = modalItems.map(({ src, alt }) => ({ src, alt }));

            modalItems.forEach((itemData, index) => {
                const { element, alt } = itemData;
                if (!element) {
                    return;
                }

                element.setAttribute('tabindex', '0');
                element.setAttribute('role', 'button');
                if (alt) {
                    element.setAttribute('aria-label', `Open larger view of ${alt}`);
                } else {
                    element.setAttribute('aria-label', 'Open larger view of this artwork');
                }

                const handleOpen = () => {
                    openGalleryModal(modalData, index, element);
                };

                element.addEventListener('click', handleOpen);
                element.addEventListener('keydown', event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleOpen();
                    }
                });
            });
        }
    });

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
