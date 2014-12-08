Ember.Handlebars.helper('moderatorList', function(moderators) {
  var ret = "";
  for(var i=0, j=moderators.length; i<j; i++) {
    ret = ret + '<a href="/users/' + moderators[i].username + '">' + moderators[i].username + '</a>';
    if (i<j-1) {
      ret = ret + ", ";
    };
  }
  return new Handlebars.SafeString(ret);
});
