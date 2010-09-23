/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL. A blog module.                             *
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

var Blog = Class.create({
    initialize: function (root, data, config) {
        this.root = root;

        var Blog = this;

        this.resource = new miniLOL.Resource("Blog", {
            load: function (path) {
                var data = this.data;

                new Ajax.Request(path + "?failCache=" + Math.random(), {
                    method: "get",
                    asynchronous: false,

                    requestHeaders: {
                        "Cache-Control": "must-revalidate",
                        "Pragma":        "no-cache"
                    },

                    onSuccess: function (http) {
                        if (miniLOL.Document.check(http.responseXML, path)) {
                            return;
                        }

                        data.data = miniLOL.Document.fix(http.responseXML);
                    },

                    onFailure: function (http) {
                        miniLOL.error("Error while loading Blog's data.xml (#{error})".interpolate({
                            error: http.status
                        }));
                    }
                });

                if (!data.data) {
                    return false;
                }

                Blog.data  = this.data.data;
                Blog.cache = this.data.cache;
            },

            clear: function () {
                this.data = {
                    data: null,
                    cache: {}
                };
            }
        });

        this.resource.load(this.root+data);
        miniLOL.resource.get("miniLOL.config").load(this.root+config);

        this.Template = miniLOL.utils.execute(this.root+"/system/Template.min.js");
        this.template = new this.Template(this.root);

        this.Feed = miniLOL.utils.execute(this.root+"/system/Feed.min.js");
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
            tokenized: true,

            parameters: data,

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.module.execute("Blog", { rehash: true });
                miniLOL.module.execute("Blog", { feed: true, build: true });
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", true);
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
            tokenized: true,

            parameters: data,    

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.module.execute("Blog", { rehash: true });
                miniLOL.module.execute("Blog", { feed: true, build: true });
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", true);
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
            tokenized: true,

            parameters: data,    

            onSuccess: function (http) {
                miniLOL.content.set(http.responseText);
                miniLOL.module.execute("Blog", { rehash: true });
                miniLOL.module.execute("Blog", { feed: true, build: true });
            },

            onFailure: function () {
                miniLOL.error("Something went deeply wrong.", true);
            }
        });
    },

    rehash: function () {
        this.resource.reload();
    },

    getPost: function (id) {
        return this.data.getElementById(id);
    },

    getPostInfo: function (id) {
        var post;

        if (Object.isString(id)) {
            post = this.getPost(id);
        }
        else {
            post = id;
        }

        return {
            date:   post.getAttribute("date"),
            id:     post.getAttribute("id"),
            title:  post.getAttribute("title"),
            author: post.getAttribute("author")
        };
    },

    getPosts: function () {
        return $A(this.data.getElementsByTagName("post"));
    }
});

return Blog;

})();
