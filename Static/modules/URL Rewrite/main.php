<?php
/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL. A PHP implementation.                      *
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

class URLRewriteModule extends Module
{
    public function name ()
    {
        return 'URL Rewrite';
    }

    public static function htaccess ()
    {
        $_WEB_ROOT = WEB_ROOT;

        return <<<APACHE

RewriteEngine On
RewriteBase /

RewriteRule ^([^&/]+)$ {$_WEB_ROOT}/?$1 [L,QSA,NS]

RewriteRule ^pages/((themes|resources|system|modules)/.+)$ {$_WEB_ROOT}/$1 [L,QSA,NS]
RewriteRule ^pages/(.*)$ {$_WEB_ROOT}/?page=$1 [L,QSA,NS]

RewriteRule ^module/((themes|resources|system|modules)/.+)$ {$_WEB_ROOT}/$1 [L,QSA,NS]
RewriteRule ^module/(.*)$ {$_WEB_ROOT}/?module=$1 [L,QSA,NS]

APACHE;
    }

    public function __construct ()
    {
        miniLOL::instance()->events->observe(':go.before', array($this, '__fixUrl'));
        miniLOL::instance()->events->observe(':output', array($this, '__fixScript'));
        miniLOL::instance()->events->observe(':output', array($this, '__fixLinks'));

        if (!file_exists(ROOT.'/.htaccess')) {
            file_put_contents(ROOT.'/.htaccess', URLRewriteModule::htaccess());
        }
    }

    public function __fixUrl ($event)
    {
        $url = str_replace(WEB_ROOT.'/', '', miniLOL::instance()->get('go.params.url'));

        if (preg_match('#pages/(.+)$#', $url, $matches)) {
            $url = '?page=' . str_replace('?', '&', $matches[1]);
        }
        else {
            if ($url[0] != '?') {
                $url = "?{$url}";
            }
        }

        miniLOL::instance()->set('go.params.url', $url);
    }

    public function __fixScript ($event)
    {
        $html = str_get_html(miniLOL::instance()->get('output'));

        $html->find('#__miniLOL_Static_fixUrl', 0)->innertext = <<<HTML

        

HTML;

        miniLOL::instance()->set('output', $html->save());
    }

    public function __fixLinks ($event)
    {
        $html = str_get_html(miniLOL::instance()->get('output'));

        foreach ($html->find('a') as $a) {
            $url = $a->href;

            $url = preg_replace('#^\?page=(.*?)(&(.*))?$#', 'pages/$1?$3', $url);
            $url = preg_replace('#^\?module=(.*?)(&(.*))?$#', 'modules/$1?$3', $url);
            $url = preg_replace('#^\?([^&/]+)(&(.*))?$#', '$1?$3', $url);
            $url = preg_replace('#\?$#', '', $url);

            $a->href = $url;
        }

        miniLOL::instance()->set('output', $html->save());
    }
}

?>
