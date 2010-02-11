<?php
/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL. A content management module.               *
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

class Module
{
    private $_data;
    private $_tree;
    private $_compressed;
    private $_compression;

    public function Module ($data, $type = NULL)
    {
        if ($type) {
            $this->_compressed  = $data;
            $this->_compression = $type;
        }
        else {
            $this->_compression = Module::parseCompression($data);
            $this->_compressed  = @file_get_contents($data); 
        }

        if ($this->_compressed === false) {
            if (preg_match('#^http://#', $data) && extension_loaded('curl')) {
                $curl = curl_init(urlencode($data));
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                $this->_compressed = curl_exec($curl);
            }
        }

        if (!$this->_compressed) {
            throw new Exception('Could not get the data.');
        }
    }

    public function extract ()
    {
        $this->_createTree();

        if (!$this->_tree['manifest.xml']) {
            throw new Exception('Module description file is missing.');
        }

        $dom      = DOMDocument::loadXML($this->_tree['manifest.xml']);
        $contents = $dom->getElementsByTagName('contents')->item(0);
        $this->checkMD5($contents);

        $name = $dom->getElementsByTagName('name')->item(0)->nodeValue;

        Module::extract($this->_tree, "{$_SESSION['miniLOL']['path']}/modules/{$name}");
    }

    public function checkMD5 ($content, $path = NULL)
    {
        $path = ($path) ? "$path/{$content->getAttribute('name')}" : $content->getAttribute('name');

        if ($content->nodeName == 'directory' || $content->nodeName == 'contents') {
            foreach ($content->childNodes as $element) {
                if ($element->nodeType != XML_ELEMENT_NODE) {
                    continue;
                }

                $this->checkMD5($element, $path);
            }
        }
        else if ($content->nodeName == 'file') {
            $file = &$this->_getElement($path);

            $original = $content->getAttribute('md5sum');
            $checked  = md5($file);
            
            if ($original != $checked) {
                throw new Exception("The md5sum of `$path` doesn't match: original=$original; checked=$checked.");
            }
        }
    }

    private function _createTree ()
    {
        if ($this->_data) {
            return;
        }

        $func = Module::decompressFunction($this->_compression);
        $this->_data = $func($this->_compressed);

        unset($this->_compression);
        unset($this->_compressed);

        $this->_tree = array();

        $i = 0;
        while (true) {
            $name = trim(substr($this->_data, $i, 100));
            $i += 100 + 8 + 8 + 8;

            if (!$name) {
                break;
            }

            $size = octdec(trim(substr($this->_data, $i, 12)));
            $i += 12 + 12 + 8;

            $type = substr($this->_data, $i, 1);
            $i += 1 + 100 + 255;

            if (!$type && $size) {
                $current = &$this->_getElement($name);
                $current = substr($this->_data, $i, $size);
                $i += $size + (512 - ($size % 512));
            }
        }
    }

    private function &_getElement ($path) {
        preg_match_all('#([^/]+)(/)?#', $path, $matches);

        $current = &$this->_tree;
        foreach ($matches[1] as $element) {
            $current = &$current[$element];
        }

        return $current;
    }

    public static function decompressFunction ($algorithm)
    {
        switch ($matches[1]) {
            case 'gz':
            if (!extension_loaded('zlib')) {
                throw new Exception('zlib module is missing.');
            }
            else {
                return gzuncompress;
            }
            break;

            case 'bz2':
             if (!extension_loaded('bzip2')) {
                throw new Exception('bzip2 module is missing.');
            }
            else {
                return bzdecompress;
            }
            break;

            default:
            return create_function('$data', 'return $data;');
            break;
        }

    }

    public static function parseCompression ($path)
    {
        if (preg_match('#tar\.(\w+)$#', $path, $matches)) {
            return $matches[1];
        }

        return NULL;
    }

    public static function extract ($data, $path)
    {
        if (is_array($data)) {
            mkdir($path);

            foreach ($data as $name => $content) {
                Module::extract($content, "$path/$name");
            }
        }
        else {
            file_put_contents($path, $data);
        }
    }
}
?>
