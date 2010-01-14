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

miniLOL.module.create("themeswitcher", {
    version: "0.1",

    type: "passive",

    initialize: function () {
        miniLOL.resource.load(miniLOL.resources.config, this.root+"/resources/config.xml");

        var This = this;
        this.resource = {
            name: "themes",

            load: function (themes) {
                if (!this.res) {
                    this.res = [];
                } var res = this.res;

                new Ajax.Request(themes, {
                    method: "get",
                    asynchronous: false,

                    onSuccess: function (http) {
                        var dom = miniLOL.utils.fixDOM(http.responseXML);

                        var themes = dom.getElementsByTagName("theme");
                        for (var i = 0; i < themes.length; i++) {
                            res.push(themes[i].getAttribute("name"));
                        }
                    }
                }
            }
        }

        this.execute({ theme: new CookieJar().get("theme") });
    },

    execute: function (args) {
        args["theme"] = args["theme"] || miniLOL.config["themeswitcher"].defaultTheme;

        if (args["choose"]) {
            var jar = new CookieJar({ expires: 60 * 60 * 24 * 365 });
            jar.set("theme", args["theme"]);
        }
        else if (args["chooser"]) {
            
        }
        else {
            miniLOL.theme.load(args["theme"]);
        }
    }
});
