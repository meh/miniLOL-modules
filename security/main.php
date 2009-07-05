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

define('__VERSION__', '0.1');

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

// Secure config file
$xml = file('resources/config.php');
array_shift($xml);
array_pop($xml);
$xml = join("\n", $xml);

$Config = simplexml_load_string($xml);

if (isset($_REQUEST['login']) && isset($_REQUEST['password'])) {
    if ($_REQUEST['password'] == $Config->admin->password) {
        $_SESSION['miniLOL']['admin'] = true;

        echo 'Logged in succesfully.';
    }
    else {
        echo 'The password is wrong.';
    }

    exit;
}

if (@!$_SESSION['miniLOL']['admin'] || !isset($_REQUEST['get']) || !strlen($_REQUEST['get'])) {
    exit;
}

if ($_REQUEST['get'][0] == '/') {
    $node = @$Config->xpath($_REQUEST['get']);
    echo $node[0];
    exit;
}

$lastNode = $Config;
$nodeTree = explode('.', $_REQUEST['get']);

foreach ($nodeTree as $node) {
    $lastNode = $lastNode->{$node};

    if (!$lastNode) {
        break;
    }
}

echo $lastNode;

?>
