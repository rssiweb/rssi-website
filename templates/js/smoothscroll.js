window.onload = function() {

    ///////////////////
    // smooth scroll //
    ///////////////////

    document.body.addEventListener('click', e => {

        const href = e.target.href;
        if (!href) return;

        const id = href.split('#').pop();
        const target = document.getElementById(id);

        if (!target) return;
        e.preventDefault();
        history.pushState({}, document.title, href);
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    });

    /////////////////
    // back to top //
    /////////////////

    var btn = $('#bttbutton');

    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, '300');
    });


}