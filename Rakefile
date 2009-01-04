require 'rake'
require 'fileutils'

DHONISHOW_ROOT          = File.expand_path(File.dirname(__FILE__))
DHONISHOW_JS_SRC_DIR    = File.join(DHONISHOW_ROOT, 'src/javascripts')
DHONISHOW_CSS_SRC_DIR    = File.join(DHONISHOW_ROOT, 'src/stylesheets')
DHONISHOW_CSS_IMAGES_SRC_DIR    = File.join(DHONISHOW_CSS_SRC_DIR, 'images')
DHONISHOW_DIST_DIR      = File.join(DHONISHOW_ROOT, 'dist')
DHONISHOW_DIST_IMAGES_DIR      = File.join(DHONISHOW_DIST_DIR, 'images')
DHONISHOW_VERSION       = 'RB_1.0'

task :default => [:dist]

desc "Builds the distribution."
task :dist do
  $:.unshift File.join(DHONISHOW_ROOT, 'helper')
  require 'protodoc'
    
  puts "Building JavaScript file"
  Dir.chdir(DHONISHOW_JS_SRC_DIR) do
    File.open(File.join(DHONISHOW_DIST_DIR, "jquery.dhonishow.#{DHONISHOW_VERSION}.js"), 'w+') do | dist |
      dist << Protodoc::Preprocessor.new('Rake.build')
    end
  end
  
  puts "Building Stylesheet file"
  Dir.chdir(DHONISHOW_CSS_SRC_DIR) do
    File.open(File.join(DHONISHOW_DIST_DIR, "jquery.dhonishow.#{DHONISHOW_VERSION}.css"), 'w+') do | dist |
      dist << Protodoc::Preprocessor.new('Rake.build')
    end
  end
  
  # Copy all PNGs and GIFs to the images directory in dist
  images_whitelist = %w{.gif .png}
  cp_r DHONISHOW_CSS_IMAGES_SRC_DIR, DHONISHOW_DIST_DIR
  Dir.new(DHONISHOW_DIST_IMAGES_DIR)
  Dir.chdir(DHONISHOW_DIST_IMAGES_DIR)
  Dir.entries(".").each { | file |
    if File.stat(file).file? && !images_whitelist.include?(File.extname(file))
      File.delete(file)
    end
  }
end