/// <reference path="../../typed/node/node.d.ts" />
'use strict';
var express = require('express');
var path = require('path');

var Store = (function () {
    function Store(name) {
        this._name = name;
        this._app = express();
        this._domainNames = [];
        this.Init();
    }
    Object.defineProperty(Store.prototype, "Name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });

    Store.prototype.Init = function () {
        this._domainNames.push(this._name + ".mystore.com");
        var name = this._name;

        this._app.set('views', path.join(__dirname, '../../views'));
        this._app.set('view engine', 'ejs');
        this._app.use(express.static(path.join(__dirname, 'public')));
        this._app.get('/', function (req, res) {
            res.render('index', { title: name });
        });
    };

    Object.defineProperty(Store.prototype, "DomainNames", {
        get: function () {
            return this._domainNames;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Store.prototype, "App", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    return Store;
})();
exports.Store = Store;
//# sourceMappingURL=index.js.map
