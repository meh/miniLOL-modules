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

        var This = this;
        this._resource = new miniLOL.Resource({
            load: function (path) {
                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,

                    onSuccess: function (http) {
                        var hates = http.responseXML.getElementsByTagName("hate");

                        for (var i = 0; i < hates.length; i++) {
                            this._data[hates[i].getAttribute("browser")] = {
                                wait:    parseFloat(hates[i].getAttribute("wait")) || 23,
                                message: hates[i].firstChild.nodeValue
                            };
                        }
                    },

                    onFailure: function (http) {
                        miniLOL.error("Error while loading IHM's hatred.xml (#{error})".interpolate({
                            error: http.status
                        }));
                    }
                });
            },

            clear: function () {
                This._browsers = this._data = {};
            }
        });

        this._resource.load(this.root+"/resources/hatred.xml");
    },

    apply: function () {
        var browser;

        for (var check in Prototype.Browser) {
            if (Prototype.Browser[check]) {
                browser = this._browsers[check];
                break;
            }
        }

        if (!brower) {
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
