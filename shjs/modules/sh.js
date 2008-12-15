miniLOL.module.create('shjs', {
    onLoad: function() {
        include("js" , "modules/shjs/sh_main.min.js");
        include("css", "modules/shjs/css/"+miniLOL.config.shjsStyle);
    },

    execute: function () {
        if (typeof(sh_highlightDocument) == 'function') {
            sh_highlightDocument('modules/shjs/lang/', '.min.js');
        }
        else {
            miniLOL.module.execute('shjs', arguments[0]);
        }
    }
});
