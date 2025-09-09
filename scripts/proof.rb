#!/usr/bin/env ruby
# frozen_string_literal: true

require "html-proofer"

path = ARGV[0] || "_site"

ignores = [
  %r{\Ahttps?://}i,  # ignore all absolute externals
  %r{\Amailto:}i,
  %r{\Atel:}i,
  %r{\Ajavascript:}i
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
