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
        var pres = document.getElementsByTagName("pre");
        
        for (var i = 0; i < pres.length; i++) {
            if (pres[i].className.match(/sh_/)) {
                if (pres[i].innerHTML.match(/[<>&]/)) {
                    pres[i].innerHTML = pres[i].innerHTML
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                }
            }
        }

        sh_highlightDocument(this.root+'/system/lang/', '.min.js');
    },
});
