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

var Template = Class.create({
    initialize: function () {
        this.load();
    },

    load: function () {
        // load and parse blog's template
        var template = miniLOL.theme.template.load("Blog/template")
                    || miniLOL.theme.template.load("template", This.root+"/resources");

        if (!template) {
            if (!miniLOL.error()) {
                miniLOL.error("Couldn't find the blog's template.");
            }
            
            return false;
        }

        this.template = {};

        this.template.blog = template.getElementsByTagName("blog")[0].firstChild.nodeValue;

        var posts   = template.getElementsByTagName("posts")[0];
        var pager   = posts.getElementsByTagName("pager")[0];
        var numbers = pager.getElementsByTagName("numbers")[0];

        this.template.posts                       = {};
        this.template.posts.overall               = posts.firstChild.nodeValue;
        this.template.posts.pager_overall         = pager.firstChild.nodeValue;
        this.template.posts.pager_previous        = posts.getElementsByTagName("previous")[0].firstChild.nodeValue;
        this.template.posts.pager_numbers         = numbers.firstChild.nodeValue;
        this.template.posts.pager_numbers_length  = parseInt(numbers.getAttribute("length"));
        this.template.posts.pager_numbers_first   = numbers.getElementsByTagName("first")[0].firstChild.nodeValue;
        this.template.posts.pager_numbers_inner   = numbers.getElementsByTagName("inner")[0].firstChild.nodeValue;
        this.template.posts.pager_numbers_current = numbers.getElementsByTagName("current")[0].firstChild.nodeValue;
        this.template.posts.pager_numbers_last    = numbers.getElementsByTagName("last")[0].firstChild.nodeValue;
        this.template.posts.pager_next            = pager.getElementsByTagName("next")[0].firstChild.nodeValue;
        
        var post    = template.getElementsByTagName("post")[0];
        var pager   = post.getElementsByTagName("pager")[0];
        var numbers = pager.getElementsByTagName("numbers")[0];

        this.template.post                       = {};
        this.template.post.overall               = post.firstChild.nodeValue;
        this.template.post.pager_overall         = pager.firstChild.nodeValue;
        this.template.post.pager_previous        = post.getElementsByTagName("previous")[0].firstChild.nodeValue;
        this.template.post.pager_numbers         = numbers.firstChild.nodeValue;
        this.template.post.pager_numbers_length  = parseInt(numbers.getAttribute("length"));
        this.template.post.pager_numbers_first   = numbers.getElementsByTagName("first")[0].firstChild.nodeValue;
        this.template.post.pager_numbers_inner   = numbers.getElementsByTagName("inner")[0].firstChild.nodeValue;
        this.template.post.pager_numbers_current = numbers.getElementsByTagName("current")[0].firstChild.nodeValue;
        this.template.post.pager_numbers_last    = numbers.getElementsByTagName("last")[0].firstChild.nodeValue;
        this.template.post.pager_next            = pager.getElementsByTagName("next")[0].firstChild.nodeValue;

        var manage = template.getElementsByTagName("manage")[0];

        this.template.manage = {};
        this.template.manage.admin = manage.getElementsByTagName("admin")[0].firstChild.nodeValue;
        this.template.manage.post  = manage.getElementsByTagName("post")[0].firstChild.nodeValue;
        this.template.manage.edit  = manage.getElementsByTagName("edit")[0].firstChild.nodeValue;

        // load and parse blog's editors
        var editors = miniLOL.theme.template.load("Blog/editors")
                   || miniLOL.theme.template.load("editors", This.root+"/resources");

        if (!editors) {
            if (!miniLOL.error()) {
                miniLOL.error("Couldn't find the blog's template.");
            }

            return false;
        }

        editors = editors.getElementsByTagName("editor");
        for (var i = 0; i < editors.length; i++) {
            this.editors[editors[i].getAttribute("type")] = editors[i].firstChild.nodeValue;
        }
    },

    reload: function () {
        this.load();
    }
});

var Blog = Class.create({
    initialize: function (root, data, config) {
        this.root = root;

        var This = this;
        this.resource = {
            name: "Blog",

            load: function (data, template, editors) {
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

        this._template = new Template;
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
            type = "post";
        }

        if (type == "post") {
            new Ajax.Request(this.root+"/main.php?post", {
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
        }
        else if (type == "comment") {
            new Ajax.Request(this.root+"/main.php?post&comment", {
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
        }
    },

    rehash: function () {
        miniLOL.resource.reload(this.resource);
    }
});

miniLOL.module.create("Blog", {
    version: "0.3",

    type: "active",

    initialize: function () {
        this.blog     = new Blog(this.root, this.root+"/resources/data.xml", this.root+"/resources/template.xml", this.root+"/resources/editors.xml", this.root+"/resources/config.xml");
        this.template = new Template;

        if (!miniLOL.theme.style.exists("Blog/style")) {
            miniLOL.theme.style.load("style", this.root+"/resources");
        }

        Event.observe(document, ":refresh", function () {
            miniLOL.module.get("Blog").template.reload();
        });
    },

    execute: function (args) {
        if (args["comment"]) {
            if (!args["id"]) {
                miniLOL.error("You're doing it wrong.", miniLOL.theme.content(), true);
                return false;
            }

            if (args["post"]) {
                if (args["do"]) {
                    args["title"]  = args["title"] || "Re: " + this.topic(args["id"]).title;
                    args["date"]   = new Date().toString();
                    args["author"] = args["author"] || miniLOL.config["Blog"].author.comment;
    
                    miniLOL.module.execute("Logger", ["log", 70, "Blog", "post", "comment", {
                        title:   args["title"],
                        date:    args["date"],
                        author:  args["author"],
                        content: args["content"]
                    }]);

                    this.blog.post("comment", {
                        title:   args["title"],
                        date:    args["date"],
                        author:  args["author"],
                        content: args["content"]
                    });
                }
                else {
                    miniLOL.content.set(this.templetize(args["id"], "new_comment"));
                }
            }
        }
        else {
            if (args["post"] || args["edit"] || args["delete"]) {
                throw new Error("You can't post without the `security` module.");
            }

            if (args["post"]) {
                if (args["do"]) {
                    args["title"]   = args["title"]   || '';
                    args["date"]    = args["date"]    || new Date().toString();
                    args["author"]  = args["author"]  || miniLOL.config["Blog"].author.post;
                    args["content"] = args["content"] || '';
    
                    miniLOL.module.execute("Logger", ["log", 100, "Blog", "post", {
                        title:   args["title"],
                        date:    args["date"],
                        author:  args["author"],
                        content: args["content"]
                    }]);

                    miniLOL.content.set("Posting...");

                    this.blog.post({
                        title:   args["title"],
                        date:    args["date"],
                        author:  args["author"],
                        content: args["content"]
                    });
                }
                else {
                    miniLOL.content.set(this.templetize([miniLOL.config["Blog"].author.post], "new_post"));
                }
            }
            else if (args["edit"]) {
                if (!miniLOL.module.execute("security", { connected: true })) {
                    miniLOL.error("You're doing it wrong.", miniLOL.theme.content, true);
                    return false;
                }

                if (args["id"]) {
                    if (args["do"]) {
                        args["title"]   = args["title"]   || '';
                        args["date"]    = args["date"]    || new Date().toString();
                        args["author"]  = args["author"]  || miniLOL.config["Blog"].author.post;
                        args["content"] = args["content"] || '';
    
                        miniLOL.module.execute("Logger", ["log", 100, "Blog", "post", args["id"], {
                            title:   args["title"],
                            date:    args["date"],
                            author:  args["author"],
                            content: args["content"]
                        }]);
    
                        new Ajax.Request(this.root+"/main.php?edit", {
                            method: 'post',
    
                            parameters: {
                                id:      args["id"],
                                title:   args["title"],
                                date:    args["date"],
                                author:  args["author"],
                                content: args["content"]
                            },
    
                            onSuccess: function (http) {
                                miniLOL.content.set(http.responseText);
                                miniLOL.resource.reload(miniLOL.module.get("Blog").resource);
                            },
    
                            onFailure: function () {
                                miniLOL.error("Something went deeply wrong.", miniLOL.theme.content(), true);
                            }
                        });
                    }
                    else {
                        if (!miniLOL.module.execute("security", { connected: true })) {
                            miniLOL.error("You're doing it wrong.", miniLOL.theme.content(), true);
                            return false;
                        }
    
                        var post = this.data.getElementById(args["id"]);
    
                        if (post == null) {
                            miniLOL.error("The post doesn't exist.", miniLOL.theme.content(), true);
                            return false;
                        }
    
                        miniLOL.content.set(this.templetize([
                            post.getAttribute("title"),
                            post.getAttribute("author"),
                            post.getAttribute("date"),
                            args["id"]
                         ], "edit_post"));
                    }
                }
                else {
                    miniLOL.error("You're doing it wrong.", miniLOL.theme.content(), true);
                    return false;
                }
            }
            else if (args["delete"]) {
                if (!args["id"]) {
                    miniLOL.error("You're doing it wrong.", miniLOL.theme.content(), true);
                    return false;
                }
    
                if (args["do"]) {
                    miniLOL.module.execute("Logger", ["log", 100, "Blog", "delete", args["id"]]);
    
                    new Ajax.Request(this.root+"/main.php?delete", {
                        method: "post",
    
                        parameters: {
                            id: args["id"]
                        },
    
                        onSuccess: function (http) {
                            miniLOL.content.set(http.responseText);
                            miniLOL.resource.reload(miniLOL.module.get("Blog").resource);
                        },
    
                        onFailure: function () {
                            miniLOL.error("Something went deeply wrong.", miniLOL.theme.content(), true);
                        }
                    });
                }
                else {
                    miniLOL.error("You're doing it wrong.", miniLOL.theme.content(), true);
                    return false;
                }
            }
            else if (args["build"]) {
                miniLOL.error("Not yet implemented.", miniLOL.theme.content(), true);
                return false;
            }
            else if (args["comment"]) {
            }
            else {
                args["page"] = args["page"] || 1;
                
                if (args["id"]) {
                    var post = this.data.getElementById(args["id"]);
                    if (post) {
                        miniLOL.content.set(this.templetize([post, $A(this.data.getElementsByTagName("post")).indexOf(post)+1], "post"));
                    }
                    else {
                        miniLOL.error("Post not found.", miniLOL.theme.content(), true);
                        return false;
                    }
                }
                else if (args["number"]) {
                    var posts = this.data.getElementsByTagName("post");
    
                    if (args["number"] <= posts.length) {
                        miniLOL.content.set(this.templetize([posts[parseInt(args["number"])-1], parseInt(args["number"])], 'post'));
                    }
                    else {
                        miniLOL.error("Post not found.", miniLOL.theme.content(), true);
                        return false;
                    }
                }
                else {
                    var allPosts = this.data.getElementsByTagName("post");

                    if (allPosts.length == 0) {
                        miniLOL.error("The blog is empty :(", miniLOL.theme.content(), true);
                        return false;
                    }
        
                    if (args["page"] > Math.ceil(allPosts.length/miniLOL.config["Blog"].postsPerPage) || args["page"] < 1) {
                        miniLOL.error("Page not found.", miniLOL.theme.content(), true);
                        return false;
                    }
        
                    var posts = [];

                    for (   var i = allPosts.length-1-(miniLOL.config["Blog"].postsPerPage*(args["page"]-1)), count = 0;
                            count < miniLOL.config["Blog"].postsPerPage && i >= 0;
                            i--, count++) {
                        posts.push(allPosts[i]);
                    }
        
                    miniLOL.content.set(this.templetize([posts, parseInt(args["page"])], "posts"));
                }
            }
        }

        return true;
    },

    templetize: function (data, type) {
        if (type == "admin") {
            return this.template.manage.admin.interpolate({
                post_id: data[0]
            });
        }
        else if (type == "posts") {
            var posts = '';
            for (var i = 0; i < data[0].length; i++) {
                posts += this.templetize([data[0][i], null], "post");
            }

            return this.template.blog.interpolate({ content:
                this.template.posts.overall.interpolate({
                    posts: posts,
                    pager: this.templetize(["page", data[1], Math.ceil(this.data.getElementsByTagName("post").length/miniLOL.config["Blog"].postsPerPage)], "pager_overall")
                })
            });
        }
        else if (type == "post") {
            var pager = (data[1] != null)
                ? this.templetize(["number", data[1], this.data.getElementsByTagName("post").length], "pager_overall")
                : '';

            var content = this.template.post.overall.interpolate({
                id: data[0].getAttribute("id"),
                content: data[0].firstChild.nodeValue,
                title: data[0].getAttribute("title"),
                date: data[0].getAttribute("date"),
                author: data[0].getAttribute("author"),
                link: "#module=blog&id="+data[0].getAttribute("id"),
                pager: pager,
                admin: (miniLOL.module.execute("security", { connected: true, cached: true })) ? this.templetize([data[0].getAttribute("id")], "admin") : ''
            });

            if (data[1] == null) {
                return content;
            }

            return this.template.blog.interpolate({ content: content });
        }
        else if (type == "pager_overall") {
            var template;
            if (data[0] == "number") {
                template = this.template.post.pager_overall;
            }
            else if (data[0] == "page") {
                template = this.template.posts.pager_overall;
            }

            return template.interpolate({
                previous: this.templetize(data, "pager_previous"),
                numbers:  this.templetize(data, "pager_numbers"),
                next:     this.templetize(data, "pager_next")
            });
        }
        else if (type == "pager_previous") {
            var template;
            if (data[0] == "number") {
                template = this.template.post.pager_previous;
            }
            else if (data[0] == "page") {
                template = this.template.posts.pager_previous;
            }

            var num = (data[1] <= 1) ? data[1] : data[1]-1;

            return template.interpolate({
                number: num,
                link: "#module=blog&#{type}=#{value}".interpolate({ type: data[0], value: num })
            });
        }
        else if (type == "pager_numbers") {
            var template;
            if (data[0] == "number") {
                template = this.template.post;
            }
            else if (data[0] == "page") {
                template = this.template.posts;
            }

            var end   = Math.floor(template.pager_numbers_length/2)+data[1];
            var start = end-template.pager_numbers_length+1;

            if (start < 1) {
                start = 1;
                end  += template.pager_numbers_length-end;
            }

            if (end > data[2]) {
                start -= end-data[2];

                if (start < 1) {
                    start = 1;
                }

                end = data[2];
            }

            var content = template[(start == data[1])
                ? "pager_numbers_current" : "pager_numbers_first"].interpolate({
                    number: start,
                    link: "#module=blog&#{type}=#{value}".interpolate({ type: data[0], value: start })
                });

            if (data[2] > 1) {
                for (var i = start+1; i < end; i++) {
                    content += template[(i == data[1])
                        ? "pager_numbers_current" : "pager_numbers_inner"].interpolate({
                            number: i,
                            link: "#module=blog&#{type}=#{value}".interpolate({ type: data[0], value: i })
                        });
                }
                content += template[(end == data[1])
                    ? "pager_numbers_current" : "pager_numbers_last"].interpolate({
                        number: end,
                        link: "#module=blog&#{type}=#{value}".interpolate({ type: data[0], value: end })
                });
            }

            return template.pager_numbers.interpolate({
                content: content
            });
        }
        else if (type == "pager_next") {
            var template;
            if (data[0] == "number") {
                template = this.template.post.pager_next;
            }
            else if (data[0] == "page") {
                template = this.template.posts.pager_next;
            }

            var num = (data[1] >= data[2]) ? data[1] : parseInt(data[1])+1;

            return template.interpolate({
                number: num,
                link: "#module=blog&" + data[0] + '=' + num
            });
        }
        else if (type == "new_post") {
            return this.template.blog.interpolate({
                content: this.template.manage.post.interpolate({
                    author: data[0],
                    editor: this.editors[miniLOL.config["Blog"].editorType || "simple"]
                })
            });
        }
        else if (type == "edit_post") {
            return this.template.blog.interpolate({
                content: this.template.manage.edit.interpolate({
                    title:   data[0],
                    author:  data[1],
                    date:    data[2],
                    post_id: data[3],
                    editor: this.editors[miniLOL.config["Blog"].editorType || "simple"]
                })
            });
        }
    },

    topic: function (id) {
        var result = {};
        var topic  = this.data.getElementById(id);
        var attrs  = topic.attributes;

        for (var i = 0; i < attrs.length; i++) {
            result[attrs[i].nodeName] = attrs[i].nodeValue;
        }

        result.content = topic.firstChild.nodeValue;

        return result;
    },

    comment: function (topic, type) {
        var result    = null;
        var resultDOM = null;
        var topic     = this.data.getElementById(topic);
        var comments  = topic.getElementsByTagName("comments")[0].getElementsByTagName("comment");

        if (type.number) {
            for (var i = 0; i < comments.length; i++) {
                if (i == type.number-1) {
                    resultDOM = comments[i];
                    break;
                }
            }
        }
        else if (type.id) {
            for (var i = 0; i < comments.length; i++) {
                if (comments[i].getAttribute("id") == type.id) {
                    resultDOM = comments[i];
                    break;
                }
            }
        }

        if (resultDOM) {
            var attrs = resultDOM.attributes;

            result        = {};
            result.number = i + 1;

            for (var i = 0; i < attrs.length; i++) {
                result[attrs[i].nodeName] = attrs[i].nodeValue;
            }

            result.content = resultDOM.firstChild.nodeValue;
        }

        return result;
    },

    comments: function (topic) {
        var result = [];
        var length = topic.getElementsByTagName("comments")[0].getElementsByTagName("comment").length;

        for (var i = 0; i < length; i++) {
            result.push(this.comment(topic, { number: i+1 }));
        }

        return result;
    }
});

})();
