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

function security_lock ($lock = 'resources/.lock')
{
    touch($lock);
}

function security_unlock ($lock = 'resources/.lock')
{
    unlink($lock);
}

function security_waitUnlock ($lock = 'resources/.lock', $maxCycles = 1337, $unlock = false)
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

?>
