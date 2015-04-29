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

var hideCart = function() { 
  var $cart = $(".cart_holder");
  $cart.slideUp(300, function() {
    $(this).remove();
    cartShowing = false;
  });
}

var updateCart = function(cart) {
  var $cartList = $(".header_cart_details");
  var $text = Format.pluralize(cart.item_count, 'Item<span class="hide_mobile">:', 'Items<span class="hide_mobile">:')+' '+Format.money(cart.total, true, true) +'</span>';
  $cartList.html($text);
  if (cartShowing || $("body").attr("id") == "cart") {
    var $container = $("<div>")
      , $cart = $(".cart_holder");
    $container.load("/cart?" + $.now() + " .cart_holder", function() {
      $cart.html($container.find(".cart_holder").html())
    });
  }
}

var removeFromCart = function(itemID) {
  Cart.removeItem(itemID, function(cart) { 
    updateCart(cart)
  });
}

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

  $('.image-link').magnificPopup({
    type:'image',
    gallery: {
      enabled: true
    }
  });
  
  $('#quantity').keyup(function() {
    var $quantityInput = $(this)
      , $priceDisplay = $quantityInput.closest(".product_form").find("small")
      , quantity = parseInt($quantityInput.val())
      , price = $quantityInput.data("default-price");
    if (quantity > 0) { 
      $priceDisplay.html(Format.money(quantity * price, true, true));
    }
  });
  
  $(".product_form").submit(function(e) {
    e.preventDefault();
    var quantity = $(this).find("#quantity").val()
      , itemID = $(this).find("#option").val()
      , addButton = $(this).find('.add-to-cart')
      , addText = $(this).find('.add_text')
      , addTextValue = addText.html()
      , addedText = addButton.attr('data-added-text');
    addButton.blur();
    Cart.addItem(itemID, quantity, function(cart) { 
      addText.html(addedText);
      setTimeout(function() {
        addText.html(addTextValue);
      }, 1100);
      updateCart(cart);
    });
  });

  $(document).on("click", ".remove a", function(e) {
    e.preventDefault();
    var itemID = $(this).data("item-id");
    removeFromCart(itemID);
  });
  
  $(document).on("click", ".cart_holder #update", function(e) {
    e.preventDefault();
    Cart.updateFromForm("cart_form", function(cart) { 
      updateCart(cart); 
    });
  });

  $('select').change(function(e) {
    e.preventDefault();
    $(this).blur();
  })
});

$(window).load(function() { 
  var $container = $('.product_list');  
  $container.imagesLoaded(function() {
    $container.masonry();
  });
})