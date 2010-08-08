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

require(SYSTEM.'/Resources.php');
require(SYSTEM.'/Modules.php');
require(SYSTEM.'/Events.php');
require(SYSTEM.'/Theme.php');

class miniLOL
{
    public static $Version = '0.1';

    private static $_instance;

    public static function instance ()
    {
        if (!isset($_SESSION['miniLOL'])) {
            $_SESSION['miniLOL'] = array();
        }

        return new miniLOL;
        
        if (!isset($_SESSION['miniLOL']['Static'])) {
            return $_SESSION['miniLOL']['Static'] = new miniLOL;
        }
        else {
            return $_SESSION['miniLOL']['Static'];
        }
    }

    public $resources;
    public $modules;

    public $theme;

    public $events;

    private function __construct ()
    {
        $this->resources = new Resources($this);
        $this->modules   = new Modules($this);

        $this->theme = new Theme($this);

        $this->events = new Events($this);
    }

    public function error ($what=null)
    {
        if ($what == null) {
            return $this->_error;
        }

        if (is_bool($what)) {
            if ($what) {
                $this->_error = 'An error happened.';
            }
            else {
                $this->_error = false;
            }
        }
        else {
            $this->_error = (string) $what;
        }
    }

    public function go ($requests)
    {

    }
}

?>
