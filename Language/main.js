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

miniLOL.module.create("Language", {
    version: "0.1",

    type: "active",

    aliases: ["lang"],

    initialize: function () {
        miniLOL.resource.get("miniLOL.config").load(this.root+"/resources/config.xml");

        this.Languages  = miniLOL.utils.require(this.root+"/system/Languages.js");
        this.languages = new this.Languages(this.root, "/resources/languages.xml");

        this.Template = miniLOL.utils.require(this.root+"/system/Template.js");
        this.template = new this.Template(this.root);

        this.languages.set(location.href.parseQuery().lang || new CookieJar().get("language") || miniLOL.config["Language"].defaultLanguage);
    },

    execute: function (args) {
        args = args || {};

        if (args["page"]) {
            this.languages.page(args["page"], args["lang"]);
        }
        else if (args["choose"]) {
            this.languages.set(args["lang"], Boolean(args["apply"]), true);
        }
        else if (args["chooser"]) {
            miniLOL.content.set(this.template.apply("global", this.languages.toArray()));
        }
        else {
            this.languages.apply(true);
        }

        return true;
    }
});
