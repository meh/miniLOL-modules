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

var Language = Class.create({
    initialize: function (root, languages) {
        this.root = root;

        var Language = this;

        this.resource = new miniLOL.Resource("Language.resource", {
            load: function (path) {
                Language.languages = this.data;

                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,

                    onSuccess: function (http) {
                        if (miniLOL.utils.checkXML(http.responseXML, path)) {
                            return;
                        }

                        $A(http.responseXML.getElementsByTagName("language")).each(function (language) {
                            Language.languages.push({
                                code: language.getAttribute("code"),
                                name: language.getAttribute("name")
                            });
                        });
                    },

                    onFailure: function (http) {
                        miniLOL.error("Error while loading config.xml (#{error})".interpolate({
                            error: http.status
                        }));
                    }
                });
            },

            clear: function () {
                this.data = [];
            }
        });

        this.resource.load(this.root+languages);

        miniLOL.resource.get("miniLOL.menus").flush(["resources/menus.xml"]);
        miniLOL.resource.get("miniLOL.pages").flush(["resources/pages.xml"]);
    },

    set: function (lang, apply, save) {
        if (!Object.isString(lang)) {
            lang = lang.name || lang.code;
        }

        if (!lang) {
            throw new Error("No correct language was passed.");
        }
        
        var language = this.languages.find(function (current) {
            if (current.name == lang || current.code == lang) {
                return true;
            }
        });

        if (!language) {
            throw new Error("`#{language}` isn't in the languages list.".interpolate({
                language: lang
            }));
        }

        this.old      = this.current;
        this.current = language;

        if (this.old == this.current) {
            return;
        }

        if (save) {
            new CookieJar({ expires: 60 * 60 * 24 * 365 }).set("language", this.current);
        }

        Event.fire(document, ":module.Language.change", this.current);

        this.apply(apply);
    },

    apply: function (reload) {
        if (this.old != this.current) {
            miniLOL.resource.get("miniLOL.config").flush([this.root+"/resources/languages/#{code}/config.xml".interpolate(this.old)]);
            miniLOL.resource.get("miniLOL.menus").flush([this.root+"/resources/languages/#{code}/menus.xml".interpolate(this.old)]);
            miniLOL.resource.get("miniLOL.pages").flush([this.root+"/resources/languages/#{code}/pages.xml".interpolate(this.old)]);

            if (!miniLOL.resource.get("miniLOL.config").load(this.root+"/resources/languages/#{code}/config.xml".interpolate(this.current))) {
                return false;
            }

            if (!miniLOL.resource.get("miniLOL.menus").load(this.root+"/resources/languages/#{code}/menus.xml".interpolate(this.current))) {
                return false;
            }

            if (!miniLOL.resource.get("miniLOL.pages").load(this.root+"/resources/languages/#{code}/pages.xml".interpolate(this.current))) {
                return false;
            }
        }

        if (reload) {
            miniLOL.menu.change(miniLOL.menu.current, true);
            return miniLOL.go(location.href);
        }
    },

    page: function (page, lang) {
        miniLOL.go("#page=../#{root}/resources/languages/#{code}/data/#{page}".interpolate({
            root: this.root,
            code: lang || this.current.code,
            page: page
        }));
    },

    toArray: function () {
        return this.languages;
    }
});

return Language;

})();
