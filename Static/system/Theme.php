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

class Theme
{
    private $_path;
    private $_info;
    private $_styles;
    
    public function __construct ($path)
    {
        $this->_path   = realpath(dirname($path));
        $this->_info   = array();
        $this->_styles = array();

        $xml = simplexml_load_file($path);

        foreach ($xml->attributes() as $name => $value) {
            $this->_info[(string) $name] = (string) $value;
        }

        foreach ($xml->xpath('/theme/styles/style') as $style) {
            array_push($this->_styles, $style);
        }
    }
}

?>
