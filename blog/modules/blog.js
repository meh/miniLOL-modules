miniLOL.module.create('blog', {
    onLoad: function() {
        new Ajax.Request('resources/blog.xml', {
            method: 'get',
            asynchronous: false,

            onSuccess: function (http) {
                http.responseXML.$ = _$;
                miniLOL._cache.blog = http.responseXML;
            }
        });

        setTimeout("miniLOL.module.reload('blog')", miniLOL.config.refreshEvery*1000);
    },

    execute: function (args) {
        if (!miniLOL._cache.blog) {
            miniLOL.config.contentNode.innerHTML = "An error occurred while loading blog.xml";
        }
        
        if (args.id) {
            var post = miniLOL._cache.blog.$(args.id);
            if (post) {
                miniLOL.config.contentNode.innerHTML = post.firstChild.nodeValue;
            }
            else {
                miniLOL.config.contentNode.innerHTML = "Post not found.";
            }
        }
    }
});
