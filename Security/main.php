<?php
/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL. A server side support module.              *
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

define('__VERSION__', '0.2.4');

function simpleXMLToArray ($xml)
{
    if (count($xml->children()) == 0) {
        return (string) $xml;
    }

    $result = array();

    foreach ($xml as $name => $value) {
        $result[$name] = simpleXMLToArray($value);
    }

    return $result;
}

include_once('utils.php');

session_set_cookie_params(60*60*24*365, '/');
session_start();

if (isset($_REQUEST['connected'])) {
    if (@$_SESSION['miniLOL']['admin']) {
        echo 'true';
    }
    else {
        echo 'false';
    }

    exit;
}
else if (isset($_REQUEST['build'])) {
    $_SESSION['miniLOL']['config'] = simpleXMLToArray(simplexml_load_string(security_loadConfig('resources/config.php')));

    $_SESSION['miniLOL']['path']['root']    = realpath(dirname(__FILE__).'/../..');
    $_SESSION['miniLOL']['path']['modules'] = realpath(dirname(__FILE__).'/..');

    exit;
}

if (isset($_REQUEST['login']) && isset($_REQUEST['password'])) {
    $_SESSION['miniLOL']['config'] = simpleXMLToArray(simplexml_load_string(security_loadConfig('resources/config.php')));

    $password = security_getRequest('password');

    if ($_SESSION['miniLOL']['config']['admin']['password']['type'] != 'text') {
        $password = @hash(strtolower($_SESSION['miniLOL']['config']['admin']['password']['type']), $password);

        if (!$password) {
            echo "The hashing algorithm isn't present.";
            exit;
        }
    }
    
    if ($password == $_SESSION['miniLOL']['config']['admin']['password']['data']) {
        $_SESSION['miniLOL']['admin']  = true;

        echo 'Logged in succesfully.';
    }
    else {
        echo 'The password is wrong.';
    }

    exit;
}
else if (isset($_REQUEST['logout'])) {
    unset($_SESSION['miniLOL']);

    echo 'Logged out.';
    exit;
}
else if (isset($_REQUEST['change']) && isset($_REQUEST['password']) && isset($_REQUEST['type'])) {
    if (@!$_SESSION['miniLOL']['admin']) {
        echo 'You fail at auditing.';
        exit;
    }

    $type = security_getRequest('type');

    $config = simplexml_load_string(security_loadConfig('resources/config.php'));
    $config->admin->password->type = $type;
    $config->admin->password->data = ($type == 'text') ? security_getRequest('password') : @hash(strtolower($type), security_getRequest('password'));

    if (!$config->admin->password->data) {
        echo "The hashing algorithm isn't present.";
        exit;
    }

    security_saveConfig('resources/config.php', "\n".preg_replace('#^\s*\n#ms', '', $config->asXML()));

    $_SESSION['miniLOL']['config'] = simpleXMLToArray($config);

    echo 'Password changed.';

    exit;
}

if (@!$_SESSION['miniLOL']['admin'] || !isset($_REQUEST['get']) || !strlen($_REQUEST['get'])) {
    exit;
}

$lastNode = $_SESSION['miniLOL']['config'];
$nodeTree = explode('.', $_REQUEST['get']);

foreach ($nodeTree as $node) {
    if (!isset($lastNode[$node])) {
        exit;
    }

    $lastNode = $lastNode[$node];
}

if (is_string($lastNode)) {
    echo $lastNode;
}

?>
