// Postcards - Click to Flip and Nav Initialization

document.addEventListener('DOMContentLoaded', function() {
  // Postcard flip interaction
  const postcards = document.querySelectorAll('.postcard');

  postcards.forEach(postcard => {
    postcard.addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  });

  // Takuma nav initialization and toggle
  const takumaNav = document.getElementById('takuma-nav');
  const takumaIcon = document.getElementById('takuma-icon');
  let clickExpanded = false;

  if (takumaNav && takumaIcon) {
    // Show nav when icon loads
    takumaIcon.addEventListener('load', function() {
      takumaNav.classList.add('loaded');
    });

    // If already loaded (cached), show immediately
    if (takumaIcon.complete) {
      takumaNav.classList.add('loaded');
    }

    takumaNav.addEventListener('click', function(e) {
      // Don't toggle if clicking on a link
      if (e.target.tagName === 'A') return;

      clickExpanded = !clickExpanded;

      if (clickExpanded) {
        this.classList.add('expanded');
        // Listen for clicks outside to close
        setTimeout(() => {
          document.addEventListener('click', handleClickOutside);
        }, 0);
      } else {
        this.classList.remove('expanded');
        document.removeEventListener('click', handleClickOutside);
      }
    });

    // Click outside to close
    function handleClickOutside(e) {
      if (!takumaNav.contains(e.target)) {
        clickExpanded = false;
        takumaNav.classList.remove('expanded');
        document.removeEventListener('click', handleClickOutside);
      }
    }

    // Prevent hover events from interfering when manually expanded
    takumaNav.addEventListener('mouseenter', function() {
      if (!clickExpanded) {
        this.classList.add('expanded');
      }
    });

    takumaNav.addEventListener('mouseleave', function() {
      if (!clickExpanded) {
        this.classList.remove('expanded');
      }
    });
  }
});
