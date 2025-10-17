document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.site-header');

    // Header background on scroll
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader);

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

        if (logoDropdown) {
            logoDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        setTimeout(function() {
            document.addEventListener('click', function(e) {
                if (menuOpen && !logoWrapper.contains(e.target)) {
                    menuOpen = false;
                    logoWrapper.classList.remove('menu-open');
                }
            });
        }, 0);
    }

    // Dynamic dates
    function updateDates() {
        const today = new Date();
        const dayOfWeek = today.getDay();

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

        const ordinal = (day) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = day % 100;
            return day + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
        const startDateElement = document.querySelector('.start-date');
        if (startDateElement) {
            startDateElement.textContent = `${startMonth} ${ordinal(startDay)}`;
        }

        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
        const endDateElement = document.querySelector('.end-date');
        if (endDateElement) {
            endDateElement.textContent = `${endMonth} ${ordinal(endDay)}`;
        }
    }

    // Calendly button handler
    const calendlyButton = document.querySelector('.cta-button');
    if (calendlyButton) {
        calendlyButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof Calendly !== 'undefined') {
                Calendly.initPopupWidget({url: 'https://calendly.com/kateleext/takuma'});
            }
        });
    }

    // Takuma nav toggle and loading
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

    // Swipeable card carousel
    const cardContainer = document.getElementById('card-container');
    const timelineCards = document.querySelectorAll('.timeline-card');
    const navDots = document.querySelectorAll('.card-nav-dot');
    let currentCard = 0;

    function showCard(index) {
        // Remove active from all
        timelineCards.forEach(card => card.classList.remove('active'));
        navDots.forEach(dot => dot.classList.remove('active'));

        // Add active to current
        if (timelineCards[index]) {
            timelineCards[index].classList.add('active');
        }
        if (navDots[index]) {
            navDots[index].classList.add('active');
        }
        currentCard = index;
    }

    // Dot navigation
    if (navDots.length > 0) {
        navDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const cardIndex = parseInt(this.getAttribute('data-card'));
                showCard(cardIndex);
            });
        });
    }

    // Touch swipe support
    if (cardContainer) {
        let touchStartX = 0;
        let touchEndX = 0;

        cardContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        cardContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next card
                    const nextCard = Math.min(currentCard + 1, timelineCards.length - 1);
                    showCard(nextCard);
                } else {
                    // Swipe right - previous card
                    const prevCard = Math.max(currentCard - 1, 0);
                    showCard(prevCard);
                }
            }
        }
    }

    // Calendly button handler for letter page
    const calendlyButtonLetter = document.querySelector('.cta-button-letter');
    if (calendlyButtonLetter) {
        calendlyButtonLetter.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof Calendly !== 'undefined') {
                Calendly.initPopupWidget({url: 'https://calendly.com/kateleext/takuma'});
            }
        });
    }

    updateHeader();
    updateDates();
});
