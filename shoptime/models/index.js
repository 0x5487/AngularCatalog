/// <reference path="../../typings/node/node.d.ts" />
'use strict';
var express = require('express');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');

var Store = (function () {
    function Store(name, rootPath) {
        this._name = name;
        this._app = express();
        this._domainNames = [];
        this._defaultTheme = "simple";
        this._myStoragePath = path.join(rootPath, name);
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
            var fileLocation = path.join(_this._myStoragePath, 'pages/home.json');

            fs.readFile(fileLocation, 'utf8', function (err, data) {
                if (err)
                    throw err;
                var page = JSON.parse(data);

                if (page.template == "none") {
                    res.send(page.content);
                } else {
                    var templatePath = path.join(_this._myStoragePath, 'templates/' + page.template + ".ejs");

                    fs.readFile(templatePath, 'utf8', function (err1, data1) {
                        if (err1)
                            throw err1;
                        var template = JSON.parse(data1);

                        var dataJSON = { "name": page.name, "content": page.content };
                        var pageResult = ejs.render(template, dataJSON);
                        res.send(pageResult);
                    });
                }
            });
        });

        this._app.get('/admin', function (req, res) {
            res.render('index', { title: name });
        });

        this._app.get('/pages/:pageName', function (req, res) {
            var pageName = req.params.pageName;

            if (pageName != null && pageName.length > 0) {
                var fileLocation = path.join(_this._myStoragePath, 'pages/' + pageName + '.json');

                fs.readFile(fileLocation, 'utf8', function (err, data) {
                    if (err)
                        throw err;
                    var page = JSON.parse(data);

                    if (page.template == "none") {
                        res.send(page.content);
                    } else {
                        var templatePath = path.join(_this._myStoragePath, "themes/" + req.session.theme + '/templates/' + page.template + ".ejs");

                        fs.readFile(templatePath, 'utf8', function (err, template) {
                            if (err)
                                throw err;
                            var dataJSON = { "name": page.name, "content": page.content };
                            var pageResult = ejs.render(template, dataJSON);
                            res.send(pageResult);
                        });
                    }
                });
            }
        });

        this._app.use('/files', express.static(path.join(this._myStoragePath, 'files')));
    };
    return Store;
})();
exports.Store = Store;
//# sourceMappingURL=index.js.map
