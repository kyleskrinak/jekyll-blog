#!/usr/bin/env ruby
# frozen_string_literal: true

require "html-proofer"

dir = ARGV[0] || "_site"

# Internal-only: ignore ALL absolute http(s) links (externals),
# plus noisy schemes we don't want to validate.
ignores = [
  %r{\Ahttps?://}i,     # ignore every absolute external
  %r{\Amailto:}i,
  %r{\Atel:}i,
  %r{\Ajavascript:}i
]

HTMLProofer.check_directory(
  dir,
  checks: %w[Links Images Scripts],
  enforce_https: false,            # don't fail on http links (e.g., localhost, canonicals)
  ignore_urls: ignores,
  # curl options (harmless even if we ignore externals; keeps defaults explicit)
  typhoeus: { timeout: 20, connecttimeout: 10, followlocation: true }
).run