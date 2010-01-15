/*********************************************************************
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             *
 *                   Version 2, December 2004                        *
 *                                                                   *
 *  Copyleft meh.                                                    *
 *                                                                   *
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             *
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION  *
 *                                                                   *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.                        *
 *********************************************************************/

miniLOL.module.create("Security", {
    version: "0.2.3",

    type: "passive",
    
    initialize: function () {
        if (!miniLOL.theme.style.exists("Security/style")) {
            miniLOL.theme.style.load("style", this.root+"/resources");
        }

        new Ajax.Request(this.root+"/main.php?build", {
            method: "get",
            asynchronous: false,

            onFailure: function () {
                miniLOL.content.set("Failed to build the configuration tree.");
            }
        });

        this.execute({ connected: true });
    },

    execute: function (args) {
        if (!args) {
            return;
        }

        if (args["login"]) {
            if (args["do"]) {
                miniLOL.module.execute("Logger", ["log", 100, "Security", "login", args["password"] || '']);

                if (!args["password"]) {
                    miniLOL.error("The password is missing.", miniLOL.theme.content(), true);
                    return false;
                }

                new Ajax.Request(this.root+"/main.php?login&password=#{0}".interpolate([encodeURIComponent(args["password"])]), {
                    method: "get",

                    onSuccess: function (http) {
                        miniLOL.content.set(http.responseText);

                        if (miniLOL.module.execute("Security", { connected: true })) {
                            Event.fire(document, ":security", "login");
                        }
                    },

                    onFailure: function () {
                        miniLOL.error("Something went deeply wrong :(", miniLOL.theme.content());
                    }
                });
            }
            else {
                new Ajax.Request(this.root+"/resources/template.php?login", {
                    method: "get",

                    onSuccess: function (http) {
                        miniLOL.content.set(http.responseText);
                    },

                    onFailure: function () {
                        miniLOL.error("Something went deeply wrong :(", miniLOL.theme.content());
                    }
                });
            }
        }
        else if (args["logout"]) {
            miniLOL.module.execute("Logger", ["log", 30, "Security", "logout"]);

            new Ajax.Request(this.root+"/main.php?logout", {
                method: "get",

                onSuccess: function (http) {
                    miniLOL.content.set(http.responseText);
                    miniLOL.modules.security.connected = false;
                    Event.fire(document, ":security", "logout");
                },

                onFailure: function () {
                    miniLOL.error("Something went deeply wrong :(", miniLOL.theme.content());
                }
            });

            
        }
        else if (args["change"]) {
            if (args["do"]) {
                miniLOL.module.execute("Logger", ["log", 100, "Security", "change", args["password"] || '', args["type"] || '']);

                if (!args["password"] || !args["type"]) {
                    miniLOL.error("The password or the type are missing.", miniLOL.theme.content());
                    return false;
                }

                new Ajax.Request(this.root+"/main.php?change&password=#{0}&type=#{1}".interpolate([encodeURIComponent(args["password"]), encodeURIComponent(args["type"])]), {
                    method: "get",

                    onSuccess: function (http) {
                        miniLOL.content.set(http.responseText);
                    },

                    onFailure: function () {
                        miniLOL.error("Something went deeply wrong :(", miniLOL.theme.content());
                    }
                });
            }
            else {
                new Ajax.Request(this.root+"/resources/template.php?change", {
                    method: "get",

                    onSuccess: function (http) {
                        miniLOL.content.set(http.responseText);
                    },

                    onFailure: function () {
                        miniLOL.error("Something went deeply wrong :(", miniLOL.theme.content());
                    }
                });
            }
        }
        else if (args["connected"]) {
            if (args["cached"]) {
                return this.connected;
            }

            var result = "false";

            miniLOL.module.execute("Logger", ["log", 30, "Security", "connected"]);
            
            new Ajax.Request(this.root+"/main.php?connected", {
                method: "get",
                asynchronous: false,

                onSuccess: function (http) {
                    result = http.responseText;
                }
            });

            return this.connected = (result == "true");
        }
        else if (args["get"]) {
            var result = '';

            miniLOL.module.execute("Logger", ["log", 30, "Security", "get", args["get"]]);
            
            new Ajax.Request(this.root+"/main.php?get=" + args["get"], {
                method: "get",
                asynchronous: false,

                onSuccess: function (http) {
                    result = http.responseText;
                }
            });

            return result;
           
        }
    }
});
