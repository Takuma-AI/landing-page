document.addEventListener('DOMContentLoaded', function() {
    // Scroll-driven content controller
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('.scroll-section');
    const header = document.querySelector('.site-header');

    if (!scrollContainer || sections.length === 0) return;

    // Initialize sections
    sections.forEach((section, index) => {
        if (index > 0) {
            section.classList.add('inactive');
        } else {
            section.classList.add('active');
        }
    });

    // Update active state based on scroll
    function updateActiveState() {
        const activeZoneTop = window.innerHeight * 0.3; // 30% from top (lower = appears sooner)
        let desiredActiveIndex = -1;
        let closestDistance = Infinity;

        sections.forEach((section, index) => {
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const distance = Math.abs(sectionTop - activeZoneTop);

            // Find which section's top is closest to the active zone
            if (sectionTop <= activeZoneTop + 100 && distance < closestDistance) {
                closestDistance = distance;
                desiredActiveIndex = index;
            }
        });

        sections.forEach((section, index) => {
            if (index < desiredActiveIndex) {
                section.classList.remove('active', 'inactive');
                section.classList.add('past');
            } else if (index === desiredActiveIndex) {
                section.classList.add('active');
                section.classList.remove('inactive', 'past');
            } else {
                section.classList.remove('active', 'past');
                section.classList.add('inactive');
            }
        });

        // Limit scroll at last section
        if (desiredActiveIndex === sections.length - 1) {
            const lastSectionRect = sections[desiredActiveIndex].getBoundingClientRect();
            if (lastSectionRect.top <= activeZoneTop) {
                const currentScroll = scrollContainer.scrollTop;
                const maxPosition = lastSectionRect.top + currentScroll - activeZoneTop;
                if (currentScroll > maxPosition) {
                    scrollContainer.scrollTop = maxPosition;
                }
            }
        }
    }

    // Header background on scroll
    function updateHeader() {
        if (window.pageYOffset > window.innerHeight * 0.1) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Attach scroll listener
    scrollContainer.addEventListener('scroll', function() {
        updateActiveState();
    });

    window.addEventListener('scroll', function() {
        updateHeader();
    });

    // Brand menu toggle
    let menuOpen = false;
    const logoWrapper = document.querySelector('.logo-wrapper');
    const logo = document.querySelector('.logo');
    const logoDropdown = document.querySelector('.logo-dropdown');

    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            menuOpen = !menuOpen;

            if (menuOpen) {
                logoWrapper.classList.add('menu-open');
            } else {
                logoWrapper.classList.remove('menu-open');
            }
        });

        // Prevent dropdown clicks from closing menu
        if (logoDropdown) {
            logoDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Close menu when clicking outside
        setTimeout(function() {
            document.addEventListener('click', function(e) {
                if (menuOpen && !logoWrapper.contains(e.target)) {
                    menuOpen = false;
                    logoWrapper.classList.remove('menu-open');
                }
            });
        }, 0);
    }

    // Initial state
    updateActiveState();
    updateHeader();
});
