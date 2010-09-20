require 'rake'
require 'rake/clean'

# You need this: http://code.google.com/closure/compiler/
COMPILER = 'closure-compiler'

def minify (file, out=nil)
    if !File.exists?(file)
        return false
    end

    if !out
        out = file.clone;
        out[out.length - 3, 3] = '.min.js'
    end

    if !File.exists?(out) || File.mtime(file) > File.mtime(out)
        result = `#{COMPILER} --js '#{file}' --js_output_file '#{out}'`

        if $? != 0
            File.delete(out) rescue nil

            return false
        end
    end

    return true
end

FILES = FileList['**/**.js']
FILES.exclude('**/**.min.js')

CLEAN.include('**/**.min.js')

task :default do
    root = Dir.pwd

    FILES.each {|file|
        Dir.chdir(File.dirname(file))

        puts "Compiling `#{file}`"

        if !minify(File.basename(file))
            puts "Failed to compile `#{file}`"
            exit
        end

        Dir.chdir(root)
    }
end
