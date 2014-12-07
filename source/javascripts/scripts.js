$(document).ready(function() {

  $('.bxslider').bxSlider({
  auto: true
  });

  $('.wrapper-dropdown').on('click', function() {
    $(this).toggleClass('active');
  });

  $(".nav li a").attr("data-hover", 'name of page');

  $(".pagination a").attr("data-hover", 'page number');

  $(function() {
    $(".nav a").each(function(){
      if ($(this).attr("href") == window.location.pathname) {
      $(this).addClass("current");
      }
    });
  });

  // var maxHeight = Math.max($(".description").height(), $(".product-shots").height());
  // var columnTop = $(".fixed").parent().offset().top;

  // $(".description").height(maxHeight);
  // $(".product-shots").height(maxHeight);

  // $(window).on('scroll', function() {
  //   var windowTop = $(window).scrollTop();

  //   if (windowTop >= columnTop) {
  //     $(".fixed").css("top", windowTop - columnTop);
  //   } else {
  //     $(".fixed").removeAttr("style");
  //   }
  // });


 

});

