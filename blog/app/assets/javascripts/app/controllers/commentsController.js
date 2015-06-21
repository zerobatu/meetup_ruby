angular
  .module('app')
  .controller('CommentsController', CommentsController);

CommentsController.$inject = ['Comment'];

function CommentsController(Comment) {
  var vm = this;
  this.comments = [];

  Comment.all($('#post_id').val(), function(err, data) {
    if(err) {
      alert("comments error");
    } else {
      vm.comments = data;
    } 
  });

  this.add = function() {
    Comment.new($('#post_id').val(), vm.new, function(err, data) {
      if(err) {
        alert("comments error");
      } else {
        vm.new = '';
        vm.comments.unshift(data);
      } 
    });
  }
}
