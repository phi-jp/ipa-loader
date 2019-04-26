
var fs = require('fs');
var yauzl = require('yauzl')
var collect = require('collect-stream');
var plistParse = require('simple-plist').parse;

module.exports = {
  _load: function(zip, callback) {
    var data = {};
    zip.on('entry', function(entry) {
      // console.log(entry.fileName);
      
      if (/Payload\/[^\/]*\/Info.plist$/.test(entry.fileName)) {
        zip.openReadStream(entry, function(err, stream){
          collect(stream, function(err, src){
            var metadata = plistParse(src);
            data.metadata = metadata;
          });
        });
      }
      else if (/^Payload\/[^\/]*\/AppIcon60x60@3x.png$/.test(entry.fileName)) {
        zip.openReadStream(entry, function(err, stream){
          collect(stream, function(err, src){
            data.icon = src;
          });
        });
      }
    });

    zip.on('end', function() {
      callback(null, data);
    });
  },
  fromBuffer: function(buffer, callback) {
    var self = this;
    yauzl.fromBuffer(buffer, function(error, zip) {
      self._load(zip, callback);
    });
  },
  fromFd: function(fd, callback) {
    var self = this;
    yauzl.fromFd(fd, function(error, zip) {
      self._load(zip, callback);
    });
  },
  fromPath: function(path, callback) {
    var fd = fs.openSync(path, 'r');
    this.fromFd(fd, callback);
  },
};
