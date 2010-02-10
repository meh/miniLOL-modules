#! /usr/bin/env ruby
require "digest/md5"

def manifest (path, level)
    if File.directory?(path)
        puts "#{'    ' * level}<directory name=\"#{File.basename(path)}\">"

        Dir.foreach(path) {|file|
            if file == "." || file == ".."
                next
            end

            manifest("#{path}/#{file}", level + 1)
        }

        puts "#{'    ' * level}</directory>"
    else
        puts "#{'    ' * level}<file name=\"#{File.basename(path)}\" md5sum=\"#{Digest::MD5.hexdigest(File.read(path))}\"/>"
    end
end

puts '<contents>'
Dir.foreach(ARGV[0] || ".") {|file|
    if file == "." || file == ".."
        next
    end

    manifest("#{ARGV[0] || '.'}/#{file}", 1)
}
puts '</contents>'
