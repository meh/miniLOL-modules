<?php
/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL. A PHP implementation.                      *
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

class MenusResource extends Resource
{
    public function name ()
    {
        return 'miniLOL.menus';
    }

    public function _load ($path)
    {
        foreach (simplexml_load_file($path)->xpath('/menus/menu') as $menu) {
            $attributes = $menu->attributes();

            $this->_data[(string) $attributes['id']] = $menu;
        }
    }

    public function get ($id)
    {
        return $this->_data[$id];
    }

    public function normalize ($callback)
    {
        foreach ($this->_data as $name => $menu) {
            if (is_array($callback)) {
                $this->_data[$name] = $callback[0]->{$callback[1]}($menu);
            }
            else {
                $this->_data[$name] = $callback($menu);
            }
        }
    }
}

?>