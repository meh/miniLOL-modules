/*
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                   Version 2, December 2004
 *
 *  Copyleft meh. [http://meh.paranoid.pk | meh@paranoici.org]
 *
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *********************************************************************/

miniLOL.module.create("Gallery", {
  version: "0.1",

  initialize: function () {
    miniLOL.resource.get("miniLOL.config").load(this.root + "/resources/config.xml");

    Event.observe(document, ':go', this.execute);
  },

  execute: function () {
    if (this.periodical) {
      this.periodical.stop();
      delete this.periodical;

      if ($("image")) {
        $("image").update("");
      }

      if ($("thumbnails")) {
        $("thumbnails").update("");
      }
    }

    this.dom = Element.xpath(miniLOL.page.current, "./images")[0];

    if (!this.dom || !$("image")) {
      return false;
    }

    this.images = $A(this.dom.getElementsByTagName("*"));

    if (this.images.empty()) {
      return false;
    }

    this.current = 0;

    if (this.dom.getAttribute("thumbnails") != "false") {
      this.images.each(function (image, index) {

        var div = new Element("div", { "class": "thumbnail", id: "thumbnail_" + index });

        var a = new Element("a", { href: "javascript: void(0)" })
        a.update("<img src='" + image.getAttribute("thumbnail") + "'/>");
        a.observe('click', function () {
          this.periodical.stop();

          var thumb = (this.current == 0) ? this.images.length - 1 : this.current - 1;

          if ($("thumbnail_" + thumb)) {
              $("thumbnail_" + thumb).removeClassName("current");
          }

          this.current = index;
          this.periodical.initialize(this.periodical.callback, this.periodical.frequency);
          this.periodical.execute();
        }.bind(this));

        div.insert(a)
        $("thumbnails").insert(div);
      }.bind(this));
    }

    this.periodical = new PeriodicalExecuter(function () {
      $("image").fade({ duration: 0.7, afterFinish: function () {
        $("image").update("<img src='" + this.images[this.current].getAttribute("src") + "'/>");
        Event.observe($("image").getElementsByTagName("img")[0], "load", function () {
          Event.fire(document, ":image.loaded");
        });

        Event.fire(document, ":image.add");

        if (this.dom.getAttribute("thumbnails") != "false") {
          if (this.current == 0) {
            $("thumbnail_" + (this.images.length - 1)).removeClassName("current");
            $("thumbnail_" + this.current).addClassName("current");
          }
          else {
            $("thumbnail_" + (this.current - 1)).removeClassName("current");
            $("thumbnail_" + this.current).addClassName("current");
          }
        }

        $("image").appear({ duration: 0.7, afterFinish: function () {
          Event.fire(document, ":image.added");

          this.current++;

          if (this.current >= this.images.length) {
            this.current = 0;
          }
        }.bind(this) });
      }.bind(this) });
    }.bind(this), parseInt(miniLOL.config["Gallery"].changeEvery));

    this.periodical.execute();
  }
});
