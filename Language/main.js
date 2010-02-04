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

(function () {

miniLOL.module.create("Language", {
    version: "0.1",

    type: "active",

    aliases: ["lang"],

    initialize: function () {
        this.Languages = miniLOL.utils.require(this.root+"/system/Languages.js");
        this._languages = new this.Languages(this.root, "/resources/languages.xml");

        this._languages.pages.load("/resources/pages");
        this._languages.menus.load("/resources/menus");

        this._languages.set(new CookieJar().get("language") || miniLOL.config["Language"].defaultLanguage);

        this.Template = miniLOL.utils.require(this.root+"/system/Template.js");
        this._template = new this.Template(this.root);
    },

    execute: function (args) {
        if (args["page"]) {
            if (args["external"]) {
                miniLOL.content.set(this._languages.page(args["page"], true));
            }
            else {
                miniLOL.content.set(this._languages.page(args["page"]));
            }
        }
        else if (args["choose"]) {
            new CookieJar({ expires: 60 * 60 * 24 * 365 }).set("language", args["lang"]);

            if (args["apply"]) {
                this.execute();
            }
        }
        else if (args["chooser"]) {
            miniLOL.content.set(this._template.apply("global", this._languages.toArray());
        }
        else {
            miniLOL.menu.change(miniLOL.menu.current);
            miniLOL.go(location.href);
        }

        return true;
    }
});

})();
