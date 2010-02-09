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
            $this->_compressed  = file_get_contents($data); 
        }
    }

    public function extract ()
    {
        $this->_createTree();
    }

    private function _createTree ()
    {
        $func = Module::decompressFunction($this->_compression);

        $this->_data = $func($this->_compressed);
    }

    public static function decompressFunction ($algorithm)
    {
        switch ($matches[1]) {
            case 'gz':
            if (!function_exists('gzuncompress')) {
                throw new Exception('zlib module is missing.');
            }
            else {
                return gzuncompress;
            }
            break;

            case 'bz2':
             if (!function_exists('bzdecompress')) {
                throw new Exception('bzip2 module is missing.');
            }
            else {
                return bzdecompress;
            }
            break;

            default:
            return create_function('data', 'return data');
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
}
?>
