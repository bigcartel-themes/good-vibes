require 'dugway'

options = {}

# Use data from any store to make sure your theme looks great with all sorts of products, pages,
# categories, and more. Just give us the subdomain. Default is "dugway" for dugway.bigcartel.com.
  options[:store] = 'ferseverse'

# Simulate the customization done by store owners by passing values to different variables.
# Default values are based on the "default" for each setting in your settings.json.
 options[:customization] = {
  :logo => {
    :url => '/images/gv-logo.png'

  },
  :slideshow => [
    { :url => '/images/test-banner.jpg', :width => 1440, :height => 800 },
    { :url => '/images/test-banner.jpg', :width => 1440, :height => 800 },
    { :url => '/images/test-banner.jpg', :width => 1440, :height => 800 }
  ],
  :store_tagline => 'The good vibes theme does it right',
}

run Dugway.application(options)