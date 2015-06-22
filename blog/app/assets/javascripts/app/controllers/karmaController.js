angular
  .module('app')
  .controller('KarmaController', KarmaController);

KarmaController.$inject = ['Karma'];

function KarmaController(Karma) {
  var vm = this;
  this.postKarma = null;

  Karma.score($('#post_id').val(), function(err, data) {
    vm.postKarma = err ? 0 : (data.karma || 0);
  });

  this.up = function() {
    Karma.up($('#post_id').val(), function(err, data) {
      if(err) {
        if(err == 401) alert("you must log")
      } else {
        vm.postKarma = data.karma;
      }
    });
  }

  this.down = function() {
    Karma.down($('#post_id').val(), function(err, data) {
      if(err) {
        if(err == 401) alert("you must log")
      } else {
        vm.postKarma = data.karma;
      }
    });
  }
}
