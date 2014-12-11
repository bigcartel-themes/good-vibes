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


  // Sticky scrolling on Product page
  var columnTop = $(".fixed").parent().offset().top;

  $(window).on('scroll', function() {
    var windowTop = $(window).scrollTop();

    if (windowTop >= columnTop) {
      $(".fixed").css("top", windowTop - columnTop);
    } else {
      $(".fixed").removeAttr("style");
    }
  });


  var container = document.querySelector('#container');
  var msnry = new Masonry( container, {
    columnWidth: 200,
    itemSelector: '.item'
  });

 
});

