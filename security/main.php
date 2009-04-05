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

session_start();

// Secure config file
$xml = <<<XML

<config>
    <admin>
        <password>lolwat</password>
    </admin>
</config>

XML;

$Config = simplexml_load_string($xml);

if (count($_GET) > 0 || count($_POST) > 0) {
    if (isset($_REQUEST['password'])) {
        if ($_REQUEST['password'] == $Config->admin->password) {
            $_SESSION['miniLOL']['admin'] = true;

            echo 'Logged in succesfully.';
        }
        else {
            echo 'The password is wrong.';
        }
    }
}

?>
