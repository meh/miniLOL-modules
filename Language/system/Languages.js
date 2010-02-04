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

var Languages = Class.create({
    initialize: function (root, languages) {
        this.root = root;

        var This = this;
        this.resource = new miniLOL.Resource("Languages.resource", {
            load: function (path) {
                This._languages = this._data;

                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,

                    onSuccess: function (http) {
                        if (miniLOL.utils.checkXML(http.responseXML, path)) {
                            return;
                        }

                        var languages = http.responseXML.getElementsByTagName("language");
                        for (var i = 0; i < languages; i++) {
                            res.push({
                                code: languages[i].getAttribute("code"),
                                name: languages[i].getAttribute("name")
                            });
                        }
                    },

                    onFailure: function (http) {
                        miniLOL.error("Error while loading config.xml (#{error})".interpolate({
                            error: http.status
                        }));
                    }
                });
            },

            clear: function () {
                this._data = [];
            }
        };

        this.resource.load(this.root+languages);

        this.Pages = miniLOL.utils.require(this.root+"/system/Pages.js");
        this.Menus = miniLOL.utils.require(this.root+"/system/Pages.js");
    }
});

return Languages;

})();
