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

miniLOL.module.create("Syntax Highlighter", {
    version: "0.2.5",

    type: "passive",

    aliases: ["SyntaxHighlighter"],

    initialize: function () {
        miniLOL.utils.require(this.root+"/system/shCore.js");

        miniLOL.resources.functions.load(this.root+"/resources/functions.xml");
        miniLOL.resources.config.load(this.root+"/resources/config.xml");

        SyntaxHighlighter.config["tagName"] = miniLOL.config["Syntax Highlighter"].tagName;

        for (var conf in miniLOL.config["Syntax Highlighter"]) {
            SyntaxHighlighter.defaults[conf] = (miniLOL.config["Syntax Highlighter"][conf][0] == '[' && confs[conf][confs[conf].length-1] == ']')
                ? eval(miniLOL.config["Syntax Highlighter"][conf].replace(/[^\d\[\],]/g, ''))
                : miniLOL.config["Syntax Highlighter"][conf];
        }

        this.loaded    = {};
        this.languages = {}
        this.aliases   = {};

        var This = this;
        new Ajax.Request(this.root+"/resources/langs.xml", {
            method: "get",
            asynchronous: false,

            onSuccess: function (http) {
                $A(http.responseXML.getElementsByTagName("language")).each(function (language) {
                    var file             = language.getAttribute("file");
                    This.languages[file] = language.getAttribute("aliases");
            
                    if (This.languages[file]) {
                        This.languages[file].split(/ /).each(function (split) {
                            This.aliases[split] = file;
                        });
                    }
                });
            },

            onFailure: function () {
                miniLOL.content.set("Something went wrong while loading langs.xml.");
            }
        });

        miniLOL.theme.style.load("shCore", this.root+"/resources/styles");

        if (miniLOL.config["Syntax Highlighter"].style) {
            miniLOL.theme.style.unload("Syntax Highlighter/style");
            miniLOL.theme.style.load("shTheme"+miniLOL.config["Syntax Highlighter"].style, this.root+"/resources/styles");
        }

        Event.observe(document, ":go", function () {
            miniLOL.module.execute("Syntax Highlighter");
        });
    },

    loadFile: function (name) {
        if (name && !this.loaded[name]) {
            if (miniLOL.utils.include(this.root+"/resources/langs/shBrush"+name+".js")) {
                this.loaded[name] = true;

                SyntaxHighlighter.vars.discoveredBrushes = {};
                for (var brush in SyntaxHighlighter.brushes) {
                    var aliases = SyntaxHighlighter.brushes[brush].aliases;
                    
                    if (!aliases) {
                        continue;
                    }
                    
                    aliases.each(function (alias) {
                        SyntaxHighlighter.vars.discoveredBrushes[alias] = brush;
                    });
                }
            }
        }
    },

    loadTagFiles: function () {
        $$(SyntaxHighlighter.config["tagName"]).each(function (tag) {
            var alias = tag.getAttribute("class");

            if (alias && (alias = alias.match(/brush:\s*(.*?)(;|$)/))) {
                this.loadFile(this.aliases[alias[1]]);
            }
        }, this);
    },

    execute: function (args) {
        if ($$('.syntaxhighlighter').length) {
            return;
        }
 
        args = args || {};

        var defaults = Object.extend({}, SyntaxHighlighter.defaults);

        for (var arg in args) {
            SyntaxHighlighter.defaults[arg] = (args[arg][0] == '[' && args[arg][args[arg].length-1] == ']')
                ? eval(args[arg].replace(/[^\d\[\],]/g, ''))
                : args[arg];
        }

        if (args["lang"]) {
            SyntaxHighlighter.defaults["brush"] = args["lang"];
            this.loadFile(this.aliases[args["lang"]]);
        }

        this.loadTagFiles();

        SyntaxHighlighter.highlight();

        SyntaxHighlighter.defaults = defaults;
    }
});
