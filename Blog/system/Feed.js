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

        this.path    = data.path || "/feed.xml";
        this.type    = data.type;
        this.version = data.version;
        
        if (!this.type || !this.version) {
            this.type    = this.type || "rss";
            this.version = "2.0";
        } 

        this.max = data.max;

        this.title       = data.title || miniLOL.config["core"].siteTitle;
        this.description = data.description || "#{title} feed.".interpolate({ title: this.title });
        this.language    = data.language || "en-us";

        $$("head")[0].insert(new Element("link", {
            rel:   "alternate",
            type:  "application/#{type}+xml".interpolate({ type: this.type }),
            href:  miniLOL.path + this.path,
            title: this.title
        }));
    },

    update: function (data) {
        new Ajax.Request(this.root+"/main.php", {
            parameters: {
                feed:    this.path,
                content: this.build(data)
            },

            onFailure: function (http) {
                miniLOL.content.set("Failed to send the feed (#{status} - #{statusText}).".interpolate(http));
            }
        });
    },

    build: function (data) {
        var callback = this.callbacks["#{type}-#{version}".interpolate({ type: this.type, version: this.version })];

        if (!callback) {
            return false;
        }

        return callback.call(this, data);
    },

    callbacks: {
        "rss-2.0": function (data) {
            var result = '';

            var posts  = $A(data.getElementsByTagName("post"));
            var max    = this.max || posts.length;
            
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
                title:       this.title,
                description: this.description,
                link:        "#{path}/#module=blog".interpolate(miniLOL),
                language:    this.language,

                date: new Date().toUTCString(),

                version: miniLOL.module.get("Blog").version,
                author:  miniLOL.config["Blog"].author.post
            });

            var limit = posts.length - max;

            if (limit <= 0) {
                limit = posts.length;
            }

            posts.each(function (post) {
                var description;
                if (miniLOL.config["Blog"].feed.description == "full") {
                    description = post.firstChild.nodeValue;
                }
                else {
                    description = post.firstChild.nodeValue.match(/^(.*?)(<br|\n)/)[1];
                }

                result += ("<item>\n"
                    + "    <title><![CDATA[#{title}]]></title>\n"
                    + "    <link><![CDATA[#{link}]]></link>\n"
                    + "    <guid><![CDATA[#{link}]]></guid>\n"
                    + "    <description><![CDATA[#{description}]]></description>\n"
                    + "    <pubDate><![CDATA[#{date}]]></pubDate>\n"
                + "</item>\n").interpolate({
                    title:       post.getAttribute("title"),
                    link:        "#{path}/#module=blog&id=#{id}".interpolate({ path: miniLOL.path, id: post.getAttribute("id") }),
                    description: description,
                    date:        new Date(post.getAttribute("date")).toUTCString()
                });
            });

            result += "</channel>\n"
                    + "</rss>";

            return result;
        }
    }
});

return Feed;

})();
