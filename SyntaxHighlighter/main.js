/*********************************************************************
*           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE              *
*                   Version 2, December 2004                         *
*                                                                    *
*  Copyleft meh.                                                     *
*                                                                    *
*           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE              *
*  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION   *
*                                                                    *
*  0. You just DO WHAT THE FUCK YOU WANT TO.                         *
*********************************************************************/

miniLOL.module.create('SyntaxHighlighter', {
    version: '0.1',

    onLoad: function () {
        miniLOL.resource.load(miniLOL.resource.functions, this.root+"/resources/functions.xml");
        miniLOL.resource.load(miniLOL.resource.config,    this.root+"/resources/config.xml");

        for (var conf in miniLOL.config.SyntaxHighlighter) {
            SyntaxHighlighter.defaults[arg] = (args[arg][0] == '[' && args[arg][args[arg].length-1] == ']')
                ? eval(args[arg])
                : args[arg];
        }

        var sh   = this;
        sh.langs = new Array;

        new Ajax.Request(this.root+"/resources/langs.xml", {
            method: 'get',
            asynchronous: false,

            onSuccess: function (http) {
                var langs = http.responseXML.getElementsByTagName("language");

                for (var i = 0; i < langs.length; i++) {
                    sh.langs.push(langs[i].firstChild.nodeValue);
                    Import(sh.root+"/resources/langs/shBrush"+langs[i].firstChild.nodeValue+".js");
                }
            },

            onFailure: function () {
                $(miniLOL.config.contentNode).innerHTML = "Something went wrong while loading langs.xml.";
            }
        });

        include("css", this.root+"/resources/styles/shCore.css");
        include("css", this.root+"/resources/styles/"+miniLOL.config.SyntaxHighlighter.style);
    },

    execute: function (args) {
        for (var arg in args) {
            SyntaxHighlighter.defaults[arg] = (args[arg][0] == '[' && args[arg][args[arg].length-1] == ']')
                ? eval(args[arg])
                : args[arg];
        }

        SyntaxHighlighter.all();
    },
});
