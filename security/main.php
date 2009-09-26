<?php
/*********************************************************************
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             *
 *                   Version 2, December 2004                        *
 *                                                                   *
 *  Copyleft meh.                                                    *
 *                                                                   *
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             *
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION  *
 *                                                                   *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.                        *
 *********************************************************************/

define('__VERSION__', '0.2');

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

    $config = simplexml_load_string(security_loadConfig('resources/config.php'));
    $config->admin->password->type = security_getRequest('type');
    $config->admin->password->data = @hash(strtolower(security_getRequest('type')), security_getRequest('password'));

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
