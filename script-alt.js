document.addEventListener('DOMContentLoaded', function() {
    // Scroll-driven content controller
    const scrollPage = document.querySelector('.scroll-page');
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('.scroll-section');
    const header = document.querySelector('.site-header');
    let currentBgColor = 'black';

    if (!scrollContainer || sections.length === 0) return;

    // Initialize sections and background
    sections.forEach((section, index) => {
        if (index > 0) {
            section.classList.add('inactive');
        } else {
            section.classList.add('active');
        }
    });

    // Set initial background
    scrollPage.classList.add('bg-black');

    // Update active state - simple slide approach like Hashi
    function updateActiveState() {
        const activeZoneTop = window.innerHeight * 0.4; // 40% from top
        let desiredActiveIndex = -1;
        let closestDistance = Infinity;

        // Find which section is closest to active zone
        sections.forEach((section, index) => {
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const distance = Math.abs(sectionTop - activeZoneTop);

            if (sectionTop <= activeZoneTop + 50 && distance < closestDistance) {
                closestDistance = distance;
                desiredActiveIndex = index;
            }
        });

        // Update section states: past, active, or inactive
        sections.forEach((section, index) => {
            if (index < desiredActiveIndex) {
                // Past sections
                section.classList.remove('active', 'inactive');
                section.classList.add('past');
            } else if (index === desiredActiveIndex) {
                // Active section
                section.classList.add('active');
                section.classList.remove('inactive', 'past');
            } else {
                // Future sections
                section.classList.remove('active', 'past');
                section.classList.add('inactive');
            }
        });

        // Update background based on active section
        if (desiredActiveIndex >= 0) {
            const bgColor = sections[desiredActiveIndex].dataset.bgColor;
            if (bgColor && currentBgColor !== bgColor) {
                scrollPage.classList.remove('bg-black', 'bg-white');
                scrollPage.classList.add(`bg-${bgColor}`);
                currentBgColor = bgColor;
            }
        }

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

    // Attach scroll listener
    scrollContainer.addEventListener('scroll', function() {
        updateActiveState();
    });

    window.addEventListener('scroll', function() {
        updateHeader();
    });

    // Initial state
    updateActiveState();
    updateHeader();
});
