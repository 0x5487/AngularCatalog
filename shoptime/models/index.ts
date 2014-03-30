/// <reference path="../../typed/node/node.d.ts" />

'use strict';
var express = require('express');
var path = require('path');


export class Store {

    private _app;
    private _name:string;
    private _domainNames:string[];

    constructor(name:string) {
        this._name = name;
        this._app = express();
        this._domainNames = [];
        this.Init();
    }

    private Init():void {

        this._domainNames.push(this._name + ".mystore.com");


        this._app.get('/', function(req, res){
            var name = this._name;
            res.send('Hello' + this._name);
        });
    }

    get DomainNames() : string[] {
        return this._domainNames;
    }

    get App(): any {
        return this._app;
    }
}






