var ipaLoader = require('../');

ipaLoader.fromPath(__dirname + '/Preview.ipa', function(err, data) {
  if(err){
    throw err;
  }
  console.log(data.metadata.CFBundleIdentifier);
});
