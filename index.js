/// <reference path="./typings/node/node.d.ts" />
'use strict';
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var shoptime = require('./shoptime/stores');
var cons = require('consolidate');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine("html", cons.dust);
app.set('template_engine', "dust");
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var storageRootPath = path.join(__dirname, 'storage');

var jason = new shoptime.Store("jason", storageRootPath);

var stores = new Array();
stores.push(jason);

app.all("*", function (req, res, next) {
    var host = req.host;
    var isFound = false;

    stores.forEach(function (store) {
        store.domainNames.forEach(function (domainName) {
            if (domainName == host && isFound == false) {
                isFound = true;
                return store.app(req, res, next);
            }
        });
    });

    if (isFound == false) {
        next();
    }
});

app.get('/account/add/:name', function (req, res) {
    var name = req.params.name;

    if (name != null) {
        var isFound = false;
        stores.forEach(function (store) {
            if (isFound == false && store.Name == name) {
                isFound = true;
            }
        });

        if (isFound == false) {
            var newStore = new shoptime.Store(name, storageRootPath);
            stores.push(newStore);
        }

        res.send("add " + name);
    } else {
        res.send("can't find the name");
    }
});

app.get('/', function (req, res) {
    res.send('Hello from main!');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//# sourceMappingURL=index.js.map
