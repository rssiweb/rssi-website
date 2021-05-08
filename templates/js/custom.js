/* jQuery Pre loader
 -----------------------------------------------*/
$(window).load(function() {
    $('.preloader').fadeOut(1000); // set duration in brackets    
});


/* Mobile Navigation
    -----------------------------------------------*/
$(window).scroll(function() {
    if ($(".navbar").offset() != undefined) {
        if ($(".navbar").offset().top > 50) {
            $(".navbar-fixed-top").addClass("top-nav-collapse");
        } else {
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
        }
    }
});


/* HTML document is loaded. DOM is ready. 
-------------------------------------------*/
$(document).ready(function() {

    /* Hide mobile menu after clicking on a link
      -----------------------------------------------*/
    $('.navbar-collapse a').click(function() {
        $(".navbar-collapse").collapse('hide');
    });


    /* Parallax section
       -----------------------------------------------*/
    function initParallax() {
        $('#intro').parallax("100%", 0.1);
        $('#overview').parallax("100%", 0.3);
        $('#detail').parallax("100%", 0.2);
        $('#video').parallax("100%", 0.3);
        $('#speakers').parallax("100%", 0.1);
        $('#program').parallax("100%", 0.2);
        $('#register').parallax("100%", 0.1);
        $('#faq').parallax("100%", 0.3);
        $('#venue').parallax("100%", 0.1);
        $('#sponsors').parallax("100%", 0.3);
        $('#contact').parallax("100%", 0.2);

    }
    initParallax();

    /* Back top
    -----------------------------------------------*/
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('.go-top').fadeIn(200);
        } else {
            $('.go-top').fadeOut(200);
        }
    });
    // Animate the scroll to top
    $('.go-top').click(function(event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 500);
    })


    /* wow
    -------------------------------*/
    new WOW({ mobile: false }).init();

});

//RESPONSIVE HEADER//

function myFunction() {
    var x = document.getElementById("mynavbarHo");
    if (x.className === "navbarHo navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbarHo navbar";
    }
}

//popup image

//$("#thover").click(function(){
//$(this).fadeOut();
//$("#tpopup").fadeOut();
//});

/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: https://cdn.jsdelivr.net/gh/manucaralmo/GlowCookies@3.0.1/src/glowCookies.min.js
 */
class GlowCookies {
    constructor() { this.banner = void 0, this.config = void 0, this.tracking = void 0, this.PreBanner = void 0, this.Cookies = void 0 }
    render() { this.addCss(), this.createDOMElements(), this.checkStatus() }
    addCss() {
        const e = document.createElement("link");
        e.setAttribute("rel", "stylesheet"), e.setAttribute("href", "https://cdn.jsdelivr.net/gh/manucaralmo/GlowCookies@3.0.1/src/glowCookies.min.css"), document.head.appendChild(e)
    }
    createDOMElements() { this.PreBanner = document.createElement("div"), this.PreBanner.innerHTML = `<button type="button" id="prebannerBtn" class="prebanner prebanner-${this.config.position} ${this.config.border} animation" style="color: ${this.banner.manageCookies.color}; background-color: ${this.banner.manageCookies.background};">\n <svg fill="currentColor" style="margin-right: 0.25em; margin-top: 0.15em; vertical-align: text-top;" height="1.05em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\n <path d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0 0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77 54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0 0 57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/>\n </svg>${this.banner.manageCookies.text}</button>`, this.PreBanner.style.display = "none", document.body.appendChild(this.PreBanner), this.Cookies = document.createElement("div"), this.Cookies.innerHTML = `<div class="glow-banner banner-${this.config.position} ${this.config.border}" style="background-color: ${this.banner.background};">\n <div class="glow-banner-content">\n <div class="glow-banner-description" style="color: ${this.banner.color};">\n ${this.banner.heading}\n ${this.banner.description} \n <a href="${this.banner.link}" class="link-btn" style="color: ${this.banner.color};" target="_blank">${this.banner.linkText}</a>\n </div>\n <div class="glow-buttons">\n <button type="button" id="acceptCookies" class="cookie-consent-btn animation" style="background-color: ${this.banner.acceptBtn.background}; color: ${this.banner.acceptBtn.color};">\n <svg fill="currentColor" style="margin-right: 0.25em; margin-top: 0.15em; vertical-align: text-top;" height="1.05em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\n <path d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0 0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77 54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0 0 57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/>\n </svg>\n ${this.banner.acceptBtn.text}\n </button>\n <button type="button" id="rejectCookies" class="cookie-consent-btn-secondary animation" style="background-color: ${this.banner.rejectBtn.background}; color: ${this.banner.rejectBtn.color};">\n ${this.banner.rejectBtn.text}\n </button>\n </div>\n </div>\n </div>`, this.Cookies.style.display = "none", document.body.appendChild(this.Cookies), document.getElementById("prebannerBtn").addEventListener("click", () => this.openSelector()), document.getElementById("acceptCookies").addEventListener("click", () => this.acceptCookies()), document.getElementById("rejectCookies").addEventListener("click", () => this.rejectCookies()) }
    checkStatus() {
        switch (localStorage.getItem("GlowCookies")) {
            case "1":
                this.openManageCookies(), this.activateTracking(), this.addCustomScript();
                break;
            case "0":
                this.openManageCookies();
                break;
            default:
                this.openSelector()
        }
    }
    openManageCookies() { this.config.hideAfterClick ? this.PreBanner.style.display = "none" : this.PreBanner.style.display = "block", this.Cookies.style.display = "none" }
    openSelector() { this.PreBanner.style.display = "none", this.Cookies.style.display = "block" }
    acceptCookies() { localStorage.setItem("GlowCookies", "1"), this.openManageCookies(), this.activateTracking(), this.addCustomScript() }
    rejectCookies() { localStorage.setItem("GlowCookies", "0"), this.openManageCookies(), this.disableTracking() }
    activateTracking() {
        if (void 0 !== this.tracking.AnalyticsCode && null !== this.tracking.AnalyticsCode) {
            let e = document.createElement("script");
            e.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=" + this.tracking.AnalyticsCode), document.head.appendChild(e);
            let t = document.createElement("script");
            t.text = `window.dataLayer = window.dataLayer || [];\n function gtag(){dataLayer.push(arguments);}\n gtag('js', new Date());\n gtag('config', '${this.tracking.AnalyticsCode}');`, document.head.appendChild(t)
        }
        if (void 0 !== this.tracking.FacebookPixelCode && null !== this.tracking.FacebookPixelCode) {
            let e = document.createElement("script");
            e.text = `\n !function(f,b,e,v,n,t,s)\n {if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n n.queue=[];t=b.createElement(e);t.async=!0;\n t.src=v;s=b.getElementsByTagName(e)[0];\n s.parentNode.insertBefore(t,s)}(window, document,'script',\n 'https://connect.facebook.net/en_US/fbevents.js');\n fbq('init', '${this.tracking.FacebookPixelCode}');\n fbq('track', 'PageView');\n `, document.head.appendChild(e);
            let t = document.createElement("noscript");
            t.setAttribute("height", "1"), t.setAttribute("width", "1"), t.setAttribute("style", "display:none"), t.setAttribute("src", `https://www.facebook.com/tr?id=${this.tracking.FacebookPixelCode}&ev=PageView&noscript=1`), document.head.appendChild(t)
        }
        if (void 0 !== this.tracking.HotjarTrackingCode && null !== this.tracking.HotjarTrackingCode) {
            let e = document.createElement("script");
            e.text = `\n (function(h,o,t,j,a,r){\n h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};\n h._hjSettings={hjid:${this.tracking.HotjarTrackingCode},hjsv:6};\n a=o.getElementsByTagName('head')[0];\n r=o.createElement('script');r.async=1;\n r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;\n a.appendChild(r);\n })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');\n `, document.head.appendChild(e)
        }
    }
    disableTracking() {
        if (void 0 !== this.tracking.AnalyticsCode && null !== this.tracking.AnalyticsCode) {
            let e = document.createElement("script");
            e.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=" + this.tracking.AnalyticsCode), document.head.appendChild(e);
            let t = document.createElement("script");
            t.text = `window.dataLayer = window.dataLayer || [];\n function gtag(){dataLayer.push(arguments);}\n gtag('js', new Date());\n gtag('config', '${this.tracking.AnalyticsCode}' , {\n 'client_storage': 'none',\n 'anonymize_ip': true\n });`, document.head.appendChild(t)
        }
        this.clearCookies()
    }
    clearCookies() {
        let e = document.cookie.split("; ");
        for (let t = 0; t < e.length; t++) {
            let n = window.location.hostname.split(".");
            for (; n.length > 0;) {
                let o = encodeURIComponent(e[t].split(";")[0].split("=")[0]) + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" + n.join(".") + " ;path=",
                    i = location.pathname.split("/");
                for (document.cookie = o + "/"; i.length > 0;) document.cookie = o + i.join("/"), i.pop();
                n.shift()
            }
        }
    }
    addCustomScript() {
        if (void 0 !== this.tracking.customScript) {
            let e;
            this.tracking.customScript.forEach(t => { "src" === t.type ? (e = document.createElement("script")).setAttribute("src", t.content) : "custom" === t.type && ((e = document.createElement("script")).text = t.content), "head" === t.position ? document.head.appendChild(e) : document.body.appendChild(e) })
        }
    }
    start(e, t) { null == t && (t = {}), this.config = { border: t.border || "border", position: t.position || "left", hideAfterClick: t.hideAfterClick || !1 }, this.tracking = { AnalyticsCode: t.analytics || void 0, FacebookPixelCode: t.facebookPixel || void 0, HotjarTrackingCode: t.hotjar || void 0, customScript: t.customScript || void 0 }, "en" === e ? this.banner = { description: t.bannerDescription || "We use our own and third-party cookies to personalize content and to analyze web traffic.", linkText: t.bannerLinkText || "Read more about cookies", link: t.policyLink || "#link", background: t.bannerBackground || "#fff", color: t.bannerColor || "#505050", heading: t.bannerHeading || "", acceptBtn: { text: t.acceptBtnText || "Accept cookies", background: t.acceptBtnBackground || "#24273F", color: t.acceptBtnColor || "#fff" }, rejectBtn: { text: t.rejectBtnText || "Reject", background: t.rejectBtnBackground || "#E8E8E8", color: t.rejectBtnColor || "#636363" }, manageCookies: { color: t.manageColor || "#red", background: t.manageBackground || "#fff", text: t.manageText || "Manage cookies" } } : "es" === e && (this.banner = { description: t.bannerDescription || "Utilizamos cookies propias y de terceros para personalizar el contenido y para analizar el tráfico de la web.", linkText: t.bannerLinkText || "Ver más sobre las cookies", link: t.policyLink || "#link", background: t.bannerBackground || "#fff", color: t.bannerColor || "#505050", heading: t.bannerHeading || "", acceptBtn: { text: t.acceptBtnText || "Aceptar cookies", background: t.acceptBtnBackground || "#24273F", color: t.acceptBtnColor || "#fff" }, rejectBtn: { text: t.rejectBtnText || "Rechazar", background: t.rejectBtnBackground || "#E8E8E8", color: t.rejectBtnColor || "#636363" }, manageCookies: { color: t.manageColor || "#red", background: t.manageBackground || "#fff", text: t.manageText || "Cookies" } }), window.addEventListener("load", () => { this.render() }) }
}
const glowCookies = new GlowCookies;