miniLOL.module.create('shjs', {
    initialize: function() {
        miniLOL.resource.load(miniLOL.resource.functions, this.root+"/resources/functions.xml");
        miniLOL.resource.load(miniLOL.resource.config,    this.root+"/resources/config.xml");

        miniLOL.theme.style.load(miniLOL.config.shjs.style, this.root+"/resources/css");
        miniLOL.utils.require(this.root+"/system/sh_main.min.js");

        Event.observe(window, ':go', this.execute);
    },

    execute: function () {
        var pres = document.getElementsByTagName("pre");
        
        for (var i = 0; i < pres.length; i++) {
            if (pres[i].className.match(/(^| )sh_/)) {
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
