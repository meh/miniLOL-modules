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

define('__VERSION__', '0.2');

session_set_cookie_params(60*60*24*365, '/');
session_start();

if (isset($_REQUEST['retrieve'])) {
    exit;
}

if (@!$_SESSION['miniLOL']['admin']) {
    echo "You're doing it wrong.";
    exit;
}

$data = DOMDocument::load('resources/data.xml');
$data->preserveWhiteSpace = false;
$data->formatOutput       = true;

if (isset($_REQUEST['build'])) {
    if ($_REQUEST['type'] == 'rss') {
        if ($_REQUEST['version'] == '1.0') {
            
        }
        else if ($_REQUEST['version'] = '2.0') {

        }
    }
    else if ($_REQUEST['type'] == 'atom') {

    }

    exit;
}

if (isset($_REQUEST['post'])) {
    if (isset($_REQUEST['comment'])) {

    }
    else {
        $id = $data->documentElement->getAttribute('total') + 1;
    
        $post = $data->createElement('post');
        $post->setAttribute('id', $id);
        $post->setAttribute('title', htmlentities(urldecode(get_magic_quotes_gpc() ? stripslashes($_REQUEST['title']) : $_REQUEST['title']), ENT_QUOTES, 'UTF-8'));
        $post->setAttribute('author', htmlentities(urldecode(get_magic_quotes_gpc() ? stripslashes($_REQUEST['author']) : $_REQUEST['author']), ENT_QUOTES, 'UTF-8'));
        $post->setAttribute('date', htmlentities(urldecode(get_magic_quotes_gpc() ? stripslashes($_REQUEST['date']) : $_REQUEST['date']), ENT_QUOTES, 'UTF-8'));

        $data->documentElement->setAttribute('total', $id);

        $content = $data->createCDataSection(str_replace(']]>', ']&#93;>', urldecode(get_magic_quotes_gpc() ? stripslashes($_REQUEST['content']) : $_REQUEST['content'])));
        $post->appendChild($content);
        $data->documentElement->appendChild($post);

        $data->save('resources/data.xml');

        echo 'The post has been added.';
    }

    exit;
}

if (!isset($_REQUEST['id'])) {
    echo "You're doing it wrong.";
    exit;
}

$post = $data->getElementById($_REQUEST['id']);

if (!$post) {
    echo "The post doesn't exist.";
    exit;
}

if (isset($_REQUEST['edit'])) {
    if (isset($_REQUEST['comment'])) {

    }
    else {
        $post->setAttribute('title', htmlentities(urldecode(get_magic_quotes_gpc() ? stripslashes($_REQUEST['title']) : $_REQUEST['title']), ENT_QUOTES, 'UTF-8'));
        $post->setAttribute('author', htmlentities(urldecode(get_magic_quotes_gpc() ? stripslashes($_REQUEST['author']) : $_REQUEST['author']), ENT_QUOTES, 'UTF-8'));
        $post->setAttribute('date', htmlentities(urldecode(get_magic_quotes_gpc() ? stripslashes($_REQUEST['date']) : $_REQUEST['date']), ENT_QUOTES, 'UTF-8'));

        $post->removeChild($post->firstChild);
        $content = $data->createCDataSection(str_replace(']]>', ']&#93;>', urldecode(get_magic_quotes_gpc() ? stripslashes($_REQUEST['content']) : $_REQUEST['content'])));
        $post->appendChild($content);

        $data->save('resources/data.xml');

        echo 'The post has been modified.';
    }
}
else if (isset($_REQUEST['delete'])) {
    if (isset($_REQUEST['comment'])) {
    }
    else {
        $data->documentElement->removeChild($post);
        $data->save('resources/data.xml');

        echo 'The post has been deleted.';
    }
}

?>
