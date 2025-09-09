#!/usr/bin/env ruby
# frozen_string_literal: true

require "html-proofer"

path = ARGV[0] || "_site/index.html"
abort "Path not found: #{path}" unless File.exist?(path)

ignores = [
  %r{\Ahttps?://(www\.)?linkedin\.com/.*\z},
  %r{\Ahttps?://(www\.)?nytimes\.com/.*\z},
  %r{\Ahttps?://(www\.)?autohotkey\.com/.*\z},
  %r{\Ahttps?://(www\.)?pixabay\.com/.*\z},
  %r{\Ahttps?://(www\.)?parade\.com/.*\z},
  %r{\Ahttps?://(www\.)?ninateicholz\.com/.*\z},
  %r{\Ahttps?://thebigfatsurprise\.com/.*\z},
  %r{\Ahttps?://(www\.)?ncbi\.nlm\.nih\.gov/.*\z},
  %r{\Ahttps?://app\.prezentt\.com/.*\z},
  %r{\Ahttps?://live-seattle-hes\.pantheonsite\.io/.*\z},
  %r{\Ahttps?://127\.0\.0\.1(?::\d+)?/.*\z}
]

opts = {
  checks: %w[Links Images Scripts],
  enforce_https: false,
  ignore_urls: ignores,
  typhoeus: { timeout: 20, connecttimeout: 10, followlocation: true }
}

if File.directory?(path)
  HTMLProofer.check_directory(path, **opts).run
else
  HTMLProofer.check_file(path, **opts).run
end
