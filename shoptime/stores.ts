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


export class Store {

    private _app;
    private _name:string;
    private _domainNames:string[];
    private _defaultTheme:string;
    private _myStoragePath:string;

    constructor(name:string, rootPath:string) {
        this._name = name;
        this._app = express();
        this._domainNames = [];
        this._defaultTheme = "simple";
        this._myStoragePath = path.join(rootPath, name);
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

    public sendPage(req, res, theme:string, pageName:string ) {

        if(pageName != null && pageName.length > 0){

            var fileLocation:string = path.join(this._myStoragePath, 'pages/' + pageName + '.json');

            fs.readFile(fileLocation, 'utf8',  (err, data) => {
                if (err) throw err;
                var page = JSON.parse(data);

                var templatePath:string = path.join(this._myStoragePath, "themes/" + theme + '/templates/' + page.template + ".html");

                fs.readFile(templatePath, 'utf8', (err, template) => {
                    if (err) throw err;
                    var compiled = dust.compile(template, pageName);
                    dust.loadSource(compiled);
                    var dataJSON = { "title": page.title, "content": page.content};
                    //var pageResult = ejs.render(template, dataJSON);

                    dust.render(pageName, dataJSON, function(err, out) {
                        res.send(out);
                    });

                    //res.send(pageResult);
                });
            });
        }
    }


    private Init():void {

        this._domainNames.push(this._name + ".mystore.com");
        this._app.set('views', path.join(__dirname, '../../views'));
        this._app.set('view engine', 'ejs');
        this._app.use(express.cookieParser());
        this._app.use(express.session({secret: '1234567890QWERTY'}));

        this._app.get("*", (req, res, next)=>{

            var theme = req.query.theme;
            var sess = req.session;
            if(theme != null && theme.length > 0){
                sess.theme = theme;

            }else{
                if(sess.theme == null){
                    sess.theme = this.defaultTheme;
                }
            }

            next();
        });

        this._app.use('/public', (req, res, next) =>{
            var handler = express.static(path.join(this._myStoragePath, 'themes/'+ req.session.theme + '/public'))
            handler(req, res, next);
        });

        this._app.get('/', (req, res) =>{
            var theme = req.session.theme;
            this.sendPage(req, res, theme, "home");
        });

        this._app.get('/admin', (req, res) =>{
            res.render('index', { title: name });
        });

        this._app.get('/admin/main', (req, res) =>{
            res.render('main');
        });

        this._app.get('/pages/:pageName', (req, res)=>{
            var pageName = req.params.pageName;
            var theme = req.session.theme;
            this.sendPage(req, res, theme, pageName);
        });

        this._app.use('/files', express.static(path.join(this._myStoragePath, 'files')));
    }
}






