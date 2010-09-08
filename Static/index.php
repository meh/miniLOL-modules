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

define('ROOT',     realpath(dirname(__FILE__)));
define('WEB_ROOT', dirname($_SERVER['SCRIPT_NAME']));
define('MODULES',  ROOT.'/modules');
define('SYSTEM',   MODULES.'/Static/system');
define('ADAPTERS', MODULES.'/Static/adapters');

require(SYSTEM.'/utils.php');
require(SYSTEM.'/miniLOL.php');

session_start();

$miniLOL = miniLOL::instance();

$miniLOL->resources->get('miniLOL.config')->load('resources/config.xml');

$config =& $miniLOL->resources->get('miniLOL.config')->get();

$miniLOL->set('title', $config['core']['siteTitle']);

$miniLOL->theme->load($config['core']['theme']);

$miniLOL->resources->get('miniLOL.menus')->load('resources/menus.xml')->normalize(array($miniLOL->theme, 'menus'));
$miniLOL->resources->get('miniLOL.pages')->load('resources/pages.xml')->normalize(array($miniLOL->theme, 'pages'));

$miniLOL->resources->get('miniLOL.functions')->load('resources/functions.xml');

foreach ($miniLOL->resources->get('miniLOL.modules')->load('resources/modules.xml') as $module) {
    $miniLOL->modules->load($module);
}

if (ob_get_length() > 0) {
    $miniLOL->error(ob_get_contents());
}

ob_end_clean();

if ($miniLOL->error()) {
    echo $miniLOL->error();
    exit;
}

$output['content'] = $miniLOL->go($_SERVER['REQUEST_URI'], $_REQUEST);

if ($content === false) {
    exit;
}

$output['title'] = $miniLOL->get('title');

$output['meta'] = '';
if (is_array($config['Static']['meta'])) {
    foreach ($config['Static']['meta'] as $name => $content) {
        $output['meta'] .= "<meta name='{$name}' content='{$content}'/>\n";
    }
}

$output['favicon'] = ($config['Static']['favicon'])
    ? $output['favicon'] = "<link rel='icon' type='image/png' href='{$config['Static']['favicon']}'/>"
    : '';

$output['styles'] = '';
foreach ($miniLOL->theme->styles() as $style) {
    $output['styles'] .= "<link rel='stylesheet' type='text/css' href='{$miniLOL->theme->path(true)}/{$style}.css'/>\n";
}

$output['javascript'] = array();

if ($config['Static']['alwaysOn'] != 'true') {
    $scripts = unifiedScriptsURL(array(
        'system/prototype.min.js', 'system/unFocus-History.min.js', 'system/cookiejar.min.js',

        # 'system/scriptaculous.min.js' # Uncomment if you need scriptaculous

        'system/miniLOL.min.js', 
    ));

    $output['javascript']['dependencies'] = <<<HTML

    <script type="text/javascript" src="{$scripts}"></script>

    <script type="text/javascript">// <![CDATA[
        (miniLOL.utils.fixURL = function () {
            var matches = location.href.match(/\?(.*)$/);

            if (matches) {
                location.href = location.href.replace(/\?(.*)$/, "#" + matches[1]);

                return true;
            }
        })();
    // ]]></script>

HTML;

    $output['javascript']['initialization'] = 'if (miniLOL.utils.fixURL()) return false; miniLOL.initialize()';
}

$output['whole'] = <<<HTML

<!DOCTYPE html>
<html>
<head>
    <title>{$output['title']}</title>

    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>

    {$output['meta']}

    {$output['favicon']}

    {$output['styles']}

    {$output['javascript']['dependencies']}
</head>

<body onload="{$output['javascript']['initialization']}">
    {$output['content']}
</body>
</html>

HTML;

$miniLOL->set('output', $output['whole']);
$miniLOL->events->fire(':output');
echo $miniLOL->get('output');

?>
