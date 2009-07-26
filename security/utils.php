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

function security_waitUnlock ($lock = 'resources/.lock', $maxCycles = 1337)
{
    $cycles = 0;
    while (file_exists($lock)) {
        usleep(rand()%1000000);
        $cycles++;

        if ($cycles > $maxCycles) {
            echo "The request couldn't be fulfilled.";
            exit;
        }
    }
}

?>
