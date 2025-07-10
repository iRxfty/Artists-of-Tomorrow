document.addEventListener('DOMContentLoaded', function() {
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
                
                //
