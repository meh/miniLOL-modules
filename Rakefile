require 'rake'
require 'rake/clean'

# You need this: http://code.google.com/closure/compiler/
COMPILER = 'closure' # or java -jar compiler.jar

def minify (file, out=nil)
    if !File.exists?(file)
        return false
    end

    out ||= file.clone; out[out.length - 3, 3] = '.min.js'

    if !File.exists?(out) || File.mtime(file) > File.mtime(out)
        result = `#{COMPILER} --js '#{file}' --js_output_file '#{out}'`

        if $? != 0
            raise 'lol error'
        end
    else
        return false
    end

    return true
end

FILES = FileList['**/**.js']
FILES.exclude('**/**.min.js')

task :default do
    root = Dir.pwd

    FILES.each {|file|
        Dir.chdir(File.dirname(file))

        if minify(File.basename(file))
            puts "Compiled `#{file}`"
        end

        Dir.chdir(root)
    }
end
