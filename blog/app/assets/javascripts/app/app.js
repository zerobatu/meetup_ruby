var app = angular
    .module('app', [])
    .constant("commentServer", {
      "url": "http://comment.lvh.me:3003"
    });

app.config(function ($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
});
