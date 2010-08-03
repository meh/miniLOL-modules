/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL. A server side support module.              *
 *                                                                          *
 * miniLOL is free software: you can redistribute it and/or modify          *
 * it under the terms of the GNU Affero General Public License as           *
 * published by the Free Software Foundation, either version 3 of the       *
 * License, or (at your option) any later version.                          *
 *                                                                          *
 * miniLOL is distributed in the hope that it will be useful,               *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 * GNU Affero General Public License for more details.                      *
 *                                                                          *
 * You should have received a copy of the GNU Affero General Public License *
 * along with miniLOL.  If not, see <http://www.gnu.org/licenses/>.         *
 ****************************************************************************/

miniLOL.module.create("Security", {
    version: "0.2.4",

    type: "passive",

    aliases: ["security"],
    
    initialize: function () {
        miniLOL.utils.require(this.root+"/system/extensions.js");

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
                    tokenized: true,

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
                tokenized: true,

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
                    tokenized: true,

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
        else if (args["token"]) {
            var result;

            new Ajax.Request(this.root+"/main.php?token", {
                method: "get",
                asynchronous: false,

                onSuccess: function (http) {
                    result = http.responseText;
                }
            });

            return result;
        }
        else if (args["get"]) {
            var result = "";

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
