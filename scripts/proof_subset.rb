#!/usr/bin/env ruby
# Single-file html-proofer that understands absolute paths like /assets/...
require "html-proofer"

target  = ARGV[0] || "_site/index.html"

# Same noisy externals we ignore elsewhere
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
  enforce_https: false,
  ignore_urls: ignores,
  typhoeus: { timeout: 20, connecttimeout: 10, followlocation: true }
}

root = File.expand_path("_site") # real site root for absolute paths
HTMLProofer.check_file(target, opts.merge(root_dir: root)).run