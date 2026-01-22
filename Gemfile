source "https://rubygems.org"
ruby "3.2.9"

gem "jekyll", "~> 4.4"
gem "minimal-mistakes-jekyll", github: "kyleskrinak/minimal-mistakes", branch: "master"

# Jekyll plugins (autoloaded by Jekyll)
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-include-cache"
  gem "jekyll-redirect-from"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-paginate"
end

# Local tooling
group :development do
  gem "jekyll-compose", "~> 0.12"
  gem "webrick", "~> 1.8"  # Ruby 3.x `jekyll serve`
end

# CI / Tests
group :test do
  gem "html-proofer", "~> 5.0"
end