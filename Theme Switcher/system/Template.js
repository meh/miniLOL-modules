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

var Template = Class.create({
    initialize: function (root) {
        this.root = root;

        this.template = miniLOL.theme.template.load("Theme Switcher/template")
                      || miniLOL.theme.template.load("/resources/template", this.root);

        if (!this.template) {
            throw new Error("Theme Switcher template not found.");
        }
    },

    apply: function (type, data) {
        return this.callbacks[type].call(this, data);
    },

    callbacks: {
        "global": function (data) {
            var themes = '';

            data.each(function (theme) {
                themes += this.apply("theme", theme);
            }, this);
           
            return this.template.getElementsByTagName("global")[0].firstChild.nodeValue.interpolate({
                data: themes
            });
        },

        "theme": function (data) {
            return this.template.getElementsByTagName("theme")[0].firstChild.nodeValue.interpolate({
                name: data,
                SELECTED: (data == miniLOL.theme.name) ? "SELECTED" : ''
            });
        }
    }
});

return Template;

})();
