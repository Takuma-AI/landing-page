document.addEventListener('DOMContentLoaded', function() {
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
        const day = startDate.getDate();
        const ordinal = (day) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = day % 100;
            return day + (s[(v - 20) % 10] || s[v] || s[0]);
        };
        const monthName = startDate.toLocaleDateString('en-US', { month: 'long' });

        // Update start date
        const startDateElement = document.querySelector('.start-date-tag');
        if (startDateElement) {
            startDateElement.textContent = `Sprint Begins ${monthName} ${ordinal(day)}`;
        }

        // Update end date
        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
        const dateEmphasis = document.querySelector('.date-emphasis');
        if (dateEmphasis) {
            dateEmphasis.textContent = `${endMonth} ${ordinal(endDay)}`;
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