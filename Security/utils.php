<?php
/*********************************************************************
*           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE              *
*                   Version 2, December 2004                         *
*                                                                    *
*  Copyleft meh.                                                     *
*                                                                    *
*           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE              *
*  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION   *
*                                                                    *
*  0. You just DO WHAT THE FUCK YOU WANT TO.                         *
*********************************************************************/

function security_lock ($lock = '.lock')
{
    touch($lock);
}

function security_unlock ($lock = '.lock')
{
    unlink($lock);
}

function security_waitUnlock ($lock = '.lock', $maxCycles = 1337, $unlock = false)
{
    $cycles = 0;
    while (file_exists($lock)) {
        usleep(rand()%1000000);
        $cycles++;

        if ($cycles > $maxCycles) {
            if ($unlock) {
                unlink($lock);
            }
            else {
                echo "The request couldn't be fulfilled.";
                exit;
            }
        }
    }
}

function security_getRequest ($name)
{
    if (!isset($_REQUEST[$name])) {
        return null;
    }

    return (get_magic_quotes_gpc() ? stripslashes($_REQUEST[$name]) : $_REQUEST[$name]);
}

function security_loadConfig ($file)
{
    // Secure config file
    $xml = file($file);
    array_shift($xml);
    array_shift($xml);
    array_pop($xml);
    array_pop($xml);
    return join("\n", $xml);
}

function security_saveConfig ($file, $config)
{
    file_put_contents($file, "<?php die('You fail.'); /*\n" . $config . "\n*/?>");
}

function security_rmdir ($directory, $recursive = false, $empty = false)
{
    if (!$recursive) {
        return rmdir($directory);
    }

    if (substr($directory, -1) == '/') {
        $directory = substr($directory, 0, -1);
    }

    if (!file_exists($directory) || !is_dir($directory)) {
        return false;
    }
    else if (is_readable($directory)) {
        $handle = opendir($directory);

        while (($item = readdir($handle)) !== false) {
            if ($item != '.' && $item != '..') {
                $path = $directory.'/'.$item;

                if (is_dir($path)) {
                    security_rmdir($path, true, $empty);
                }
                else {
                    unlink($path);
                }
            }
        }

        closedir($handle);

        if ($empty == false) {
            return (bool) rmdir($directory);
        }
    }

    return true;
}

?>
