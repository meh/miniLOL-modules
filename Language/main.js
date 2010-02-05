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

miniLOL.module.create("Language", {
    version: "0.1",

    type: "passive",

    initialize: function () {
        miniLOL.resources.config.load(this.root+"/resources/config.xml");

        this.Languages  = miniLOL.utils.require(this.root+"/system/Languages.js");
        this._languages = new this.Languages(this.root, "/resources/languages.xml");

        this.Template = miniLOL.utils.require(this.root+"/system/Template.js");
        this._template = new this.Template(this.root);

        this._languages.set(new CookieJar().get("language") || miniLOL.config["Language"].defaultLanguage);
    },

    execute: function (args) {
        if (args["choose"]) {
            this._languages.set(args["lang"], Boolean(args["apply"]));
        }
        else if (args["chooser"]) {
            miniLOL.content.set(this._template.apply("global", this._languages.toArray()));
        }
        else {
            this._languages.apply();
        }

        return true;
    }
});
