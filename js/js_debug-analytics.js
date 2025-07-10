// Debug script for analytics
document.addEventListener('DOMContentLoaded', function() {
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = 'position:fixed;top:10px;right:10px;background:#333;color:#fff;padding:10px;z-index:10000;font-family:monospace;border-radius:5px;';
    
    let debugContent = '<h3>Analytics Debug</h3>';
    
    // Check Google Analytics
    if (window.dataLayer && typeof gtag === 'function') {
        debugContent += '<p style="color:lightgreen">✓ Google Analytics detected</p>';
        // Force a GA event
        gtag('event', 'debug_check', {
            'debug_time': new Date().toString()
        });
        debugContent += '<p>Test event sent to GA</p>';
    } else {
        debugContent += '<p style="color:red">✗ Google Analytics not found</p>';
    }
    
    // Check Microsoft Clarity
    if (typeof clarity === 'function') {
        debugContent += '<p style="color:lightgreen">✓ Microsoft Clarity detected</p>';
    } else {
        debugContent += '<p style="color:red">✗ Microsoft Clarity not found</p>';
        debugContent += '<p>Note: Clarity might still be working even if not detected here</p>';
    }
    
    // Add instructions
    debugContent += '<p>Check GA4 real-time reports and Clarity dashboard</p>';
    debugContent += '<button id="closeDebug" style="background:#f44;border:none;color:white;padding:5px;margin-top:10px;cursor:pointer;">Close</button>';
    
    debugPanel.innerHTML = debugContent;
    document.body.appendChild(debugPanel);
    
    // Add close button functionality
    document.getElementById('closeDebug').addEventListener('click', function() {
        debugPanel.remove();
    });
    
    // Log to console as well
    console.log('Analytics Debug: GA4 ' + (window.dataLayer ? 'DETECTED' : 'NOT DETECTED') + 
                ', Clarity ' + (typeof clarity === 'function' ? 'DETECTED' : 'NOT DETECTED'));
});
