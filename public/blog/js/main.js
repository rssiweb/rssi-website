// Optional: Function to highlight active nav link
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Remove active class from all nav links
    $('.nav-link').removeClass('active');
    
    // Add active class based on current page
    if (currentPage === 'index.html' || currentPage === '') {
        $('a[href="index.html"]').addClass('active');
    } else if (currentPage === 'user-portal.html') {
        $('a[href="user-portal.html"]').addClass('active');
    } else if (currentPage === 'create-blog.html') {
        $('a[href="create-blog.html"]').addClass('active');
    } else if (currentPage === 'blog-detail.html') {
        $('a[href="index.html"]').addClass('active');
    } else if (currentPage === 'edit-blog.html') {
        $('a[href="user-portal.html"]').addClass('active');
    }
}