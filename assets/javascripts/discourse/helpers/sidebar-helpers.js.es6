Ember.Handlebars.helper('moderatorList', function(moderators) {
  var ret = "";
  for(var i=0, j=moderators.length; i<j; i++) {
    ret = ret + '<a href="/users/' + moderators[i].username + '">' + moderators[i].username + '</a>';
    if (i<j-1) {
      ret = ret + ", ";
    };
  }
  return new Handlebars.SafeString(ret);
}, 'moderators');

Ember.Handlebars.helper('restrictDescription', function(description) {
  if (description.length > 150) {
    return new Handlebars.SafeString(description.substr(0, 150) + '&hellip;');
  } else {
    return new Handlebars.SafeString(description);
  }
}, 'description');

Ember.Handlebars.helper('digitGrouping', function(number) {
  number = parseFloat(number);
  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + '.');
}, 'number');
