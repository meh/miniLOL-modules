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

miniLOL.module.create("Menu Shell", {
    version: "0.1",

    type: "active",

    aliases: ["minish"],

    initialize: function () {
        this.Shell = miniLOL.utils.require(this.root+"/system/Shell.js");
        this.shell = new this.Shell(this.root, "/resources/commands.xml");

        Event.observe(document, ":menu.change", function (event) {
            if (event.memo) {
                miniLOL.module.execute("Menu Shell", { set: true, menu: event.memo });
            }
        });
    },

    execute: function (args) {
        if (args["execute"]) {
            return this.shell.execute(args["command"]);
        }
        else if (args["set"]) {
            if (args["menu"]) {
                this.shell.menu(args["menu"]);
            }
        }
        else if (args["append"]) {
            miniLOL.theme.content.insert({
                bottom: args["content"]
            });
        }
        else {
            miniLOL.content.set(this.shell.template.apply("PS1", this.shell.context()));
        }

        return true;
    }
});

})();
