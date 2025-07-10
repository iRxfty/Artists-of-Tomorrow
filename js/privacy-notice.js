document.addEventListener('DOMContentLoaded', function() {
    // Check if user already accepted
    if (!localStorage.getItem('privacyAccepted')) {
        // Create banner
        const banner = document.createElement('div');
        banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#f0f0f0;padding:15px;text-align:center;box-shadow:0 -2px 5px rgba(0,0,0,0.1);z-index:1000;';
        banner.innerHTML = `
            <p>This website uses analytics to improve your experience. 
            <a href="https://clarity.microsoft.com/terms" target="_blank">Learn more</a>.</p>
            <button id="acceptPrivacy" style="background:#4D7EA8;color:white;border:none;padding:8px 15px;margin:5px;cursor:pointer;">Accept</button>
        `;
        document.body.appendChild(banner);
        
        // Add button functionality
        document.getElementById('acceptPrivacy').addEventListener('click', function() {
            localStorage.setItem('privacyAccepted', 'true');
            banner.style.display = 'none';
        });
    }
});
