// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer dynamically
    loadHeader();
    loadFooter();
    
    // Initialize components
    initComponents();
});

function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initNavbar();
            })
            .catch(error => console.error('Error loading header:', error));
    }
}

function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
                setActiveNavLink();
            })
            .catch(error => console.error('Error loading footer:', error));
    }
}

function initNavbar() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
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
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.includes(linkHref.replace('.html', '')))) {
            link.classList.add('active');
        } else {
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
        card.addEventListener('click', function() {
            document.querySelectorAll('.voucher-card').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');
            
            const voucherType = this.dataset.type;
            document.getElementById('voucherType').value = voucherType;
        });
    });
}