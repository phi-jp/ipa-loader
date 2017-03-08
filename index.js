
var fs = require('fs');
var yauzl = require('yauzl')
var collect = require('collect-stream');
var bplistParse = require('bplist-parser').parseBuffer;

module.exports = {
  _load: function(zip, callback) {
    var data = {};
    zip.on('entry', function(entry) {
      if (!/Payload\/[^\/]*\/Info.plist$/.test(entry.fileName)) return ;

      zip.openReadStream(entry, function(err, stream){
        collect(stream, function(err, src){
          var metadata = bplistParse(src)[0];
          data.metadata = metadata;
        });
      });
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
