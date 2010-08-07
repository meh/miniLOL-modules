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

abstract class Resource
{
    private $_calls;
    private $_data;

    private $miniLOL;

    public function __construct ($miniLOL)
    {
        $this->miniLOL = $miniLOL;

        $this->clear();
        $this->flush();
    }

    public function load ()
    {
        $args = func_get_args();

        try {
            call_user_method_array('_load', $this, $args);

            array_push($this->_calls, $args);
        }
        catch (Exception $e) {
            throw $e;
        }

        return $this;
    }

    public function clear ()
    {
        $this->_data = array();
    }

    public function flush ()
    {
        $result       = $this->_calls;
        $this->_calls = array();

        return $result;
    }

    public function reload ()
    {
        $this->clear();

        foreach ($this->flush() as $call) {
            call_user_func($this->load, $call);
        }
    }

    abstract public function name ();
}

?>
