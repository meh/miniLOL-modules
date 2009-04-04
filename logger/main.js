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
    version: '0.1',

    onGo: function () {
        var url  = location.href.match(/#(.*)$/);
        url      = encodeURIComponent(url ? (url[1].empty() ? miniLOL.config.homePage : url[1]) : miniLOL.config.homePage);
        var date = encodeURIComponent(new Date().toString());

        new Ajax.Request(this.root+"/main.php?url="+url+"&date="+date, {
            method: 'get',
        });
    },

    execute: function (args) {

    },
});
