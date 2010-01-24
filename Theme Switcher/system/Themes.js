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

var Themes = Class.create({
    initialize: function () {
        this._themes = [];
    },

    load: function (path) {
        var result = false;
    
        var This = this;
        new Ajax.Request(path, {
            method: "get",
            asynchronous: false,
    
            onSuccess: function (http) {
                var dom = miniLOL.utils.fixDOM(http.responseXML);
    
                var themes = dom.getElementsByTagName("theme");
                for (var i = 0; i < themes.length; i++) {
                    This._themes.push(themes[i].getAttribute("name"));
                }
    
                result = true;
            }
        });
    
        return result;
    },

    exists: function (theme) {
        return this._themes.indexOf(theme) >= 0;
    },

    toArray: function () {
        return this._themes;
    }
});

return Themes;

})();
