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

(function () {
  var Blog = Class.create({
    initialize: function (config) {
      miniLOL.resource.get('miniLOL.config').load('resources/config.xml')
    },

    fetch: function (what) {
      var result;

      if (miniLOL.config['Blog']['fetchFrom']) {
        new Ajax.Request(miniLOL.config['Blog']['fetchFrom'], {
          params: what,
          evalJS: false,
          asynchronous: false,

          onSuccess: function (http) {
            result = miniLOL.JSON.unserialize(http.responseText);
          }
        });
      }
      else {
        
      }

      return result;
    }
  });

  return Blog;
})();
