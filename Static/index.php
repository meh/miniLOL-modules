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

$config = @simplexml_load_file('modules/Static/resources/config.xml');

if ($config && $config->root) {
    $root = $config->root;
}
else {
    $root = 'index.html';
}

if ($config && $config->keywords) {
    $keywords = "<meta name='keywords' content='{$config->keywords}'/>";
}
else {
    $keywords = '';
}

$config = simplexml_load_file('resources/config.xml');
$title  = $config->siteTitle;

$query = $_SERVER['QUERY_STRING'];

if ($query) {
    preg_match('/^([^=]+)(&|$)/', $query, $matches);

    if ($matches) {
        $page = $matches[1];
    }
    else {
        preg_match('/^page=(.+?)(&|$)/', $query, $matches);

        if ($matches) {
            $page     = $matches[1];
            $external = true;
        }
    }
}

if (!$page) {
    $page = $config->homePage;
}

if ($external) {
    $page = preg_replace('/\.\.\/g', '', $page);

    $content = @file_get_contents($page);

    if (!$content) {
        $content = '404 - File not found';
    }
}
else {
    function parse ($node) {
        $result = '';

        foreach ($node->childNodes as $element) {
            $text = $element->nodeValue;

            if ($text = preg_replace('/^\s+$/m', '', $text)) {
                $result .= preg_replace('/href=(["\'])#/', 'href=$1?', $text);
            }
        }

        return $result;
    }

    $pages = DOMDocument::load('resources/pages.xml');
    $pages->normalizeDocument();

    $page = $pages->getElementById($page);

    if (!$page) {
        $content = '404 - File not found';
    }
    else {
        if ($page->getAttribute('title')) {
            $title = preg_replace('/#{siteTitle}/', $config->siteTitle, $page->getAttribute('title'));
        }

        $content = parse($page);
    }
}

$menus = DOMDocument::load('resources/menus.xml');

$default = $menus->getElementById('default');

if (!$default) {
    foreach ($default->childNodes as $node) {
        if ($node->nodeType == XML_ELEMENT_NODE) {
            $default = $node;
            break;
        }
    }
}

$menu  = '';

foreach ($default->childNodes as $node) {
    if ($node->nodeName == 'item') {
        $href = preg_replace('/#/', '?', $node->getAttribute('href'));
        $text = $node->firstChild->nodeValue;
        $menu .= "<a href='{$href}'>{$text}</a>&nbsp;";
    }
}

echo <<<HTML

<!DOCTYPE html>
<html>
<head>
    <title>{$title}</title>

    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    {$keywords}
    
    <script>
        location.href = "{$root}";
    </script>
</head>

<body>
    <noscript>
        <div class="menu">
            {$menu}
        </div>

        <br/>

        <div class="body">
            {$content}
        </div>

        <div style="position: absolute; top: 10px; left: 10px; border: 2px solid black; background: white;">If you have Javascript disabled, enable it please, or the website will be shown in the text only version.</div>
    </noscript>
</body>
</html>

HTML
?>
