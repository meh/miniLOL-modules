miniLOL.module.create('blog', {
    onLoad: function() {
        miniLOL.resource.blog = {
            name: 'blog',
            res: {
                dom: null,
                cache: {},
                template: undefined,
            },

            load: function (path) {
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
        }; this.cache = miniLOL.resource.blog.res;

        miniLOL.resource.load(miniLOL.resource.blog, this.root+"/resources/blog.xml");

        new PeriodicalExecuter(function(){miniLOL.resource.reload(miniLOL.resource.blog)}, miniLOL.config.refreshEvery);
    },

    execute: function (args) {
        if (!this.cache.dom) {
            miniLOL.config.contentNode.innerHTML = "An error occurred while loading blog.xml";
            return false;
        }
        
        if (args.id) {
            var post = this.cache.dom.$(args.id);
            if (post) {

                miniLOL.config.contentNode.innerHTML = this.cache.template.interpolate({
                    content: post.firstChild.nodeValue,
                    title: post.getAttribute('title')
                });
            }
            else {
                miniLOL.config.contentNode.innerHTML = "Post not found.";
            }
        }
    }
});
