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
    initialize: function (template, path) {
        this._template = miniLOL.theme.template.load("Menu Shell/template")
                      || miniLOL.theme.template.load(template, path);

        if (!this._template) {
            throw new Error("Menu Shell template not found.");
        }
    },

    apply: function (type, data) {
        return this._callbacks[type].call(this, data);
    },

    _callbacks: {
        "PS1": function (data) 
            return this._template.getElementsByTagName("PS1")[0].firstChild.nodeValue.interpolate({
                PWD: data.variables.PWD,
            });
        },
    }
});

return Template;

})();
