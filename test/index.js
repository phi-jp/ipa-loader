var ipaLoader = require('../');
var fs = require("fs");

ipaLoader.fromPath(__dirname + '/Preview.ipa', function(err, data) {
  if(err){
    throw err;
  }
  fs.writeFile('icon.png', data.icon, "binary", function(err) {
    // console.log(err); // writes out file without error, but it's not a valid image
  });
});
