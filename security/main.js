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

miniLOL.module.create('security', {
    version: '0.1',
    
    onLoad: function () {
        include("css", this.root+"/resources/style.css");
        new Ajax.Request(this.root+"/main.php?build", {
            method: 'get',

            onFailure: function () {
                $(miniLOL.config.contentNode).innerHTML = "Failed to build the configuration tree.";
            }
        });
    },

    execute: function (args) {
        if (!args) {
            return;
        }

        if (args["login"]) {
            if (args["do"]) {
                if (!args["password"]) {
                    $(miniLOL.config.contentNode).innerHTML = 'The password is missing.';
                    return false;
                }

                new Ajax.Request(this.root+"/main.php?login&password=#{0}".interpolate([encodeURIComponent(args["password"])]), {
                    method: 'get',

                    onSuccess: function (http) {
                        $(miniLOL.config.contentNode).innerHTML = http.responseText;
                    },

                    onFailure: function () {
                        $(miniLOL.config.contentNode).innerHTML = 'Something went deeply wrong :(';
                    },
                });
            }
            else {
                new Ajax.Request(this.root+"/resources/login.tpl", {
                    method: 'get',

                    onSuccess: function (http) {
                        $(miniLOL.config.contentNode).innerHTML = http.responseText;
                    },

                    onFailure: function () {
                        $(miniLOL.config.contentNode).innerHTML = 'Something went deeply wrong :(';
                    },
                });
            }
        }
        else if (args["logout"]) {
            new Ajax.Request(this.root+"/main.php?logout", {
                method: 'get',

                onSuccess: function (http) {
                    $(miniLOL.config.contentNode).innerHTML = http.responseText;
                },

                onFailure: function () {
                    $(miniLOL.config.contentNode).innerHTML = 'Something went deeply wrong :(';
                },
            });
        }
        else if (args["connected"]) {
            var result = "false";
            
            new Ajax.Request(this.root+"/main.php?connected", {
                method: 'get',
                asynchronous: false,

                onSuccess: function (http) {
                    result = http.responseText;
                },
            });

            return result == "true";
        }
        else if (args["get"]) {
            var result = "";
            
            new Ajax.Request(this.root+"/main.php?get=" + args["get"], {
                method: 'get',
                asynchronous: false,

                onSuccess: function (http) {
                    result = http.responseText;
                },
            });

            return result;
           
        }
    },
});
