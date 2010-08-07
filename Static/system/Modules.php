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

require(SYSTEM.'/Module.php');

foreach (glob(SYSTEM.'/modules/*/main.php') as $module) {
    require($module);
}

class Modules
{
    private $_modules;

    public function __construct ()
    {
        $this->_modules = array();
    }

    public function load ($name)
    {
        $path = SYSTEM.'/modules/'.$name.'/main.php';

        if (!file_exists($path)) {
            return;
        }

        $this->_modules[$name] = new str_replace(' ', '', $name);
    }

    public function get ($name)
    {
        return $this->_modules[$name];
    }
}

?>
