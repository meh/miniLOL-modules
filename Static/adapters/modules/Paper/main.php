<?php
/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh@paranoici.org]           *
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

class PaperModule extends Module
{
    public $aliases = array('paper');

    public function name ()
    {
        return 'Paper';
    }

    public function __construct ()
    {
        if (!miniLOL::instance()->theme->hasStyle('Paper/style')) {
            miniLOL::instance()->theme->addStyle('modules/Paper/resources/style');
        }
    }

    public function execute ($args)
    {
        if ($args['name']) {
            $html = @DOMDocument::loadHTML(miniLOL::instance()->modules->get('Markdown')->execute(
                str_replace(array('&lt;', '&gt;', '&amp;'), array('<', '>', '&'), file_get_contents(MODULES."/Paper/papers/{$args['name']}"))
            ));

            $xpath = new DOMXpath($html);

            $xpath->query('//h1[position()=1]')->item(0)->setAttribute('class', 'title');
            $xpath->query('//h2[position()=1]')->item(0)->setAttribute('class', 'title');

            foreach ($xpath->query('//h1[position()>2]') as $element) {
                $element->parentNode->insertBefore($html->createElement('hr'), $element);
            }

            $menu = $html->createElement('div');
            $menu->setAttribute('id', 'paper-menu');

            $chapter = array(0, 0, 0, 0, 0, 0);
            $group   = null;

            foreach ($xpath->query('//h1[not(@class="title")] | //h2[not(@class="title")] | //h3') as $elemen) {
                $anchor = $html->createElement('a');
                
                $name = $this->__array_to_chapter($chapter, (int) $element->nodeName[1]);

                $anchor->setAttribute('name', $name);
                $anchor->appendChild($element);
                $element->parentNode->replaceChild($anchor, $element);

                if ($element->nodeName == 'h1') {
                    if ($group) {
                        $menu->appendChild($group);
                    }

                    $group = $html->createElement('div');
                    $group->setAttribute('class', 'main')
                }

                $link = $html->createElement('a');
                $link->setAttribute('href', "#{$name}");
            }

            $menu->appendChild($group);
            $html->appendChild($menu);

            return '<div id="paper">' . $html->saveHTML() . '</div>';
        }
    }

    private function __array_to_chapter ($array, $level)
    {
        $result = '';

        for ($i = 0; $i < $level; $i++) {
            $result .= ".{$array[$i]}";
        }

        return substr($result, 1);
    }
}
