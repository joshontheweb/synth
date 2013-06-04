var http = require('http'),
    fs = require('fs')
    mime = require('mime');

var server = http.createServer(function(req, res) {
  // send all urls to render index
  var path = 'index.html';

  // make exception for static assets
  if (req.url.match(/^\/media/)) {
    path = req.url;
  }

  var absPath = __dirname + '/' + path;
  var mimeType = mime.lookup(absPath);

  // load file
  fs.readFile(absPath, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    } else {
      res.setHeader('Content-Type', mimeType);
      res.writeHead(200);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(8000);
console.log('Listening on port: 8000');

