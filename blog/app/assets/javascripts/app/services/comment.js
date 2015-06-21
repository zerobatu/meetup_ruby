angular
  .module('app')
  .service('Comment', Comment);

Comment.$inject = ['$http', 'commentServer'];

function Comment($http, commentServer) {
  this.all = function(id, fn) {
    $http.get(commentServer.url + '/posts/' + id + '/comments')
    .success(function(data, status, headers, config) {
      fn(null, data);
    })
    .error(function(data, status, headers, config) {
      fn(status, data);
    });
  };

  this.new = function(id, message, fn) {
    $http.post(commentServer.url + '/posts/' + id + '/comments', {content: message})
    .success(function(data, status, headers, config) {
      fn(null, data);
    })
    .error(function(data, status, headers, config) {
      fn(status, data);
    });
  };
}
