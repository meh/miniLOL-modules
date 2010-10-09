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

miniLOL.module.create('Wiki', {
    version: '0.1',

    type: 'active',

    aliases: ['wiki'],

    initialize: function () {
        this.Wiki = miniLOL.utils.execute(this.root+'/system/Wiki.js', { minified: true });
        this.wiki = new this.Wiki(this.root, '/resources/data.xml', '/resources/config.xml');

        Event.observe(document, ':refresh', function () {
            miniLOL.module.execute('Wiki', { rehash: true });
        });
    },

    execute: function (args) {
        if (args['page']) {
            if (args['edit']) {

            }
            else {
                miniLOL.content.set(this.wiki.render(args['page']));
            }
        }
        else {
            miniLOL.content.set(this.wiki.dashboard());
        }
    }
});
