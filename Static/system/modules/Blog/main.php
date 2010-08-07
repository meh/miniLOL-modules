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

require(SYSTEM.'/modules/Blog/Post.php');
require(SYSTEM.'/modules/Blog/Resource.php');

class Blog extends Module
{
    private $_resource;

    public function name ()
    {
        return 'Blog';
    }

    public function __construct ($miniLOL)
    {
        super($miniLOL);

        $this->_resource = new BlogResource;
        $this->_resource->load(MODULES.'/Blog/resources/data.xml');
    }

    public function get ($what, $data)
    {
        return $this->_resource->get($what, $data);
    }

    public function page ($number, $posts=5)
    {
        
    }
}

?>
