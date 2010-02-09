/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL. A multi language support module.           *
 *                                                                          *
 * miniLOL is free software: you can redistribute it and/or modify          *
 * it under the terms of the GNU Affero General Public License as           *
 * published by the Free Software Foundation, either version 3 of the       *
 * License, or (at your option) any later version.                          *
 *                                                                          *
 * miniLOL is distributed in the hope that it will be useful,               *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 * GNU Affero General Public License for more details.                      *
 *                                                                          *
 * You should have received a copy of the GNU Affero General Public License *
 * along with miniLOL.  If not, see <http://www.gnu.org/licenses/>.         *
 ****************************************************************************/

(function () {

var Template = Class.create({
    initialize: function (root) {
        this.root = root;

        var This = this;
        Event.observe(document, ":module.Language.change", function (event) {
            This.set(event.memo);
        });
    },

    set: function (language) {
        this._template = miniLOL.theme.template.load("/resources/languages/#{code}/template".interpolate(language), this.root);

        if (!this._template) {
            throw new Error("Language template not found.");
        }
    },

    apply: function (type, data) {
        return this._callbacks[type].call(this, data);
    },

    _callbacks: {
        "global": function (data) {
            var languages = '';

            for (var i = 0; i < data.length; i++) {
                languages += this.apply("language", data[i]);
            }
           
            return this._template.getElementsByTagName("global")[0].firstChild.nodeValue.interpolate({
                data: languages
            });
        },

        "language": function (data) {
            return this._template.getElementsByTagName("language")[0].firstChild.nodeValue.interpolate({
                name: data.name,
                SELECTED: (data.name == miniLOL.module.get("Language")._languages._language.name) ? "SELECTED" : ''
            });
        }
    }
});

return Template;

})();
