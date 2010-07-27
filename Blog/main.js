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

miniLOL.module.create("Blog", {
    version: "0.3",

    type: "active",

    aliases: ["blog"],

    initialize: function () {
        this.Blog = miniLOL.utils.execute(this.root+"/system/Blog.js");
        this.blog = new this.Blog(this.root, "/resources/data.xml", "/resources/config.xml");

        Event.observe(document, ":refresh", function () {
            miniLOL.module.execute("Blog", { rehash: true });
        });
    },

    execute: function (args) {
        if (args["post"] || args["edit"] || args["remove"]) {
            // if there's no id and it's not posting a post (lol) go batshit.
            if (!args["id"] && !(args["post"] && !args["comment"])) {
                miniLOL.content.set("You're doing it wrong.");
                return false;
            }

            if (args["comment"]) {
                if (args["post"]) {
                    if (args["do"]) {
                        args["title"]  = args["title"] || "Re: " + this.topic(args["id"]).title;
                        args["date"]   = new Date().toString();
                        args["author"] = args["author"] || miniLOL.config["Blog"].author.comment;
        
                        this.blog.post("comment", {
                            title:   args["title"],
                            date:    args["date"],
                            author:  args["author"],
                            content: args["content"]
                        });
                    }
                    else {
                        miniLOL.content.set(this.blog.template.apply("new_comment", { id: args["id"] }));
                    }
                }
            }
            else {
                if (args["post"]) {
                    if (args["do"]) {
                        args["title"]   = args["title"]   || '';
                        args["date"]    = args["date"]    || new Date().toString();
                        args["author"]  = args["author"]  || miniLOL.config["Blog"].author.post;
                        args["content"] = args["content"] || '';

                        miniLOL.content.set("Posting...");
    
                        this.blog.post({
                            title:   args["title"],
                            date:    args["date"],
                            author:  args["author"],
                            content: args["content"]
                        });
                    }
                    else {
                        miniLOL.content.set(this.blog.template.apply("new_post", { author: miniLOL.config["Blog"].author.post }));
                    }
                }
                else if (args["edit"]) {
                    if (args["id"]) {
                        if (args["do"]) {
                            args["title"]   = args["title"]   || '';
                            args["date"]    = args["date"]    || new Date().toString();
                            args["author"]  = args["author"]  || miniLOL.config["Blog"].author.post;
                            args["content"] = args["content"] || '';
        
                            this.blog.edit({
                                id:      args["id"],
                                title:   args["title"],
                                date:    args["date"],
                                author:  args["author"],
                                content: args["content"]
                            });
                        }
                        else {
                            var post = this.blog.getPost(args["id"]);
        
                            if (post == null) {
                                miniLOL.error("The post doesn't exist.", miniLOL.theme.content(), true);
                                return false;
                            }
        
                            miniLOL.content.set(this.blog.template.apply("edit_post", {
                                title:  post.getAttribute("title"),
                                author: post.getAttribute("author"),
                                date:   post.getAttribute("date"),
                                id:     args["id"]
                            }));
                        }
                    }
                    else {
                        miniLOL.content.set("You're doing it wrong.");
                        return false;
                    }
                }
                else if (args["remove"]) {
                    if (!args["id"]) {
                        miniLOL.content("You're doing it wrong.", miniLOL.theme.content(), true);
                        return false;
                    }
        
                    if (args["do"]) {
                        this.blog.remove({ id: args["id"] });
                    }
                    else {
                        miniLOL.content.set("You're doing it wrong.");
                        return false;
                    }
                }
            }
        }
        else if (args["rehash"]) {
            this.blog.rehash();
        }
        else if (args["feed"]) {
            if (args["build"]) {
                this.blog.feed.update(this.blog.data);
            }
        }
        else if (args["dashboard"]) {
            miniLOL.content.set(this.blog.template.apply("dashboard"));
        }
        else {
            args["page"] = args["page"] || 1;
            
            if (args["id"]) {
                var post = this.blog.getPost(args["id"]);

                if (post) {
                    var posts = this.blog.getPosts();
                    miniLOL.content.set(this.blog.template.apply("post", { post: post, number: posts.indexOf(post) + 1, total: posts.length }));

                    if (miniLOL.config["Blog"].title) {
                        document.title = miniLOL.config["Blog"].title.interpolate(Object.extend(this.blog.getPostInfo(post), miniLOL.config["core"]));
                    }
                }
                else {
                    miniLOL.error("Post not found.", miniLOL.theme.content(), true);
                    return false;
                }
            }
            else if (args["number"]) {
                var posts = this.blog.getPosts();

                if (args["number"] <= posts.length) {
                    var post = posts[parseInt(args["number"])-1];
                    miniLOL.content.set(this.blog.template.apply("post", { post: post, number: parseInt(args["number"]), total: posts.length }));

                    if (miniLOL.config["Blog"].title) {
                        document.title = miniLOL.config["Blog"].title.interpolate(Object.extend(this.blog.getPostInfo(post), miniLOL.config["core"]));
                    }
                }
                else {
                    miniLOL.content.set("Post not found.");
                    return false;
                }
            }
            else {
                var allPosts = this.blog.getPosts();

                if (allPosts.length == 0) {
                    miniLOL.content.set("The blog is empty :(");
                    return false;
                }
    
                if (args["page"] > Math.ceil(allPosts.length/miniLOL.config["Blog"].postsPerPage) || args["page"] < 1) {
                    miniLOL.content.set("Page not found.");
                    return false;
                }
    
                var posts = [];

                for (var i = allPosts.length - 1 - (miniLOL.config["Blog"].postsPerPage * (args["page"] - 1)), count = 0;
                     count < miniLOL.config["Blog"].postsPerPage && i >= 0;
                     i--, count++) {
                    posts.push(allPosts[i]);
                }
    
                miniLOL.content.set(this.blog.template.apply("posts", { posts: posts, page: parseInt(args["page"]), total: Math.ceil(this.blog.getPosts().length / miniLOL.config["Blog"].postsPerPage) }));
            }
        }

        return true;
    }
});
