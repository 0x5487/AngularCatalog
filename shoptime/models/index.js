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
    Store.prototype.Init = function () {
        this._domainNames.push(this._name + ".mystore.com");

        this._app.get('/', function (req, res) {
            var name = this._name;
            res.send('Hello' + this._name);
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
