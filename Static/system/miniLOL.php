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

require(SYSTEM.'/Events.php');
require(SYSTEM.'/Resources.php');
require(SYSTEM.'/Modules.php');
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

        // XXX: This is only for development purposes.
        return new miniLOL;
        
        if (!isset($_SESSION['miniLOL']['Static'])) {
            return $_SESSION['miniLOL']['Static'] = new miniLOL;
        }
        else {
            return $_SESSION['miniLOL']['Static'];
        }
    }

    public $events;

    public $resources;
    public $modules;

    public $theme;

    private $_data;

    private function __construct ()
    {
        $this->events = new Events($this);

        $this->resources = new Resources($this);
        $this->modules   = new Modules($this);

        $this->theme = new Theme($this);

        $this->resources->get('miniLOL.config')->load('modules/Static/resources/config.xml');
    }

    public function error ($what=null)
    {
        if ($what == null) {
            return $this->_error;
        }

        if (is_bool($what)) {
            if ($what) {
                $this->_error = 'Something went wrong.';
            }
            else {
                $this->_error = false;
            }
        }
        else {
            $this->_error = (string) $what;
        }
    }

    public function &get ($name)
    {
        return $this->_data[$name];
    }

    public function &set ($name, $value)
    {
        return $this->_data[$name] = $value;
    }

    public function load ($page, $arguments)
    {
        if (ini_get('allow_url_fopen')) {
            return file_get_contents("http://{$_SERVER['HTTP_HOST']}".WEB_ROOT."/data/{$page}?{$arguments}");
        }
        else {
            return file_get_contents(ROOT."/data/{$page}");
        }
    }

    public function go ($url, $arguments, $query=null, $again=false)
    {
        if ($url[0] == '#') {
            $url[0] = '?';
        }

        $this->events->fire(':go.before', array(
            'url'       => &$url,
            'arguments' => &$arguments,
            'query'     => &$query,
            'again'     => &$again
        ));

        if (isURL($url)) {
            header("Location: {$url}");
            return false;
        }

        if (!$query) {
            $query = $_SERVER['QUERY_STRING'];
        }

        if (preg_match('/\?(([^=&]*)&|([^=&]*)$)/', $url, $matches)) {
            $page = (!empty($matches[2])) ? $matches[2] : $matches[3];

            $alias = $this->resources->get('miniLOL.pages')->attribute($page, 'alias');
            $type  = $this->resources->get('miniLOL.pages')->attribute($page, 'type');
            $menu  = $this->resources->get('miniLOL.pages')->attribute($page, 'menu');

            if (($title = $this->resources->get('miniLOL.pages')->attribute($page, 'title'))) {
                $this->set('title', $title);
            }

            if ($alias) {
                if ($alias[0] == '#') {
                    $alias[0] = '?';
                }

                if ($alias[0] != '?') {
                    $alias = "?{$alias}";
                }

                header("Location: $alias"); 
                return false;
            }
            else {
                $content = $this->resources->get('miniLOL.pages')->get($page);
            }
        }
        else if ($arguments['module']) {
            $content = $this->modules->execute($arguments['module'], $arguments);
        }
        else if ($arguments['page']) {
            $page = $arguments['page']; unset($arguments['page']);
            $content = $this->load($page, $query);
        }
        else {
            if (!$again) {
                $config = $this->resources->get('miniLOL.config')->get('core');

                return $this->go($config['homePage'], $arguments, null, true);
            }
        }

        if ($content === null && !isset($arguments['module'])) {
            $content = '404 - Not Found';
        }
        else {
            if (isset($arguments['type'])) {
                $type = $arguments['type'];
            }

            if ($type) {
                $content = $this->resources->get('miniLOL.functions')->render($type, $content, $arguments);
            }
        }

        if ($arguments['menu']) {
            $menu = $arguments['menu'];
        }

        if (!$menu) {
            $menu = 'default';
        }

        $this->set('menu', preg_replace('/(href=[\'"])#/', '$1?', $this->resources->get('miniLOL.menus')->get($menu)));
        $this->set('content', preg_replace('/(href=[\'"])#/', '$1?', $content));

        $this->events->fire(':go', $url);

        return $this->theme->output($this->get('content'), $this->get('menu'));
    }
}

?>
