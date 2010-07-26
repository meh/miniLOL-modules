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

        Event.observe(document, ":module.Language.change", function (event) {
            this.set(event.memo);
        }.bind(this));
    },

    set: function (language) {
        this.template = miniLOL.theme.template.load("/resources/languages/#{code}/template".interpolate(language), this.root);

        if (!this.template) {
            throw new Error("Language template not found.");
        }
    },

    apply: function (type, data) {
        return this.callbacks[type].call(this, data);
    },

    callbacks: {
        "global": function (data) {
            var languages = '';

            data.each(function (language) {
                languages += this.apply("language", language);
            }, this);
           
            return this.template.getElementsByTagName("global")[0].firstChild.nodeValue.interpolate({
                data: languages
            });
        },

        "language": function (data) {
            return this.template.getElementsByTagName("language")[0].firstChild.nodeValue.interpolate({
                name: data.name,
                SELECTED: (data.name == miniLOL.module.get("Language").languages.language.name) ? "SELECTED" : ''
            });
        }
    }
});

return Template;

})();
