
document.addEventListener("DOMContentLoaded", function () {
  let contactFields = document.querySelectorAll(".contact_form input, .contact_form textarea");
  contactFields.forEach(function (contactField) {
    contactField.removeAttribute("tabindex");
  });
});
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

$(document).ready(function() {
  $('.open_shop button').on('click', function(e) {
    e.preventDefault();
    $('.page_links').slideUp('fast', function() {
      $('ul.category_links').slideToggle(150);
    });
  });

  $('.open_pages button').on('click', function(e) {
    e.preventDefault();
    $('.category_links').slideUp('fast', function() {
      $('.page_links').slideToggle(150);
    });
  });
});

var $container = $('.masonry');
if ($container.length) {
  $container.imagesLoaded(function() {
    $container.masonry();
  });
}