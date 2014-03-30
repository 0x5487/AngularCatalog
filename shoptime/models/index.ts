/// <reference path="../../typings/node/node.d.ts" />

'use strict';
var express = require('express');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');


export class Store {

    private _app;
    private _name:string;
    private _domainNames:string[];
    private _defaultTheme:string;
    private _myStoragePath:string;

    constructor(name:string) {
        this._name = name;
        this._app = express();
        this._domainNames = [];
        this._defaultTheme = "simple";
        this._myStoragePath = "D:/OpenSource/AngularCatalog/storage/jason/";
        this.Init();
    }


    get name():string{
        return this._name;
    }

    get defaultTheme():string {
        return this._defaultTheme;
    }

    get domainNames() : string[] {
        return this._domainNames;
    }

    get app(): any {
        return this._app;
    }

    private Init():void {

        this._domainNames.push(this._name + ".mystore.com");
        var name = this._name;

        this._app.set('views', path.join(__dirname, '../../views'));
        this._app.set('view engine', 'ejs');
        this._app.use('/public', express.static(path.join(this._myStoragePath, 'themes/'+ this._defaultTheme + '/public')));

        this._app.get('/', (req, res) =>{

            var fileLocation:string = path.join(this._myStoragePath, 'pages/home.json');

            fs.readFile(fileLocation, 'utf8', (err, data) =>{
                if (err) throw err;
                var page = JSON.parse(data);

                if(page.template == "none"){
                    res.send(page.content);
                }else {

                    var templatePath:string = path.join(this._myStoragePath, 'templates/' + page.template + ".ejs");

                    fs.readFile(templatePath, 'utf8', (err1, data1)=> {
                        if (err1) throw err1;
                        var template = JSON.parse(data1);

                        var dataJSON = { "name": page.name, "content": page.content};
                        var pageResult = ejs.render(template, dataJSON);
                        res.send(pageResult);
                    });

                }
            });
        });

        this._app.get('/admin', (req, res) =>{
            res.render('index', { title: name });
        });


        this._app.get('/pages/:pageName', (req, res)=>{

            var pageName = req.params.pageName;

            if(pageName != null && pageName.length > 0){

                var fileLocation:string = path.join(this._myStoragePath, 'pages/' + pageName + '.json');

                fs.readFile(fileLocation, 'utf8',  (err, data) => {
                    if (err) throw err;
                    var page = JSON.parse(data);

                    if(page.template == "none"){
                        res.send(page.content);
                    }else {

                        var templatePath:string = path.join(this._myStoragePath, "themes/" + this._defaultTheme + '/templates/' + page.template + ".ejs");

                        fs.readFile(templatePath, 'utf8', (err, template) => {
                            if (err) throw err;
                            var dataJSON = { "name": page.name, "content": page.content};
                            var pageResult = ejs.render(template, dataJSON);
                            res.send(pageResult);
                        });

                    }
                });
            }

        });
    }
}






