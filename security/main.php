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

define('__VERSION__', '0.1.1');

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

function buildConfig ($file)
{
    // Secure config file
    $xml = file($file);
    array_shift($xml);
    array_pop($xml);
    $xml = join("\n", $xml);

    return simplexml_load_string($xml);
}

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
    $_SESSION['miniLOL']['config'] = simpleXMLToArray(buildConfig('resources/config.php'));
    exit;
}

if (isset($_REQUEST['login']) && isset($_REQUEST['password'])) {
    $_SESSION['miniLOL']['config'] = simpleXMLToArray(buildConfig('resources/config.php'));

    if ($_REQUEST['password'] == $_SESSION['miniLOL']['config']['admin']['password']) {
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
