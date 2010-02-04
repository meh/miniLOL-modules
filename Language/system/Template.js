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

        this._template = miniLOL.theme.template.load("Language/template")
                      || miniLOL.theme.template.load("/resources/template", this.root);

        if (!this._template) {
            throw new Error("Language template not found.");
        }
    },

    apply: function (type, data) {
        return this._callbacks[type].call(this, data);
    },

    _callbacks: {
        "global": function (data) {
            var themes = '';

            for (var i = 0; i < data.length; i++) {
                themes += this.apply("language", data[i]);
            }
           
            return this._template.getElementsByTagName("global")[0].firstChild.nodeValue.interpolate({
                data: themes,
            });
        },

        "language": function (data) {
            return this._template.getElementsByTagName("language")[0].firstChild.nodeValue.interpolate({
                name: data,
                SELECTED: (data == miniLOL.theme.name) ? "SELECTED" : ''
            });
        }
    }
});

return Template;

})();
