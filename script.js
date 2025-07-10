/**
 * Artists of Tomorrow - Main JavaScript
 * Handles mobile navigation, form submissions, and other interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks.classList.contains('active') && !event.target.closest('nav') && !event.target.closest('.hamburger')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Form submission handling
    const submissionForm = document.getElementById('artSubmission');
    
    if (submissionForm) {
        submissionForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Basic form validation
            let isValid = true;
            const requiredFields = submissionForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Generate a unique submission ID
            const submissionId = generateSubmissionId();
            
            // Show submission ID to user
            alert('Thank you for your submission! Your artwork ID is: ' + submissionId + 
                  '\n\nPlease write this number on the back of your artwork along with your name, date, and grade level.');
            
            // In a real implementation, this would send data to a server
            // For now we'll just reset the form
            submissionForm.reset();
        });
    }
    
    // Generate a random submission ID
    function generateSubmissionId() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return 'AOT-' + timestamp + '-' + random;
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add additional CSS classes for mobile styles
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
    
    // Run on load and resize
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
});