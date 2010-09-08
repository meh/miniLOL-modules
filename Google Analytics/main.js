/*********************************************************************
*           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE              *
*                   Version 2, December 2004                         *
*                                                                    *
*  Copyleft meh.                                                     *
*                                                                    *
*           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE              *
*  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION   *
*                                                                    *
*  0. You just DO WHAT THE FUCK YOU WANT TO.                         *
*********************************************************************/

miniLOL.module.create("Google Analytics", {
    version: "0.1",

    initialize: function () {
        miniLOL.resource.get("miniLOL.config").load(this.root+"/resources/config.xml");

        window._gaq = window._gaq || [];
        window._gaq.push(["_setAccount", miniLOL.config["Google Analytics"].account]);

        var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;
        ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
        var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);

        Event.observe(document, ":go", function (event) {
            window._gaq.push(["_trackPageview", "/"+event.memo]);
        });
    }
});
