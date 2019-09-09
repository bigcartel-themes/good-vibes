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
      , price = $(".add-to-cart-button").attr("data-selected-price")
    if (quantity > 0 && price) {
      $priceDisplay.html(Format.money(quantity * price, true, true));
    }
  });

  $(".product_form").submit(function(e) {
    e.preventDefault();
    var quantity = $(this).find("#quantity").val()
      , itemID = $(this).find("#option").val()
      , addButton = $(this).find('.add-to-cart-button')
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
});

var $container = $('.masonry');
if ($container.length) {
  $container.imagesLoaded(function() {
    $container.masonry();
  });
}


var isGreaterThanZero = function(currentValue) {
  return currentValue > 0;
}

function arrayContainsArray(superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
}

function unique(item, index, array) {
  return array.indexOf(item) == index;
}

function cartesianProduct(a) {
  var i, j, l, m, a1, o = [];
  if (!a || a.length == 0) return a;
  a1 = a.splice(0, 1)[0];
  a = cartesianProduct(a);
  for (i = 0, l = a1.length; i < l; i++) {
    if (a && a.length) for (j = 0, m = a.length; j < m; j++)
      o.push([a1[i]].concat(a[j]));
    else
      o.push([a1[i]]);
  }
  return o;
}

Array.prototype.equals = function (array) {
  if (!array)
    return false;
  if (this.length != array.length)
    return false;
  for (var i = 0, l=this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

// From https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

Array.prototype.count = function(filterMethod) {
  return this.reduce((count, item) => filterMethod(item)? count + 1 : count, 0);
}

$('.product_option_select').on('change',function() {
  var option_price = $(this).find("option:selected").attr("data-price");
  enableAddButton(option_price);
});
function enableAddButton(updated_price) {
  var addButton = $('.add-to-cart-button');
  var addButtonTextElement = addButton.find('.add_text');
  var addButtonPriceTextElement = addButton.find('.price_info');
  var addButtonTitle = addButton.attr('data-add-title');
  addButton.attr("disabled",false);
  if (updated_price) {
    quantity = parseInt($('#quantity').val());
    if (quantity > 0) {
      updated_total_price = quantity * updated_price;
    }
    addButtonPriceTextElement.html(Format.money(updated_total_price, true, true));
    addButton.attr('data-selected-price',updated_price);
    addButtonPriceTextElement.show();
  }
  else {
    priceTitle = '';
    addButtonPriceTextElement.hide();
  }
  addButtonTextElement.html(addButtonTitle);
}

function disableAddButton(type) {
  var addButton = $('.add-to-cart-button');
  var addButtonTextElement = addButton.find('.add_text');
  var addButtonPriceTextElement = addButton.find('.price_info');
  var addButtonTitle = addButton.attr('data-add-title');
  if (type == "sold-out") {
    var addButtonTitle = addButton.attr('data-sold-title');
  }
  if (!addButton.is(":disabled")) {
    addButton.attr("disabled","disabled");
  }
  addButtonTextElement.html(addButtonTitle);
  addButtonPriceTextElement.hide();
}

function enableSelectOption(select_option) {
  select_option.removeAttr("disabled");
  select_option.text(select_option.attr("data-name"));
  select_option.removeAttr("disabled-type");
  if ((select_option.parent().is('span'))) {
    select_option.unwrap();
  }
}
function disableSelectOption(select_option, type) {
  if (type === "sold-out") {
    disabled_text = select_option.parent().attr("data-sold-text");
    disabled_type = "sold-out";
    if (show_sold_out_product_options === 'false') {
      hide_option = true;
    }
    else {
      hide_option = false;
    }
  }
  if (type === "unavailable") {
    disabled_text = select_option.parent().attr("data-unavailable-text");
    disabled_type = "unavailable";
    hide_option = true;
  }
  if (select_option.val() > 0) {
    var name = select_option.attr("data-name");
    select_option.attr("disabled",true);
    select_option.text(name + ' ' + disabled_text);
    select_option.attr("disabled-type",disabled_type);
    if (hide_option === true) {
      if (!(select_option.parent().is('span'))) {
        select_option.wrap('<span>');
      }
    }
  }
}
