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

        this.Language = miniLOL.utils.execute(this.root+"/system/Language.min.js");
        this.language = new this.Language(this.root, "/resources/languages.xml");

        this.Template = miniLOL.utils.execute(this.root+"/system/Template.min.js");
        this.template = new this.Template(this.root);

        this.language.set(location.href.parseQuery().lang || new CookieJar().get("language") || miniLOL.config["Language"].defaultLanguage);
    },

    execute: function (args) {
        args = args || {};

        if (args["page"]) {
            this.language.page(args["page"], args["lang"]);
        }
        else if (args["choose"]) {
            this.language.set(args["lang"], Boolean(args["apply"]), true);
        }
        else if (args["chooser"]) {
            miniLOL.content.set(this.template.apply("global", this.language.toArray()));
        }
        else {
            this.language.apply(true);
        }

        return true;
    }
});
