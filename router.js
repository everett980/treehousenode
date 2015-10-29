var Profile = require("./profile.js");
var renderer = require("./renderer.js");

var commonHeaders = {'Content-Type': 'text/html'};
var queryString = require('querystring');
//2. Handle HTTP route Get / and Post / i.e. Home
function home(request, response) {
  if(request.url === '/') {
    if(request.method.toLowerCase() === "get") {
      response.writeHead(200, commonHeaders);
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else {
      //do something else to handle post.
        //extract user from the post data and redirect to /:username
      request.on('data', function(postBody) {
        console.log(postBody.toString());
        var query = queryString.parse(postBody.toString());
        response.writeHead(303, {"Location": "/" + query.username});
        response.end();
      });
    }
  }
}

//3. Handle HTTP route GET /:username
function user(request, response) {
  var username = request.url.replace("/", "");
  if(username.length > 0) {
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);
    //following line for testing purposes only, remove when necessary
    //response.write(username + "\n");
    
    //get json from Treehouse
    var studentProfile = new Profile(username);
    //on 'end'
    studentProfile.on('end', function(profileJSON) {
      //show profile
      var values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      }
      //simple response
      //response.write(values.username+" has "+values.javascriptPoints+" points in JavaScript.\n");
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();
    });
    //on 'error'
    studentProfile.on('error', function(error) {
      //show error
      renderer.view("header", {}, response);
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    });
  }
}

module.exports.home = home;
module.exports.user = user;