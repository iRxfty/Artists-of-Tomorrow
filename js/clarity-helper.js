/**
 * Artists of Tomorrow - Clarity/Font Helper
 * Prevents CORS issues with Microsoft fonts used by Clarity
 */
(function() {
    // Create a style element to preemptively block problematic fonts
    const style = document.createElement('style');
    style.textContent = `
        /* Block Microsoft fonts that cause CORS errors */
        @font-face {
            font-family: 'Segoe UI';
            src: local('Segoe UI');
            font-weight: normal;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'Segoe UI';
            src: local('Segoe UI Bold');
            font-weight: bold;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'Segoe UI';
            src: local('Segoe UI Light');
            font-weight: 300;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'Segoe UI';
            src: local('Segoe UI Semibold');
            font-weight: 600;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'Segoe UI';
            src: local('Segoe UI Semilight');
            font-weight: 200;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'Leelawadee UI';
            src: local('Leelawadee UI');
            font-weight: normal;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'Leelawadee UI';
            src: local('Leelawadee UI Bold');
            font-weight: bold;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'Leelawadee UI';
            src: local('Leelawadee UI Semilight');
            font-weight: 300;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'FabricMDL2Icons';
            src: local('FabricMDL2Icons');
            font-weight: normal;
            font-style: normal;
        }
    `;
    
    // Add the style to the document head
    document.head.appendChild(style);
    
    // Create a MutationObserver to handle any dynamic font loading attempts
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    // Check for link elements that might be loading fonts
                    if (node.tagName === 'LINK' && node.href) {
                        // Block any Microsoft font files
                        const fontPatterns = [
                            'fabric-icons', 'segoeui', 'leelawadeeui', 
                            '.woff', '.woff2', '.ttf', '.eot'
                        ];
                        
                        if (fontPatterns.some(pattern => node.href.includes(pattern))) {
                            // Prevent the loading by removing the element
                            if (node.parentNode) {
                                node.parentNode.removeChild(node);
                            } else {
                                node.href = '';
                            }
                            console.log('Blocked font loading:', node.href);
                        }
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
    
    // Also check for any existing font links
    document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"]').forEach(link => {
        const fontPatterns = ['fabric-icons', 'segoeui', 'leelawadeeui', '.woff', '.woff2', '.ttf', '.eot'];
        if (fontPatterns.some(pattern => link.href.includes(pattern))) {
            link.href = '';
            console.log('Removed existing font link:', link);
        }
    });
    
    console.log('Enhanced font blocker initialized');
})();
