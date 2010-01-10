/*********************************************************************
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             *
 *                   Version 2, December 2004                        *
 *                                                                   *
 *  Copyleft meh.                                                    *
 *                                                                   *
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             *
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION  *
 *                                                                   *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.                        *
 *********************************************************************/

miniLOL.module.create("ihm", {
    version: "0.1",

    type: "passive",

    initialize: function () {
        this.execute(23);
    },

    execute: function (seconds) {
        if (!Prototype.Browser.IE) {
            return;
        }

        function resize () {
            $("yiff").setStyle({
                top:  ((document.viewport.getHeight() - $("yiff").getHeight())/2) + "px",
                left: ((document.viewport.getWidth() - $("yiff").getWidth() )/2) + "px"
            });
        }

        var block = new Element("div", {
            style: "z-index: 9001; position: absolute; top: 0; left: 0; background: black; color: white; font-weight: bold; font-size: 23px; text-align: center;"
        });

        block.setStyle({
            width:  document.viewport.getWidth() + "px",
            height: document.viewport.getHeight() + "px"
        });

        block.update("<div id='yiff' style='position: absolute;'>" +
            "Are you aware that you're using a SHITTY browser?<br/><br/>" +
            "If you aren't, get a real browser, get <a href='http://getfirefox.com' style='font-size: 23px;'>Firefox</a>.<br/><br/>" +
            "If you are, <span style='color: red;'>yiff in hell furfag</span>."
        + "</div>");

        $(document.body).insert(block);

        Event.observe(window, "resize", resize);
        resize.defer();

        setTimeout(function () {
            block.remove();
            Event.stopObserving(window, "resize", resize);
        }, seconds * 1000);
    }
});
