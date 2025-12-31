Minimal Mistakes Overrides Audit (chore/mm-upgrade-reveal-modernize-2025-12-30)

Summary: This file lists _includes, _layouts, and _sass files that differ from the upstream Minimal Mistakes theme (v4.27.3) and recommends a short action for each.

Recommendations: "keep" = keep local override; "refactor" = replace override with theme include or variable; "style" = move custom styling to _sass/_minimal_mistakes_overrides.scss; "remove" = remove local override and use theme default.

Files & recommendation
----------------------

_includes/
- archive-single.html: refactor (verify differences, prefer theme include unless site-specific)
- breadcrumbs.html: refactor
- browser-upgrade.html: keep (site-specific)
- comments-providers/disqus.html: keep (site config/dependency specific)
- comments-providers/giscus.html: keep
- comments.html: refactor (verify provider toggles)
- documents-collection.html: refactor
- figure/*: style (move SASS overrides where possible)
- footer/custom.html: refactor (small changes; prefer theme *custom.html include pattern)
- footer.html: refactor (if only text changes, use site.* config)
- gallery/*: keep or refactor depending on customizations
- head/custom.html: refactor (move inline script/styles into dedicated include)
- head.html: refactor & security (self-host Font Awesome instead of CDN) [OPTIONAL]
- intro.md: keep (content)
- masthead.html: refactor (if layout changes are minor prefer variables)
- nav_list/*: refactor
- page__hero.html: refactor (use theme hero variables where possible)
- reveallinks.html: keep (presentation-specific)
- seo.html: refactor (merge if minimal changes, keep if custom JSON-LD)
- search/algolia-search-scripts.html: keep (external search provider) or move to include
- social-share.html: refactor
- toc.html: refactor

_layouts/
- reveal-duke.html: keep (presentation-specific layout) but extract styles/scripts to assets/_includes
- (Other custom layouts found) : evaluate similarly

_sass/
- custom SASS present across multiple partials: consolidate into _sass/_minimal_mistakes_overrides.scss (style)

Next steps
----------
1. Implement low-risk refactors first (move inline CSS to _sass file, extract small custom includes to call theme includes).  
2. Run `bundle exec jekyll build` and `./scripts/clean-build-proof.zsh` after each change and capture screenshots.  
3. Proceed to Reveal modernization after MM refactor work is validated.

Notes
-----
- Some overrides are presentation-specific (reveal) and will be handled when modernizing Reveal, but keep the reveal-specific files isolated from global theme overrides.
- Consider self-hosting FontAwesome as part of the asset hygiene step to reduce external dependencies.
