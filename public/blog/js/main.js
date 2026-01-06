// Add Scroll to Top button functionality
function addScrollToTopButton() {
    // Check if button already exists
    if (document.querySelector('.scroll-to-top')) {
        return;
    }

    // Create the button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.id = 'scrollTopBtn';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';

    // Add click event for smooth scroll
    scrollButton.addEventListener('click', function (e) {
        e.preventDefault();

        // Add pulse effect on click
        this.classList.add('pulse');

        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Remove pulse after animation
        setTimeout(() => {
            this.classList.remove('pulse');
        }, 600);
    });

    // Add keyboard support for accessibility
    scrollButton.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });

    // Add to body
    document.body.appendChild(scrollButton);

    // Show/hide based on scroll position
    function toggleScrollButton() {
        const scrollButton = document.querySelector('.scroll-to-top');
        if (scrollButton) {
            if (window.scrollY > 300) {
                scrollButton.classList.add('show');

                // Add pulse animation when first showing
                if (!scrollButton.hasAttribute('data-pulsed')) {
                    scrollButton.classList.add('pulse');
                    scrollButton.setAttribute('data-pulsed', 'true');

                    // Remove pulse after 3 seconds
                    setTimeout(() => {
                        scrollButton.classList.remove('pulse');
                    }, 3000);
                }
            } else {
                scrollButton.classList.remove('show');
                scrollButton.classList.remove('pulse');
            }
        }
    }

    // Initial check
    toggleScrollButton();

    // Add scroll event listener
    window.addEventListener('scroll', toggleScrollButton);

    // Optional: Add focus styles for better accessibility
    scrollButton.addEventListener('focus', function () {
        this.style.outline = '2px solid rgba(52, 152, 219, 0.5)';
        this.style.outlineOffset = '2px';
    });

    scrollButton.addEventListener('blur', function () {
        this.style.outline = 'none';
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    addScrollToTopButton();

    // Also check for scroll position on page load
    setTimeout(() => {
        const scrollButton = document.querySelector('.scroll-to-top');
        if (scrollButton && window.scrollY > 300) {
            scrollButton.classList.add('show');
        }
    }, 100);
});

// If using jQuery, also initialize on jQuery ready
if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(function () {
        addScrollToTopButton();
    });
}

// Check if user is admin
function checkUserIsAdmin() {
    return currentUser && currentUser.is_admin === true;
}