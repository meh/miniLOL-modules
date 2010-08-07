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

// Don't be a faggot, if you pass user input to these lock functions it would become insecure.

function security_lock ($lock = '.lock')
{
    security_waitUnlock($lock);

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
                echo 'The request could not be fulfilled.';
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

function security_checkToken ($token=null)
{
    return ($token ? $token : security_getRequest('__token')) == $_SESSION['miniLOL']['__token'];
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
