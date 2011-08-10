<?php
/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh@paranoici.org]           *
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

class Page {
    public $attributes;
    public $meta;

    private $_dom;

    function __construct ($dom) {
        $this->_dom       = $dom;
        $this->attributes = ObjectFromAttributes($this->_dom->attributes);
        $this->meta       = XMLToArray($this->_dom->getElementsByTagName('meta')->item(0));
    }

    public function dom () {
        return $this->_dom;
    }

    public function name () {
        return $this->_dom->getAttribute('id');
    }
}

class PagesResource extends Resource
{
    public function name ()
    {
        return 'miniLOL.pages';
    }

    public function _load ($path)
    {
        foreach (DOMDocument::load($path)->getElementsByTagName('page') as $page) {
            $page = new Page($page);
            $this->_data[$page->name()] = $page;
        }
    }

    public function get ($page)
    {
        return $this->_data[$page];
    }
}

?>
