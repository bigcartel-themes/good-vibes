$(document).ready(function() {

  $('.bxslider').bxSlider({
  auto: true
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
});
