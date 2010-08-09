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

define('MINILOL_VERSION', '1.2');
define('__VERSION__', '0.1');

ob_start();

define('ROOT',    realpath(dirname(__FILE__)));
define('MODULES', ROOT.'/modules');
define('SYSTEM',  MODULES.'/Static/system');

require(SYSTEM.'/miniLOL.php');

session_start();

$miniLOL = miniLOL::instance();

$miniLOL->resources->get('miniLOL.config')->load('resources/config.xml');

$config =& $miniLOL->resources->get('miniLOL.config')->get();

$miniLOL->theme->load($config['core']['theme']);

$miniLOL->resources->get('miniLOL.menus')->load('resources/menus.xml')->normalize(array($miniLOL->theme, 'menus'));
$miniLOL->resources->get('miniLOL.pages')->load('resources/pages.xml')->normalize(array($miniLOL->theme, 'pages'));

foreach ($miniLOL->resources->get('miniLOL.modules')->load('resources/modules.xml') as $module) {
    $miniLOL->modules->load($module);
}

if (ob_get_length() > 0) {
    $miniLOL->error(ob_get_contents());
}

ob_clean();

if ($miniLOL->error()) {
    echo $miniLOL->error();
    ob_end_flush();
    exit;
}

$output = array();

$output['title']   = $config['core']['siteTitle'];
$output['meta']    = '';
$output['styles']  = '';
$output['content'] = $miniLOL->go($_ENV['REQUEST_URI'], $_REQUEST);

if (is_array($config['Static']['meta'])) {
    foreach ($config['Static']['meta'] as $name => $content) {
        $output['meta'] .= "<meta name='{$name}' content='{$content}'/>\n";
    }
}

foreach ($miniLOL->theme->styles() as $style) {
    $output['styles'] .= "<link rel='stylesheet' type='text/css' href='{$miniLOL->theme->path(true)}/{$style}.css'/>\n";
}

echo <<<HTML
<!DOCTYPE html>
<html>
<head>
    <title>{$output['title']}</title>

    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>

    {$output['meta']}

    {$output['styles']}

    <!--
    If you don't phear the Google empire and want more speed, you can use the Google lib APIs.
    But the client needs external access to make it work and it's not good in an intranet.

    For using Google lib APIs comment the internal libraries block and uncomment the Google libraries block.
    To use the internal libraries just leave it as it is.
    -->
    
    <!-- internal libraries -->
    <script type="text/javascript" src="system/prototype.min.js"></script>
    <!-- Uncomment this if you need scriptaculous support, it's really doubling the files to get loaded
    <script type="text/javascript" src="system/scriptaculous/scriptaculous.js"></script>
    -->
    
    <!-- Google libraries
    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript">// <![CDATA[

    google.load("prototype", "1.6"); // this is needed by the core

    // Uncomment this if you need scriptaculous support, it's really doubling the files to get loaded
    // google.load("scriptaculous", "1.8.3");

    // ]]></script>
    -->

    <script type="text/javascript" src="system/unFocus-History.js"></script>
    <script type="text/javascript" src="system/cookiejar.min.js"></script>

    <script type="text/javascript" src="system/miniLOL.min.js"></script>
</head>

<body onload="miniLOL.initialize()">
    {$output['content']}
</body>
</html>
HTML;

ob_end_flush();

?>
