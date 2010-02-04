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

miniLOL.module.create("Logger", {
    version: "0.2.2",

    type: "passive",

    aliases: ["logger"],

    dependencies: ["Security"],

    initialize: function () {
        miniLOL.resources.config.load(this.root+"/resources/config.xml");
    },

    onGo: function (event) {
        this.execute("Logger", ["log", 50, "page", "view", event.memo]);
    },

    execute: function (type) {
        if (type == "log") {
            var priority = arguments[1];
    
            if (priority < miniLOL.config["Logger"].priority) {
                return true;
            }
    
            var argv = '';
            for (var i = 2; i < arguments.length; i++) {
                argv += i-2 + '=' + encodeURIComponent((typeof arguments[i] != "object") ? arguments[i] : Object.toJSON(arguments[i])) + '&';
            }
    
            var date = encodeURIComponent(new Date().toString());
    
            new Ajax.Request(this.root+"/main.php?data&priority=" + priority + '&' + argv + "date=" + date, {
                method: "get"
            });
        }
    }
});
