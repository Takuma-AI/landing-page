document.addEventListener('DOMContentLoaded', function() {
    // Header scroll behavior
    const header = document.querySelector('.site-header');
    let lastScrollY = 0;
    let scrollingDown = false;
    const secondSection = document.querySelector('.raising-bar');

    function updateHeader() {
        const currentScrollY = window.pageYOffset;
        const secondSectionTop = secondSection ? secondSection.offsetTop : window.innerHeight;

        // Determine scroll direction
        scrollingDown = currentScrollY > lastScrollY;

        // Past second section
        if (currentScrollY > secondSectionTop) {
            header.classList.add('scrolled');

            // Show/hide based on scroll direction
            if (scrollingDown && currentScrollY > secondSectionTop + 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            // In hero section - keep original behavior
            header.classList.remove('scrolled', 'hidden');
        }

        lastScrollY = currentScrollY;
    }

    // Throttle scroll events
    let headerTicking = false;
    window.addEventListener('scroll', function() {
        if (!headerTicking) {
            window.requestAnimationFrame(function() {
                updateHeader();
                headerTicking = false;
            });
            headerTicking = true;
        }
    });

    // One-time snap from hero to content
    let hasSnapped = false;
    let isSnapping = false;

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const threshold = windowHeight * 0.15; // 15% scroll triggers snap

        // Only snap once when leaving hero section
        if (!hasSnapped && !isSnapping && scrollY > threshold && scrollY < windowHeight) {
            isSnapping = true;
            window.scrollTo({
                top: windowHeight,
                behavior: 'smooth'
            });

            setTimeout(() => {
                hasSnapped = true;
                isSnapping = false;
            }, 600);
        }
    });
    // Standard click accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Click handlers for accordion
    accordionHeaders.forEach((header, index) => {
        header.addEventListener('click', () => {
            const item = accordionItems[index];
            const isActive = item.classList.contains('active');

            // Close all items
            accordionItems.forEach(accItem => {
                accItem.classList.remove('active');
            });

            // Open clicked item if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Initial state - first item open
    if (accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }

    // Simple typewriter effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';

        let index = 0;
        function typeWriter() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }

        setTimeout(typeWriter, 300);
    }

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

        // Update start date (October 6th span)
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
        const startDateElement = document.querySelector('.date-emphasis');
        if (startDateElement) {
            startDateElement.textContent = `${startMonth} ${ordinal(startDay)}`;
        }

        // Update end date (November 3rd span)
        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
        const goldTextElement = document.querySelector('.gold-text');
        if (goldTextElement) {
            goldTextElement.textContent = `${endMonth} ${ordinal(endDay)}`;
        }
    }

    updateDates();

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});