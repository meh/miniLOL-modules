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

miniLOL.module.create("IHM", {
    version: "0.1",

    type: "passive",

    initialize: function () {
        if (Prototype.Browser.IE) {
            this.wait = 23;

            this.message
                = "Are you aware that you're using a SHITTY browser?<br/><br/>"
                + "If you aren't, get a real browser, get <a href='http://getfirefox.com' style='font-size: 23px;'>Firefox</a>.<br/><br/>"
                + "If you are, <span style='color: red;'>yiff in hell furfag</span>.";
        }
        /*
        else if (Prototype.Browser.Safari) {
            this.wait = 15;

            this.message
                = "Why should I let a macfag in? At least why should I let you join instantly? :3<br/><br/>"
                + "WebKit is theoretically good, but, sadly, it sucks in some parts.<br/><br/>"
                + "For example it doesn't apply CSS added to a style tag via javascript.<br/><br/>"
                + "<span style='color: red;'>APPLE IS FOR FAGGOTS</span><br/><br/>"
                + "Get a real browser, get <a href='http://getfirefox.com' style='font-size: 23px;'>Firefox</a>.";
        }
        else if (Prototype.Browser.Chrome) {
            this.wait = 10;

            this.message
                = "Google is EVIL, its motto is \"don't be evil\" because it wants to be the only evil entity >:(<br/><br/>"
                + "Also V8 sucks hard, it's shit compared to TraceMonkey, it's faster because it has less features.<br/><br/>"
                + "<span style='color: blue;'>G</span><span style='color: red;'>o</span><span style='color: yellow;'>o</span><span style='color: blue;'>g</span><span style='color: green;'>l</span><span style='color: red;'>e</span>geddon is near.<br/><br/>"
                + "Get a real browser, get <a href='http://getfirefox.com' style='font-size: 23px;'>Firefox</a>.";
        }
        */

        this.execute(this.wait);
    },

    execute: function (seconds) {
        if (!this.message) {
            return;
        }

        function resize (lol) {
            $("IHM").setStyle({
                width:  document.viewport.getWidth() + "px",
                height: document.viewport.getHeight() + "px"
            });

            $("yiff").setStyle({
                top:  ((document.viewport.getHeight() - $("yiff").getHeight())/2) + "px",
                left: ((document.viewport.getWidth() - $("yiff").getWidth())/2) + "px"
            });

            if (lol) {
                resize.defer();
            }
        }

        var block = new Element("div", {
            id:    "IHM",
            style: "z-index: 9001; position: absolute; top: 0; left: 0; background: black; color: white; font-weight: bold; font-size: 23px; text-align: center;"
        });

        block.update("<div id='yiff' style='position: absolute;'>" + this.message + "</div>");

        $(document.body).insert(block);

        Event.observe(window, "resize", resize);
        Event.observe(document, ":initialized", resize);
        resize.defer(true);

        setTimeout(function () {
            block.remove();
            Event.stopObserving(window, "resize", resize);
        }, seconds * 1000);
    }
});
