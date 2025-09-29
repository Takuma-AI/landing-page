// Subtle scroll reveal animations
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections and key elements
    const elementsToAnimate = document.querySelectorAll('.service, .method, .who-for li, .differences p');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Smooth scroll for anchor links
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

    // Add subtle parallax to hero on scroll
    const hero = document.querySelector('.hero');
    let ticking = false;

    function updateHeroPosition() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeroPosition);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);


    // Typewriter effect for hero title (subtle)
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

        // Start after a brief delay
        setTimeout(typeWriter, 500);
    }

    // Dynamic dates for "Your Next Four Weeks" section
    function updateDates() {
        const today = new Date();
        const dayOfWeek = today.getDay();

        // Calculate next start date (next Monday if Mon-Wed, Monday after next if Thu-Sun)
        let daysToAdd;
        if (dayOfWeek >= 1 && dayOfWeek <= 3) {
            // Monday to Wednesday: next Monday
            daysToAdd = 8 - dayOfWeek;
        } else {
            // Thursday to Sunday: Monday after next
            daysToAdd = dayOfWeek === 0 ? 8 : 15 - dayOfWeek;
        }

        const startDate = new Date(today);
        startDate.setDate(today.getDate() + daysToAdd);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 28); // 4 weeks later

        // Format dates
        const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

        // Update HTML
        const startDateElement = document.querySelector('.start-date');
        if (startDateElement) {
            startDateElement.textContent = `Starting ${startFormatted}:`;
        }

        const momentumElement = document.querySelector('.momentum');
        if (momentumElement) {
            momentumElement.textContent = `By ${endFormatted}, you'll have risen above the noise with momentum you didn't know was possible.`;
        }
    }

    updateDates();
});