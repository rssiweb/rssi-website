
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
                fetch('/footer.html')
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


// Header-specific scripts (fully defensive)
function initHeaderScripts() {

    const mobileNavShow = document.querySelector('.mobile-nav-show');
    const mobileNavHide = document.querySelector('.mobile-nav-hide');
    const mobileNavToggles = document.querySelectorAll('.mobile-nav-toggle');
    const dropdownLinks = document.querySelectorAll('.navbar .dropdown > a');

    // Header not present on this page
    if (!mobileNavShow || !mobileNavHide || mobileNavToggles.length === 0) {
        return;
    }

    // Mobile navigation toggle
    mobileNavToggles.forEach(el => {
        el.addEventListener('click', function (event) {
            event.preventDefault();
            document.body.classList.toggle('mobile-nav-active');
            mobileNavShow.classList.toggle('d-none');
            mobileNavHide.classList.toggle('d-none');
        });
    });

    // Mobile dropdown toggle
    dropdownLinks.forEach(el => {
        el.addEventListener('click', function (e) {
            if (!document.body.classList.contains('mobile-nav-active')) return;

            e.preventDefault();
            this.classList.toggle('active');
            this.nextElementSibling?.classList.toggle('dropdown-active');

            const icon = this.querySelector('.dropdown-indicator');
            icon?.classList.toggle('bi-chevron-up');
            icon?.classList.toggle('bi-chevron-down');
        });
    });

    // Active link highlight
    const currentPath = window.location.pathname.toLowerCase();
    const navbar = document.getElementById('navbar');

    if (navbar) {
        navbar.querySelectorAll('a').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (!linkPath || linkPath === '#') return;

            if (currentPath.endsWith(linkPath.toLowerCase())) {
                link.classList.add('active');
            }
        });
    }
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

// Generate breadcrumbs based on navigation structure and current page
function generateBreadcrumbs() {
    const breadcrumbList = document.getElementById('breadcrumb-list');
    const pageTitle = document.getElementById('page-title');

    // If no breadcrumbs container exists on this page, exit
    if (!breadcrumbList || !pageTitle) return;

    const currentPath = window.location.pathname.toLowerCase();
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

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
        // Fallback: Use document title or URL
        const fallbackTitle = document.title.split('|')[0].trim() ||
            currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
        pageTitle.textContent = fallbackTitle;
        breadcrumbList.innerHTML = '<li><a href="index">Home</a></li><li>' + fallbackTitle + '</li>';
        return;
    }

    // Build breadcrumb trail
    const breadcrumbs = [];
    const addedTexts = new Set(); // Track added items to prevent duplicates

    // Start with Home
    breadcrumbs.push({ text: 'Home', url: 'index' });
    addedTexts.add('Home');

    // Function to get dropdown text
    function getDropdownText(dropdownElement) {
        const span = dropdownElement.querySelector('span');
        if (span) return span.textContent.trim();

        // Remove dropdown indicator and trim
        return dropdownElement.textContent
            .replace(/▼/g, '')
            .replace(/chevron-down/gi, '')
            .replace(/chevron-up/gi, '')
            .trim();
    }

    // Function to traverse up and find all parent dropdowns
    function findParentDropdowns(element) {
        const parents = [];
        let currentElement = element;

        while (currentElement && currentElement !== navbar) {
            // Check if this is a dropdown link or inside a dropdown
            const isDirectLink = currentElement.tagName === 'A' && currentElement.getAttribute('href') === '#';
            const parentLi = currentElement.closest('li.dropdown');

            if (parentLi) {
                const dropdownLink = parentLi.querySelector('a[href="#"]');
                if (dropdownLink && !dropdownLink.contains(currentElement)) {
                    const text = getDropdownText(dropdownLink);
                    if (text && !parents.includes(text)) {
                        parents.unshift(text); // Add to beginning to maintain order
                    }
                }
            }

            currentElement = currentElement.parentElement;
        }

        return parents;
    }

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