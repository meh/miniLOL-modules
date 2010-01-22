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

(function () {

miniLOL.module.create("Blog", {
    version: "0.3",

    type: "active",

    aliases: ["blog"],

    initialize: function () {
        this.Blog = miniLOL.utils.require(this.root+"/system/Blog.js");
        this.blog = new this.Blog(this.root, "/resources/data.xml", "/resources/config.xml", "/resources/style", "/resources/template", "/resources/editors");

        Event.observe(document, ":refresh", function () {
            miniLOL.module.get("Blog").blog.template.reload();
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
        else {
            args["page"] = args["page"] || 1;
            
            if (args["id"]) {
                var post = this.blog.getPost(args["id"]);
                if (post) {
                    var posts = this.blog.getPosts();
                    miniLOL.content.set(this.blog.template.apply("post", { post: post, number: posts.indexOf(post) + 1, total: posts.length }));
                }
                else {
                    miniLOL.error("Post not found.", miniLOL.theme.content(), true);
                    return false;
                }
            }
            else if (args["number"]) {
                var posts = this.blog.getPosts();

                if (args["number"] <= posts.length) {
                    miniLOL.content.set(this.blog.template.apply("post", { post: posts[parseInt(args["number"])-1], number: parseInt(args["number"]), total: posts.length }));
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

})();
