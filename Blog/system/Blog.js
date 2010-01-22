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
        this.resource = {
            name: "Blog",

            load: function (data) {
                if (!this.res) {
                    this.res = {
                        data: null,
                        cache: {},
                    };

                    delete This._data;
                    delete This._cache;
                } var res = this.res;

                new Ajax.Request(This.root+data + "?failCache=" + Math.random(), {
                    method: "get",
                    asynchronous: false,

                    requestHeaders: {
                        "Cache-Control": "must-revalidate",
                        "Pragma":        "no-cache"
                    },

                    onSuccess: function (http) {
                        var error = miniLOL.utils.checkXML(http.responseXML);
                        if (error) {
                            miniLOL.error("Error while parsing blog's data.xml<br/><br/>#{error}".interpolate({
                                error: error.replace(/\n/g, "<br/>").replace(/ /g, "&nbsp;")
                            }));

                            return;
                        }

                        res.data = miniLOL.utils.fixDOM(http.responseXML);
                    },

                    onFailure: function (http) {
                        miniLOL.error("Error while loading config.xml (#{error})".interpolate({
                            error: http.status
                        }));
                    }
                });

                if (!res.data) {
                    return false;
                }

                This._data  = res.data;
                This._cache = res.cache;
            }
        };

        miniLOL.resource.load(this.resource, data);
        miniLOL.resource.load(miniLOL.resources.config, This.root+config);

        this.Template = miniLOL.utils.require(this.root+"/system/Template.js");
        this.template = new this.Template(this.root, style, template, editors);

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
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", miniLOL.theme.content(), true);
            }
        });
    },

    rehash: function () {
        miniLOL.resource.reload(this.resource);
        this.feed.update(this._data);
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
