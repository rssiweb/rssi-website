/*!
 * RSSI Notice Ticker
 * Shows the newest notices AND news (published in the last NEW_DAYS days) as a right-to-left
 * scrolling bar just below the header. Hidden automatically when nothing is new.
 * Self-contained: injects its own CSS and markup. Needs Bootstrap Icons (already on the page).
 * Usage: <script src="/js/notice-ticker.js?v=1.2.0"></script> near the end of <body>.
 */
(function () {
    'use strict';

    /* ---------- Settings ---------- */
    var BASE = window.location.hostname === 'localhost' ? 'http://localhost:8082' : 'https://login.rssi.in';
    var ENDPOINT = BASE + '/fetch_data_news.php'; // same endpoint the Announcements page uses
    var ALL_URL = 'announcements';                 // "View all" link
    var MAX_ITEMS = 10;                            // most items to show
    var SPEED = 60;                                // scroll speed in pixels per second
    var NEW_DAYS = 7;                              // only items newer than this many days are shown

    /* ---------- Styles ---------- */
    var css = '' +
        '.notice-ticker{background:#fff;border-bottom:1px solid rgba(55,55,63,.12);box-shadow:0 2px 8px rgba(55,55,63,.06);position:relative;z-index:5}' +
        '.notice-ticker[hidden]{display:none}' +
        '.nt-inner{display:flex;align-items:stretch;max-width:1320px;margin:0 auto;min-height:42px}' +
        '.nt-label{display:flex;align-items:center;gap:.5rem;flex-shrink:0;padding:0 1rem;background:var(--color-primary,#ce1212);color:#fff;font-weight:600;font-size:.9rem;white-space:nowrap}' +
        '.nt-viewport{flex:1;min-width:0;overflow:hidden;display:flex;align-items:center;' +
        '-webkit-mask-image:linear-gradient(to right,transparent,#000 24px,#000 calc(100% - 24px),transparent);' +
        'mask-image:linear-gradient(to right,transparent,#000 24px,#000 calc(100% - 24px),transparent)}' +
        '.nt-track{display:flex;width:max-content;animation:nt-scroll var(--nt-duration,40s) linear infinite;will-change:transform}' +
        '.nt-set{display:flex;flex-shrink:0}' +
        '.nt-item{display:inline-flex;align-items:center;gap:.5rem;padding:0 1.25rem;color:#37373f;text-decoration:none;font-size:.92rem;white-space:nowrap}' +
        '.nt-item::after{content:"\\2022";margin-left:1.25rem;color:rgba(55,55,63,.35)}' +
        '.nt-item:hover .nt-subject,.nt-item:focus-visible .nt-subject{color:var(--color-primary,#ce1212);text-decoration:underline}' +
        '.nt-date{font-size:.8rem;color:#7f7f90}' +
        '.nt-all{display:flex;align-items:center;flex-shrink:0;padding:0 1rem;font-size:.85rem;font-weight:600;color:var(--color-primary,#ce1212);text-decoration:none;border-left:1px solid rgba(55,55,63,.12);white-space:nowrap}' +
        '.nt-all:hover{color:#000}' +
        // Pause on mouse hover (real mice only, so touch screens never get "stuck") and on keyboard focus only
        '@media (hover:hover){.notice-ticker:hover .nt-track{animation-play-state:paused}}' +
        '.notice-ticker:has(.nt-item:focus-visible) .nt-track{animation-play-state:paused}' +
        '@keyframes nt-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}' +
        '@media (max-width:575.98px){.nt-label-text{display:none}.nt-label{padding:0 .8rem}.nt-item{font-size:.85rem}.nt-all{padding:0 .75rem}}' +
        '@media (prefers-reduced-motion:reduce){.nt-track{animation:none}.nt-viewport{overflow-x:auto;-webkit-mask-image:none;mask-image:none}.nt-set[aria-hidden="true"]{display:none}}';

    var style = document.createElement('style');
    style.id = 'notice-ticker-css';
    style.textContent = css;
    document.head.appendChild(style);

    /* ---------- Markup ---------- */
    var bar = document.createElement('div');
    bar.id = 'notice-ticker';
    bar.className = 'notice-ticker';
    bar.hidden = true; // stays hidden until updates load
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Latest Updates');
    bar.innerHTML =
        '<div class="nt-inner">' +
        '<span class="nt-label"><i class="bi bi-megaphone-fill"></i><span class="nt-label-text">Latest Updates</span></span>' +
        '<div class="nt-viewport"><div class="nt-track"></div></div>' +
        '<a class="nt-all" href="' + ALL_URL + '">View all</a>' +
        '</div>';

    var header = document.getElementById('main-header');
    if (header) {
        header.insertAdjacentElement('afterend', bar);
    } else {
        var main = document.querySelector('main') || document.body.firstChild;
        main.parentNode.insertBefore(bar, main);
    }

    var viewport = bar.querySelector('.nt-viewport');
    var track = bar.querySelector('.nt-track');
    var items = [];

    /* ---------- Helpers ---------- */
    function esc(s) {
        var d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }
    function attr(s) { return esc(s).replace(/"/g, '&quot;'); }

    function isRecent(date) {
        var t = new Date(date).getTime();
        return !isNaN(t) && (Date.now() - t) / 86400000 <= NEW_DAYS;
    }
    function fmt(date) {
        var d = new Date(date);
        return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // dup = true for the second copy used for the seamless loop (hidden from keyboard/screen readers)
    function itemHtml(n, dup) {
        var date = n.date ? '<span class="nt-date">' + esc(fmt(n.date)) + '</span>' : '';
        return '<a class="nt-item" href="' + attr(n.url || ALL_URL) + '" target="_blank" rel="noopener"' +
            (dup ? ' tabindex="-1"' : '') + '>' +
            '<span class="nt-subject">' + esc(n.subject) + '</span>' + date + '</a>';
    }

    // The header is fixed, so the bar is pushed down by the header's height. The hero's own top padding
    // exists for the same reason, so the bar's share is taken out of the hero padding: no double gap,
    // and the hero keeps its normal CSS (the original value is re-read from the stylesheet each time).
    var hero = document.getElementById('hero');
    function applyOffset() {
        var h = header ? header.offsetHeight : 0;
        bar.style.marginTop = h + 'px';
        if (hero && !bar.hidden) {
            hero.style.paddingTop = '';
            var pad = parseFloat(window.getComputedStyle(hero).paddingTop) || 0;
            hero.style.paddingTop = Math.max(0, pad - h) + 'px';
        }
    }

    /* ---------- Build the scrolling track ---------- */
    function build() {
        if (!items.length) return;

        var single = items.map(function (n) { return itemHtml(n, false); }).join('');
        track.innerHTML = '<div class="nt-set">' + single + '</div>';

        // Repeat the set until it is wider than the viewport so there are no gaps
        var setW = track.firstChild.offsetWidth || 1;
        var vw = viewport.offsetWidth || window.innerWidth;
        var reps = Math.max(1, Math.ceil(vw / setW));

        var a = new Array(reps + 1).join(single);
        var b = new Array(reps + 1).join(items.map(function (n) { return itemHtml(n, true); }).join(''));
        track.innerHTML = '<div class="nt-set">' + a + '</div><div class="nt-set" aria-hidden="true">' + b + '</div>';

        var half = track.firstChild.offsetWidth || 1;
        track.style.setProperty('--nt-duration', Math.max(12, half / SPEED).toFixed(1) + 's');
    }

    /* ---------- Load notices + news ---------- */
    fetch(ENDPOINT)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!data || !data.success) return;

            var recent = function (list) {
                return (list || []).filter(function (n) { return n && n.subject && isRecent(n.date); });
            };

            items = recent(data.notices).concat(recent(data.news))
                .sort(function (x, y) { return new Date(y.date) - new Date(x.date); })
                .slice(0, MAX_ITEMS);
            if (!items.length) return; // nothing new: bar stays hidden, page layout untouched

            bar.hidden = false; // must be visible before measuring widths
            applyOffset();
            build();
        })
        .catch(function (err) { console.error('Notice ticker:', err); });

    /* ---------- Don't leave the animation paused after opening a link ---------- */
    // Clicking a link leaves it focused; when you come back from the new tab it was still "focused".
    bar.addEventListener('click', function (e) {
        var link = e.target.closest ? e.target.closest('.nt-item') : null;
        if (link) setTimeout(function () { link.blur(); }, 0);
    });
    function releaseFocus() {
        var a = document.activeElement;
        if (a && bar.contains(a) && !a.matches(':focus-visible')) a.blur();
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) releaseFocus(); });
    window.addEventListener('focus', releaseFocus);

    var lastW = window.innerWidth, timer;
    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            applyOffset();
            if (window.innerWidth !== lastW) { lastW = window.innerWidth; build(); }
        }, 250);
    });
})();