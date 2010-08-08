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
    public $miniLOL;

    private $_name;
    private $_path;
    private $_info;
    private $_styles;
    private $_template;
    
    public function __construct ($miniLOL)
    {
        $this->miniLOL = $miniLOL;
    }

    public function load ($name)
    {
        $path = ROOT."/themes/{$name}";

        $this->_name   = $name;
        $this->_path   = realpath($path);
        $this->_info   = array();
        $this->_styles = array();

        $xml = simplexml_load_file($this->path().'/theme.xml');

        foreach ($xml->attributes() as $name => $value) {
            $this->_info[(string) $name] = (string) $value;
        }

        foreach ($xml->xpath('/theme/styles/style') as $style) {
            $attributes = $style->attributes();
            array_push($this->_styles, (string) $attributes['name']);
        }

        $this->_template = file_get_contents("{$this->_path}/template.html");
    }

    public function name ()
    {
        return $this->_name;
    }

    public function path ($relative=false)
    {
        return ($relative) ? "themes/{$this->name()}" : $this->_path;
    }

    public function info ()
    {
        return $this->_info;
    }

    public function styles ()
    {
        return $this->_styles;
    }

    public function template ()
    {
        return $this->_template;
    }

    public function menus ($menu)
    {

    }

    public function pages ($page)
    {
    }

    public function output ($content, $menu)
    {

    }
}

?>
