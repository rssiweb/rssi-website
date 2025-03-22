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
        const togglescrollTop = function() {
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