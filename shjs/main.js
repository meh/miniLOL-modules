miniLOL.module.create('shjs', {
    onLoad: function() {
        miniLOL.resource.load(miniLOL.resource.functions, this.root+"/resources/functions.xml");
        miniLOL.resource.load(miniLOL.resource.config,    this.root+"/resources/config.xml");

        include("js" , this.root+"/system/sh_main.min.js");
        include("css", this.root+"/resources/css/"+miniLOL.config.shjs.style);
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
