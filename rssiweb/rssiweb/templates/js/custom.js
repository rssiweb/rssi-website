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
});

//RESPONSIVE HEADER//

function myFunction() {
    var x = document.getElementById("mynavbarHo");
    if (x.className === "navbarHo navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbarHo navbar";
    }
};