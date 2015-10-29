var fs = require('fs');

function mergeValues(values, content) {
  //Cycle over the keys in values
    //Replace all {{key}} with the values from the values object
  for (var key in values) {
    
    content = content.replace("{{" + key + "}}", values[key]);
  }
  //return merged content
  return content;
}
function view(templateName, values, response) {
  var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: "utf8"});
  //Insert values in to the content
  fileContents = mergeValues(values, fileContents);                          
 //write out response
  response.write(fileContents);
}

module.exports.view = view;