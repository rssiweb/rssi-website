// Scroll to Top Functionality
function initScrollToTop() {
    const scrollBtn = $('#scrollToTopBtn');
    const fabContainer = $('#scrollToTopFab');

    // Show/hide button based on scroll position
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            fabContainer.fadeIn(300);
        } else {
            fabContainer.fadeOut(300);
        }
    });

    // Scroll to top when clicked
    scrollBtn.click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500);
        return false;
    });

    // Add keyboard support
    scrollBtn.on('keypress', function (e) {
        if (e.which === 13 || e.which === 32) {
            $(this).click();
        }
    });
}