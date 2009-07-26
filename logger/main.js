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

miniLOL.module.create('logger', {
    version: '0.2',

    type: 'passive',

    dependencies: ['security'],

    onLoad: function () {
        miniLOL.resource.load(miniLOL.resources.config, this.root+"/resources/config.xml");
    },

    onAction: function (args) {
        var priority = args.shift();

        if (priority < miniLOL.config['logger'].priority) {
            return true;
        }

        var argv = "";
        for (var i = 0; i < args.length; i++) {
            argv += i + '=' + encodeURIComponent((typeof args[i] != 'object') ? args[i] : Object.toJSON(args[i])) + '&';
        }

        var date = encodeURIComponent(new Date().toString());

        new Ajax.Request(this.root+"/main.php?data&priority="+priority+"&" + argv + "date="+date, {
            method: 'get',
        });
    },

    execute: function (args) {

    },
});
