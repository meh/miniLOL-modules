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

define('__VERSION__', '0.3');

require_once('../security/utils.php');

session_set_cookie_params(60*60*24*365, '/');
session_start();

if (isset($_REQUEST['retrieve'])) {
    exit;
}

if (@!$_SESSION['miniLOL']['admin']) {
    echo "You're doing it wrong.";
    exit;
}

security_waitUnlock();
security_lock();

$config = simplexml_load_file('resources/config.xml');

$data = DOMDocument::load('resources/data.xml');
$data->preserveWhiteSpace = false;
$data->formatOutput       = true;

if (isset($_REQUEST['build'])) {
    if (!isset($_REQUEST['type'])) {
        $_REQUEST['type']    = $config->feed->type;
        $_REQUEST['version'] = $config->feed->version;
    }

    if ($_REQUEST['type'] == 'rss') {
        if ($_REQUEST['version'] == '1.0') {
            
        }
        else if ($_REQUEST['version'] = '2.0') {

        }
    }
    else if ($_REQUEST['type'] == 'atom') {

    }

    security_unlock();
    exit;
}

if (isset($_REQUEST['comment'])) {
    $post = $data->getElementById($_REQUEST['parent']);

    if (!$post) {
        echo "The post doesn't exist.";
        security_unlock();
        exit;
    }

    if (isset($_REQUEST['post'])) {
        security_unlock();
        exit;
    }

    if (!isset($_REQUEST['id'])) {
        echo "You're doing it wrong.";
        security_unlock();
        exit;
    }
}
else {
    if (isset($_REQUEST['post'])) {
        $id = $data->documentElement->getAttribute('total') + 1;
    
        $post = $data->createElement('post');
        $post->setAttribute('id', $id);
        $post->setAttribute('title', htmlentities(urldecode(security_getRequest('title')), ENT_QUOTES, 'UTF-8'));
        $post->setAttribute('author', htmlentities(urldecode(security_getRequest('author')), ENT_QUOTES, 'UTF-8'));
        $post->setAttribute('date', htmlentities(urldecode(security_getRequest('date')), ENT_QUOTES, 'UTF-8'));

        $data->documentElement->setAttribute('total', $id);

        $content = $data->createCDataSection(str_replace(']]>', ']&#93;>', urldecode(security_getRequest('content'))));
        $post->appendChild($content);
        $data->documentElement->appendChild($post);

        $data->save('resources/data.xml');

        echo 'The post has been added.';

        security_unlock();
        exit;
    }

    if (!isset($_REQUEST['id'])) {
        echo "You're doing it wrong.";
        security_unlock();
        exit;
    }

    $post = $data->getElementById($_REQUEST['id']);

    if (!$post) {
        echo "The post doesn't exist.";
        security_unlock();
        exit;
    }

    if (isset($_REQUEST['edit'])) {
        $post->setAttribute('title', htmlentities(urldecode(security_getRequest('title')), ENT_QUOTES, 'UTF-8'));
        $post->setAttribute('author', htmlentities(urldecode(security_getRequest('author')), ENT_QUOTES, 'UTF-8'));
        $post->setAttribute('date', htmlentities(urldecode(security_getRequest('date')), ENT_QUOTES, 'UTF-8'));

        $post->removeChild($post->firstChild);
        $content = $data->createCDataSection(str_replace(']]>', ']&#93;>', urldecode(security_getRequest('content'))));
        $post->appendChild($content);

        $data->save('resources/data.xml');

        echo 'The post has been modified.';
    }
    else if (isset($_REQUEST['remove'])) {
        $data->documentElement->removeChild($post);
        $data->save('resources/data.xml');
    
        echo 'The post has been removed.';
    }
}

security_unlock();
    
?>
