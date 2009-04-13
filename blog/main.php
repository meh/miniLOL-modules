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

if (!$_SESSION['miniLOL']['admin']) {
    echo "You're doing it wrong.";
    exit;
}

$data = DOMDocument::load('resources/data.xml');

if (isset($_REQUEST['post'])) {
    $ids   = array();
    $posts = $data->getElementsByTagName("post");

    for ($i = 0; $i < $posts->length; $i++) {
        array_push($ids, ((int) $posts->item($i)->getAttribute('id')));
    }
    
    $post = new DOMElement('post');
    $post->setAttribute('id', max($ids)+1);
    $post->setAttribute('title', $_REQUEST['title']);
    $post->setAttribute('author', $_REQUEST['author']);
    $post->setAttribute('date', $_REQUEST['date']);

    $content = $data->createCDataSection(str_replace(']]>', ']&#93;>', $_REQUEST['content']));
    $post->appendChild($content);

    echo "The post has been added.";
    $data->save('resources/data.xml');
    exit;
}

if (!isset($_REQUEST['id'])) {
    echo "You're doing it wrong.";
    exit;
}

if (isset($_REQUEST['edit'])) {

}
else if (isset($_REQUEST['delete'])) {

}

?>
