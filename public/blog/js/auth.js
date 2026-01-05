// js/auth.js - Centralized authentication management for all pages

// API endpoint configuration
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8082/blog-api/'
    : 'https://login.rssi.in/blog-api/';

// Google Client ID
const GOOGLE_CLIENT_ID = '880893711562-48c591om401pva696dnk9ffnqb9it4mm.apps.googleusercontent.com';

// Global user variable
let currentUser = null;

// ==================== CORE AUTH FUNCTIONS ====================

function checkUserLogin() {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            // Check if token is still valid
            if (currentUser.expires_at && new Date() > new Date(currentUser.expires_at)) {
                logoutUser();
                return false;
            }
            return true;
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('user');
            currentUser = null;
            return false;
        }
    }
    currentUser = null;
    return false;
}

function updateLoginButtons() {
    const loginContainer = $('#loginButtons');
    if (!loginContainer.length) return;

    if (currentUser) {
        // User is logged in - show user menu
        loginContainer.html(`
            <div class="dropdown">
                <button class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <img src="${currentUser.picture || 'https://via.placeholder.com/25?text=U'}" 
                         alt="${currentUser.name}" 
                         class="rounded-circle me-2" 
                         style="width: 25px; height: 25px; object-fit: cover;">
                    <span style="font-size: 0.9rem;">${currentUser.name.split(' ')[0]}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="user-portal.html"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>
                    <li><a class="dropdown-item" href="create-blog.html"><i class="fas fa-plus me-2"></i>Create Post</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="switchAccount(); return false;"><i class="fas fa-sync-alt me-2"></i>Switch Account</a></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser(); return false;"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                </ul>
            </div>
        `);
    } else {
        // User not logged in - show original Google Sign-In button
        loginContainer.html(`
            <div id="g_id_onload"
                 data-client_id="${GOOGLE_CLIENT_ID}"
                 data-context="signin"
                 data-ux_mode="popup"
                 data-callback="handleGoogleSignIn"
                 data-auto_prompt="false">
            </div>
            <div class="g_id_signin"
                 data-type="standard"
                 data-shape="rectangular"
                 data-theme="filled_blue"
                 data-text="signin_with"
                 data-size="medium"
                 data-logo_alignment="left"
                 data-width="auto">
            </div>
        `);

        // Load Google Identity Services script if not already loaded
        if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }
}

function initGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        setupGoogleSignIn();
    } else {
        setTimeout(initGoogleSignIn, 1000);
    }
}

function setupGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup'
    });

    // Only render the button if user is not logged in
    if (!currentUser) {
        // Check if Google Sign-In button container exists
        const gsiContainer = document.querySelector('.g_id_signin');
        if (gsiContainer && !gsiContainer.hasAttribute('data-rendered')) {
            google.accounts.id.renderButton(
                gsiContainer,
                {
                    type: 'standard',
                    theme: 'filled_blue',
                    size: 'medium',
                    text: 'signin_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                    width: 'auto'
                }
            );
            gsiContainer.setAttribute('data-rendered', 'true');
        }
    }
}

function handleGoogleSignIn(response) {
    if (response.credential) {
        $.ajax({
            url: API_BASE + 'google-auth/login.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id_token: response.credential }),
            success: function (response) {
                if (response.success) {
                    const userData = {
                        ...response.user,
                        expires_at: new Date(Date.now() + 3600000).toISOString()
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    currentUser = userData;

                    // Update UI
                    updateLoginButtons();
                    showToast('Login successful! Welcome ' + userData.name.split(' ')[0] + '!', 'success');

                    // Reload page for protected pages
                    if (window.location.pathname.includes('user-portal.html') ||
                        window.location.pathname.includes('create-blog.html') ||
                        window.location.pathname.includes('edit-blog.html')) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                } else {
                    showToast('Login failed: ' + response.message, 'error');
                }
            },
            error: function () {
                showToast('Error connecting to server. Please try again.', 'error');
            }
        });
    }
}

function logoutUser() {
    localStorage.removeItem('user');
    currentUser = null;

    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke();
    }

    updateLoginButtons();
    showToast('Logged out successfully', 'success');

    // Redirect to home page if on protected pages
    if (window.location.pathname.includes('user-portal.html') ||
        window.location.pathname.includes('create-blog.html') ||
        window.location.pathname.includes('edit-blog.html')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

function switchAccount() {
    logoutUser();
}

// ==================== PAGE PROTECTION FUNCTIONS ====================

// For pages that require login (user-portal.html, create-blog.html, edit-blog.html)
function protectPage() {
    if (!checkUserLogin()) {
        showLoginRequired();
        return false;
    }
    return true;
}

function showLoginRequired() {
    // This should be implemented per page since UI differs
    console.log('Login required for this page');
    // Pages will override this with their own UI
}

// ==================== UTILITY FUNCTIONS ====================

function showToast(message, type = 'info') {
    $('.toast').remove();

    const bgColor = type === 'success' ? 'bg-success' :
        type === 'error' ? 'bg-danger' :
            type === 'warning' ? 'bg-warning' : 'bg-info';

    const icon = type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' :
            type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

    const toast = $(`
        <div class="toast align-items-center text-white ${bgColor} border-0" role="alert" 
             style="position: fixed; top: 20px; right: 20px; z-index: 1060; max-width: 400px;">
            <div class="d-flex">
                <div class="toast-body p-3">
                    <div class="d-flex align-items-center">
                        <i class="fas ${icon} me-3" style="font-size: 1.2rem;"></i>
                        <div style="flex: 1;">${message}</div>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `);

    $('body').append(toast);
    const bsToast = new bootstrap.Toast(toast[0]);
    bsToast.show();

    setTimeout(() => toast.remove(), 3000);
}

// Initialize auth when DOM is ready
$(document).ready(function () {
    checkUserLogin();
    updateLoginButtons();
    initGoogleSignIn();
});

// Make functions globally available
window.currentUser = currentUser;
window.checkUserLogin = checkUserLogin;
window.updateLoginButtons = updateLoginButtons;
window.initGoogleSignIn = initGoogleSignIn;
window.triggerGoogleSignIn = triggerGoogleSignIn;
window.handleGoogleSignIn = handleGoogleSignIn;
window.logoutUser = logoutUser;
window.switchAccount = switchAccount;
window.protectPage = protectPage;
window.showToast = showToast;