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

(function () {

var IHM = Class.create({
    initialize: function (root) {
        this.root = root;

        var IHM = this;
        this.resource = new miniLOL.Resource("IHM.browsers", {
            load: function (path) {
                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,

                    onSuccess: function (http) {
                        $A(http.responseXML.getElementsByTagName("hate")).each(function (hate) {
                            IHM.browsers[hate.getAttribute("browser")] = {
                                wait:    parseFloat(hate.getAttribute("wait")) || 23,
                                message: hate.firstChild.nodeValue
                            };
                        });
                    },

                    onFailure: function (http) {
                        miniLOL.error("Error while loading IHM's hatred.xml (#{error})".interpolate({
                            error: http.status
                        }));
                    }
                });
            },

            clear: function () {
                IHM.browsers = this.data = {};
            }
        });

        this.resource.load(this.root+"/resources/hatred.xml");
    },

    apply: function () {
        var browser;

        for (var check in Prototype.Browser) {
            if (Prototype.Browser[check]) {
                browser = this.browsers[check];
                break;
            }
        }

        if (!browser) {
            return false;
        }

        function resize (retarded) {
            $("IHM").setStyle({
                width:  document.viewport.getWidth() + "px",
                height: document.viewport.getHeight() + "px"
            });

            $("yiff").setStyle({
                top:  ((document.viewport.getHeight() - $("yiff").getHeight())/2) + "px",
                left: ((document.viewport.getWidth() - $("yiff").getWidth())/2) + "px"
            });

            if (retarded) {
                resize.defer();
            }
        }

        var block = new Element("div", {
            id:    "IHM",
            style: "z-index: 9001; position: absolute; top: 0; left: 0; background: black; color: white; font-weight: bold; font-size: 23px; text-align: center;"
        });

        block.update("<div id='yiff' style='position: absolute;'>" + browser.message + "</div>");

        $(document.body).insert(block);

        Event.observe(window, "resize", resize);
        Event.observe(document, ":initialized", resize);
        resize.defer(true);

        setTimeout(function () {
            block.remove();
            Event.stopObserving(window, "resize", resize);
        }, browser.wait * 1000);

    }
});

return IHM;

})();
