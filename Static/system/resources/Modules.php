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

class Modules extends Resource
{
    public function name ()
    {
        return 'miniLOL.modules';
    }

    public function _load ($path)
    {
        foreach (DOMDocument::loadXML($path)->getElementsByTagName('module') as $module) {
            array_push($this->_data, $module->getAttribute('name'));
        }
    }

    public function each ($callback)
    {
        array_walk($this->_data, $callback)
    }

    public function exists ($name)
    {
        return array_search($this->_data, $name) !== FALSE;
    }
}

?>
