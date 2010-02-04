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

var Blog = Class.create({
    initialize: function (root, data, config, style, template, editors) {
        this.root = root;

        var This = this;
        this.resource = new miniLOL.Resource("Blog", {
            load: function (path) {
                var data = this._data;

                new Ajax.Request(path + "?failCache=" + Math.random(), {
                    method: "get",
                    asynchronous: false,

                    requestHeaders: {
                        "Cache-Control": "must-revalidate",
                        "Pragma":        "no-cache"
                    },

                    onSuccess: function (http) {
                        if (miniLOL.utils.checkXML(http.responseXML, path)) {
                            return;
                        }

                        data.data = miniLOL.utils.fixDOM(http.responseXML);
                    },

                    onFailure: function (http) {
                        miniLOL.error("Error while loading config.xml (#{error})".interpolate({
                            error: http.status
                        }));
                    }
                });

                if (!data.data) {
                    return false;
                }

                This._data  = this._data.data;
                This._cache = this._data.cache;
            },

            clear: function () {
                this._data = {
                    data: null,
                    cache: {},
                };
            }
        });

        this.resource.load(this.root+data);
        miniLOL.resources.config.load(this.root+config);

        this.Template = miniLOL.utils.require(this.root+"/system/Template.js");
        this.template = new this.Template(this.root);

        this.Feed = miniLOL.utils.require(this.root+"/system/Feed.js");
        this.feed = new this.Feed(this.root, {
            path:    miniLOL.config["Blog"].feed.path,
            type:    miniLOL.config["Blog"].feed.type,
            version: miniLOL.config["Blog"].feed.version,
            max:     miniLOL.config["Blog"].feed.max,

            title:       miniLOL.config["Blog"].feed.title,
            description: miniLOL.config["Blog"].feed.description,
            language:    miniLOL.config["Blog"].feed.language
        });
    },

    post: function () {
        var data; 
        var type;

        if (Object.isString(arguments[0])) {
            data = arguments[1];
            type = arguments[0];
        }
        else {
            data = arguments[0];
            type = '';
        }

        miniLOL.module.execute("Logger", ["log", 100, "Blog", "post", type, data]);

        if (!type) {
            if (!miniLOL.module.execute("Security", { connected: true })) {
                miniLOL.content.set("You're doing it wrong.");
                return false;
            }
        }

        new Ajax.Request(this.root+"/main.php?post&"+type, {
            method: "post",

            parameters: data,

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.module.execute("Blog", { rehash: true });
                miniLOL.module.execute("Blog", { feed: true, build: true });
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", miniLOL.theme.content(), true);
            }
        });
    },

    edit: function () {
        var data; 
        var type;

        if (Object.isString(arguments[0])) {
            data = arguments[1];
            type = arguments[0];
        }
        else {
            data = arguments[0];
            type = '';
        }

        miniLOL.module.execute("Logger", ["log", 100, "Blog", "post", type, data]);

        if (!miniLOL.module.execute("Security", { connected: true })) {
            miniLOL.content.set("You're doing it wrong.");
            return false;
        }

        new Ajax.Request(this.root+"/main.php?edit&"+type, {
            method: 'post',

            parameters: data,    

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.module.execute("Blog", { rehash: true });
                miniLOL.module.execute("Blog", { feed: true, build: true });
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", miniLOL.theme.content(), true);
            }
        });
    },

    remove: function () {
        var data; 
        var type;

        if (Object.isString(arguments[0])) {
            data = arguments[1];
            type = arguments[0];
        }
        else {
            data = arguments[0];
            type = '';
        }

        miniLOL.module.execute("Logger", ["log", 100, "Blog", "remove", type, data]);

        if (!miniLOL.module.execute("Security", { connected: true })) {
            miniLOL.content.set("You're doing it wrong.");
            return false;
        }

        new Ajax.Request(this.root+"/main.php?remove&"+type, {
            method: 'post',

            parameters: data,    

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.module.execute("Blog", { rehash: true });
                miniLOL.module.execute("Blog", { feed: true, build: true });
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", miniLOL.theme.content(), true);
            }
        });
    },

    rehash: function () {
        this.resource.reload();
    },

    getPost: function (id) {
        return this._data.getElementById(id);
    },

    getPosts: function () {
        return $A(this._data.getElementsByTagName("post"));
    }
});

return Blog;

})();
