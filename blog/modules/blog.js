miniLOL.module.create('blog', {
    onLoad: function() {
        this._error = false;

        new Ajax.Request('resources/blog.xml', {
            method: 'get',
            asynchronous: false,

            onSuccess: function (http) {
                http.responseXML.$ = _$;
                miniLOL._cache.blog = http.responseXML;
            }

            onFailure: function () {
                miniLOL.module.list.blog._error = true;
            }
        });
    },

    execute: function (args) {
        if (this._error) {
            miniLOL.config.contentNode.innerHTML = "An error occurred while loading blog.xml";
        }
    }
});
