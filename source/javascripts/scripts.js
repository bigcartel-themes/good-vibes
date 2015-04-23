// Custom error handling

API.onError = function(errors) {
  var $errorList = $('<ul>', { class: 'errors'} )
    , $cartErrorsLocation = $('.cart_form')
    , $productErrorsLocation = $('.product_form');
  $.each(errors, function(index, error) {
    $errorList.append($('<li>').html(error));
  });
  if ($cartErrorsLocation.length > 0) {
    $cartErrorsLocation.find('.errors').hide();
    $cartErrorsLocation.prepend($errorList);
    $('.cart-wrapper').scrollTop(0);
  } else if ($productErrorsLocation.length > 0) {
    $productErrorsLocation.find('.errors').hide();
    $productErrorsLocation.prepend($errorList);
  }
}

// Hide cart function

var hideCart = function() { 
  var $cart = $(".cart_holder");
  $cart.slideUp(300, function() {
    $(this).remove();
    cartShowing = false;
  });
}

// Update cart function

var updateCart = function(cart) {
  var $cartList = $(".header_cart_details");
  var $text = Format.pluralize(cart.item_count, 'Item:', 'Items:')+' '+Format.money(cart.total, true, true);

  $cartList.html($text);
  if (cartShowing || $("body").attr("id") == "cart") {
    var $container = $("<div>")
      , $cart = $(".cart_holder");

    $container.load("/cart?" + $.now() + " .cart_holder", function() {
      $cart.html($container.find(".cart_holder").html())
    });
  }
}

// Remove from cart function

var removeFromCart = function(itemID) {
  Cart.removeItem(itemID, function(cart) { 
    updateCart(cart)
  });
}

// Add to cart function

var addToCart = function(itemID, quantity) {
  Cart.addItem(itemID, quantity, function(cart) { 
    updateCart(cart) 
  });
}

// Show cart function

var showCart = function() { 
  var $container = $("<div>");
  $container.load("/cart?" + $.now() + " .cart_holder", function() {
    var $cart = $container.find(".cart_holder")
    $cart.css("display", "none");
    $("body").prepend($cart);
    $cart.slideDown(200, function() { 
      cartShowing = true;
    });
  });
}

$(document).ready(function() {

  // Shop / pages dropdown
  
  $('.open_shop a').on('click', function(e) {
    e.preventDefault();
    $('.page_links').slideUp('fast', function() { 
      $('ul.category_links').slideToggle(150);
    });    
  });

  $('.open_pages a').on('click', function(e) {
    e.preventDefault();
    $('.category_links').slideUp('fast', function() { 
      $('.page_links').slideToggle(150);
    });
  });
  


  

  // Hide / show cart
  
  if ($("body").attr("id") != "cart") {
    cartShowing = false;
    $(document).on("click", ".open_cart a", function(e) {
      e.preventDefault();
      if (!cartShowing) { showCart() }
      if (cartShowing) { hideCart() }
    }).on("click", ".close_cart", function(e) {
      e.preventDefault();
      if (cartShowing) { hideCart() }
    });
  }

  // Product image gallery
  
  $('.image-link').magnificPopup({
    type:'image',
    gallery: {
      enabled: true
    }
  });
  
  
  // Updating product price on quantity change
  
  $('#quantity').keyup(function() {
    var $quantityInput = $(this)
      , $priceDisplay = $quantityInput.closest(".product_form").find("small")
      , quantity = parseInt($quantityInput.val())
      , price = $quantityInput.data("default-price");
  
    if (quantity > 0) { 
      $priceDisplay.html(Format.money(quantity * price, true, true));
    }
  });
  
  // Adding items to the cart
  
  $(".product_form").submit(function(e) {
    e.preventDefault();
    var quantity = $(this).find("#quantity").val()
      , itemID = $(this).find("#option").val()
      , addButton = $(this).find('.add-to-cart');
    addToCart(itemID, quantity);
    addButton.blur();
  });
  
  // Removing items from the cart
  
  $(document).on("click", ".remove a", function(e) {
    e.preventDefault();
    var itemID = $(this).data("item-id");
    removeFromCart(itemID);
  });
  
  // Updating cart
  
  $(document).on("click", ".cart_holder #update", function(e) {
    e.preventDefault();
    Cart.updateFromForm("cart_form", function(cart) { 
      updateCart(cart) 
    });
  });
});

// Masonry

$(window).load(function() { 
  var $container = $('.product_list');  
  $container.imagesLoaded( function() {
    $container.masonry();
  });
})