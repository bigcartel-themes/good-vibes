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

  // Showing and hiding the cart

  if ($("body").attr("id") != "cart") {
    var cartShowing = false;

    $(document).on("click", ".shopping-cart a", function(e) {
      e.preventDefault();

      if (!cartShowing) { showCart() }
    }).on("click", "#close-cart", function(e) {
      e.preventDefault();

      if (cartShowing) { hideCart() }
    });

    var hideCart = function() {
      var $cart = $(".cart");

      cartShowing = false;

      $cart.slideUp(300, function() {
        $(this).remove();
      });
    }

    var showCart = function() {
      var $container = $("<div>");

      $container.load("/cart" + " .cart", function() {
        var $cart = $container.find(".cart")

        cartShowing = true;
        $cart.css("display", "none");
        $("body").prepend($cart);
        $cart.slideDown(300);
      });
    }
  }
});
