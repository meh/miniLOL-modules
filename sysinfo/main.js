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

miniLOL.module.create('sysinfo', {
    version: '0.1',

    type: 'active',

    execute: function (args) {
        var type   = (args.show) ? true : false;
        var result = null;
        var query  = "";

        for (var key in args) {
            query += encodeURIComponent(key) + (args[key] ? '=' + encodeURIComponent(args[key]) : '') + '&';
        }

        new Ajax.Request(this.root+"/main.php?", {
            method: 'get',
            asynchronous: type,

            onSuccess: function (http) {
                if (type) {
                    miniLOL.content.set(http.responseText);
                }
                else {
                    result = http.responseText;
                }
            },

            onFailure: function () {
                miniLOL.content.set('Something went deeply wrong :(');
            },
        });

        return result;
    },
});
