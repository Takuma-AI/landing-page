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

    // Update active state based on scroll with smooth reveal
    function updateActiveState() {
        const activeZoneTop = window.innerHeight * 0.2; // 20% from top
        const revealDistance = window.innerHeight * 0.5; // Start revealing 50vh before threshold (much earlier)
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

            // Calculate smooth reveal opacity
            const distanceFromThreshold = sectionTop - activeZoneTop;

            if (distanceFromThreshold > revealDistance) {
                // Too far away, fully hidden
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                section.classList.remove('active', 'past');
                section.classList.add('inactive');
            } else if (distanceFromThreshold <= 0) {
                // Past the threshold
                if (distanceFromThreshold > -window.innerHeight * 0.5) {
                    // Still on screen, fade to past state
                    const pastProgress = Math.abs(distanceFromThreshold) / (window.innerHeight * 0.5);
                    section.style.opacity = Math.max(0.2, 1 - pastProgress * 0.8);
                    section.classList.remove('active', 'inactive');
                    section.classList.add('past');
                } else {
                    // Way past, fully faded
                    section.style.opacity = '0.2';
                    section.classList.remove('active', 'inactive');
                    section.classList.add('past');
                }
            } else {
                // Approaching threshold, smooth reveal
                const progress = 1 - (distanceFromThreshold / revealDistance);
                const opacity = Math.pow(progress, 0.4); // Sharper curve, reaches 1.0 faster
                section.style.opacity = opacity.toString();
                section.style.visibility = 'visible';

                if (progress > 0.5) { // Active earlier
                    section.classList.add('active');
                    section.classList.remove('inactive', 'past');
                } else {
                    section.classList.remove('active', 'past');
                    section.classList.add('inactive');
                }
            }
        });

        // Update background based on active section
        if (desiredActiveIndex >= 0) {
            const bgColor = sections[desiredActiveIndex].dataset.bgColor;
            if (bgColor && currentBgColor !== bgColor) {
                // Remove all bg classes
                scrollPage.classList.remove('bg-black', 'bg-white');
                // Add new bg class
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

    // Timeline progressive highlight
    const timelineScrollSections = [
        document.querySelector('.timeline-scroll-1'),
        document.querySelector('.timeline-scroll-2'),
        document.querySelector('.timeline-scroll-3'),
        document.querySelector('.timeline-scroll-4')
    ];
    const timelineItems = document.querySelectorAll('.timeline-item');

    function updateTimelineHighlight() {
        if (!timelineScrollSections[0]) return;

        const timelineSection = timelineScrollSections[0];
        const timelineRect = timelineSection.getBoundingClientRect();
        const threshold = window.innerHeight * 0.2;

        // Determine which week to highlight based on scroll position
        let highlightedWeek = 0;

        timelineScrollSections.forEach((section, index) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();

            // Each spacer triggers the next week
            if (rect.top <= threshold) {
                highlightedWeek = index;
            }
        });

        // Cap at index 3 (week 4)
        highlightedWeek = Math.min(highlightedWeek, 3);

        // Update timeline items
        timelineItems.forEach((item, index) => {
            item.classList.remove('highlighted', 'completed');

            if (index === highlightedWeek) {
                item.classList.add('highlighted');
            } else if (index < highlightedWeek) {
                item.classList.add('completed');
            }
        });

        // Manage sticky state
        const lastSpacerRect = timelineScrollSections[3] ? timelineScrollSections[3].getBoundingClientRect() : null;

        // Stick when timeline reaches threshold
        if (timelineRect.top <= threshold && highlightedWeek < 3) {
            timelineSection.classList.add('is-sticky');
            timelineSection.classList.remove('is-unstuck');
        }
        // Unstick as soon as week 4 is highlighted (much faster)
        else if (highlightedWeek === 3) {
            timelineSection.classList.remove('is-sticky');
            timelineSection.classList.add('is-unstuck');
        }
        // Not sticky yet
        else if (timelineRect.top > threshold) {
            timelineSection.classList.remove('is-sticky', 'is-unstuck');
        }
    }

    // Attach timeline highlight to scroll
    scrollContainer.addEventListener('scroll', function() {
        updateActiveState();
        updateTimelineHighlight();
    });

    window.addEventListener('scroll', function() {
        updateHeader();
    });

    // Initial state
    updateActiveState();
    updateHeader();
    updateTimelineHighlight();
});
