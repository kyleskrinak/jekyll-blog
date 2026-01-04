// Gumshoe initialization fix for MM fork Phase 5
// This ensures Gumshoe is available globally after main.min.js loads

(function() {
  'use strict';
  
  // Wait for Gumshoe to be available
  const initGumshoe = function() {
    const toc = document.querySelector('nav.toc');
    if (!toc) return;
    
    // Check if Gumshoe is available (after plugins load)
    if (typeof window.Gumshoe === 'undefined' && typeof Gumshoe === 'function') {
      window.Gumshoe = Gumshoe;
    }
    
    // Initialize if available
    if (typeof window.Gumshoe === 'function') {
      new window.Gumshoe('nav.toc a', {
        navClass: 'active',
        contentClass: 'active',
        nested: false,
        nestedClass: 'active',
        offset: 20,
        reflow: true,
        events: true
      });
    }
  };
  
  // Initialize lightbox for gallery images
  const initLightbox = function() {
    const links = document.querySelectorAll('figure a[href$=".jpg"], figure a[href$=".JPG"], figure a[href$=".png"], a.image-popup');
    
    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        // Add image-lightbox class for styling
        link.classList.add('image-lightbox');
      });
    });
  };
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initGumshoe();
      initLightbox();
    });
  } else {
    initGumshoe();
    initLightbox();
  }
  
  // Also try again after a short delay in case plugins are still loading
  setTimeout(initGumshoe, 500);
})();
