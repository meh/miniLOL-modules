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
        this.languages = new this.Languages(this.root, "/resources/languages.xml");

        this.languages.pages.load("/resources/pages");
        this.languages.menus.load("/resources/menus");
    },

    execute: function (args) {
        if (args["page"]) {
            if (args["external"]) {
                miniLOL.content.set(this.pages.external(args["page"]));
            }
            else {
                miniLOL.content.set(this.pages.get(args["page"]));
            }
        }

        return true;
    }
});

})();
