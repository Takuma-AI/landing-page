document.addEventListener('DOMContentLoaded', function() {
    // Simple header background toggle
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > window.innerHeight * 0.9) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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