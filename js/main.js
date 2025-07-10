document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements
    animateElements();
    
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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhance footer links with hover effect
    document.querySelectorAll('.footer-links ul li a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.paddingLeft = '20px';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '15px';
        });
    });
});

// Function to add animation classes to elements
function animateElements() {
    // Animate section headings
    const headings = document.querySelectorAll('h2');
    headings.forEach((heading, index) => {
        heading.classList.add('animate-fade-up');
        heading.style.animationDelay = (0.2 * index) + 's';
    });
    
    // Animate cards
    const cards = document.querySelectorAll('.card, .prize-card, .prize, .contact-method, .judge-card');
    cards.forEach((card, index) => {
        card.classList.add('animate-fade-in');
        card.style.animationDelay = (0.1 * index) + 's';
    });
    
    // Animate steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.add('animate-slide-in');
        step.style.animationDelay = (0.2 * index) + 's';
    });
}
