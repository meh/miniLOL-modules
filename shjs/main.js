miniLOL.module.create('shjs', {
    onLoad: function() {
        include("js" , this.root+"/system/sh_main.min.js");
        include("css", this.root+"/resources/css/"+miniLOL.config.shjsStyle);
    },

    execute: function () {
        if (typeof(sh_highlightDocument) == 'function') {
            sh_highlightDocument(this.root+'/system/lang/', '.min.js');
        }
        else {
            miniLOL.module.execute('shjs', arguments[0]);
        }
    }
});
