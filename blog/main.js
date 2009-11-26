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

miniLOL.module.create('blog', {
    version: '0.3',

    type: 'active',

    dependencies: [/* 'security' // It could be a `just show` blog. */],

    onLoad: function (reloading) {
        miniLOL.resources.blog = {
            name: 'blog',
            res:  null,

            load: function (data, template, editors, blog) {
                if (this.res == null) {
                    this.res = {
                        data: null,
                        cache: {},
                        template: {},
                        editors: {},
                    };

                    delete blog.data;
                    delete blog.cache;
                    delete blog.template;
                    delete blog.editors;
                } var res = this.res;

                new Ajax.Request(data + "?failCache=" + Math.random(), {
                    method: 'get',
                    asynchronous: false,

                    requestHeaders: {
                        'Cache-Control': 'must-revalidate',
                        'Pragma':        'no-cache',
                    },

                    onSuccess: function (http) {
                        res.data = _fix(http.responseXML);
                    },
                });

                new Ajax.Request(template, {
                    method: 'get',
                    asynchronous: false,

                    onSuccess: function (http) {
                        var template      = _fix(http.responseXML);
                        res.template.blog = template.getElementsByTagName('blog')[0].firstChild.nodeValue;

                        var posts   = template.getElementsByTagName('posts')[0];
                        var pager   = posts.getElementsByTagName('pager')[0];
                        var numbers = pager.getElementsByTagName('numbers')[0];
                        res.template.posts                       = new Object;
                        res.template.posts.overall               = posts.firstChild.nodeValue;
                        res.template.posts.pager_overall         = pager.firstChild.nodeValue;
                        res.template.posts.pager_previous        = posts.getElementsByTagName('previous')[0].firstChild.nodeValue;
                        res.template.posts.pager_numbers         = numbers.firstChild.nodeValue;
                        res.template.posts.pager_numbers_length  = parseInt(numbers.getAttribute('length'));
                        res.template.posts.pager_numbers_first   = numbers.getElementsByTagName('first')[0].firstChild.nodeValue;
                        res.template.posts.pager_numbers_inner   = numbers.getElementsByTagName('inner')[0].firstChild.nodeValue;
                        res.template.posts.pager_numbers_current = numbers.getElementsByTagName('current')[0].firstChild.nodeValue;
                        res.template.posts.pager_numbers_last    = numbers.getElementsByTagName('last')[0].firstChild.nodeValue;
                        res.template.posts.pager_next            = pager.getElementsByTagName('next')[0].firstChild.nodeValue;
                        
                        var post    = template.getElementsByTagName('post')[0];
                        var pager   = post.getElementsByTagName('pager')[0];
                        var numbers = pager.getElementsByTagName('numbers')[0];
                        res.template.post                       = new Object;
                        res.template.post.overall               = post.firstChild.nodeValue;
                        res.template.post.pager_overall         = pager.firstChild.nodeValue;
                        res.template.post.pager_previous        = post.getElementsByTagName('previous')[0].firstChild.nodeValue;
                        res.template.post.pager_numbers         = numbers.firstChild.nodeValue;
                        res.template.post.pager_numbers_length  = parseInt(numbers.getAttribute('length'));
                        res.template.post.pager_numbers_first   = numbers.getElementsByTagName('first')[0].firstChild.nodeValue;
                        res.template.post.pager_numbers_inner   = numbers.getElementsByTagName('inner')[0].firstChild.nodeValue;
                        res.template.post.pager_numbers_current = numbers.getElementsByTagName('current')[0].firstChild.nodeValue;
                        res.template.post.pager_numbers_last    = numbers.getElementsByTagName('last')[0].firstChild.nodeValue;
                        res.template.post.pager_next            = pager.getElementsByTagName('next')[0].firstChild.nodeValue;

                        var manage = template.getElementsByTagName('manage')[0];
                        res.template.manage = new Object;
                        res.template.manage.admin = manage.getElementsByTagName('admin')[0].firstChild.nodeValue;
                        res.template.manage.post  = manage.getElementsByTagName('post')[0].firstChild.nodeValue;
                        res.template.manage.edit  = manage.getElementsByTagName('edit')[0].firstChild.nodeValue;
                    },
                });

                new Ajax.Request(editors, {
                    method: 'get',
                    asynchronous: false,

                    onSuccess: function (http) {
                        var editors = _fix(http.responseXML).getElementsByTagName('editor');
                        for (var i = 0; i < editors.length; i++) {
                            res.editors[editors[i].getAttribute('type')] = editors[i].firstChild.nodeValue;
                        }
                    },
                });

                blog.data     = res.data;
                blog.cache    = res.cache;
                blog.template = res.template;
                blog.editors  = res.editors;
            }
        };

        miniLOL.resource.load(miniLOL.resources.blog, this.root+"/resources/data.xml", this.root+"/resources/template.xml", this.root+"/resources/editors.xml", this);
        miniLOL.resource.load(miniLOL.resources.config, this.root+"/resources/config.xml");

        include("css", this.root+"/resources/style.css");

        new PeriodicalExecuter('miniLOL.resource.reload(miniLOL.resources.blog)', miniLOL.config['core'].refreshEvery || 360);
    },

    execute: function (args) {
        if (!this.data) {
            throw new Error("An error occurred while loading data.xml");
        }

        if (args["comment"]) {
            if (!args["id"]) {
                miniLOL.content.set("You're doing it wrong.");
                return false;
            }

            if (args["post"]) {
                if (args["do"]) {
                    args["title"]   = args["title"] || "Re: " + this.topic(args["id"]).title;
                    args["date"]    = new Date().toString();
                    args["author"]  = args["author"] || miniLOL.config["blog"].author.comment;
    
                    miniLOL.module.execute('logger', ['log', 100, 'blog', 'post', {
                        title:   args['title'],
                        date:    args['date'],
                        author:  args['author'],
                        content: args['content'],
                    }]);
    
                    new Ajax.Request(this.root+"/main.php?post", {
                        method: 'post',
    
                        parameters: {
                            title:   args["title"],
                            date:    args["date"],
                            author:  args["author"],
                            content: args["content"],
                        },
    
                        onSuccess: function (http) {
                            miniLOL.content.set(http.responseText);
                            miniLOL.resource.reload(miniLOL.resources.blog);
                        },
    
                        onFailure: function () {
                            miniLOL.content.set("Something went deeply wrong.");
                        },
                    });

                }
                else {
                    if (!miniLOL.module.execute('security', { connected: true })) {
                        miniLOL.content.set("You're doing it wrong.");
                        return false;
                    }
    
                    miniLOL.content.set(this.templetize(args["id"], 'new_comment'));
                    miniLOL.content.get().evalScripts();
                }
            }
        }
        else {
            if (!miniLOL.modules.security && (args["post"] || args["edit"] || args["delete"])) {
                throw new Error("You can't post without the `security` module.");
            }

            if (args["post"]) {
                if (args["do"]) {
                    args["title"]   = args["title"]   || "";
                    args["date"]    = args["date"]    || new Date().toString();
                    args["author"]  = args["author"]  || miniLOL.config['blog'].author.post;
                    args["content"] = args["content"] || "";
    
                    miniLOL.module.execute('logger', ['log', 100, 'blog', 'post', {
                        title:   args['title'],
                        date:    args['date'],
                        author:  args['author'],
                        content: args['content'],
                    }]);
    
                    new Ajax.Request(this.root+"/main.php?post", {
                        method: 'post',
    
                        parameters: {
                            title:   args["title"],
                            date:    args["date"],
                            author:  args["author"],
                            content: args["content"],
                        },
    
                        onSuccess: function (http) {
                            miniLOL.content.set(http.responseText);
                            miniLOL.resource.reload(miniLOL.resources.blog);
                        },
    
                        onFailure: function () {
                            miniLOL.content.set("Something went deeply wrong.");
                        },
                    });
                }
                else {
                    if (!miniLOL.module.execute('security', { connected: true })) {
                        miniLOL.content.set("You're doing it wrong.");
                        return false;
                    }
    
                    miniLOL.content.set(this.templetize([miniLOL.config['blog'].author.post], 'new_post'));
                    miniLOL.content.get().evalScripts();
                }
            }
            else if (args["edit"]) {
                if (args["id"]) {
                    if (args["do"]) {
                        args["title"]   = args["title"]   || "";
                        args["date"]    = args["date"]    || new Date().toString();
                        args["author"]  = args["author"]  || miniLOL.config['blog'].author.post;
                        args["content"] = args["content"] || "";
    
                        miniLOL.module.execute('logger', ['log', 100, 'blog', 'post', args['id'], {
                            title:   args['title'],
                            date:    args['date'],
                            author:  args['author'],
                            content: args['content'],
                        }]);
    
                        new Ajax.Request(this.root+"/main.php?edit", {
                            method: 'post',
    
                            parameters: {
                                id:      args["id"],
                                title:   args["title"],
                                date:    args["date"],
                                author:  args["author"],
                                content: args["content"],
                            },
    
                            onSuccess: function (http) {
                                miniLOL.content.set(http.responseText);
                                miniLOL.resource.reload(miniLOL.resources.blog);
                            },
    
                            onFailure: function () {
                                miniLOL.content.set("Something went deeply wrong.");
                            },
                        });
                    }
                    else {
                        if (!miniLOL.module.execute('security', { connected: true })) {
                            miniLOL.content.set("You're doing it wrong.");
                            return false;
                        }
    
                        var post = this.data.getElementById(args["id"]);
    
                        if (post == null) {
                            miniLOL.content.set("The post doesn't exist.");
                            return false;
                        }
    
                        miniLOL.content.set(this.templetize([
                            post.getAttribute("title"),
                            post.getAttribute("author"),
                            post.getAttribute("date"),
                            args["id"],
                         ], 'edit_post'));
                        miniLOL.content.get().evalScripts();
                    }
                }
                else {
                    miniLOL.content.set("You're doing it wrong.");
                    return false;
                }
            }
            else if (args["delete"]) {
                if (!args["id"]) {
                    miniLOL.content.set("You're doing it wrong.");
                    return false;
                }
    
                if (args["do"]) {
                    miniLOL.module.execute('logger', ['log', 100, 'blog', 'delete', args['id']]);
    
                    new Ajax.Request(this.root+"/main.php?delete", {
                        method: 'post',
    
                        parameters: {
                            id: args["id"],
                        },
    
                        onSuccess: function (http) {
                            miniLOL.content.set(http.responseText);
                            miniLOL.resource.reload(miniLOL.resources.blog);
                        },
    
                        onFailure: function () {
                            miniLOL.content.set("Something went deeply wrong.");
                        },
                    });
                }
                else {
                    miniLOL.content.set("You're doing it wrong.");
                    return false;
                }
            }
            else if (args["build"]) {
                miniLOL.content.set("Not yet implemented.");
                return false;
            }
            else if (args["comment"]) {
                if (args[""]) {
    
                }
            }
            else {
                args["page"] = args["page"] || 1;
                
                if (args["id"]) {
                    var post = this.data.getElementById(args["id"]);
                    if (post) {
                        miniLOL.content.set(this.templetize([post, $A(this.data.getElementsByTagName("post")).indexOf(post)+1], 'post'));
                        miniLOL.content.get().evalScripts();
                    }
                    else {
                        miniLOL.content.set( "Post not found.");
                        return false;
                    }
                }
                else if (args["number"]) {
                    var posts = this.data.getElementsByTagName("post");
    
                    if (args["number"] <= posts.length) {
                        miniLOL.content.set(this.templetize([posts[parseInt(args["number"])-1], parseInt(args["number"])], 'post'));
                        miniLOL.content.get().evalScripts();
                    }
                    else {
                        miniLOL.content.set("Post not found.");
                        return false;
                    }
                }
                else {
                    var allPosts = this.data.getElementsByTagName('post');

                    if (allPosts.length == 0) {
                        miniLOL.content.set("The blog is empty :(");
                        return false;
                    }
        
                    if (args["page"] > Math.ceil(allPosts.length/miniLOL.config['blog'].postsPerPage) || args["page"] < 1) {
                        miniLOL.content.set("Page not found.");
                        return false;
                    }
        
                    var posts = new Array;
        
                    for (   var i = allPosts.length-1-(miniLOL.config['blog'].postsPerPage*(args["page"]-1)), count = 0;
                            count < miniLOL.config['blog'].postsPerPage && i >= 0;
                            i--, count++) {
                        posts.push(allPosts[i]);
                    }
        
                    miniLOL.content.set(this.templetize([posts, parseInt(args["page"])], 'posts'));
                    miniLOL.content.get().evalScripts();
                }
            }
        }

        return true;
    },

    templetize: function (data, type) {
        if (type == "admin") {
            return this.template.manage.admin.interpolate({
                post_id: data[0],
            });
        }
        else if (type == "posts") {
            var posts = new String;
            for (var i = 0; i < data[0].length; i++) {
                posts += this.templetize([data[0][i], null], 'post');
            }

            return this.template.blog.interpolate({ content:
                this.template.posts.overall.interpolate({
                    posts: posts,
                    pager: this.templetize(['page', data[1], Math.ceil(this.data.getElementsByTagName('post').length/miniLOL.config['blog'].postsPerPage)], 'pager_overall'),
                }),
            });
        }
        else if (type == "post") {
            var pager = (data[1] != null)
                ? this.templetize(['number', data[1], this.data.getElementsByTagName('post').length], 'pager_overall')
                : "";

            var content = this.template.post.overall.interpolate({
                id: data[0].getAttribute('id'),
                content: data[0].firstChild.nodeValue,
                title: data[0].getAttribute('title'),
                date: data[0].getAttribute('date'),
                author: data[0].getAttribute('author'),
                link: "#module=blog&id="+data[0].getAttribute('id'),
                pager: pager,
                admin: (miniLOL.module.execute("security", { connected: true, cached: true })) ? this.templetize([data[0].getAttribute('id')], "admin") : "",
            });

            if (data[1] == null) {
                return content;
            }

            return this.template.blog.interpolate({ content: content });
        }
        else if (type == 'pager_overall') {
            var template;
            if (data[0] == 'number') {
                template = this.template.post.pager_overall;
            }
            else if (data[0] == 'page') {
                template = this.template.posts.pager_overall;
            }

            return template.interpolate({
                previous: this.templetize(data, 'pager_previous'),
                numbers:  this.templetize(data, 'pager_numbers'),
                next:     this.templetize(data, 'pager_next'),
            });
        }
        else if (type == 'pager_previous') {
            var template;
            if (data[0] == 'number') {
                template = this.template.post.pager_previous;
            }
            else if (data[0] == 'page') {
                template = this.template.posts.pager_previous;
            }

            var num = (data[1] <= 1) ? data[1] : data[1]-1;

            return template.interpolate({
                number: num,
                link: "#module=blog&"+data[0]+"="+num,
            });
        }
        else if (type == 'pager_numbers') {
            var template;
            if (data[0] == 'number') {
                template = this.template.post;
            }
            else if (data[0] == 'page') {
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

            var content = new String;

            content += template[(start == data[1])
                ? "pager_numbers_current" : "pager_numbers_first"].interpolate({
                    number: start,
                    link: "#module=blog&"+data[0]+"="+start,
            });

            if (data[2] > 1) {
                for (var i = start+1; i < end; i++) {
                    content += template[(i == data[1])
                        ? "pager_numbers_current" : "pager_numbers_inner"].interpolate({
                            number: i,
                            link: "#module=blog&"+data[0]+"="+i,
                    });
                }
                content += template[(end == data[1])
                    ? "pager_numbers_current" : "pager_numbers_last"].interpolate({
                        number: end,
                        link: "#module=blog&"+data[0]+"="+end,
                });
            }

            return template.pager_numbers.interpolate({
                content: content,
            });
        }
        else if (type == 'pager_next') {
            var template;
            if (data[0] == 'number') {
                template = this.template.post.pager_next;
            }
            else if (data[0] == 'page') {
                template = this.template.posts.pager_next;
            }

            var num = (data[1] >= data[2]) ? data[1] : parseInt(data[1])+1;

            return template.interpolate({
                number: num,
                link: "#module=blog&" + data[0] + "=" + num,
            });
        }
        else if (type == 'new_post') {
            return this.template.blog.interpolate({
                content: this.template.manage.post.interpolate({
                    author: data[0],
                    editor: this.editors[miniLOL.config['blog'].editorType || 'simple'],
                })
            });
        }
        else if (type == 'edit_post') {
            return this.template.blog.interpolate({
                content: this.template.manage.edit.interpolate({
                    title:   data[0],
                    author:  data[1],
                    date:    data[2],
                    post_id: data[3],
                    editor: this.editors[miniLOL.config['blog'].editorType || 'simple'],
                })
            });
        }
    },

    topic: function (id) {
        var result = new Object;
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

            result        = new Object;
            result.number = i+1;

            for (var i = 0; i < attrs.length; i++) {
                result[attrs[i].nodeName] = attrs[i].nodeValue;
            }

            result.content = resultDOM.firstChild.nodeValue;
        }

        return result;
    },

    comments: function (topic) {
        var result = new Array;
        var length = topic.getElementsByTagName("comments")[0].getElementsByTagName("comment").length;

        for (var i = 0; i < length; i++) {
            result.push(this.comment(topic, { number: i+1 }));
        }

        return result;
    },
});
