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

  // Enable sticky scrolling only on Product page
  if ($("body").attr("id") == "product") {
    var columnTop = $(".fixed").parent().offset().top;

    $(window).on('scroll', function() {
      var windowTop = $(window).scrollTop();

      if (windowTop >= columnTop) {
        $(".fixed").css("top", windowTop - columnTop);
      } else {
        $(".fixed").removeAttr("style");
      }
    });
  }

  // Enable Masonry plugin only on Home page
  if ($("body").attr("id") == "home") {
    // var $container = $(".container")

    // $container.masonry({
    //   columnWidth: 200,
    //   itemSelector: ".item"
    // });
  }
});

