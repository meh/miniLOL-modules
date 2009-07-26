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

    dependencies: ['security'],

    onAction: function (args) {
        var argv = "";
        for (var i = 0; i < args.length; i++) {
            argv += i + '=' + encodeURIComponent((typeof args[i] != 'object') ? args[i] : Object.toJSON(args[i])) + '&';
        }

        var date = encodeURIComponent(new Date().toString());

        new Ajax.Request(this.root+"/main.php?data&" + argv + "date="+date, {
            method: 'get',
        });
    },

    execute: function (args) {

    },
});
