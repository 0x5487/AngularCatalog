/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/q/Q.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/dustjs-linkedin/dustjs-linkedin.d.ts" />
'use strict';
var express = require('express');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var dust = require('dustjs-linkedin');
require('dustjs-helpers');

var Store = (function () {
    function Store(name, rootPath) {
        this._name = name;
        this._app = express();
        this._domainNames = [];
        this._defaultTheme = "simple";
        this._myStoragePath = path.join(rootPath, name);
        Store.MYNAME = this._myStoragePath;
        this.Init();
    }
    Object.defineProperty(Store.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Store.prototype, "defaultTheme", {
        get: function () {
            return this._defaultTheme;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Store.prototype, "domainNames", {
        get: function () {
            return this._domainNames;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Store.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });

    Store.prototype.createVariable = function (chunk, context, bodies, params) {
        var id = dust.helpers.tap(params.id, chunk, context);
        var value = dust.helpers.tap(params.valu, chunk, context);

        var data = {};
        data[id] = value;
        context[id] = value;

        //var ctx = context.push(data);
        return chunk.render(bodies.block, context);
    };

    Store.prototype.getCollections = function (chunk, context, bodies, params) {
        var dataName = "collections";
        var fileLocation = path.join(Store.MYNAME, 'data/' + dataName + '.json');
        var id = dust.helpers.tap(params.id, chunk, context);
        var find = dust.helpers.tap(params.find, chunk, context);

        if (find) {
        } else {
            return chunk.map(function (chunk) {
                fs.readFile(fileLocation, 'utf8', function (err, data) {
                    if (err)
                        throw err;

                    var jsonData = {};
                    jsonData[id] = JSON.parse(data);
                    return chunk.render(bodies.block, context.push(jsonData)).end();
                });
            });
        }
    };

    Store.prototype.sendPage = function (req, res, theme, pageName) {
        var _this = this;
        if (pageName != null && pageName.length > 0) {
            var fileLocation = path.join(this._myStoragePath, 'pages/' + pageName + '.json');

            fs.readFile(fileLocation, 'utf8', function (err, data) {
                if (err)
                    throw err;
                var page = JSON.parse(data);

                var templatePath = path.join(_this._myStoragePath, "themes/" + theme + '/templates/' + page.template + ".html");

                fs.readFile(templatePath, 'utf8', function (err, template) {
                    if (err)
                        throw err;

                    var base = dust.makeBase({
                        key: "mykey"
                    });

                    dust.isDebug = true;
                    var compiled = dust.compile(template, pageName);
                    dust.loadSource(compiled);
                    var dataJSON = { "title": page.title, "content": page.content };
                    dust.helpers.collections = _this.getCollections;
                    dust.helpers.vari = _this.createVariable;

                    dust.render(pageName, base.push(dataJSON), function (err, out) {
                        res.send(out);
                    });
                    //res.send(pageResult);
                });
            });
        }
    };

    Store.prototype.Init = function () {
        var _this = this;
        this._domainNames.push(this._name + ".mystore.com");
        this._app.set('views', path.join(__dirname, '../../views'));
        this._app.set('view engine', 'ejs');
        this._app.use(express.cookieParser());
        this._app.use(express.session({ secret: '1234567890QWERTY' }));

        this._app.get("*", function (req, res, next) {
            var theme = req.query.theme;
            var sess = req.session;
            if (theme != null && theme.length > 0) {
                sess.theme = theme;
            } else {
                if (sess.theme == null) {
                    sess.theme = _this.defaultTheme;
                }
            }

            next();
        });

        this._app.use('/public', function (req, res, next) {
            var handler = express.static(path.join(_this._myStoragePath, 'themes/' + req.session.theme + '/public'));
            handler(req, res, next);
        });

        this._app.get('/', function (req, res) {
            var theme = req.session.theme;
            _this.sendPage(req, res, theme, "home");
        });

        this._app.get('/admin', function (req, res) {
            res.render('index', { title: name });
        });

        this._app.get('/admin/main', function (req, res) {
            res.render('main');
        });

        this._app.get('/pages/:pageName', function (req, res) {
            var pageName = req.params.pageName;
            var theme = req.session.theme;
            _this.sendPage(req, res, theme, pageName);
        });

        this._app.use('/files', express.static(path.join(this._myStoragePath, 'files')));
    };
    Store.MYNAME = "Jason";
    return Store;
})();
exports.Store = Store;
//# sourceMappingURL=stores.js.map
