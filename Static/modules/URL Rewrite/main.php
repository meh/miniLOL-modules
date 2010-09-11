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
        $root = WEB_ROOT;

        return <<<APACHE

RewriteEngine On
RewriteBase /

RewriteRule ^pages/(.*)$ {$root}/?page=$1 [L,QSA]

RewriteRule ^([^&/\.?]+)$ {$root}/?$1 [L,QSA]

APACHE;
    }

    public function __construct ()
    {
        miniLOL::instance()->events->observe(':output', array($this, 'fixScript'));

        if (!file_exists(ROOT.'/.htaccess') || filesize(ROOT.'/.htaccess') == 0) {
            file_put_contents(ROOT.'/.htaccess', URLRewriteModule::htaccess());
        }
    }

    public function fixScript ()
    {
        $html = str_get_html(miniLOL::instance()->get('output'));

        $html->find('#__miniLOL_Static_fixUrl', 0)->innertext = <<<HTML

        

HTML;

        miniLOL::instance()->set('output', $html->save());
    }
}

?>
