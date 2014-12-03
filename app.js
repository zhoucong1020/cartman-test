var express = require('express');
var querystring = require('querystring');
var http = require('http');
var bodyParser    = require('body-parser');
var app = express();

var proxyServer = "172.16.0.40";
var proxyDomain = "/winsion-afc-v2.1";
var proxyServerPort = 80;

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('etag');
app.use(express.static(__dirname + '/public'));

app.get('/proxy', function(req, res) {
  var proxyPath = req.query.proxypath;
  var data = querystring.stringify(req.query);

  var opt = {
    method: "GET",
    host: proxyServer,
    port: proxyServerPort,
    path: proxyDomain + proxyPath + "?" + data,
    headers: {
      "Content-Type": 'text/plain',
      "X-Real-IP": req.ip
    }
  };

  var req_proxy = http.request(opt, function(serverFeedback) {
    var body = "";
    serverFeedback.on('data', function(data) {
        body += data;
      })
      .on('end', function() {
        res.set('Pragma', 'no-cache');
        res.set('Cache-Control', 'no-cache');
        res.set('Expires', '0');
        res.set('Content-Type', 'application/json');
        res.status(serverFeedback.statusCode).send(body);
      });
  });
  req_proxy.end();
});

app.post('/proxy', function(req, res) {
  var proxyPath = req.query.proxypath;
  var data = querystring.stringify(req.body);

  var opt = {
    method: "POST",
    host: proxyServer,
    port: proxyServerPort,
    path: proxyDomain + proxyPath + "?" + data,
    headers: {
      "Content-Type": 'text/plain',
      "X-Real-IP": req.ip
    }
  };

  var req_proxy = http.request(opt, function(serverFeedback) {
    var body = "";
    serverFeedback.on('data', function(data) {
        body += data;
      })
      .on('end', function() {
        res.set('Pragma', 'no-cache');
        res.set('Cache-Control', 'no-cache');
        res.set('Expires', '0');
        res.set('Content-Type', 'application/json');
        res.status(serverFeedback.statusCode).send(body);
      });
  });
  req_proxy.end();
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
