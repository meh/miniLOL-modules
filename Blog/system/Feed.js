/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL. A blog module.                             *
 *                                                                          *
 * miniLOL is free software: you can redistribute it and/or modify          *
 * it under the terms of the GNU Affero General Public License as           *
 * published by the Free Software Foundation, either version 3 of the       *
 * License, or (at your option) any later version.                          *
 *                                                                          *
 * miniLOL is distributed in the hope that it will be useful,               *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 * GNU Affero General Public License for more details.                      *
 *                                                                          *
 * You should have received a copy of the GNU Affero General Public License *
 * along with miniLOL.  If not, see <http://www.gnu.org/licenses/>.         *
 ****************************************************************************/

(function () {

var Feed = Class.create({
    initialize: function (root, data) {
        this.root = root;

        this._path = data.path || "/feed.xml";
        this._type    = data.type;
        this._version = data.version;
        
        if (!this._type || !this._version) {
            this._type    = this._type || "rss";
            this._version = "2.0";
        } 

        this._max = data.max;

        this._title       = data.title || miniLOL.config["core"].siteTitle;
        this._description = data.description || "#{title} feed.".interpolate({ title: this._title });
        this._language    = data.language || "en-us";

        $$("head")[0].insert(new Element("link", {
            rel:   "alternate",
            type:  "application/#{type}+xml".interpolate({ type: this._type }),
            href:  miniLOL.path + this._path,
            title: this._title
        }));
    },

    update: function (data) {
        new Ajax.Request(this.root+"/main.php", {
            parameters: {
                feed:    this._path,
                content: this.build(data)
            },

            onFailure: function (http) {
                miniLOL.content.set("Failed to send the feed (#{status} - #{statusText}).".interpolate(http));
            }
        });
    },

    build: function (data) {
        var callback = this._callbacks["#{type}-#{version}".interpolate({ type: this._type, version: this._version })];

        if (!callback) {
            return false;
        }

        return callback.call(this, data);
    },

    _callbacks: {
        "rss-2.0": function (data) {
            var result = '';

            var posts  = data.getElementsByTagName("post");
            var max    = this._max || posts.length;
            
            result += ("<?xml version='1.0' encoding='utf-8'?>\n"
                + "<rss version='2.0'>\n"
                + "    <channel>\n"
                + "        <title><![CDATA[#{title}]]></title>\n"
                + "        <description><![CDATA[#{description}]]></description>\n"
                + "        <link><![CDATA[#{link}]]></link>\n"
                + "        <language><![CDATA[#{language}]]></language>\n"
                + "        <pubDate><![CDATA[#{date}]]></pubDate>\n"
                + "        <lastBuildDate><![CDATA[#{date}]]></lastBuildDate>\n"
                + "        <generator><![CDATA[miniLOL-Blog-#{version}]]></generator>\n"
                + "        <webMaster><![CDATA[#{author}]]></webMaster>\n"
            ).interpolate({
                title:       this._title,
                description: this._description,
                link:        "#{path}/#module=blog".interpolate(miniLOL),
                language:    this._language,

                date: new Date().toUTCString(),

                version: miniLOL.module.get("Blog").version,
                author:  miniLOL.config["Blog"].author.post
            });

            var limit = posts.length - max;
            if (limit <= 0) {
                limit = posts.length;
            }

            for (var i = posts.length-1; i >= limit; i--) {
                var description;
                if (miniLOL.config["Blog"].feed.description == "full") {
                    description = posts[i].firstChild.nodeValue;
                }
                else {
                    description = posts[i].firstChild.nodeValue.match(/^(.*?)(<br|\n)/)[1];
                }

                result += ("<item>\n"
                    + "    <title><![CDATA[#{title}]]></title>\n"
                    + "    <link><![CDATA[#{link}]]></link>\n"
                    + "    <guid><![CDATA[#{link}]]></guid>\n"
                    + "    <description><![CDATA[#{description}]]></description>\n"
                    + "    <pubDate><![CDATA[#{date}]]></pubDate>\n"
                + "</item>\n").interpolate({
                    title:       posts[i].getAttribute("title"),
                    link:        "#{path}/#module=blog&id=#{id}".interpolate({ path: miniLOL.path, id: posts[i].getAttribute("id") }),
                    description: description,
                    date:        new Date(posts[i].getAttribute("date")).toUTCString()
                });
            }

            result += "</channel>\n"
                    + "</rss>";

            return result;
        }
    }
});

return Feed;

})();
