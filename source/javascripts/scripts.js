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
      , $priceDisplay = $(".product_form .price_info")
      , quantity = parseInt($quantityInput.val())
      , price = $quantityInput.data("default-price");
    if (quantity > 0) { 
      $priceDisplay.html(Format.money(quantity * price, true, true));
    }
  });
  
  if ($('#option').length && $('.price_info').length && $('#quantity').length) { 
    if ($('#option option:selected').data('option-price')) {
      var $optionPrice = $('#option option:selected').data('option-price')
        , $optionQuantity = $('#quantity').val();
      $('.price_info').html(Format.money($optionPrice * $optionQuantity, true, true));
      $('#quantity').data('default-price',$optionPrice);
    }
  }
  $(".product_form").submit(function(e) {
    e.preventDefault();
    var quantity = $(this).find("#quantity").val()
      , itemID = $(this).find("#option").val()
      , addButton = $(this).find('.add-to-cart')
      , addText = $(this).find('.add_text')
      , addTextValue = addText.html()
      , addedText = addButton.data('added-text');
    Cart.addItem(itemID, quantity, function(cart) { 
      addText.html(addedText);
      if ($('.product_form .errors').length) { 
        $('.product_form .errors').hide();
      }
      setTimeout(function() {
        addText.html(addTextValue);
      }, 1100);
      updateCart(cart);
    });
    addButton.blur();
  });

  $(document).on("click", ".remove a", function(e) {
    e.preventDefault();
    if ($("body").attr("id") == "cart") { 
      $(this).closest('li').find('input[id$=_qty]').val(0).closest('form').submit();
    }
    else { 
      var itemID = $(this).data("item-id");
      removeFromCart(itemID);
    }
  });
  
  $(document).on("click", ".cart_holder #update", function(e) {
    if ($("body").attr("id") != "cart") {
      e.preventDefault();
      Cart.updateFromForm("cart_form", function(cart) { 
        updateCart(cart); 
      });
    }
  });
  $('#option').change(function(e) {
    var $optionPrice = $('option:selected', this).data('option-price')
      , $optionQuantity = $('#quantity').val(); 
    $('.price_info').html(Format.money($optionPrice * $optionQuantity, true, true));
    $('#quantity').data('default-price',$optionPrice);
  })
});

$(window).load(function() { 
  var $container = $('.masonry');  
  $container.imagesLoaded(function() {
    $container.masonry();
  });
})