document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already accepted
    if (!localStorage.getItem('privacyAccepted')) {
        // Create banner element
        const banner = document.createElement('div');
        banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#333333;color:#fff;padding:15px;text-align:center;box-shadow:0 -4px 10px rgba(0,0,0,0.2);z-index:1000;animation:slideInUp 0.5s ease;';
        
        // Add content to banner - using relative path instead of absolute
        banner.innerHTML = `
            <div style="max-width:1200px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:15px;">
                <p style="margin:0;flex-grow:1;">This website uses analytics tools to improve your experience. 
                <a href="privacy.html" id="privacyLink" style="color:#E08D79;text-decoration:underline;">Privacy Policy</a></p>
                <button id="acceptPrivacy" style="background:#E08D79;color:white;border:none;padding:10px 25px;margin:5px;cursor:pointer;border-radius:50px;font-weight:bold;transition:all 0.3s ease;">Accept</button>
            </div>
        `;
        
        // Add banner to page
        document.body.appendChild(banner);
        
        // Add button click handler
        document.getElementById('acceptPrivacy').addEventListener('click', function() {
            localStorage.setItem('privacyAccepted', 'true');
            banner.style.animation = 'slideOutDown 0.5s ease forwards';
            
            // Add animation styles
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes slideOutDown {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(100%); opacity: 0; }
                }
                
                @keyframes slideInUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            // Remove banner after animation completes
            setTimeout(() => {
                banner.style.display = 'none';
            }, 500);
        });
        
        // Add hover effect to the accept button
        const acceptBtn = document.getElementById('acceptPrivacy');
        if (acceptBtn) {
            acceptBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#D07A69';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            });
            
            acceptBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#E08D79';
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        }
    }
});
