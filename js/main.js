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
    const fadeTargets = document.querySelectorAll('section, .card, .prize-card, .step, .judge-card, .prize, .contact-method');

    if (!reduceMotion && 'IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeTargets.forEach(el => {
            el.classList.add('fade-in');
            fadeObserver.observe(el);
        });
    } else {
        fadeTargets.forEach(el => {
            el.classList.add('fade-in', 'in-view');
        });
    }
    
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

    // Photo carousel controls with infinite scroll and lightbox
    const carouselLightbox = (() => {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.innerHTML = `
            <figure class="lightbox__figure">
                <button class="lightbox__close" type="button" aria-label="Close image preview">&times;</button>
                <img class="lightbox__image" alt="">
            </figure>
        `;
        document.body.appendChild(overlay);

        const closeButton = overlay.querySelector('.lightbox__close');
        const image = overlay.querySelector('.lightbox__image');
        let lastFocusedElement = null;

        const close = () => {
            overlay.classList.remove('is-active');
            document.body.classList.remove('lightbox-open');
            image.src = '';
            image.alt = '';
            if (lastFocusedElement) {
                lastFocusedElement.focus({ preventScroll: true });
                lastFocusedElement = null;
            }
        };

        const open = (src, alt, trigger) => {
            if (!src) {
                return;
            }
            lastFocusedElement = trigger || null;
            image.src = src;
            image.alt = alt || '';
            overlay.classList.add('is-active');
            document.body.classList.add('lightbox-open');
            closeButton.focus({ preventScroll: true });
        };

        closeButton.addEventListener('click', close);
        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                close();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && overlay.classList.contains('is-active')) {
                close();
            }
        });

        return { open, close };
    })();

    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const track = carousel.querySelector('[data-carousel-track]');
        if (!track) {
            return;
        }

        const prevButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');

        let metrics = { itemWidth: 0, gap: 0 };
        let wrapWidth = 0;
        let initialScroll = 0;
        let isJumping = false;

        const computeMetrics = () => {
            const firstItem = track.querySelector('.carousel-item');
            if (!firstItem) {
                return { itemWidth: 0, gap: 0 };
            }
            const styles = window.getComputedStyle(track);
            const gapValue = parseFloat(styles.columnGap || styles.gridColumnGap || styles.gap || '0') || 0;
            const width = firstItem.getBoundingClientRect().width;
            return { itemWidth: width, gap: gapValue };
        };

        const ensureTabbableItems = () => {
            track.querySelectorAll('.carousel-item').forEach(item => {
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');
                const img = item.querySelector('img');
                const label = img && img.alt ? `Expand ${img.alt}` : 'Expand competition photo';
                item.setAttribute('aria-label', label);
            });
        };

        const setupCarousel = (attempt = 0) => {
            wrapWidth = 0;
            initialScroll = 0;
            isJumping = false;

            const originalMarkup = track.dataset.originalMarkup;
            if (!originalMarkup) {
                track.dataset.originalMarkup = track.innerHTML;
            } else {
                track.innerHTML = originalMarkup;
            }

            const originalItems = Array.from(track.children).filter(child => child.classList.contains('carousel-item'));
            if (!originalItems.length) {
                return;
            }

            metrics = computeMetrics();
            if (metrics.itemWidth === 0 && attempt < 5) {
                setTimeout(() => setupCarousel(attempt + 1), 150);
                return;
            }

            const spacing = (metrics.itemWidth + metrics.gap) || track.clientWidth;
            let clonesPerSide = Math.ceil(track.clientWidth / spacing) + 1;
            clonesPerSide = Math.min(clonesPerSide, originalItems.length);

            const beforeFragment = document.createDocumentFragment();
            const afterFragment = document.createDocumentFragment();

            for (let i = 0; i < clonesPerSide; i++) {
                const afterClone = originalItems[i].cloneNode(true);
                afterClone.dataset.clone = 'after';
                afterFragment.appendChild(afterClone);

                const beforeClone = originalItems[originalItems.length - 1 - i].cloneNode(true);
                beforeClone.dataset.clone = 'before';
                beforeFragment.insertBefore(beforeClone, beforeFragment.firstChild);
            }

            track.insertBefore(beforeFragment, track.firstChild);
            track.appendChild(afterFragment);

            ensureTabbableItems();

            metrics = computeMetrics();

            const firstOriginal = track.querySelector('.carousel-item:not([data-clone])');
            const firstAfterClone = track.querySelector('.carousel-item[data-clone="after"]');

            if (!firstOriginal || !firstAfterClone) {
                return;
            }

            initialScroll = firstOriginal.offsetLeft;
            wrapWidth = firstAfterClone.offsetLeft - initialScroll;
            if (wrapWidth <= 0) {
                wrapWidth = 0;
                return;
            }

            isJumping = true;
            requestAnimationFrame(() => {
                track.scrollLeft = initialScroll;
                requestAnimationFrame(() => {
                    isJumping = false;
                });
            });
        };

        const getScrollStep = () => {
            const baseStep = track.clientWidth * 0.8;
            const itemStep = metrics.itemWidth + metrics.gap;
            return Math.max(baseStep, itemStep || baseStep);
        };

        const scrollByAmount = direction => {
            track.scrollBy({
                left: direction * getScrollStep(),
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        };

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                scrollByAmount(-1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                scrollByAmount(1);
            });
        }

        track.addEventListener('scroll', () => {
            if (!wrapWidth || isJumping) {
                return;
            }

            const maxPosition = initialScroll + wrapWidth;
            const minPosition = initialScroll - wrapWidth;
            const tolerance = 2;

            if (track.scrollLeft >= (maxPosition - tolerance)) {
                isJumping = true;
                track.scrollLeft -= wrapWidth;
                requestAnimationFrame(() => {
                    isJumping = false;
                });
            } else if (track.scrollLeft <= (minPosition + tolerance)) {
                isJumping = true;
                track.scrollLeft += wrapWidth;
                requestAnimationFrame(() => {
                    isJumping = false;
                });
            }
        }, { passive: true });

        track.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                scrollByAmount(-1);
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                scrollByAmount(1);
                return;
            }

            if ((event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') && event.target.classList.contains('carousel-item')) {
                event.preventDefault();
                const img = event.target.querySelector('img');
                if (img) {
                    carouselLightbox.open(img.currentSrc || img.src, img.alt, event.target);
                }
            }
        });

        track.addEventListener('click', event => {
            const item = event.target.closest('.carousel-item');
            if (!item) {
                return;
            }
            const img = item.querySelector('img');
            if (img) {
                carouselLightbox.open(img.currentSrc || img.src, img.alt, item);
            }
        });

        const debouncedSetup = () => {
            clearTimeout(track._carouselResizeTimer);
            track._carouselResizeTimer = setTimeout(() => {
                setupCarousel();
            }, 200);
        };

        window.addEventListener('resize', debouncedSetup);
        setupCarousel();
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
