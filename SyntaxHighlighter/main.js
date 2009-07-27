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
    version: '0.1.1',

    type: 'passive',

    onLoad: function () {
        Import(this.root+"/system/shCore.js");

        miniLOL.resource.load(miniLOL.resources.functions, this.root+"/resources/functions.xml");
        miniLOL.resource.load(miniLOL.resources.config,    this.root+"/resources/config.xml");

        SyntaxHighlighter.config["tagName"] = miniLOL.config['SyntaxHighlighter'].tagName;

        for (var conf in miniLOL.config['SyntaxHighlighter']) {
            SyntaxHighlighter.defaults[conf] = (miniLOL.config['SyntaxHighlighter'][conf][0] == '[' && confs[conf][confs[conf].length-1] == ']')
                ? eval(miniLOL.config.SyntaxHighlighter[conf].replace(/[^\d\[\],]/g, ''))
                : miniLOL.config.SyntaxHighlighter[conf];
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
                miniLOL.content.set("Something went wrong while loading langs.xml.");
            }
        });

        include("css", this.root+"/resources/styles/shCore.css");
        include("css", this.root+"/resources/styles/shTheme"+miniLOL.config.SyntaxHighlighter.style+".css");
    },

    onGo: function () {
        this.execute();
    },

    execute: function (args) {
        args         = args || {};
        var defaults = Object.extend({}, SyntaxHighlighter.defaults);

        for (var arg in args) {
            SyntaxHighlighter.defaults[arg] = (args[arg][0] == '[' && args[arg][args[arg].length-1] == ']')
                ? eval(args[arg].replace(/[^\d\[\],]/g, ''))
                : args[arg];
        }

        SyntaxHighlighter.defaults['brush'] = args['brush'] || args['lang'];

        SyntaxHighlighter.highlight();

        SyntaxHighlighter.defaults = defaults;
    },
});
