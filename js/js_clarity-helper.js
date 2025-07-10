document.addEventListener('DOMContentLoaded', function() {
  // Wait a moment to ensure Clarity has loaded
  setTimeout(function() {
    if (typeof clarity === 'undefined') {
      console.warn('Microsoft Clarity not loaded properly');
      return;
    }
    
    // Track all clickable elements
    document.addEventListener('click', function(event) {
      // Find the clicked element or its closest anchor parent
      let targetElement = event.target;
      let clickedLink = null;
      
      // Get the element or its closest anchor/button parent
      if (targetElement.tagName !== 'A' && targetElement.tagName !== 'BUTTON') {
        clickedLink = targetElement.closest('a, button');
      } else {
        clickedLink = targetElement;
      }
      
      // If we found a link or button, track it
      if (clickedLink) {
        let linkText = clickedLink.innerText || clickedLink.textContent || 'no text';
        let linkHref = clickedLink.href || '';
        let linkId = clickedLink.id || '';
        let linkClass = clickedLink.className || '';
        
        // Send custom event to Clarity
        clarity('set', 'custom_click', {
          element: clickedLink.tagName.toLowerCase(),
          text: linkText.trim().substring(0, 50),
          href: linkHref,
          id: linkId,
          class: linkClass
        });
        
        console.log('Clarity click tracked:', linkText.trim().substring(0, 30));
      }
    }, true);
    
    console.log('Clarity click tracking initialized');
  }, 1000);
});