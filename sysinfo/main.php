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

header('Content-Type: text/xml');

$infos = '';

if (isset($_REQUEST['processor'])) {
    $data = file_get_contents('/proc/cpuinfo');

    $options = array();

    if (!$_REQUEST['processor']) {
        $options['vendor']   = true;
        $options['model']    = true;
        $options['mhz']      = true;
        $options['cache']    = true;
        $options['fpu']      = true;
        $options['flags']    = true;
        $options['bogomips'] = true;
        $options['clflush']  = true;
    }

    if (isset($options['vendor'])) {
        $infos .= <<<INFO
        
        <info parent="processor" type="vendor"><title>Processor Vendor</title><data></data></info>

INFO;
    }
}

echo <<<XML

<?xml version="1.0"?>

<infos>
    {$infos}
</infos>

XML;

?>
