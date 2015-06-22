angular
  .module('app')
  .service('Karma', Karma);

Karma.$inject = ['$http', 'karmaServer'];

function Karma($http, karmaServer) {
  this.score = function(id, fn) {
    $http.get(karmaServer.url + '/posts/' + id + '/karma')
    .success(function(data, status, headers, config) {
      fn(null, data);
    })
    .error(function(data, status, headers, config) {
      fn(status, data);
    });
  };

  this.up = function(id, fn) {
    $http.put(karmaServer.url + '/posts/' + id + '/up')
    .success(function(data, status, headers, config) {
      fn(null, data);
    })
    .error(function(data, status, headers, config) {
      fn(status, data);
    });
  };

  this.down = function(id, fn) {
    $http.put(karmaServer.url + '/posts/' + id + '/down')
    .success(function(data, status, headers, config) {
      fn(null, data);
    })
    .error(function(data, status, headers, config) {
      fn(status, data);
    });
  };
}
