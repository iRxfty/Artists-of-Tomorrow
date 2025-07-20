/**
 * Artists of Tomorrow - Clarity Helper
 * This script fixes Microsoft Clarity's CORS font loading issues
 */
(function() {
    // Create a style element to locally define the FabricMDL2Icons font
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: 'FabricMDL2Icons';
            src: url('data:application/font-woff;charset=utf-8;base64,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') format('woff');
        }
    `;
    
    // Add the style to the document head
    document.head.appendChild(style);
    
    // Create a MutationObserver to handle any dynamic Clarity elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.tagName === 'LINK' && node.href && node.href.includes('fabric-icons')) {
                        // Prevent the loading of the problematic font
                        node.href = '';
                    }
                }
            }
        });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true 
    });
    
    console.log('Clarity helper initialized');
})();
