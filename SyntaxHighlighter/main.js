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
    version: '0.2.1',

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

        var sh     = this;
        sh.loaded  = new Object;
        sh.langs   = new Object;
        sh.aliases = new Object;

        new Ajax.Request(this.root+"/resources/langs.xml", {
            method: 'get',
            asynchronous: false,

            onSuccess: function (http) {
                var langs = http.responseXML.getElementsByTagName("language");

                for (var i = 0; i < langs.length; i++) {
                    sh.langs[langs[i].getAttribute("file")] = langs[i].getAttribute("aliases");
            
                    var split = langs[i].getAttribute("aliases").split(/ /);
                    for (var h = 0; h < split.length; h++) {
                        sh.aliases[split[h]] = langs[i].getAttribute("file");
                    }
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

    loadFile: function (name) {
        if (name && !this.loaded[name]) {
            if (Import(this.root+"/resources/langs/shBrush"+name+".js")) {
                this.loaded[name] = true;

                SyntaxHighlighter.vars.discoveredBrushes = new Object;
				for (var brush in SyntaxHighlighter.brushes) 
				{
					var aliases = SyntaxHighlighter.brushes[brush].aliases;
					
					if (aliases == null) {
						continue;
                    }
					
					for (var i = 0; i < aliases.length; i++) {
						SyntaxHighlighter.vars.discoveredBrushes[aliases[i]] = brush;
                    }
				}
            }
        }
    },

    loadTagFiles: function () {
        if ($$('.syntaxhighlighter').length) {
            return;
        }

        var tags = $$(SyntaxHighlighter.config["tagName"]);
        for (var i = 0; i < tags.length; i++) {
            var alias = tags[i].getAttribute("class").match(/brush:\s*(.*?)(;|$)/);

            if (alias) {
                this.loadFile(this.aliases[alias[1]]);
            }
        }
    },

    execute: function (args) {
        args         = args || {};
        var defaults = Object.extend({}, SyntaxHighlighter.defaults);

        for (var arg in args) {
            SyntaxHighlighter.defaults[arg] = (args[arg][0] == '[' && args[arg][args[arg].length-1] == ']')
                ? eval(args[arg].replace(/[^\d\[\],]/g, ''))
                : args[arg];
        }

        SyntaxHighlighter.defaults['brush'] = args['lang'];
        if (args['lang']) {
            this.loadFile(this.aliases[args['lang']]);
        }
        this.loadTagFiles();

        SyntaxHighlighter.highlight();

        SyntaxHighlighter.defaults = defaults;
    },
});
