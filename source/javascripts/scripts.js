$(document).ready(function() {

  $('.drop-cat').hide();

  $('.shop').on('click', function(e) {
    e.preventDefault();
    $('.drop-pages').hide();
    $('.drop-cat').slideToggle(350);
  });


  $('.drop-pages').hide();

  $('.pages').on('click', function(e) {
    e.preventDefault();
    $('.drop-cat').hide();
    $('.drop-pages').slideToggle(350);
  });

  $('.bxslider').bxSlider({
  auto: true,
  pagerSelector: '.control-wrap'
  });

  $(".nav li a").attr("data-hover", 'name of page');

  $(".pagination a").attr("data-hover", 'page number');

  // $(function() {
  //   $(".nav a").each(function(){
  //     if ($(this).attr("href") == window.location.pathname) {
  //     $(this).addClass("current");
  //     }
  //   });
  // });

  // Enable sticky scrolling only on Product page
  $(window).on('scroll', function() {
    if ($(".sticky").hasClass("fixed")) { enableSticky() }
  });

  var enableSticky = function() {
    if ($(".sticky").length > 0) {
      var columnTop = $(".sticky").parent().offset().top;
      var windowTop = $(window).scrollTop();

      $(".sticky").addClass("fixed");

      if (windowTop >= columnTop) {
        $(".sticky").css("top", windowTop - columnTop);
      } else {
        $(".sticky").removeAttr("style");
      }
    }
  }

   var fixedContainerHeight = $(".sticky").outerHeight();

    $(window).on("load resize", function() {
    var windowHeight = $(window).height();

    if (fixedContainerHeight > windowHeight) {
      $(".sticky").removeClass("fixed").removeAttr("style");
    } else {
      enableSticky();
    }
    
  });

  // Enable Masonry plugin only on Home page
  if ($("body").attr("id") == "home") {
    var $container = $(".masonry");

    $container.imagesLoaded(function() {
      $container.masonry();
    });
    // $container.imagesLoaded( function() {
    //   $container.masonry();
    // });
  }

  // Showing and hiding the cart
  if ($("body").attr("id") != "cart") {
    var cartShowing = false;

    $(document).on("click", ".shopping-cart a", function(e) {
      e.preventDefault();

      $(".fixed").removeClass("fixed").removeAttr("style"); 

      if (!cartShowing) { showCart() }
    }).on("click", "#close-cart", function(e) {
      e.preventDefault();

      enableSticky();

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

  // Change visible price when item quantity changes
  $(document).on("keyup", "#quantity", function() {
    var $quantityInput = $(this)
      , $priceDisplay = $quantityInput.closest("#product_form").find("small")
      , quantity = $quantityInput.val()
      , price = $quantityInput.data("default-price");

    $priceDisplay.html(Format.money(quantity * price, true, true));
  });

  // Adding items to the cart
  $(document).on("click", "#product_form :submit", function(e) {
    e.preventDefault();

    var $button = $(this)
      , $form = $button.closest("#product_form")
      , quantity = $form.find("#quantity").val()
      , itemID = $form.find("#option").val();

    addToCart(itemID, quantity);
  });

  var addToCart = function(itemID, quantity) {
    Cart.addItem(itemID, quantity, function(cart) { updateCart(cart) });
  }

  // Removing items from the cart
  $(document).on("click", ".cart .remove", function(e) {
    e.preventDefault();

    var itemID = $(this).data("item-id");

    removeFromCart(itemID);
  });

  var removeFromCart = function(itemID) {
    Cart.removeItem(itemID, function(cart) { updateCart(cart) });
  }

  // Updating the cart
  $(document).on("click", ".cart #update", function(e) {
    e.preventDefault();

    Cart.updateFromForm("cart_form", function(cart) { updateCart(cart) });
  });

  var updateCart = function(cart) {
    var $cartListItems = $(".shopping-cart ul a li");

    $cartListItems.filter(":first").text(cart.item_count);
    $cartListItems.filter(":last").html(Format.money(cart.total, true, true));

    if (cartShowing) {
      var $container = $("<div>")
        , $cart = $(".cart");

      $container.load("/cart" + " .cart", function() {
        $cart.html($container.find(".cart").html())
      });
    }
  }

  // Open and close dropdowns
  $(document).on("click", ".wrapper-dropdown", function(e) {
    e.stopPropagation();

    $(this).toggleClass("active");
  });

  var closeDropdowns = function() {
    $(".wrapper-dropdown.active").removeClass("active");
  }

  // Choose dropdown option
  $(document).on("click", ".wrapper-dropdown li", function() {
    var $listItem = $(this)
      , $dropdown = $listItem.closest(".wrapper-dropdown")
      , $selectionArea = $dropdown.find("span")
      , $realSelect = $dropdown.next("select");

    $selectionArea.text($listItem.text());
    $realSelect.val($listItem.data("item-id"));
  });

  // Close open dropdown when clicking outside
  $(document).on('click', function(e) {
    if ($('.wrapper-dropdown.active').length > 0) {
      if ($(this).closest('.wrapper-dropdown.active').length == 0) {
        closeDropdowns();
      }
    }
  });

  // Search for Instagram user ID
  if ($('.instagram').length > 0) {
    $.ajax({
      url: "https://api.instagram.com/v1/users/search?q=" + $('.instagram').data('instagram-username') + "&client_id=25b0b91b1f0b47588a99db9e9952d9b1",
      dataType: 'jsonp',
      success: function(response) {
        var instagramUserID = response.data[0].id;

        $.ajax({
          url: "https://api.instagram.com/v1/users/" + instagramUserID + "/media/recent/?client_id=25b0b91b1f0b47588a99db9e9952d9b1&count=4",
          dataType: 'jsonp',
          success: function(response) {
            $.each(response.data, function(index, object) {
              $('.instagram ul').append(
                $('<li>', { class: 'grid_3'}).append(
                  $('<a>', { href: object.link}).append(
                    $('<img>', { src: object.images.standard_resolution.url })
                  )
                )
              )
            });
          },
          error: function() {
            console.log("There was an error fetching Instagram images")
          }
        });
      },
      error: function() {
        console.log("There was an error searching Instagram")
      }
    });
  }
});
