<?php
define('__VERSION__', '0.1');

require_once('../security/utils.php');

if (isset($_REQUEST['install']) && $_SESSION['miniLOL']['admin']) {
    if (file_exists('install/.ed')) {
        echo <<<HTML
        
        The installation has already been made.<br/>
        <br/>
        To remove the install directory click <a href="#module=users&install&remove">here</a>.<br/>

HTML;
        exit;
    }

    if (isset($_REQUEST['remove'])) {
        security_rmdir('install', true);
    }
}

?>
