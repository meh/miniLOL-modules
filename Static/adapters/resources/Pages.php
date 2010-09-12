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

class PagesResource extends Resource
{
    public function name ()
    {
        return 'miniLOL.pages';
    }

    public function _load ($path)
    {
        foreach (DOMDocument::load($path)->getElementsByTagName('page') as $page) {
            $this->_data['content'][$page->getAttribute('id')] = $page;
        }
    }

    public function get ($id)
    {
        return $this->_data['content'][$id];
    }

    public function attribute ($page, $name)
    {
        return $this->_data['attributes'][$page][$name];
    }

    public function normalize ($callback)
    {
        foreach ($this->_data['content'] as $name => $page) {
            $this->_data['attributes'][$name] = ObjectFromAttributes($page->attributes);
            $this->_data['content'][$name]    = call_user_func($callback, $page);
        }
    }
}

?>
