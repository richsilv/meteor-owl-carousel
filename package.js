Package.describe({
  summary: 'Touch enabled jQuery plugin that lets you create a beautiful responsive carousel slider.'
});

Package.on_use(function (api) {

  api.use('jquery','client');

  api.add_files('lib/owl.carousel.css', 'client');
  api.add_files('lib/owl.theme.default.css', 'client');
  api.add_files('lib/owl.carousel.js', 'client');

});
