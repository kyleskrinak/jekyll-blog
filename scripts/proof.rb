#!/usr/bin/env ruby
# frozen_string_literal: true

# scripts/proof.rb
#
# One entry point for HTMLProofer checks (directory or single file).
#
# Modes (set via PROOF_MODE):
#   - internal (default): internal-only; ignores all absolute externals
#   - subset: checks externals but ignores a curated “noisy externals” list
#   - staging: internal-only + url_swap for kyleskrinak.github.io
#
# Examples:
#   PROOF_MODE=internal bundle exec ruby scripts/proof.rb _site
#   PROOF_MODE=subset   bundle exec ruby scripts/proof.rb _site/index.html
#   PROOF_MODE=staging  bundle exec ruby scripts/proof.rb _site
#
# Notes:
# - When checking a single file, root_dir is set to _site so absolute links like
#   /assets/... resolve correctly. [web:60]

require "html-proofer"

module HTMLProoferCore
  module_function

  def typhoeus_ci(timeout: 20, connecttimeout: 10)
    { timeout:, connecttimeout:, followlocation: true }
  end

  # Internal-only: ignore all absolute externals.
  def ignore_all_externals
    [
      %r{\Ahttps?://}i,
      %r{\Amailto:}i,
      %r{\Atel:}i,
      %r{\Ajavascript:}i
    ]
  end

  # Subset: allow externals, but ignore known “noisy” domains.
  def ignore_noisy_externals(extra: [])
    [
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
      %r{\Ahttps?://127\.0\.0\.1(?::\d+)?/.*\z},
      *extra
    ]
  end

  def base_opts(ignore_urls:, typhoeus: typhoeus_ci)
    {
      enforce_https: false,
      ignore_urls:,
      typhoeus:
    }
  end

  def internal_only_opts
    base_opts(ignore_urls: ignore_all_externals).merge(
      checks: %w[Links Images Scripts]
    )
  end

  def subset_opts
    base_opts(ignore_urls: ignore_noisy_externals)
  end

  def staging_opts
    base_opts(ignore_urls: [%r{\Ahttps?://}, %r{\Amailto:}]).merge(
      url_swap: { %r{\Ahttps?://kyleskrinak\.github\.io} => "" }
    )
  end
end

mode = (ENV["PROOF_MODE"] || "internal").downcase
target = ARGV[0] || "_site"

opts =
  case mode
  when "internal" then HTMLProoferCore.internal_only_opts
  when "subset"   then HTMLProoferCore.subset_opts
  when "staging"  then HTMLProoferCore.staging_opts
  else
    warn "Unknown PROOF_MODE=#{mode.inspect} (use: internal|subset|staging)"
    exit 2
  end

if File.directory?(target)
  HTMLProofer.check_directory(target, **opts).run
else
  root = File.expand_path("_site")
  HTMLProofer.check_file(target, opts.merge(root_dir: root)).run
end