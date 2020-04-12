function myFunction() {
  var x = document.getElementById("mynavbarH");
  if (x.className === "navbarH") {
    x.className += " responsive";
  } else {
    x.className = "navbarH";
  }
}