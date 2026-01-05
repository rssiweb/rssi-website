// includes/header.js - Simple header include with active link highlighting

function includeHeader() {
    const headerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark" style="border-bottom: 2px solid #3498db;">
            <div class="container">
                <!-- Logo/Brand -->
                <a class="navbar-brand d-flex align-items-center" href="index.html">
                    <span class="fw-bold">RSSI NGO Blog</span>
                </a>

                <!-- Mobile Toggle Button -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Navigation Links -->
                <div class="collapse navbar-collapse" id="mainNavbar">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="index.html" id="nav-index">
                                <i class="fas fa-home me-1"></i> Blog Home
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="user-portal.html" id="nav-portal">
                                <i class="fas fa-tachometer-alt me-1"></i> My Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="create-blog.html" id="nav-create">
                                <i class="fas fa-plus-circle me-1"></i> Create Post
                            </a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="aboutDropdown" role="button"
                                data-bs-toggle="dropdown">
                                <i class="fas fa-info-circle me-1"></i> About
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/" target="_blank">RSSI NGO Website</a></li>
                                <li><a class="dropdown-item" href="/kalpana-buds" target="_blank">Kalpana Buds School</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/contact-us" target="_blank">Contact Us</a></li>
                            </ul>
                        </li>
                    </ul>

                    <!-- Login Button/User Menu on Right -->
                    <div id="loginButtons" class="d-flex align-items-center">
                        <!-- Will be populated by auth.js -->
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    // Insert header HTML
    document.getElementById('header').innerHTML = headerHTML;
    
    // Highlight active link
    highlightActiveNav();
}

function highlightActiveNav() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class based on current page
    if (currentPage === 'index.html' || currentPage === '') {
        document.getElementById('nav-index')?.classList.add('active');
    } 
    else if (currentPage === 'user-portal.html') {
        document.getElementById('nav-portal')?.classList.add('active');
    } 
    else if (currentPage === 'create-blog.html') {
        document.getElementById('nav-create')?.classList.add('active');
    }
    else if (currentPage === 'blog-detail.html') {
        document.getElementById('nav-index')?.classList.add('active');
    }
    else if (currentPage === 'edit-blog.html') {
        document.getElementById('nav-portal')?.classList.add('active');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('header')) {
        includeHeader();
    }
});