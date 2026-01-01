// js/main.js?v=1.2
// Also update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    // Load header and footer dynamically
    loadHeader();
    loadFooter();

    // Initialize components
    initComponents();

    // Call setActiveNavLink again after a short delay to ensure everything is loaded
    setTimeout(setActiveNavLink, 100);
});
// Update the loadHeader function to call setActiveNavLink after header loads
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initNavbar();
                // Call after header is loaded
                setActiveNavLink();
            })
            .catch(error => console.error('Error loading header:', error));
    }
}

// Update the loadFooter function to NOT call setActiveNavLink
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
}

function initNavbar() {
    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

function setActiveNavLink() {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    // Remove .html extension for comparison
    const currentPageBase = currentPage.replace('.html', '') || 'index';

    console.log('Current page:', currentPageBase); // For debugging

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        if (!linkHref) return;

        // Extract page name from href (remove .html and any # anchors)
        const linkPage = linkHref.split('#')[0];
        const linkPageBase = linkPage.replace('.html', '') || 'index';

        // Special handling for home page
        if (linkPageBase === 'index' && currentPageBase === 'index') {
            link.classList.add('active');
        }
        // For other pages, check if they match
        else if (linkPageBase === currentPageBase) {
            link.classList.add('active');
        }
        // Check if current page starts with link page (for library-registration.html etc.)
        else if (currentPageBase.includes(linkPageBase) && linkPageBase !== 'index') {
            link.classList.add('active');
        }
        // Handle hash links on the same page
        else if (linkHref.includes('#') && currentPageBase === 'index') {
            // Remove active class from hash links by default
            link.classList.remove('active');
        }
        else {
            link.classList.remove('active');
        }
    });
}

function initComponents() {
    // Initialize carousel if exists
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
    }

    // Animate on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // Voucher selection functionality
    document.querySelectorAll('.voucher-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.voucher-card').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');

            const voucherType = this.dataset.type;
            document.getElementById('voucherType').value = voucherType;
        });
    });
}

// Add click event listeners to nav links for immediate feedback
document.addEventListener('click', function (e) {
    if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
        const navLink = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');

        // Update active class immediately
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        navLink.classList.add('active');
    }
});

// Add WhatsApp floating button to all pages
function addWhatsAppButton() {
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/919429464575?text=Hello%20Baangee%20Traders%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.target = '_blank';
    whatsappButton.title = 'Chat with us on WhatsApp';
    whatsappButton.setAttribute('aria-label', 'Chat with us on WhatsApp');

    whatsappButton.innerHTML = `
        <i class="bi bi-whatsapp"></i>
        <div class="whatsapp-tooltip">
            Chat with us on WhatsApp
        </div>
    `;

    document.body.appendChild(whatsappButton);
}

// Update the initComponents function in main.js:
function initComponents() {
    // Initialize carousel if exists
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
    }

    // Animate on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // Voucher selection functionality
    document.querySelectorAll('.voucher-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.voucher-card').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');

            const voucherType = this.dataset.type;
            document.getElementById('voucherType').value = voucherType;
        });
    });

    // Add WhatsApp button
    addWhatsAppButton();
}

// Add Scroll to Top button functionality
function addScrollToTopButton() {
    // Create the button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.innerHTML = '<i class="bi bi-chevron-up"></i>';

    // Add click event
    scrollButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add to body
    document.body.appendChild(scrollButton);

    // Show/hide based on scroll position
    window.addEventListener('scroll', function () {
        const scrollButton = document.querySelector('.scroll-to-top');
        if (scrollButton) {
            if (window.scrollY > 300) {
                scrollButton.classList.add('show');
            } else {
                scrollButton.classList.remove('show');
            }
        }
    });
}

// Update the initComponents function to include scroll-to-top button
function initComponents() {
    // Initialize carousel if exists
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
    }

    // Animate on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // Voucher selection functionality
    document.querySelectorAll('.voucher-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.voucher-card').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');

            const voucherType = this.dataset.type;
            document.getElementById('voucherType').value = voucherType;
        });
    });

    // Add WhatsApp button
    addWhatsAppButton();

    // Add Scroll to Top button
    addScrollToTopButton();
}