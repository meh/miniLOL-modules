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

$config    = simplexml_load_file('resources/config.xml');
$protected = $config->protected == 'true';
$file      = 'resources/'.$config->fileName;

if (!file_exists($file)) {
    $xml = new XMLWriter();
    $xml->openMemory();
    $xml->startDocument('1.0');
    $xml->writeElement('logs', '');
    $xml->endDocument();

    $fp = fopen($file, 'w');
    fwrite($fp, "<?php echo 'You fail at auditing :3'; die();/*\n");
    fwrite($fp, $xml->outputMemory(true));
    fwrite($fp, '*/?>');
    fclose($fp);
}

if (!isset($_REQUEST['url'])) {
    // TODO: Develop shared secure configuration module.
    if ($_REQUEST['passwd'] == 'youareafagget') {
        if (isset($_REQUEST['retrieve'])) {
            header('Content-Type: text/xml');

            $content = file_get_contents($file);
            $content = explode("\n", $content);
            array_pop($content); array_shift($content);
            $content = implode("\n", $content);

            echo $content;
        }
    }

    exit;
}

$fp = fopen($file, 'r+');
fseek($fp, -12, SEEK_END);

$xml = new XMLWriter();
$xml->openMemory();
$xml->startElement('log');
$xml->startElement('url'); $xml->writeCData($_REQUEST['url']); $xml->endElement();
$xml->startElement('date');
    $xml->startElement('server'); $xml->writeCData(date('D M j Y H:i:s \G\M\TO (T)')); $xml->endElement();
    $xml->startElement('user');   $xml->writeCData($_REQUEST['date']);                 $xml->endElement();
$xml->endElement();
$xml->startElement('ip'); $xml->writeCData($_SERVER['REMOTE_ADDR']); $xml->endElement();
$xml->startElement('user_agent'); $xml->writeCData($_SERVER['HTTP_USER_AGENT']); $xml->endElement();
$xml->startElement('referer'); $xml->writeCData($_SERVER['HTTP_REFERER']); $xml->endElement();
$xml->endElement();

fwrite($fp, $xml->outputMemory(true));
fwrite($fp, "</logs>\n*/?>");
fclose($fp);

?>
