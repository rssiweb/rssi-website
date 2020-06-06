
/* jQuery Pre loader
 -----------------------------------------------*/
$(window).load(function () {
  $('.preloader').fadeOut(1000); // set duration in brackets    
});


/* Mobile Navigation
    -----------------------------------------------*/
$(window).scroll(function () {
  if ($(".navbar").offset().top > 50) {
    $(".navbar-fixed-top").addClass("top-nav-collapse");
  } else {
    $(".navbar-fixed-top").removeClass("top-nav-collapse");
  }
});


/* HTML document is loaded. DOM is ready. 
-------------------------------------------*/
$(document).ready(function () {

  /* Hide mobile menu after clicking on a link
    -----------------------------------------------*/
  $('.navbar-collapse a').click(function () {
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


  /* Owl Carousel
-----------------------------------------------*/

  $(document).ready(function () {
    $("#owl-speakers").owlCarousel({
      autoPlay: 6000,
      items: 7, //10 items above 1000px browser width
      itemsDesktop: [1000, 5], //5 items between 1000px and 901px
      itemsDesktopSmall: [900, 3], // betweem 900px and 601px
      itemsTablet: [600, 2], //2 items between 600 and 0
      itemsMobile: false // itemsMobile disabled - inherit from itemsTablet option
    });
  });

  /* Back top
  -----------------------------------------------*/
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $('.go-top').fadeIn(200);
    } else {
      $('.go-top').fadeOut(200);
    }
  });
  // Animate the scroll to top
  $('.go-top').click(function (event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 300);
  })


  /* wow
  -------------------------------*/
  new WOW({ mobile: false }).init();

});

//RESPONSIVE HEADER//
function myFunction1() {
  var x = document.getElementById("mynavbarH");
  if (x.className === "navbarH") {
    x.className += " responsive";
  } else {
    x.className = "navbarH";
  }
}

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

$(document).ready(function () {
  $("#tclose").click(function () {
    $("#thover").fadeOut();
    $("#tpopup").fadeOut();
  });

});