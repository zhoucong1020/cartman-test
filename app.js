var express = require('express');
var querystring = require('querystring');
var http = require('http');
var bodyParser = require('body-parser');
var is   = require('type-is');
var iconv = require('iconv-lite');

var app = express();

var proxyServer = "localhost";
var proxyDomain = "";
var proxyServerPort = 8080;

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('etag');
app.use(express.static(__dirname + '/public'));


var fs = require("fs")
app.use("/cartman_test_file",function(req,res){
    var testFiles = fs.readdirSync(__dirname+"/public/test");
    testFiles = testFiles.filter(function(ele){
        return ".js" == ele.substr(ele.length-3,3);
    })
    res.send(testFiles);
})

app.use(function (req, res) {
    if(req.url == "/favicon.ico"){
        return;
    }

    var method = req.method.toUpperCase();
    console.log(new Date().getTime()+ "    " +method + "    "+req.url +" request start");
    if (req.method.toUpperCase() == "GET") {
        getProxy(req,res);
    } else if (req.method.toUpperCase() == "POST") {
        postProxy(req,res);
    }
})
function getProxy(req, res) {
    var proxyPath = req.url;
    var data = querystring.stringify(req.query);

    var opt = {
        method: "GET",
        host: proxyServer,
        port: proxyServerPort,
        path: proxyDomain + proxyPath,
        headers: {
            "Content-Type": 'text/plain',
            "X-Real-IP": req.ip
        }
    };
    proxy(req,res,opt,data);
}
function getJsonParam(body) {
    var str = "";
    for(var key in body){
        if(str == ""){
            str += key+"="+JSON.stringify(body[key]);
        }else{
            str += "&"+key+"="+JSON.stringify(body[key]);
        }
    }
    return str;
}
function postProxy(req, res) {
    var proxyPath = req.url;
    if(is(req,['json'])){
       var data =getJsonParam(req.body);
    }else{
        var data = require("querystring").stringify(req.body);
    }
    data = iconv.encode(data,"UTF-8");
    console.log(data.length + "  "+data) ;
    var opt = {
        method: "POST",
        host: proxyServer,
        port: proxyServerPort,
        path: proxyDomain + proxyPath,
        headers: {
            'Accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Content-Length': data.length,
            'X-MicrosoftAjax': 'Delta=true'
        },
        secureProtocol: 'SSLv3_method'
    };
    proxy(req,res,opt,data,true);
}

function proxy(req,res,opt,data,isPost){
    var req_proxy = http.request(opt, function (serverFeedback) {
        var body = "";
        serverFeedback.on('data', function (data) {
            body += data;
        })
            .on('end', function () {
                console.log(new Date().getTime()+ "    " +req.method + "    "+req.url +" request finish");
                res.set('Pragma', 'no-cache');
                res.set('Cache-Control', 'no-cache');
                res.set('Expires', '0');
                res.set('Content-Type', 'application/json');
                res.status(serverFeedback.statusCode).send(body);
            })
    }).on('error',function(data){
        console.log(new Date().getTime()+ "    " +req.method + "    "+req.url +" request finish");
        res.status(400).send(data);
    });
    if(isPost){
        req_proxy.write(data +"\n");
    }
    req_proxy.end();
}
var server = app.listen(3000, function() {
    console.log('Express server listening on port ' + server.address().port);
});
