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

function interpolate ($string, $object)
{
    foreach ($object as $name => $value) {
        $string = preg_replace("|#{{$name}}|", (string) $value, $string);
    }

    return $string;
}

function &XMLToArray ($xml)
{
    $result = array();
    $class  = get_class($xml);

    if (preg_match('/^SimpleXML', $class)) {
        if (count($xml->children()) == 0) {
            return (string) $xml;
        }

        foreach ($xml as $name => $value) {
            $result[$name] =& XMLToArray($value);
        }
    }
    else if (preg_match('/^DOM', $class)) {
        if ($xml->nodeType == XML_CDATA_SECTION_NODE || $xml->nodeType == XML_TEXT_NODE) {
            return $xml->nodeValue;
        }

        foreach ($xml->childNodes as $node) {
            if ($node->nodeType != XML_ELEMENT_NODE) {
                continue;
            }

            $result[$node->nodeName] =& XMLToArray($node);
        }
    }

    return $result;
}

function isURL ($text)
{
    if (preg_match('/^mailto:([\w.%+-]+@[\w.]+\.[A-Za-z]{2,4})$/', $text, $match)) {
        return array(
            'protocol' => 'mailto',
            'uri'      => $match[1]
        );
    }

    if (preg_match('/^(\w+):(\/\/.+?(:\d)?)(\/)?/', $text, $match)) {
        return array(
            'protocol' => $match[1],
            'uri'      => $match[2]
        );
    }
    
    return false;
}

function ObjectFromAttributes ($data)
{
    $attributes = array();

    foreach ($data as $attribute) {
        $attributes[$attribute->name] = $attribute->value;
    }

    return $attributes;
}

function StringFromAttributes ($data)
{
    $attributes = '';

    foreach ($data as $attribute) {
        $attributes .= urlencode($attribute->name) . '="' . $attribute->value . '" ';
    }

    return $attributes;
}

?>
