// API endpoint configuration
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8082/blog-api/'
    : 'https://login.rssi.in/blog-api/';

// Get post slug from URL
const urlParams = new URLSearchParams(window.location.search);
const postSlug = urlParams.get('slug') || urlParams.get('id');

let currentPost = null;
let isLiked = false;
let currentUser = null;

// Load blog post detail
$(document).ready(function () {
    if (!postSlug) {
        window.location.href = 'index.html';
        return;
    }

    loadBlogDetail();
    checkUserLogin();
    setupEventListeners();
});

function showLoadingState() {
    $('#blogTitle').html('<span class="placeholder col-8"></span>');
    $('#authorName').html('<span class="placeholder col-4"></span>');
    $('#postMeta').html('<span class="placeholder col-6"></span>');
    $('#blogContent').html(`
        <div class="placeholder-glow">
            <p class="placeholder col-12"></p>
            <p class="placeholder col-11"></p>
            <p class="placeholder col-10"></p>
            <p class="placeholder col-9"></p>
            <p class="placeholder col-8"></p>
        </div>
    `);

    $('.share-buttons, #authorCard, #commentSection, #relatedPosts').hide();
}

function loadBlogDetail() {
    $.ajax({
        url: API_BASE + `get_blog_detail.php?slug=${postSlug}`,
        type: 'GET',
        dataType: 'json',
        beforeSend: function () {
            showLoadingState();
        },
        success: function (response) {
            if (response.success) {
                currentPost = response.post;
                renderBlogDetail(response);
                setupShareButtons();
                setTimeout(generateTableOfContents, 100);
            } else {
                $('#loadingOverlay').html(`
                    <div class="alert alert-danger">
                        <h4>Post Not Found</h4>
                        <p>The blog post you're looking for doesn't exist.</p>
                        <a href="index.html" class="btn btn-primary">Back to Blog</a>
                    </div>
                `);
            }
        },
        error: function (xhr, status, error) {
            $('#loadingOverlay').html(`
                <div class="alert alert-danger">
                    <h4>Error Loading Post</h4>
                    <p>There was a problem loading the blog post. Please try again.</p>
                    <button onclick="location.reload()" class="btn btn-primary">Retry</button>
                    <a href="index.html" class="btn btn-secondary">Back to Blog</a>
                </div>
            `);
        }
    });
}

function renderBlogDetail(data) {
    $('#loadingOverlay').fadeOut();
    $('.share-buttons, #authorCard, #commentSection, #relatedPosts').show();

    const post = data.post;
    document.title = `${post.title} - RSSI NGO Blog`;

    $('#breadcrumbTitle').text(post.title.substring(0, 30) + (post.title.length > 30 ? '...' : ''));
    $('#blogTitle').text(post.title);
    $('#authorName').text(post.author_name || 'Anonymous');
    $('#postMeta').html(`
        ${new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })} • ${post.reading_time || '5'} min read
    `);

    if (post.author_photo) {
        $('#authorAvatar').html(`<img src="${post.author_photo}" alt="${post.author_name}" style="width:100%;height:100%;object-fit:cover;">`);
    } else {
        $('#authorAvatar').html(`
            <div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="width:100%;height:100%;">
                ${post.author_name?.charAt(0) || 'A'}
            </div>
        `);
    }

    if (post.featured_image) {
        $('#featuredImage').attr('src', post.featured_image).attr('alt', post.title);
    } else {
        $('#featuredImage').remove();
    }

    $('#blogContent').html(post.content);
    updateLikeStatus(data.likes);

    if (post.tags) {
        let tagsArray = [];
        if (typeof post.tags === 'string') {
            const cleanTags = post.tags.replace(/[{}"]/g, '');
            tagsArray = cleanTags.split(',').filter(tag => tag.trim() !== '');
        } else if (Array.isArray(post.tags)) {
            tagsArray = post.tags;
        }

        if (tagsArray.length > 0) {
            let tagsHtml = '<div class="d-flex flex-wrap gap-2">';
            tagsArray.forEach(tag => {
                const cleanTag = tag.trim();
                if (cleanTag) {
                    tagsHtml += `<span class="badge bg-secondary">${cleanTag}</span>`;
                }
            });
            tagsHtml += '</div>';
            $('#postTags').html(`<strong>Tags: </strong>${tagsHtml}`);
        }
    }

    $('#authorCard').html(`
        <div class="row align-items-center">
            <div class="col-md-3 text-center mb-3 mb-md-0">
                ${post.author_photo ?
            `<img src="${post.author_photo}" alt="${post.author_name}" class="rounded-circle" style="width:100px;height:100px;object-fit:cover;">` :
            `<div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto" style="width:100px;height:100px;font-size:2rem;">${post.author_name?.charAt(0) || 'A'}</div>`
        }
            </div>
            <div class="col-md-9">
                <h4>${post.author_name || 'Anonymous'}</h4>
                <p class="text-muted mb-2">${post.author_email || ''}</p>
                <p class="mb-0">Author bio would go here. You can store author bio in your database.</p>
            </div>
        </div>
    `);

    $('#readingTime').text(`${post.reading_time || '5'} minutes`);
    $('#wordCount').text(post.word_count || post.content.split(/\s+/).length);
    $('#postViews').text(post.views || 0);
    $('#readingTime, #wordCount, #postViews').find('.placeholder, .placeholder-glow').remove();
    $('#readingTime, #wordCount, #postViews').removeClass('placeholder-glow').css('opacity', '1');

    renderComments(data.comments);
    $('#commentCount').text(data.comments.length);
    renderRelatedPosts(data.related_posts);
    $('.placeholder, .placeholder-glow').removeClass('placeholder placeholder-glow');
    setTimeout(generateTableOfContents, 200);
}

function updateLikeStatus(likes) {
    $('#likeCount').text(likes.like_count || 0);
    if (currentUser && likes.liked_users) {
        const likedUsers = Array.isArray(likes.liked_users) ? likes.liked_users : [];
        isLiked = likedUsers.includes(currentUser.name) || likedUsers.includes(currentUser.email);
        if (isLiked) {
            $('#likeBtn').addClass('liked').html(`<i class="fas fa-heart me-2"></i><span id="likeCount">${likes.like_count || 0}</span> Liked`);
        } else {
            $('#likeBtn').removeClass('liked').html(`<i class="far fa-heart me-2"></i><span id="likeCount">${likes.like_count || 0}</span> Likes`);
        }
    }
}

function renderComments(comments) {
    let commentsHtml = '';
    if (comments.length === 0) {
        commentsHtml = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
    } else {
        comments.forEach(comment => {
            commentsHtml += renderComment(comment);
        });
    }
    $('#commentsList').html(commentsHtml);
}

function renderComment(comment, isReply = false) {
    return `
        <div class="comment-card ${isReply ? 'reply-card' : ''}" id="comment-${comment.id}">
            <div class="d-flex">
                <div class="me-3">
                    <div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style="width:40px;height:40px;">
                        ${comment.user_name?.charAt(0) || 'U'}
                    </div>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                        <h6 class="mb-1">${comment.user_name || 'Anonymous'}</h6>
                        <small class="text-muted">${new Date(comment.created_at).toLocaleDateString()}</small>
                    </div>
                    <p class="mb-2">${comment.content}</p>
                    ${!isReply ? `<button class="btn btn-sm btn-outline-secondary reply-btn" data-comment-id="${comment.id}"><i class="fas fa-reply me-1"></i> Reply</button>` : ''}
                </div>
            </div>
            ${comment.replies && comment.replies.length > 0 ? comment.replies.map(reply => renderComment(reply, true)).join('') : ''}
            ${!isReply ? `
                <div class="reply-form mt-3" id="reply-form-${comment.id}" style="display: none;">
                    <form class="reply-form" data-parent-id="${comment.id}">
                        <div class="mb-2"><textarea class="form-control form-control-sm" rows="2" placeholder="Write a reply..." required></textarea></div>
                        <div class="text-end">
                            <button type="button" class="btn btn-sm btn-outline-secondary cancel-reply-btn">Cancel</button>
                            <button type="submit" class="btn btn-sm btn-primary">Post Reply</button>
                        </div>
                    </form>
                </div>` : ''}
        </div>
    `;
}

function renderRelatedPosts(posts) {
    if (!posts || posts.length === 0) {
        $('#relatedPosts').hide();
        return;
    }
    let postsHtml = '';
    posts.forEach(post => {
        postsHtml += `
            <div class="col-md-6 col-lg-12">
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${post.featured_image || 'https://via.placeholder.com/150/e3f2fd/2c3e50?text=RSSI'}" 
                                 class="img-fluid rounded-start" alt="${post.title}" style="height: 120px; object-fit: cover;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <a href="blog-detail.html?slug=${post.slug}" class="text-decoration-none">
                                        ${post.title.substring(0, 60)}${post.title.length > 60 ? '...' : ''}
                                    </a>
                                </h6>
                                <p class="card-text"><small class="text-muted">${new Date(post.created_at).toLocaleDateString()}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    $('#relatedPostsGrid').html(postsHtml);
}

function setupShareButtons() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentPost.title);
    const text = encodeURIComponent(currentPost.excerpt || currentPost.title);
    $('#shareFacebook').attr('href', `https://www.facebook.com/sharer/sharer.php?u=${url}`);
    $('#shareTwitter').attr('href', `https://twitter.com/intent/tweet?url=${url}&text=${text}`);
    $('#shareLinkedIn').attr('href', `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${text}`);
    $('#shareWhatsApp').attr('href', `https://wa.me/?text=${title}%20${url}`);
}

function generateTableOfContents() {
    const content = document.getElementById('blogContent');
    if (!content) return;
    const headings = content.querySelectorAll('h1, h2, h3, h4');
    let tocHtml = '<ul class="list-unstyled">';
    if (headings.length === 0) {
        tocHtml = '<p class="text-muted">No headings found in this article</p>';
    } else {
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            const level = heading.tagName === 'H1' ? '' : heading.tagName === 'H2' ? 'ms-2' : heading.tagName === 'H3' ? 'ms-4' : 'ms-5';
            tocHtml += `<li class="${level} mb-2"><a href="#${id}" class="text-decoration-none">${heading.textContent}</a></li>`;
        });
        tocHtml += '</ul>';
    }
    $('#tableOfContents').html(tocHtml);
}

function checkUserLogin() {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('user');
            currentUser = null;
        }
    }
    showLoginArea();
}

function showLoginArea() {
    $('#loginArea').show();
    updateLoginButtons();
    updateCommentForm();
}

function updateLoginButtons() {
    if (currentUser) {
        $('#loginButtons').html(`
            <div class="dropdown">
                <button class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <img src="${currentUser.picture || 'https://via.placeholder.com/25?text=U'}" 
                         alt="${currentUser.name}" 
                         class="rounded-circle me-2" 
                         style="width: 25px; height: 25px; object-fit: cover;">
                    <span style="font-size: 0.9rem;">${currentUser.name.split(' ')[0]}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                </ul>
            </div>
        `);
    } else {
        $('#loginButtons').html(`
            <button class="btn btn-outline-light btn-sm" id="googleLoginBtn">
                <i class="fab fa-google me-2"></i> Login with Google
            </button>
        `);
        $('#googleLoginBtn').off('click').on('click', function () {
            // This will be handled by auth.js
            loginWithGoogle();
        });
    }
}

function updateCommentForm() {
    if (currentUser) {
        $('#commentForm').html(`
            <div class="mb-3">
                <textarea class="form-control" id="commentContent" rows="4" placeholder="Write your comment here..." required></textarea>
            </div>
            <div class="text-end">
                <button type="submit" class="btn btn-primary" id="submitCommentBtn">
                    <i class="fas fa-paper-plane me-2"></i> Post Comment
                </button>
            </div>
        `);
    } else {
        $('#commentForm').html(`
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Please <a href="#" class="alert-link" id="commentLoginLink">login</a> to post a comment.
            </div>
        `);
        $('#commentLoginLink').off('click').on('click', function (e) {
            e.preventDefault();
            loginWithGoogle();
        });
    }
}

function showToast(message, type = 'info') {
    $('.toast').remove();
    const bgColor = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';
    const toast = $(`
        <div class="toast align-items-center text-white ${bgColor} border-0" role="alert" style="position: fixed; top: 50px; right: 20px; z-index: 1060;">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `);
    $('body').append(toast);
    const bsToast = new bootstrap.Toast(toast[0]);
    bsToast.show();
    setTimeout(() => toast.remove(), 3000);
}

function setupEventListeners() {
    $('#likeBtn').click(function () {
        if (!currentUser) {
            showToast('Please login to like posts', 'error');
            loginWithGoogle();
            return;
        }
        const action = isLiked ? 'unlike' : 'like';
        $.ajax({
            url: API_BASE + 'handle_like.php',
            type: 'POST',
            data: {
                post_id: currentPost.id,
                user_id: currentUser.id,
                user_name: currentUser.name,
                user_email: currentUser.email,
                action: action
            },
            success: function (response) {
                if (response.success) {
                    isLiked = !isLiked;
                    const currentCount = parseInt($('#likeCount').text());
                    $('#likeCount').text(isLiked ? currentCount + 1 : currentCount - 1);
                    if (isLiked) {
                        $('#likeBtn').addClass('liked').html(`<i class="fas fa-heart me-2"></i><span id="likeCount">${$('#likeCount').text()}</span> Liked`);
                    } else {
                        $('#likeBtn').removeClass('liked').html(`<i class="far fa-heart me-2"></i><span id="likeCount">${$('#likeCount').text()}</span> Likes`);
                    }
                }
            }
        });
    });

    $(document).on('submit', '#commentForm', function (e) {
        e.preventDefault();
        if (!currentUser) {
            showToast('Please login to post comments', 'error');
            loginWithGoogle();
            return;
        }
        const content = $('#commentContent').val().trim();
        if (!content) {
            showToast('Please enter a comment', 'error');
            return;
        }
        $('#submitCommentBtn').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i> Posting...');
        $.ajax({
            url: API_BASE + 'handle_comment.php',
            type: 'POST',
            data: {
                post_id: currentPost.id,
                content: content,
                user_id: currentUser.id,
                user_name: currentUser.name,
                user_email: currentUser.email
            },
            success: function (response) {
                if (response.success) {
                    $('#commentContent').val('');
                    showToast('Comment submitted for approval. It will appear after review.', 'success');
                } else {
                    showToast('Failed to submit comment: ' + response.message, 'error');
                }
            },
            error: function () {
                showToast('Error submitting comment', 'error');
            },
            complete: function () {
                $('#submitCommentBtn').prop('disabled', false).html('<i class="fas fa-paper-plane me-2"></i> Post Comment');
            }
        });
    });

    $(document).on('click', '.reply-btn', function () {
        const commentId = $(this).data('comment-id');
        $(`#reply-form-${commentId}`).show();
    });

    $(document).on('click', '.cancel-reply-btn', function () {
        $(this).closest('.reply-form').hide();
    });

    $(document).on('submit', '.reply-form', function (e) {
        e.preventDefault();
        if (!currentUser) {
            showToast('Please login to reply', 'error');
            return;
        }
        const parentId = $(this).data('parent-id');
        const content = $(this).find('textarea').val().trim();
        if (!content) {
            showToast('Please enter a reply', 'error');
            return;
        }
        $.ajax({
            url: API_BASE + 'handle_comment.php',
            type: 'POST',
            data: {
                post_id: currentPost.id,
                parent_id: parentId,
                content: content,
                user_id: currentUser.id,
                user_name: currentUser.name,
                user_email: currentUser.email
            },
            success: function (response) {
                if (response.success) {
                    showToast('Reply submitted for approval', 'success');
                    $(`#reply-form-${parentId}`).hide();
                    $(`#reply-form-${parentId} textarea`).val('');
                }
            }
        });
    });

    $(document).on('click', '#logoutBtn', function (e) {
        e.preventDefault();
        logoutUser();
    });
}

// Add CSS for toast
const toastCSS = `.toast { min-width: 250px; }`;
$('head').append(`<style>${toastCSS}</style>`);