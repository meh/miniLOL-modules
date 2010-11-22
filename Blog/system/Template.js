/* Copyleft meh. [http://meh.doesntexist.org | meh@paranoici.org]
 *
 * This file is part of miniLOL. A blog module.
 *
 * miniLOL is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * miniLOL is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with miniLOL. If not, see <http://www.gnu.org/licenses/>.
 ****************************************************************************/

Class.create({
    initialize: function (root) {
        this.root = root;

        this.load();
    },

    load: function () {
        if (!miniLOL.theme.style.exists('Blog/style')) {
            miniLOL.theme.style.load('/resources/style', this.root);
        }

        // load and parse blog's template
        var template = miniLOL.Document.fix(miniLOL.utils.get(this.root+'/resources/template.xml'));

        $A(editors.getElementsByTagName('editor')).each(function (editor) {
            this.editors[editor.getAttribute('type')] = editor.firstChild.nodeValue;
        }, this);
    },

    reload: function () {
        this.load();
    },

    apply: function (type, data) {
        return this.callbacks[type].call(this, data);
    },

    callbacks: {
        'post': function (data) {
            var pager = '';
            if (data['number']) {
                pager = this.apply('pager_overall', { type: 'number', position: data['number'], total: data['total'] }); 
            }

            var content = this.template.post.overall.interpolate({
                id:      data['post'].getAttribute('id'),
                content: data['post'].firstChild.nodeValue,
                title:   data['post'].getAttribute('title'),
                date:    data['post'].getAttribute('date'),
                author:  data['post'].getAttribute('author'),
                link:    '#module=Blog&id=#{id}'.interpolate({ id: data['post'].getAttribute('id') }),
                pager:   pager,
                admin:   (miniLOL.module.execute('Security', { connected: true, cached: true }))
                             ? this.apply('admin', { id: data['post'].getAttribute('id') })
                             : ''
            });

            if (Object.isUndefined(data['number'])) {
                return content;
            }
            else {
                return this.template.blog.interpolate({ content: content });
            }
        },

        'posts': function (data) {
            var posts = '';

            data['posts'].each(function (post) {
                posts += this.apply('post', { post: post });
            }, this);

            return this.template.blog.interpolate({ content:
                this.template.posts.overall.interpolate({
                    posts: posts,
                    pager: this.apply('pager_overall', { type: 'page', position: data['page'], total: data['total'] })
                })
            });
        },

        'pager_overall': function (data) {
            var template;
            if (data['type'] == 'number') {
                template = this.template.post.pager_overall;
            }
            else if (data['type'] == 'page') {
                template = this.template.posts.pager_overall;
            }

            return template.interpolate({
                previous: this.apply('pager_previous', data),
                numbers:  this.apply('pager_numbers', data),
                next:     this.apply('pager_next', data)
            });
        },

        'pager_previous': function (data) {
            var template;
            if (data['type'] == 'number') {
                template = this.template.post.pager_previous;
            }
            else if (data['type'] == 'page') {
                template = this.template.posts.pager_previous;
            }

            var num = (data['position'] <= 1) ? data['position'] : data['position'] - 1;

            return template.interpolate({
                number: num,
                link:   '#module=Blog&#{type}=#{value}'.interpolate({ type: data['type'], value: num })
            });
        },

        'pager_numbers': function (data) {
            var template;
            if (data['type'] == 'number') {
                template = this.template.post;
            }
            else if (data['type'] == 'page') {
                template = this.template.posts;
            }

            var end   = Math.floor(template.pager_numbers_length / 2) + data['position'];
            var start = end - template.pager_numbers_length + 1;

            if (start < 1) {
                start = 1;
                end  += template.pager_numbers_length - end;
            }

            if (end > data['total']) {
                start -= end - data['total'];

                if (start < 1) {
                    start = 1;
                }

                end = data['total'];
            }

            var content = template[(start == data['position']) ? 'pager_numbers_current' : 'pager_numbers_first'].interpolate({
                number: start,
                link: '#module=Blog&#{type}=#{value}'.interpolate({ type: data['type'], value: start })
            });

            if (data['total'] > 1) {
                for (var i = start + 1; i < end; i++) {
                    content += template[(i == data['position']) ? 'pager_numbers_current' : 'pager_numbers_inner'].interpolate({
                        number: i,
                        link: '#module=Blog&#{type}=#{value}'.interpolate({ type: data['type'], value: i })
                    });
                }

                content += template[(end == data['position']) ? 'pager_numbers_current' : 'pager_numbers_last'].interpolate({
                    number: end,
                    link: '#module=Blog&#{type}=#{value}'.interpolate({ type: data['type'], value: end })
                });
            }

            return template.pager_numbers.interpolate({
                content: content
            }); 
        },

        'pager_next': function (data) {
            var template;
            if (data['type'] == 'number') {
                template = this.template.post.pager_next;
            }
            else if (data['type'] == 'page') {
                template = this.template.posts.pager_next;
            }

            var num = (data['position'] >= data['total']) ? data['position'] : parseInt(data['position']) + 1;

            return template.interpolate({
                number: num,
                link: '#module=Blog&#{type}=#{value}'.interpolate({ type: data['type'], value: num })
            });
        },

        'new_post': function (data) {
            return this.template.blog.interpolate({
                content: this.template.manage.post.interpolate({
                    author: data['author'],
                    editor: this.editors[miniLOL.config['Blog'].editorType || 'simple']
                })
            });
        },

        'edit_post': function (data) {
            return this.template.blog.interpolate({
                content: this.template.manage.edit.interpolate({
                    title:  data['title'],
                    author: data['author'],
                    date:   data['date'],
                    id:     data['id'],
                    editor: this.editors[miniLOL.config['Blog'].editorType || 'simple']
                })
            });
        },

        'admin': function (data) {
            return this.template.manage.admin.interpolate({
                id: data['id']
            });
        }
    }
});
