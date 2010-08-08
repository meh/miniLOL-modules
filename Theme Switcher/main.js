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
        miniLOL.resource.get("miniLOL.config").load(this.root+"/resources/config.xml");
        miniLOL.resource.get("miniLOL.functions").load(this.root+"/resources/functions.xml");

        this.Themes = miniLOL.utils.execute(this.root+"/system/Themes.min.js");
        this.themes = new this.Themes;

        this.Template = miniLOL.utils.execute(this.root+"/system/Template.min.js");
        this.template = new this.Template(this.root);

        if (!this.themes.load(this.root+"/resources/themes.xml")) {
            return false;
        }

        var theme = new CookieJar().get("theme");
        if (!this.themes.exists(theme)) {
            this.theme = miniLOL.config["Theme Switcher"].defaultTheme;
        }
        else {
            this.theme = theme;
        }

        Event.observe(document, ":module.loaded", function (event) {
            if (event.memo == "Theme Switcher") {
                var query = location.href.parseQuery();

                if (query.type != "theme") {
                    miniLOL.module.execute("Theme Switcher", { theme: miniLOL.module.get("Theme Switcher").theme });
                }
                else {
                    miniLOL.module.execute("Theme Switcher", { theme: query.theme });
                }
            }
        })
    },

    execute: function (args) {
        args["theme"] = args["theme"] || this.theme;

        if (args["choose"]) {
            this.theme = args["theme"];

            new CookieJar({ expires: 60 * 60 * 24 * 365 }).set("theme", args["theme"]);

            if (args["apply"]) {
                this.execute({ theme: args["theme"] });
            }
        }
        else if (args["chooser"]) {
            miniLOL.content.set(this.template.apply("global", this.themes.toArray()));
        }
        else {
            miniLOL.theme.load(args["theme"], true);
        }
    }
});
