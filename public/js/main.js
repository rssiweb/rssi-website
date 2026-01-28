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

    scrollTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Load header and footer asynchronously (safe for pages without them)
(async function loadLayout() {
    try {
        const headerContainer = document.getElementById('header');
        const footerContainer = document.getElementById('footer');

        // If neither header nor footer exists, do nothing
        if (!headerContainer && !footerContainer) return;

        const tasks = [];

        if (headerContainer) {
            tasks.push(
                fetch('/header.html')
                    .then(res => res.ok ? res.text() : '')
                    .then(html => {
                        headerContainer.innerHTML = html;
                        initHeaderScripts(); // run after header is injected
                        generateBreadcrumbs(); // generate breadcrumbs after header
                    })
            );
        }

        if (footerContainer) {
            tasks.push(
                fetch('/footer.html?v=1.0.0')
                    .then(res => res.ok ? res.text() : '')
                    .then(html => {
                        footerContainer.innerHTML = html;
                    })
            );
        }

        await Promise.all(tasks);

    } catch (error) {
        console.error('Error loading header/footer:', error);
    }
})();

// Simple event delegation for mobile menu (works for all pages)
function initializeMobileMenuDelegation() {
    // Check if already initialized to prevent duplicates
    if (window.mobileMenuEventsInitialized) {
        return;
    }

    // Single event listener for the whole document
    document.addEventListener('click', function (event) {
        // Mobile nav toggle
        if (event.target.closest('.mobile-nav-toggle')) {
            event.preventDefault();
            const mobileNavShow = document.querySelector('.mobile-nav-show');
            const mobileNavHide = document.querySelector('.mobile-nav-hide');

            document.body.classList.toggle('mobile-nav-active');
            mobileNavShow.classList.toggle('d-none');
            mobileNavHide.classList.toggle('d-none');
            return;
        }

        // Dropdown toggle (only in mobile mode)
        if (document.body.classList.contains('mobile-nav-active') &&
            event.target.closest('.navbar .dropdown > a')) {
            event.preventDefault();
            const dropdownLink = event.target.closest('.navbar .dropdown > a');

            dropdownLink.classList.toggle('active');
            dropdownLink.nextElementSibling?.classList.toggle('dropdown-active');

            const icon = dropdownLink.querySelector('.dropdown-indicator');
            if (icon) {
                icon.classList.toggle('bi-chevron-up');
                icon.classList.toggle('bi-chevron-down');
            }
            return;
        }

        // Close mobile nav when clicking outside (optional enhancement)
        if (document.body.classList.contains('mobile-nav-active') &&
            !event.target.closest('.navbar') &&
            !event.target.closest('.mobile-nav-toggle')) {
            document.body.classList.remove('mobile-nav-active');
            document.querySelector('.mobile-nav-show')?.classList.remove('d-none');
            document.querySelector('.mobile-nav-hide')?.classList.add('d-none');
        }
    });

    window.mobileMenuEventsInitialized = true;
    console.log('Mobile menu event delegation initialized');
}

// Header-specific scripts (fully defensive)
function initHeaderScripts() {
    // Initialize mobile menu using event delegation
    initializeMobileMenuDelegation();

    // Active link highlight - SIMPLIFIED VERSION
    const currentPath = window.location.pathname.toLowerCase();
    const navbar = document.getElementById('navbar');

    if (navbar) {
        navbar.querySelectorAll('a[href]').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (!linkPath || linkPath === '#') return;

            // Check if current path ends with link path
            if (currentPath.endsWith(linkPath.toLowerCase())) {
                link.classList.add('active');

                // Also activate parent dropdowns
                let parent = link.parentElement;
                while (parent && parent !== navbar) {
                    if (parent.classList.contains('dropdown')) {
                        const dropdownToggle = parent.querySelector('a');
                        if (dropdownToggle) dropdownToggle.classList.add('active');
                    }
                    parent = parent.parentElement;
                }
            }
        });
    }
}

// Initialize mobile menu for hardcoded headers (like index.html)
document.addEventListener('DOMContentLoaded', function () {
    // Check if mobile menu elements exist on page load
    if (document.querySelector('.mobile-nav-toggle')) {
        setTimeout(initializeMobileMenuDelegation, 100);
    }
});

// MISSING FUNCTION: Find parent dropdowns
function findParentDropdowns(element) {
    const parentDropdowns = [];
    let currentElement = element.parentElement;
    const navbar = document.getElementById('navbar');

    while (currentElement && currentElement !== navbar) {
        if (currentElement.classList.contains('dropdown')) {
            const dropdownText = getDropdownText(currentElement.querySelector('a'));
            if (dropdownText) {
                parentDropdowns.unshift(dropdownText); // Add to beginning to maintain order
            }
        }
        currentElement = currentElement.parentElement;
    }

    return parentDropdowns;
}

// Function to get dropdown text
function getDropdownText(dropdownElement) {
    if (!dropdownElement) return '';

    const span = dropdownElement.querySelector('span');
    if (span) return span.textContent.trim();

    // Remove dropdown indicator and trim
    return dropdownElement.textContent
        .replace(/▼/g, '')
        .replace(/chevron-down/gi, '')
        .replace(/chevron-up/gi, '')
        .trim();
}

// Generate breadcrumbs based on navigation structure and current page
function generateBreadcrumbs() {
    const breadcrumbList = document.getElementById('breadcrumb-list');
    const pageTitle = document.getElementById('page-title');

    // If no breadcrumbs container exists on this page, exit
    if (!breadcrumbList || !pageTitle) {
        console.log('Breadcrumb elements not found on this page');
        return;
    }

    const currentPath = window.location.pathname.toLowerCase();
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        // Fallback: Use simple breadcrumbs
        generateSimpleBreadcrumbs();
        return;
    }

    // Find the active link in the navigation
    let activeLink = null;
    const navLinks = navbar.querySelectorAll('a[href]');

    // Clean current path for comparison
    const cleanCurrentPath = currentPath.replace(/\.(html|php)$/, '').replace(/\/$/, '');
    const currentPage = cleanCurrentPath.split('/').pop() || 'index';

    // First pass: Find exact matches
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').toLowerCase();
        const cleanLinkPath = linkPath.replace(/\.(html|php)$/, '');

        // Check for exact match
        if (cleanLinkPath === currentPage ||
            (currentPage === '' && cleanLinkPath === 'index') ||
            (currentPage === 'index' && cleanLinkPath === 'index')) {
            activeLink = link;
        }
    });

    // If no exact match found, try partial matches
    if (!activeLink) {
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').toLowerCase();
            if (linkPath && linkPath !== '#' && currentPath.includes(linkPath)) {
                activeLink = link;
            }
        });
    }

    if (!activeLink) {
        // Fallback: Use simple breadcrumbs
        generateSimpleBreadcrumbs();
        return;
    }

    // Build breadcrumb trail
    const breadcrumbs = [];
    const addedTexts = new Set(); // Track added items to prevent duplicates

    // Start with Home
    breadcrumbs.push({ text: 'Home', url: '/' });
    addedTexts.add('Home');

    // Get current page text (clean it)
    let currentPageText = activeLink.textContent;
    // Remove dropdown indicators and trim
    currentPageText = currentPageText
        .replace(/▼/g, '')
        .replace(/chevron-down/gi, '')
        .replace(/chevron-up/gi, '')
        .replace('dropdown-indicator', '')
        .replace('bi bi-chevron-down', '')
        .replace('bi bi-chevron-up', '')
        .trim();

    // Find parent dropdowns
    const parentDropdowns = findParentDropdowns(activeLink);

    // Add parent dropdowns to breadcrumbs (avoiding duplicates)
    parentDropdowns.forEach(text => {
        if (text && !addedTexts.has(text) && text !== currentPageText) {
            breadcrumbs.push({ text: text, url: null });
            addedTexts.add(text);
        }
    });

    // Add current page (if not already added as a parent)
    if (currentPageText && !addedTexts.has(currentPageText)) {
        breadcrumbs.push({ text: currentPageText, url: null });
        addedTexts.add(currentPageText);
    }

    // Set page title (use the cleaned text)
    pageTitle.textContent = currentPageText;

    // Generate breadcrumb HTML
    let breadcrumbHTML = '';
    breadcrumbs.forEach((crumb, index) => {
        if (crumb.url && index < breadcrumbs.length - 1) {
            breadcrumbHTML += `<li><a href="${crumb.url}">${crumb.text}</a></li>`;
        } else {
            breadcrumbHTML += `<li>${crumb.text}</li>`;
        }
    });

    breadcrumbList.innerHTML = breadcrumbHTML;
}

// Simple fallback breadcrumb function
function generateSimpleBreadcrumbs() {
    const breadcrumbList = document.getElementById('breadcrumb-list');
    const pageTitle = document.getElementById('page-title');

    if (!breadcrumbList || !pageTitle) return;

    // Get current path
    const currentPath = window.location.pathname;

    // Extract page name from path
    let pageName = currentPath.split('/').pop() || 'Home';

    // Remove file extension
    pageName = pageName.replace(/\.[^/.]+$/, "");

    // If it's empty or index, set to Home
    if (pageName === '' || pageName === 'index' || pageName === 'home') {
        pageName = 'Home';
    }

    // Format for display
    const displayName = pageName
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Set page title
    pageTitle.textContent = displayName;

    // Generate breadcrumbs
    breadcrumbList.innerHTML = `
        <li><a href="/">Home</a></li>
        <li>${displayName}</li>
    `;
}

// Pace options (optional)
window.paceOptions = {
    ajax: true,
    document: true,
    eventLag: false
};

// Pace JS loader
var paceScript = document.createElement('script');
paceScript.src = 'https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js';
document.head.appendChild(paceScript);

// Clipboard functionality for link icons
document.addEventListener('DOMContentLoaded', function () {
    // Function to copy link to clipboard
    function copyLinkToClipboard(sectionId, linkIcon, tooltip) {
        const currentUrl = window.location.href.split('#')[0];
        const linkToCopy = `${currentUrl}#${sectionId}`;

        navigator.clipboard.writeText(linkToCopy)
            .then(() => {
                linkIcon.classList.add('copied');
                linkIcon.innerHTML = '<i class="bi bi-check2"></i>';
                tooltip.textContent = 'Copied!';
                tooltip.classList.add('show');

                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('zoom-highlight');
                    setTimeout(() => {
                        section.classList.remove('zoom-highlight');
                    }, 2000);
                }

                setTimeout(() => {
                    linkIcon.classList.remove('copied');
                    linkIcon.innerHTML = '<i class="bi bi-link-45deg"></i>';
                    tooltip.classList.remove('show');
                    tooltip.textContent = 'Copy link';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                const textArea = document.createElement('textarea');
                textArea.value = linkToCopy;
                document.body.appendChild(textArea);
                textArea.select();

                try {
                    document.execCommand('copy');
                    linkIcon.classList.add('copied');
                    linkIcon.innerHTML = '<i class="bi bi-check2"></i>';
                    tooltip.textContent = 'Copied!';
                    tooltip.classList.add('show');

                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.classList.add('zoom-highlight');
                        setTimeout(() => {
                            section.classList.remove('zoom-highlight');
                        }, 2000);
                    }

                    setTimeout(() => {
                        linkIcon.classList.remove('copied');
                        linkIcon.innerHTML = '<i class="bi bi-link-45deg"></i>';
                        tooltip.classList.remove('show');
                        tooltip.textContent = 'Copy link';
                    }, 2000);
                } catch (err) {
                    tooltip.textContent = 'Failed to copy';
                    tooltip.classList.add('show');
                    setTimeout(() => {
                        tooltip.classList.remove('show');
                        tooltip.textContent = 'Copy link';
                    }, 2000);
                }

                document.body.removeChild(textArea);
            });
    }

    // Attach click handlers to all link icons
    document.querySelectorAll('.heading-link-icon .link-icon').forEach(linkIcon => {
        const tooltip = linkIcon.parentElement.querySelector('.link-tooltip');
        let sectionId = linkIcon.getAttribute('href');

        if (sectionId && sectionId.startsWith('#')) {
            sectionId = sectionId.substring(1);
        } else {
            const section = linkIcon.closest('section[id]');
            if (section) {
                sectionId = section.id;
            }
        }

        if (sectionId) {
            linkIcon.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                copyLinkToClipboard(sectionId, linkIcon, tooltip);
            });

            linkIcon.addEventListener('mouseenter', function () {
                if (!linkIcon.classList.contains('copied')) {
                    tooltip.classList.add('show');
                }
            });

            linkIcon.addEventListener('mouseleave', function () {
                if (!linkIcon.classList.contains('copied')) {
                    tooltip.classList.remove('show');
                }
            });
        }
    });

    // Check URL hash on page load and highlight if matches
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            setTimeout(() => {
                section.classList.add('zoom-highlight');
                setTimeout(() => {
                    section.classList.remove('zoom-highlight');
                }, 2000);
            }, 500);
        }
    }
});

// main.js - SIMPLIFIED FOR JQUERY - REMOVE DUPLICATE INITIALIZATION
$(document).ready(function () {
    // Remove the setTimeout call to avoid duplicate initialization
    // The header is already initialized in initHeaderScripts()

    // Just run active highlighting for scroll-based navigation
    function navbarlinksActive() {
        document.querySelectorAll('#navbar a[href^="#"]').forEach(link => {
            if (!link.hash) return;

            let section = document.querySelector(link.hash);
            if (!section) return;

            let position = window.scrollY + 200;

            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Only run this for pages with hash-based navigation
    if (window.location.hash || document.querySelector('section[id]')) {
        window.addEventListener('load', navbarlinksActive);
        document.addEventListener('scroll', navbarlinksActive);
    }

    // Google Translate initialization - FIXED VERSION
    function initializeGoogleTranslate() {
        const translateElement = document.getElementById('google_translate_element');
        if (!translateElement) return;

        // Define the callback function
        window.googleTranslateElementInit = function () {
            if (typeof google !== 'undefined' && google.translate) {
                try {
                    new google.translate.TranslateElement({
                        pageLanguage: 'en',
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                        includedLanguages: "hi,en,bn",
                        autoDisplay: false,
                        multilanguagePage: true
                    }, 'google_translate_element');
                } catch (e) {
                    console.error('Google Translate initialization error:', e);
                }
            }
        };

        // Check if Google Translate script is already loaded
        if (window.google && google.translate) {
            // If already loaded, initialize immediately
            window.googleTranslateElementInit();
        } else {
            // Load the script if not already loaded
            if (!document.querySelector('script[src*="translate.google"]')) {
                const script = document.createElement('script');
                script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                script.async = true;
                script.defer = true;

                // Add error handling
                script.onerror = function () {
                    console.error('Failed to load Google Translate script');
                    // Show fallback message if needed
                    translateElement.innerHTML = '<div style="color: #666; font-size: 14px;">Translation service temporarily unavailable</div>';
                };

                document.head.appendChild(script);
            }
        }
    }

    // Initialize Google Translate with a small delay to ensure DOM is ready
    setTimeout(initializeGoogleTranslate, 500);

    // Ensure mobile menu is initialized for jQuery pages too
    setTimeout(initializeMobileMenuDelegation, 300);

    // Load banner ad
    $("#banner-container").load("/includes/adv.html");
});

// ========== EXTERNAL LINK WARNING ==========
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