miniLOL.module.create('blog', {
    onLoad: function() {
        this.cache = miniLOL._cache.blog = {
            dom: null,
            cache: {},
            template: null
        };

        new Ajax.Request(this.root+'/resources/blog.xml', {
            method: 'get',
            asynchronous: false,

            onSuccess: function (http) {
                http.responseXML.$ = _$;
                miniLOL._cache.blog.dom = http.responseXML;
                miniLOL._cache.blog.template
                    = http.responseXML.getElementsByTagName("template")[0].firstChild.nodeValue;
            }
        });

        setTimeout("miniLOL.module.reload('blog')", miniLOL.config.refreshEvery*1000);
    },

    execute: function (args) {
        if (!miniLOL._cache.blog) {
            miniLOL.config.contentNode.innerHTML = "An error occurred while loading blog.xml";
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
