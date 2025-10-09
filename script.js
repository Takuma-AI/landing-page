document.addEventListener('DOMContentLoaded', function() {
    // Scroll-driven content controller
    const scrollPage = document.querySelector('.scroll-page');
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('.scroll-section');
    const header = document.querySelector('.site-header');

    if (!scrollContainer || sections.length === 0) return;

    // Initialize sections and background
    sections.forEach((section, index) => {
        if (index > 0) {
            section.classList.add('inactive');
        } else {
            section.classList.add('active');
        }
    });

    // Set initial background to white
    scrollPage.classList.add('bg-white');

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

        // Keep background white throughout (no color switching)

        // Lock scroll at last section
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

    // Header background and logo color on scroll
    function updateHeader() {
        if (window.pageYOffset > window.innerHeight * 0.1) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Logo stays dark (background is always white)
        const logo = header.querySelector('.logo');
        const logoDropdown = header.querySelector('.logo-dropdown');
        if (logo) {
            logo.style.color = 'var(--ink-black)';
            if (logoDropdown) {
                logoDropdown.querySelectorAll('a').forEach(link => {
                    link.style.color = 'var(--ink-black)';
                });
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

    // Dynamic dates
    function updateDates() {
        const today = new Date();
        const dayOfWeek = today.getDay();

        // Calculate next Monday
        let daysToAdd;
        if (dayOfWeek >= 1 && dayOfWeek <= 3) {
            daysToAdd = 8 - dayOfWeek;
        } else {
            daysToAdd = dayOfWeek === 0 ? 8 : 15 - dayOfWeek;
        }

        const startDate = new Date(today);
        startDate.setDate(today.getDate() + daysToAdd);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 28);

        // Format dates with ordinal
        const ordinal = (day) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = day % 100;
            return day + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        // Update start date
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
        const startDateElement = document.querySelector('.start-date');
        if (startDateElement) {
            startDateElement.textContent = `${startMonth} ${ordinal(startDay)}`;
        }

        // Update end date
        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
        const endDateElement = document.querySelector('.end-date');
        if (endDateElement) {
            endDateElement.textContent = `${endMonth} ${ordinal(endDay)}`;
        }
    }

    // Initial state
    updateActiveState();
    updateHeader();
    updateDates();
});
