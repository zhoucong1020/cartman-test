var express = require('express');
var querystring = require('querystring');
var http = require('http');
var app = express();

var proxyServer = "localhost";
var proxyServerPort = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/proxy', function(req, res) {
  var proxyPath = req.query.proxypath;
  var data = querystring.stringify(req.query);

  var opt = {
    method: "GET",
    host: "localhost",
    port: proxyServerPort,
    path: proxyPath + "?" + data,
    headers: {
      "Content-Type": 'text/plain',
      "Content-Length": 0
    }
  };

  var req = http.request(opt, function(serverFeedback) {
    var body = "";
    serverFeedback.on('data', function(data) {
        body += data;
      })
      .on('end', function() {
        res.status(serverFeedback.statusCode).send(body);
      });
  });
  req.end();
});

app.post('/proxy', function(req, res) {
  var proxyPath = req.query.proxypath;

  var opt = {
    method: "POST",
    host: proxyServer,
    port: proxyServerPort,
    path: proxyPath,
    headers: {
      "Content-Type": 'text/plain',
      "Content-Length": data.length
    }
  };

  var req = http.request(opt, function(serverFeedback) {
    var body = "";
    serverFeedback.on('data', function(data) {
        body += data;
      })
      .on('end', function() {
        res.status(serverFeedback.statusCode).send(body);
      });
  });
  req.write(req.body);
  req.end();
});

app.all('/login', function(req, res) {
  if (req.query.username == "admin" && req.query.password == "admin") {
    res.status(200).send({id: "001"});
  } else {
    res.status(401).send();
  }
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
