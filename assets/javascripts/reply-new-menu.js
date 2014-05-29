(function() {

  Discourse.PostMenuView.reopen({

    shouldRerenderReplyAsNewTopicButton: Discourse.View.renderIfChanged("post.cooked"),

    renderReplyAsNewTopic: function(post, buffer) {
      if (!Discourse.User.current()) return;
      buffer.push("<button data-action=\"replyAsNewTopic\" class='reply as new topic'><i class=\"fa fa-share\"></i><i class=\"fa fa-plus\"></i></button>");
    },

    clickReplyAsNewTopic: function() {
      this.get('controller').send('replyAsNewTopic', this.get('post'));
    }

  });

})();

