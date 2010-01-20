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
    initialize: function (root, data, config) {
        this.root     = root;
        this.Template = miniLOL.utils.require(root+"/system/Template.js");

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

                new Ajax.Request(data + "?failCache=" + Math.random(), {
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
        miniLOL.resource.load(miniLOL.resources.config, config);

        this.template = new this.Template(root);
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

        new Ajax.Request(this.root+"/main.php?post&"+type, {
            method: "post",

            parameters: data,

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.module.execute("Blog", "rehash");
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

        new Ajax.Request(this.root+"/main.php?edit&"+type, {
            method: 'post',

            parameters: data,    

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.resource.reload(miniLOL.module.get("Blog").resource);
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", miniLOL.theme.content(), true);
            }
        });
    },

    delete: function () {
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

        miniLOL.module.execute("Logger", ["log", 100, "Blog", "delete", type, data]);

        new Ajax.Request(this.root+"/main.php?delete&"+type, {
            method: 'post',

            parameters: data,    

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.resource.reload(miniLOL.module.get("Blog").resource);
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", miniLOL.theme.content(), true);
            }
        });
    },

    rehash: function () {
        miniLOL.resource.reload(this.resource);
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
