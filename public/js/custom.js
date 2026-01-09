document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    /**
     * Initiate glightbox
     */
    const glightbox = GLightbox({
        selector: '.glightbox'
    });

    /**
     * Initiate pURE cOUNTER
     */
    new PureCounter();

    /**
     * Init swiper slider with 1 slide at once in desktop view
     */
    new Swiper('.slides-1', {
        speed: 600,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    /**
     * Init swiper slider with 3 slides at once in desktop view
     */
    new Swiper('.slides-3', {
        speed: 600,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 40
            },

            1200: {
                slidesPerView: 3,
            }
        }
    });

    /**
     * Gallery Slider
     */
    new Swiper('.gallery-slider', {
        speed: 400,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            640: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 5,
                spaceBetween: 20
            }
        }
    });

});

/**
 * Clients Slider
 */
// AutoMarquee - Seamless Infinite Scroll with Auto-Duplication
class AutoMarquee {
    constructor(options = {}) {
        this.container = options.container || '.clients-marquee';
        this.contentClass = options.contentClass || '.marquee-content';
        this.duplicateCount = options.duplicateCount || 2; // Creates 3 total sets
        this.baseSpeed = options.baseSpeed || 80; // Base animation duration in seconds
        this.init();
    }

    init() {
        const marqueeContainers = document.querySelectorAll(this.container);

        marqueeContainers.forEach(container => {
            const content = container.querySelector(this.contentClass);
            if (!content) return;

            // Skip if already initialized
            if (content.dataset.autoMarquee === 'true') return;
            content.dataset.autoMarquee = 'true';

            // Get original items
            const originalItems = Array.from(content.children);
            if (originalItems.length === 0) return;

            // Duplicate items for seamless loop
            this.duplicateItems(content, originalItems);

            // Adjust animation speed based on item count
            this.adjustAnimationSpeed(content, originalItems.length);

            // Add hover pause functionality
            this.addHoverEffects(container, content);

            // Force reflow to ensure smooth animation start
            void content.offsetWidth;
        });
    }

    duplicateItems(content, originalItems) {
        // Clear any existing duplicates (in case of re-initialization)
        const currentItems = Array.from(content.children);
        if (currentItems.length > originalItems.length) {
            // Remove duplicates first
            const duplicates = currentItems.slice(originalItems.length);
            duplicates.forEach(item => item.remove());
        }

        // Create duplicates
        for (let i = 0; i < this.duplicateCount; i++) {
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true'); // For accessibility
                content.appendChild(clone);
            });
        }
    }

    adjustAnimationSpeed(content, originalItemCount) {
        const totalItems = originalItemCount * (this.duplicateCount + 1);
        // Dynamic speed calculation: more items = slower animation
        const speed = this.baseSpeed * (originalItemCount / 10);
        content.style.animationDuration = `${Math.max(40, speed)}s`;
    }

    addHoverEffects(container, content) {
        // Pause on hover
        container.addEventListener('mouseenter', () => {
            content.style.animationPlayState = 'paused';
            // Add subtle scale effect to all items
            const items = content.querySelectorAll('.client-item');
            items.forEach(item => {
                item.style.transition = 'transform 0.3s ease';
                item.style.transform = 'scale(0.98)';
            });
        });

        container.addEventListener('mouseleave', () => {
            content.style.animationPlayState = 'running';
            // Remove scale effect
            const items = content.querySelectorAll('.client-item');
            items.forEach(item => {
                item.style.transform = '';
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const autoMarquee = new AutoMarquee({
        container: '.clients-marquee',
        contentClass: '.marquee-content',
        duplicateCount: 2, // Creates 3 total sets (original + 2 duplicates)
        baseSpeed: 80 // Base animation duration
    });

    // Re-initialize if new content is added dynamically
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    autoMarquee.init();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});

// Fallback for older browsers
if (!document.addEventListener) {
    window.onload = function () {
        const content = document.querySelector('.marquee-content');
        if (content) {
            const items = content.children;
            const count = items.length;
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < count; j++) {
                    content.appendChild(items[j].cloneNode(true));
                }
            }
        }
    };
}

/**
 * Success stories
 */
// Initialize Swiper for the Stories of Change section
document.addEventListener('DOMContentLoaded', function () {
    // Use the specific class for this section
    const storiesSwiper = new Swiper('#stories-of-change .stories-swiper', {
        // Show 3 slides at once on desktop
        slidesPerView: 3,
        spaceBetween: 25,
        centeredSlides: false,
        loop: true,
        speed: 600,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },

        // Navigation arrows
        navigation: {
            nextEl: '#stories-of-change .stories-swiper-button-next',
            prevEl: '#stories-of-change .stories-swiper-button-prev',
        },

        // Pagination
        pagination: {
            el: '#stories-of-change .stories-swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },

        // Responsive breakpoints
        breakpoints: {
            // Mobile: 1 slide
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // Tablet: 2 slides
            768: {
                slidesPerView: 2,
                spaceBetween: 25
            },
            // Desktop: 3 slides
            1200: {
                slidesPerView: 3,
                spaceBetween: 25
            }
        },

        // Slide effects
        grabCursor: true,
        slideToClickedSlide: false,

        // Accessibility
        a11y: {
            prevSlideMessage: 'Previous story',
            nextSlideMessage: 'Next story',
        }
    });

    // Button click handlers - specific to this section
    document.querySelector('#stories-of-change .stories-view-all-btn').addEventListener('click', function (e) {
        e.preventDefault();
        console.log('View All clicked - Stories of Change section');
        // Add your navigation logic here
    });

    // Read More button handlers - specific to this section
    document.querySelectorAll('#stories-of-change .stories-read-more').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const storyName = this.parentElement.querySelector('.stories-name').textContent;
            console.log(`Read more about: ${storyName} - Stories of Change section`);
            // Add your navigation logic here
        });
    });

    console.log('Stories of Change Swiper initialized with 3 slides visible on desktop');
});