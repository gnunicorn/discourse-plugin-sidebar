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
