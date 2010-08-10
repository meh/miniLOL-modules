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

class ConfigResource extends Resource
{
    public function name ()
    {
        return 'miniLOL.config';
    }

    public function __construct ($miniLOL)
    {
        parent::__construct($miniLOL);

        $this->miniLOL->events->observe(':resource.loaded', array($this, '_fix'));
    }


    public function _fix ($event)
    {
        $memo = $event->memo();
    
        if ($memo['resource']->name() != 'miniLOL.config' || $memo['arguments'][0] != 'resources/config.xml') {
            return;
        }

        $config =& $memo['resource']->get('core');

        if (!$config['siteTitle']) {
            $config['siteTitle'] = 'miniLOL ' . MINILOL_VERSION;
        }
    
        if (!$config['homePage']) {
            $config['homePage'] = '#home';
        }
        else {
            if ($config['homePage'][0] != '#' && !isURL($config['homePage'])) {
                $config['homePage'] = '#' . $config['homePage'];
            }
        }
    }

    public function _load ($path)
    {
        $xml    = simplexml_load_file($path);
        $attrs  = $xml->attributes();
        $domain = (string) $attrs['domain'];
        
        if (empty($domain)) {
            $domain = 'core';
        }

        if (!is_array($this->_data[$domain])) {
            $this->_data[$domain] = array();
        }
        
        $this->_data[$domain] = array_merge($this->_data[$domain], ConfigResource::toArray($xml));
    }

    public function &get ($domain=null)
    {
        if ($domain) {
            return $this->_data[$domain];
        }
        else {
            return $this->_data;
        }
    }

    public static function &toArray ($xml)
    {
        if (count($xml->children()) == 0) {
            return (string) $xml;
        }
    
        $result = array();
    
        foreach ($xml as $name => $value) {
            $result[$name] =& ConfigResource::toArray($value);
        }
    
        return $result;
    }
}

?>
