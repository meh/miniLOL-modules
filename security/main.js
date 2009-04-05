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
    },

    execute: function (args) {
        if (args.login) {
            if (args.do) {
                if (!args.password) {
                    $(miniLOL.config.contentNode).innerHTML = 'The password is missing.';
                    return false;
                }

                new Ajax.Request(this.root+"/main.php?password=#{0}".interpolate([encodeURIComponent(args.password)]), {
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
    },
});
