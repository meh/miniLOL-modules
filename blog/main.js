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
                        template: undefined,
                    };
                }

                new Ajax.Request(path, {
                    method: 'get',
                    asynchronous: false,

                    onSuccess: function (http) {
                        http.responseXML.$ = _$;
                        miniLOL.resource.blog.res.dom = http.responseXML;
                        miniLOL.resource.blog.res.template
                            = http.responseXML.getElementsByTagName("template")[0].firstChild.nodeValue;
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
            miniLOL.config.contentNode.innerHTML = "An error occurred while loading blog.xml";
            return false;
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
        else if (args.page) {
            var output = "";
            var posts  = this.cache.dom.getElementsByTagName('post');

            for (var i = 0; i < miniLOL.config.blog.postsPerPage && i < posts.length; i++) {
                output += this.templetize(posts[i]);
            }

            miniLOL.config.contentNode.innerHTML = output;
        }
    },

    templetize: function (post) {
        return this.cache.template.interpolate({
            content: post.firstChild.nodeValue,
            title: post.getAttribute('title')
        });
    }
});
