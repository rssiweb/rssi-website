document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    /**
     * Preloader
     */
    // const preloader = document.querySelector('#preloader');
    // if (preloader) {
    //     window.addEventListener('load', () => {
    //         preloader.remove();
    //     });
    // }

    /**
     * Sticky header on scroll
     */
    const selectHeader = document.querySelector('#header');
    if (selectHeader) {
        document.addEventListener('scroll', () => {
            window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
        });
    }

    /**
     * Scroll top button
     */
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
        const togglescrollTop = function () {
            window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
        }
        window.addEventListener('load', togglescrollTop);
        document.addEventListener('scroll', togglescrollTop);
        scrollTop.addEventListener('click', window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }));
    }

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

    /**
     * Animation on scroll function and init
     */
    // function aos_init() {
    //     AOS.init({
    //         duration: 1000,
    //         easing: 'ease-in-out',
    //         once: true,
    //         mirror: false
    //     });
    // }
    // window.addEventListener('load', () => {
    //     aos_init();
    // });

});

/**
 * Clients Slider
 */
if (document.querySelector('.clients-slider') && typeof Swiper !== 'undefined') {
    new Swiper('.clients-slider', {
        speed: 400,
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
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 60
            },
            640: {
                slidesPerView: 4,
                spaceBetween: 80
            },
            992: {
                slidesPerView: 6,
                spaceBetween: 120
            }
        }
    });
}
// Load header and footer asynchronously
(async function () {
    const [header, footer] = await Promise.all([
        fetch('header.html').then(r => r.text()),
        fetch('footer.html').then(r => r.text())
    ]);

    document.getElementById('header').innerHTML = header;
    document.getElementById('footer').innerHTML = footer;

    initHeaderScripts();
})();

function initHeaderScripts() {

    const mobileNavShow = document.querySelector('.mobile-nav-show');
    const mobileNavHide = document.querySelector('.mobile-nav-hide');

    if (!mobileNavShow || !mobileNavHide) return;

    document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
        el.addEventListener('click', function (event) {
            event.preventDefault();
            document.body.classList.toggle('mobile-nav-active');
            mobileNavShow.classList.toggle('d-none');
            mobileNavHide.classList.toggle('d-none');
        });
    });

    document.querySelectorAll('.navbar .dropdown > a').forEach(el => {
        el.addEventListener('click', function (e) {
            if (document.body.classList.contains('mobile-nav-active')) {
                e.preventDefault();
                this.classList.toggle('active');
                this.nextElementSibling.classList.toggle('dropdown-active');

                const icon = this.querySelector('.dropdown-indicator');
                if (icon) {
                    icon.classList.toggle('bi-chevron-up');
                    icon.classList.toggle('bi-chevron-down');
                }
            }
        });
    });
}
// External link warning
document.addEventListener("click", function (e) {
    const link = e.target.closest("a");

    if (!link) return;

    const currentDomain = window.location.hostname;

    try {
        const linkUrl = new URL(link.href, window.location.origin);

        // Skip Google Translate & system links
        if (
            link.href.includes("translate.google") ||
            link.href.startsWith("javascript:") ||
            link.classList.contains("goog-te-menu-value") ||
            link.closest(".goog-te-menu-frame") ||
            link.closest("#google_translate_element") ||
            link.hasAttribute("data-skip-external-check")
        ) {
            return;
        }

        // Only external links
        if (linkUrl.hostname && linkUrl.hostname !== currentDomain) {
            e.preventDefault();

            const confirmLeave = confirm(
                "You are being redirected to an external website. Do you want to continue?"
            );

            if (confirmLeave) {
                window.open(link.href, "_blank");
            }
        }
    } catch (err) { }
});