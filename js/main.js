document.addEventListener('DOMContentLoaded', function() {
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
            
            // In a real implementation, this would send data to a server
            // and get back a submission number
            
            // For demonstration, generate a random submission number
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
});
