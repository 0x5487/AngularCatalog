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

    get Name():string{
        return this._name;
    }

    private Init():void {

        this._domainNames.push(this._name + ".mystore.com");
        var name = this._name;

        this._app.set('views', path.join(__dirname, '../../views'));
        this._app.set('view engine', 'ejs');
        this._app.use(express.static(path.join(__dirname, 'public')));
        this._app.get('/', (req, res) =>{
            res.render('index', { title: name });
        });
    }

    get DomainNames() : string[] {
        return this._domainNames;
    }

    get App(): any {
        return this._app;
    }
}






