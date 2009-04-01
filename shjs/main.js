miniLOL.module.create('shjs', {
    onLoad: function() {
        miniLOL.resource.load(miniLOL.resource.functions, this.root+"/resources/functions.xml");
        miniLOL.resource.load(miniLOL.resource.config,    this.root+"/resources/config.xml");

        include("js" , this.root+"/system/sh_main.min.js");
        include("css", this.root+"/resources/css/"+miniLOL.config.shjs.style);

        var check = function () {
            if (typeof(sh_highlightDocument) == 'function') {
                delete miniLOL.modules.loading["shjs"];
            }
            else {
                setTimeout(function(){check()}, 10);
            }
        }; setTimeout(function(){check()}, 10);

        return false;
    },

    onGo: function () {
        miniLOL.module.execute('shjs');
    },

    execute: function (args) {
        sh_highlightDocument(this.root+'/system/lang/', '.min.js');
    },
});
