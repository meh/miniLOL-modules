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

var Languages = Class.create({
    initialize: function (root, languages) {
        this.root = root;

        var This = this;
        this.resource = new miniLOL.Resource("Languages.resource", {
            load: function (path) {
                This._languages = this._data;

                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,

                    onSuccess: function (http) {
                        if (miniLOL.utils.checkXML(http.responseXML, path)) {
                            return;
                        }

                        var languages = http.responseXML.getElementsByTagName("language");

                        for (var i = 0; i < languages.length; i++) {
                            This._languages.push({
                                code: languages[i].getAttribute("code"),
                                name: languages[i].getAttribute("name")
                            });
                        }
                    },

                    onFailure: function (http) {
                        miniLOL.error("Error while loading config.xml (#{error})".interpolate({
                            error: http.status
                        }));
                    }
                });
            },

            clear: function () {
                this._data = [];
            }
        });

        this.resource.load(this.root+languages);

        miniLOL.resources.menus.flush(["resources/menus.xml"]);
        miniLOL.resources.pages.flush(["resources/pages.xml"]);
    },

    set: function (lang, apply) {
        if (!Object.isString(lang)) {
            lang = lang.name || lang.code;
        }

        if (!lang) {
            throw new Error("No correct language was passed.");
        }
        
        var language = this._languages.find(function (current) {
            if (current.name == lang || current.code == lang) {
                return true;
            }
        });

        if (!language) {
            throw new Error("`#{language}` isn't in the languages list.".interpolate({
                language: lang
            }));
        }

        this._old      = this._language;
        this._language = language;

        new CookieJar({ expires: 60 * 60 * 24 * 365 }).set("language", this._language);

        Event.fire(document, ":module.Language.change", this._language);

        if (apply) {
            this.apply();
        }
    },

    apply: function () {
        if (miniLOL.__language__ != this._language) {
            miniLOL.resources.config.flush([this.root+"/resources/languages/#{code}/config.xml".interpolate(this._old)]);
            miniLOL.resources.menus.flush([this.root+"/resources/languages/#{code}/menus.xml".interpolate(this._old)]);
            miniLOL.resources.pages.flush([this.root+"/resources/languages/#{code}/pages.xml".interpolate(this._old)]);

            miniLOL.resources.config.load(this.root+"/resources/languages/#{code}/config.xml".interpolate(this._language))
            miniLOL.resources.menus.load(this.root+"/resources/languages/#{code}/menus.xml".interpolate(this._language));
            miniLOL.resources.pages.load(this.root+"/resources/languages/#{code}/pages.xml".interpolate(this._language));

            miniLOL.__language__ = this._language;
        }

        miniLOL.menu.change(miniLOL.menu.current);
        miniLOL.go(location.href);
    },

    page: function (page) {
        miniLOL.page.load(this.root+"/resources/languages/#{code}/data/#{page}".interpolate({
            code: this._language.code,
            page: page
        }));
    },

    toArray: function () {
        return this._languages;
    }
});

return Languages;

})();
