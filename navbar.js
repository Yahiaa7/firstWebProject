"use strict";
$(document).ready(function () {
  "use strict";

  $("ul.nav-items > li").click(function (e) {
    console.log("hiiiiiiiiiii");
    e.preventDefault();
    $("ul.nav-items > li").removeClass("active");
    $(this).addClass("active");
  });
});
