miniLOL.module.create('blog', {
    onLoad: function() {
        miniLOL.resource.blog = {
            name: 'blog',
            res: null,

            load: function (path) {
                if (miniLOL.resource.blog.res == null) {
                    miniLOL.resource.blog.res = {
                        dom: null,
                        cache: {},
                        template: {},
                    }
                }

                new Ajax.Request(path, {
                    method: 'get',
                    asynchronous: false,

                    onSuccess: function (http) {
                        http.responseXML.$ = _$;
                        miniLOL.resource.blog.res.dom = http.responseXML;

                        var template = http.responseXML.getElementsByTagName("template")[0];
                        miniLOL.resource.blog.res.template.blog  = template.getElementsByTagName('blog')[0].firstChild.nodeValue;

                        var posts   = template.getElementsByTagName('posts')[0];
                        var pager   = posts.getElementsByTagName('pager')[0];
                        var numbers = pager.getElementsByTagName('numbers')[0];
                        miniLOL.resource.blog.res.template.posts = new Object;
                        miniLOL.resource.blog.res.template.posts.overall = posts.firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.posts.pager_overall = pager.firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.posts.pager_previous = posts.getElementsByTagName('previous')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.posts.pager_numbers = numbers.firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.posts.pager_numbers_length = parseInt(numbers.getAttribute('length'));
                        miniLOL.resource.blog.res.template.posts.pager_numbers_first = numbers.getElementsByTagName('first')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.posts.pager_numbers_inner = numbers.getElementsByTagName('inner')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.posts.pager_numbers_current = numbers.getElementsByTagName('current')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.posts.pager_numbers_last  = numbers.getElementsByTagName('last')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.posts.pager_next = pager.getElementsByTagName('next')[0].firstChild.nodeValue;
                        
                        var post    = template.getElementsByTagName('post')[0];
                        var pager   = post.getElementsByTagName('pager')[0];
                        var numbers = pager.getElementsByTagName('numbers')[0];
                        miniLOL.resource.blog.res.template.post = new Object;
                        miniLOL.resource.blog.res.template.post.overall = post.firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post.pager_overall = pager.firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post.pager_previous = post.getElementsByTagName('previous')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post.pager_numbers = numbers.firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post.pager_numbers_length = parseInt(numbers.getAttribute('length'));
                        miniLOL.resource.blog.res.template.post.pager_numbers_first = numbers.getElementsByTagName('first')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post.pager_numbers_inner = numbers.getElementsByTagName('inner')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post.pager_numbers_current = numbers.getElementsByTagName('current')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post.pager_numbers_last  = numbers.getElementsByTagName('last')[0].firstChild.nodeValue;
                        miniLOL.resource.blog.res.template.post.pager_next = pager.getElementsByTagName('next')[0].firstChild.nodeValue;
                    }
                });
            }
        };

        miniLOL.resource.load(miniLOL.resource.blog, this.root+"/resources/blog.xml");
        miniLOL.resource.load(miniLOL.resource.config, this.root+"/resources/config.xml");
        this.cache = miniLOL.resource.blog.res;

        include("css", this.root+"/resources/style.css");

        new PeriodicalExecuter(function(){miniLOL.resource.reload(miniLOL.resource.blog)}, miniLOL.config.refreshEvery);
    },

    execute: function (args) {
        if (!this.cache.dom) {
            throw "An error occurred while loading blog.xml";
        }

        args.page = args.page || 1;
        
        if (args.id) {
            var post = this.cache.dom.$(args.id);
            if (post) {
                miniLOL.config.contentNode.innerHTML = this.templetize([post, parseInt(args.id)], 'post');
            }
            else {
                miniLOL.config.contentNode.innerHTML = "Post not found.";
                return false;
            }
        }
        else {
            var allPosts = this.cache.dom.getElementsByTagName("data")[0].getElementsByTagName('post');

            if (args.page > Math.ceil(allPosts.length/miniLOL.config.blog.postsPerPage) || args.page < 1) {
                miniLOL.config.contentNode.innerHTML = "Page not found.";
                return false;
            }

            var posts = new Array;

            for (   var i = allPosts.length-1-(miniLOL.config.blog.postsPerPage*(args.page-1)), count = 0;
                    count < miniLOL.config.blog.postsPerPage && i >= 0;
                    i--, count++) {
                posts.push(allPosts[i]);
            }

            miniLOL.config.contentNode.innerHTML = this.templetize([posts, parseInt(args.page)], 'posts');
        }

        return true;
    },

    templetize: function (data, type) {
        if (type == "posts") {
            var posts = new String;
            for (var i = 0; i < data[0].length; i++) {
                posts += this.templetize([data[0][i], null], 'post');
            }

            return this.cache.template.blog.interpolate({ content:
                this.cache.template.posts.overall.interpolate({
                    posts: posts,
                    pager: this.templetize(['page', data[1], Math.ceil(this.cache.dom.getElementsByTagName("data")[0].getElementsByTagName('post').length/miniLOL.config.blog.postsPerPage)], 'pager_overall'),
                }),
            });
        }
        else if (type == "post") {
            var pager = (data[1] != null)
                ? this.templetize(['id', data[1], this.cache.dom.getElementsByTagName("data")[0].getElementsByTagName('post').length], 'pager_overall')
                : "";

            var content = this.cache.template.post.overall.interpolate({
                content: data[0].firstChild.nodeValue,
                title: data[0].getAttribute('title'),
                date: data[0].getAttribute('date'),
                author: data[0].getAttribute('author'),
                link: "#module=blog&id="+data[0].getAttribute('id'),
                pager: pager,
            });

            if (data[1] == null) {
                return content;
            }

            return this.cache.template.blog.interpolate({ content: content });
        }
        else if (type == 'pager_overall') {
            var template;
            if (data[0] == 'id') {
                template = this.cache.template.post.pager_overall;
            }
            else if (data[0] == 'page') {
                template = this.cache.template.posts.pager_overall;
            }

            return template.interpolate({
                previous: this.templetize(data, 'pager_previous'),
                numbers:  this.templetize(data, 'pager_numbers'),
                next:     this.templetize(data, 'pager_next'),
            });
        }
        else if (type == 'pager_previous') {
            var template;
            if (data[0] == 'id') {
                template = this.cache.template.post.pager_previous;
            }
            else if (data[0] == 'page') {
                template = this.cache.template.posts.pager_previous;
            }

            var num = (data[1] <= 1) ? data[1] : data[1]-1;

            return template.interpolate({
                number: num,
                link: "#module=blog&"+data[0]+"="+num,
            });
        }
        else if (type == 'pager_numbers') {
            var template;
            if (data[0] == 'id') {
                template = this.cache.template.post;
            }
            else if (data[0] == 'page') {
                template = this.cache.template.posts;
            }

            var end   = Math.floor(template.pager_numbers_length/2)+data[1];
            var start = end-template.pager_numbers_length+1;

            if (start < 1) {
                start = 1;
                end  += template.pager_numbers_length-end;
            }

            if (end > data[2]) {
                start -= end-data[2];

                if (start < 1) {
                    start = 1;
                }

                end = data[2];
            }

            var content = new String;

            content += template[(start == data[1])
                ? "pager_numbers_current" : "pager_numbers_first"].interpolate({
                    number: start,
                    link: "#module=blog&"+data[0]+"="+start,
            });

            if (data[2] > 1) {
                for (var i = start+1; i < end; i++) {
                    content += template[(i == data[1])
                        ? "pager_numbers_current" : "pager_numbers_inner"].interpolate({
                            number: i,
                            link: "#module=blog&"+data[0]+"="+i,
                    });
                }
                content += template[(end == data[1])
                    ? "pager_numbers_current" : "pager_numbers_last"].interpolate({
                        number: end,
                        link: "#module=blog&"+data[0]+"="+end,
                });
            }

            return template.pager_numbers.interpolate({
                content: content,
            });
        }
        else if (type == 'pager_next') {
            var template;
            if (data[0] == 'id') {
                template = this.cache.template.post.pager_next;
            }
            else if (data[0] == 'page') {
                template = this.cache.template.posts.pager_next;
            }

            var num = (data[1] >= data[2]) ? data[1] : parseInt(data[1])+1;

            return template.interpolate({
                number: num,
                link: "#module=blog&"+data[0]+"="+num,
            });
        }
    }
});
