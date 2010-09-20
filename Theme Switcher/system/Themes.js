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
        this.themes = [];
    },

    load: function (path) {
        var result = false;
    
        new Ajax.Request(path, {
            method: "get",
            asynchronous: false,
    
            onSuccess: function (http) {
                var dom = Document.fix(http.responseXML);
    
                $A(dom.getElementsByTagName("theme")).each(function (theme) {
                    this.themes.push(theme.getAttribute("name"));
                }, this);
    
                result = true;
            }.bind(this)
        });
    
        return result;
    },

    exists: function (theme) {
        return this.themes.indexOf(theme) >= 0;
    },

    toArray: function () {
        return this.themes;
    }
});

return Themes;

})();
