const GOOGLE_CLIENT_ID = '880893711562-48c591om401pva696dnk9ffnqb9it4mm.apps.googleusercontent.com';

// Global currentUser variable - this should be the same reference as in blog-detail.js
// Make sure this is declared in both files or better, share it between them

function initGoogleSignIn() {
    if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = initializeGoogle;
    } else {
        initializeGoogle();
    }
}

function initializeGoogle() {
    if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true
        });
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
                    localStorage.setItem('user', JSON.stringify(response.user));

                    // Update the global currentUser variable
                    if (typeof window.currentUser !== 'undefined') {
                        window.currentUser = response.user;
                    }

                    // Trigger UI updates
                    updateLoginButtons();
                    updateCommentForm();
                    showToast('Login successful!', 'success');

                    // Refresh like status if on blog detail page
                    if (window.currentPost) {
                        updateLikeStatus(window.currentPost.likes);
                    }
                } else {
                    showToast('Login failed: ' + response.message, 'error');
                }
            },
            error: function () {
                showToast('Error connecting to authentication server', 'error');
            }
        });
    }
}

function loginWithGoogle() {
    if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.prompt();
    } else {
        showToast('Google Sign-In not loaded. Please refresh the page.', 'error');
        initGoogleSignIn();
    }
}

function logoutUser() {
    localStorage.removeItem('user');

    // Clear the global currentUser variable
    if (typeof window.currentUser !== 'undefined') {
        window.currentUser = null;
    }

    if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }

    // Trigger UI updates
    updateLoginButtons();
    updateCommentForm();
    showToast('Logged out successfully', 'success');

    // Refresh like status if on blog detail page
    if (window.currentPost) {
        updateLikeStatus(window.currentPost.likes);
    }
}

// Initialize Google Sign-In when document is ready
$(document).ready(function () {
    initGoogleSignIn();
});