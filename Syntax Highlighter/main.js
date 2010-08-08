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
    version: "0.3",

    type: "passive",

    aliases: ["SyntaxHighlighter"],

    initialize: function () {
        if (Object.isUndefined(window.XRegExp)) {
            miniLOL.utils.require(this.root+"/system/xregexp.min.js");
        }

        miniLOL.utils.require(this.root+"/system/shCore.min.js");

        miniLOL.resource.get("miniLOL.functions").load(this.root+"/resources/functions.xml");
        miniLOL.resource.get("miniLOL.config").load(this.root+"/resources/config.xml");

        SyntaxHighlighter.config["tagName"] = miniLOL.config["Syntax Highlighter"].tagName;
        SyntaxHighlighter.config["toolbar"] = false;

        for (var conf in miniLOL.config["Syntax Highlighter"]) {
            SyntaxHighlighter.defaults[conf] = (miniLOL.config["Syntax Highlighter"][conf][0] == '[' && confs[conf][confs[conf].length-1] == ']')
                ? eval(miniLOL.config["Syntax Highlighter"][conf].replace(/[^\d\[\],]/g, ''))
                : miniLOL.config["Syntax Highlighter"][conf];
        }

        this.loaded    = {};
        this.languages = {}
        this.aliases   = {};

        new Ajax.Request(this.root+"/resources/languages.xml", {
            method: "get",
            asynchronous: false,

            onSuccess: function (http) {
                $A(http.responseXML.getElementsByTagName("language")).each(function (language) {
                    var file             = language.getAttribute("file");
                    this.languages[file] = language.getAttribute("aliases");

                    this.languages[file].split(/ /).each(function (split) {
                        this.aliases[split] = file;
                    }, this);
                }, this);
            }.bind(this),

            onFailure: function () {
                miniLOL.content.set("Something went wrong while loading languages.xml.");
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
            if (miniLOL.utils.include(this.root+"/resources/languages/shBrush"+name+".min.js")) {
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
            else {
                $$(SyntaxHighlighter.config["tagName"]).each(function (tag) {
                    var alias = ((tag.getAttribute("class") || "").match(/brush:\s*(.*?)(;|$)/) || [])[1];

                    if (alias && this.aliases[alias] == name) {
                        tag.setAttribute("class", tag.getAttribute("class").replace(/brush:.*(;|$)/, ''));

                        tag.update("Could not load the brush.");
                    }
                }, this);
            }
        }
    },

    loadTagFiles: function () {
        $$(SyntaxHighlighter.config["tagName"]).each(function (tag) {
            var alias = ((tag.getAttribute("class") || "").match(/brush:\s*(.*?)(;|$)/) || [])[1];

            if (alias) {
                this.loadFile(this.aliases[alias]);
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
