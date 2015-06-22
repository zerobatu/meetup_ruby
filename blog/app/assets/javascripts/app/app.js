var app = angular
    .module('app', [])
    .constant("commentServer", {
      "url": "http://comment.lvh.me:3003"
    })
    .constant("karmaServer", {
      "url": "http://karma.lvh.me:3006"
    });

app.config(function ($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
});
