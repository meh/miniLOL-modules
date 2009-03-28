miniLOL.module.create('blog', {
    onLoad: function() {
        miniLOL.resource.blog = {
            name: 'blog',
            res: null,

            load: function (path) {
                if (miniLOL.resource.blog.res == null) {
                    miniLOL.resource.blog.res = {
                        dom: null,
                        cache: {},
                        template: {},
                    }
                }

                new Ajax.Request(path, {
                    method: 'get',
                    asynchronous: false,

                    onSuccess: function (http) {
                        http.responseXML.$ = _$;
                        miniLOL.resource.blog.res.dom = http.responseXML;

                        var template = http.responseXML.getElementsByTagName("template")[0];
                        miniLOL.resource.blog.res.template.posts = template.getElementsByTagName('posts')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post  = template.getElementsByTagName('post')[0].firstChild.nodeValue;
                    }
                });
            }
        };

        miniLOL.resource.load(miniLOL.resource.blog, this.root+"/resources/blog.xml");
        miniLOL.resource.load(miniLOL.resource.config, this.root+"/resources/config.xml");
        this.cache = miniLOL.resource.blog.res;

        include("css", this.root+"/resources/style.css");

        new PeriodicalExecuter(function(){miniLOL.resource.reload(miniLOL.resource.blog)}, miniLOL.config.refreshEvery);
    },

    execute: function (args) {
        if (!this.cache.dom) {
            throw "An error occurred while loading blog.xml";
        }

        args.page = args.page || 1;
        
        if (args.id) {
            var post = this.cache.dom.$(args.id);
            if (post) {
                miniLOL.config.contentNode.innerHTML = this.templetize(post);
            }
            else {
                miniLOL.config.contentNode.innerHTML = "Post not found.";
            }
        }
        else {
            var output = "";
            var allPosts  = this.cache.dom.getElementsByTagName("data")[0].getElementsByTagName('post');

            var posts = new Array;

            for (   var i = allPosts.length-1-(miniLOL.config.blog.postsPerPage*(args.page-1)), count = 0;
                    count < miniLOL.config.blog.postsPerPage && i >= 0;
                    i--, count++) {
                posts.push(allPosts[i]);
            }

            miniLOL.config.contentNode.innerHTML = this.templetize(posts);
        }

        return true;
    },

    templetize: function (data) {
        if (data instanceof Array) {
            var posts = new String;
            for (var i = 0; i < data.length; i++) {
                posts += this.templetize(data[i]);
            }

            return this.cache.template.posts.interpolate({
                posts: posts,
                pager: "",
            });
        }
        else {
            return this.cache.template.post.interpolate({
                content: data.firstChild.nodeValue,
                title: data.getAttribute('title'),
            });
        }
    }
});
