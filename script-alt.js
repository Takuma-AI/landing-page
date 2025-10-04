document.addEventListener('DOMContentLoaded', function() {
    // Scroll-driven content controller
    const scrollPage = document.querySelector('.scroll-page');
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('.scroll-section');
    const header = document.querySelector('.site-header');
    let currentBgColor = 'black';
    let hasReachedEnd = sessionStorage.getItem('hasReachedEnd') === 'true';

    if (!scrollContainer || sections.length === 0) return;

    // Initialize sections and background
    if (hasReachedEnd) {
        // Show all sections if already scrolled through once
        sections.forEach((section) => {
            section.classList.add('active');
            section.classList.remove('inactive', 'past');
            // Apply individual section backgrounds
            const bgColor = section.dataset.bgColor;
            if (bgColor) {
                section.classList.add(`section-bg-${bgColor}`);
            }
        });
        // Remove page-level background
        scrollPage.style.background = 'transparent';
    } else {
        sections.forEach((section, index) => {
            if (index > 0) {
                section.classList.add('inactive');
            } else {
                section.classList.add('active');
            }
        });
        // Set initial background
        scrollPage.classList.add('bg-black');
    }

    // Update active state - simple slide approach like Hashi
    function updateActiveState() {
        // If already reached end, keep all sections visible
        if (hasReachedEnd) {
            return;
        }

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

        // Check if reached the last section (CTA)
        if (desiredActiveIndex === sections.length - 1) {
            hasReachedEnd = true;
            sessionStorage.setItem('hasReachedEnd', 'true');

            // Show all sections and apply individual backgrounds
            sections.forEach((section) => {
                section.classList.add('active');
                section.classList.remove('inactive', 'past');
                const bgColor = section.dataset.bgColor;
                if (bgColor) {
                    section.classList.add(`section-bg-${bgColor}`);
                }
            });

            // Remove page-level background
            scrollPage.style.background = 'transparent';
            scrollPage.classList.remove('bg-black', 'bg-white');
        }
    }

    // Header background and logo color on scroll
    function updateHeader() {
        if (window.pageYOffset > window.innerHeight * 0.1) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update logo color based on scroll-page or section background
        const logo = header.querySelector('.logo');
        const logoDropdown = header.querySelector('.logo-dropdown');
        if (logo) {
            if (hasReachedEnd) {
                // Check which section is at the top
                let topSectionBgColor = 'black';
                sections.forEach((section) => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom > 100) {
                        topSectionBgColor = section.dataset.bgColor || 'black';
                    }
                });

                if (topSectionBgColor === 'white') {
                    logo.style.color = 'var(--ink-black)';
                    if (logoDropdown) {
                        logoDropdown.querySelectorAll('a').forEach(link => {
                            link.style.color = 'var(--ink-black)';
                        });
                    }
                } else {
                    logo.style.color = 'var(--paper-white)';
                    if (logoDropdown) {
                        logoDropdown.querySelectorAll('a').forEach(link => {
                            link.style.color = 'var(--paper-white)';
                        });
                    }
                }
            } else {
                // Pre-reveal: use scroll-page background
                if (scrollPage.classList.contains('bg-white')) {
                    logo.style.color = 'var(--ink-black)';
                    if (logoDropdown) {
                        logoDropdown.querySelectorAll('a').forEach(link => {
                            link.style.color = 'var(--ink-black)';
                        });
                    }
                } else if (scrollPage.classList.contains('bg-black')) {
                    logo.style.color = 'var(--paper-white)';
                    if (logoDropdown) {
                        logoDropdown.querySelectorAll('a').forEach(link => {
                            link.style.color = 'var(--paper-white)';
                        });
                    }
                }
            }
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
        updateHeader();
    });

    window.addEventListener('scroll', function() {
        updateHeader();
    });

    // Initial state
    updateActiveState();
    updateHeader();
});
