/* Copyleft meh. [http://meh.doesntexist.org | meh@paranoici.org]
 *
 * This file is part of miniLOL.
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
    initialize: function (root, data, config) {
        this.root = root;

        this.resource = new miniLOL.Resource('Wiki', {
            load: function (path) {
                var dom = miniLOL.Document.fix(miniLOL.utils.get(path));

                $A(dom.getElementsByTagName('page')).each(function (page) {
                    this.data[page.getAttribute('id')] = page.firstChild.nodeValue;
                }, this);
            }
        });

        this.resource.load(this.root + data);

        Event.observe(document, ':resource.loaded', function (event) {
            if (event.memo.resource.name != 'miniLOL.config' || event.memo.arguments[0] != root + config) {
                return;
            }

            if (!miniLOL.config['Wiki']) {
                miniLOL.config['Wiki'] = {};
            }

            if (!miniLOL.config['Wiki'].format) {
                miniLOL.config['Wiki'].format = 'Markdown';
            }
        });

        miniLOL.resource.get('miniLOL.config').load(this.root + config);
    },

    render: function (page) {
        return miniLOL.module.execute(miniLOL.config['Wiki'].format, this.resource.data()[page]);
    },
    
    dashboard: function () {
        var output = '';

        output += '<ul>';

        Object.keys(this.resource.data()).each(function (page) {
            output += '<li><a href="#module=Wiki&page=#{page}>#{page}</a></li>'.interpolate({
                page: page
            });
        });

        output += '</ul>';

        return output;
    }
});
