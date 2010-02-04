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

miniLOL.module.create("Theme Switcher", {
    version: "0.2.3",

    type: "passive",

    aliases: ["ThemeSwitcher"],

    initialize: function () {
        miniLOL.resources.config.load(this.root+"/resources/config.xml");
        miniLOL.resources.functions.load(this.root+"/resources/functions.xml");

        this.Themes = miniLOL.utils.require(this.root+"/system/Themes.js");
        this._themes = new this.Themes;

        this.Template = miniLOL.utils.require(this.root+"/system/Template.js");
        this._template = new this.Template(this.root);

        if (!this._themes.load(this.root+"/resources/themes.xml")) {
            return false;
        }

        var theme = new CookieJar().get("theme");
        if (!this._themes.exists(theme)) {
            this._theme = miniLOL.config["Theme Switcher"].defaultTheme;
        }
        else {
            this._theme = theme;
        }

        Event.observe(document, ":module.loaded", function (event) {
            if (event.memo == "Theme Switcher" && location.href.parseQuery().type != "theme") {
                miniLOL.module.execute("Theme Switcher", { theme: miniLOL.module.get("Theme Switcher").theme });
            }
        })
    },

    execute: function (args) {
        args["theme"] = args["theme"] || this._theme;

        if (args["choose"]) {
            this._theme = args["theme"];

            new CookieJar({ expires: 60 * 60 * 24 * 365 }).set("theme", args["theme"]);
        }
        else if (args["chooser"]) {
            miniLOL.content.set(this._template.apply("global", this._themes.toArray()));
        }
        else {
            miniLOL.theme.load(args["theme"], true);
        }
    }
});
