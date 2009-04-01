miniLOL.module.create('shjs', {
    onLoad: function() {
        miniLOL.resource.load(miniLOL.resource.functions, this.root+"/resources/functions.xml");
        miniLOL.resource.load(miniLOL.resource.config,    this.root+"/resources/config.xml");

        include("css", this.root+"/resources/css/"+miniLOL.config.shjs.style);
        Import(this.root+"/system/sh_main.min.js");
    },

    onGo: function () {
        miniLOL.module.execute('shjs');
    },

    execute: function (args) {
        sh_highlightDocument(this.root+'/system/lang/', '.min.js');
    },
});
