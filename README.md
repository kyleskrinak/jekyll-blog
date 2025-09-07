# Personal Blog (Jekyll + Minimal Mistakes)

This repository contains my professional/personal blog built with **Jekyll** and the **Minimal Mistakes** theme. It began life on Duke’s people.duke.edu “tilde” service and now lives on an Amazon S3 static site. The repo includes tooling for clean builds, link checking, Reveal.js slide decks, and a few local customizations.

> **Attribution & license note**  
> The base theme is **[Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)** by
> Michael Rose (MIT). This repository contains modifications and custom assets specific to my site.
> Please respect the upstream license and attribution when reusing any theme code.

---

## Quick start (local)

### Prerequisites
- Ruby (via rbenv/rvm/etc.) and Bundler
- `zsh` (scripts are written for zsh)
- (optional) Node.js if you plan to use client-side tooling

### Install
```zsh
bundle install
```

### Develop (live-reload)
```zsh
# Use dev overrides without changing prod config
bundle exec jekyll serve --livereload --drafts \
  --config _config.yml,_config_dev.yml
```

### Clean build + link proof (one-shot)
```zsh
# Cleans caches and _site, builds, then runs HTMLProofer using .htmlproofer.yml
scripts/clean-build-proof.zsh
```

---

## Project layout (high level)
```
_includes/
  reveallinks.html        # Fragment used by Reveal.js menu (not published on its own)
_layouts/
  reveal-duke.html        # Slide layout (Reveal.js integration)
  ...                     # Other Minimal Mistakes layouts
_pages/                   # Regular site pages
_posts/                   # Blog posts
_sass/                    # Theme skin and style overrides
assets/
  css/_custom-variables.scss
  css/_custom.scss
  reveal/                 # Reveal.js distribution (js/plugins/css)
scripts/
  clean-build-proof.zsh
  find-unreferenced-assets.zsh
  tmp/.gitkeep            # Scratch dir; content ignored by Git
.htmlproofer.yml          # Proofer settings (timeouts, ignores, etc.)
_config.yml               # Main Jekyll config
_config_dev.yml           # Dev-only overrides (e.g., baseurl, URLs, excludes)
```

---

## Reveal.js slides

Slides are standard Markdown files that use the custom layout.

**Front matter example:**
```yaml
---
layout: reveal-duke
title: "My Talk"
permalink: /presentations/my-talk/
---
```

Write your slides as Markdown in the page body. Separators are already set in
the layout (`data-separator` / `data-separator-vertical`) to break slides.

### “Links” menu in Reveal
The slides expose a **Links** menu item using the Reveal Menu plugin. The menu’s
HTML is **inlined** into the presentation (so we don’t publish a separate
standalone HTML page).

- Edit the fragment at `_includes/reveallinks.html` (simple HTML list).  
- The layout loads this include into a hidden `<template id="reveal-links-template">`,
  and passes its markup to `RevealMenu`’s `custom` option at runtime.

This design avoids publishing `assets/reveal/reveallinks.html` and keeps
HTMLProofer from treating it as a missing-favicon page.

---

## HTMLProofer

We use `.htmlproofer.yml` to centralize settings (timeouts, ignored URLs, etc.).
You can run proofer directly or via the helper script.

**Direct:**
```zsh
bundle exec htmlproofer ./_site
```

**Via script (recommended):**
```zsh
scripts/clean-build-proof.zsh
```

The script:
1. Cleans `_site/` and Jekyll caches.
2. Builds the site (`bundle exec jekyll build`).
3. Runs HTMLProofer with sensible defaults and ignores from `.htmlproofer.yml`.

---

## Asset hygiene

Find image/asset files that are **not** referenced by the generated site:
```zsh
scripts/find-unreferenced-assets.zsh
# Outputs lists in scripts/tmp/ (kept out of Git via .gitignore)
```

> **Note:** Only review and remove files you’re confident are unused.

---

## Custom styling

Place site-specific overrides here:

- `assets/css/_custom-variables.scss` – variables/tokens
- `assets/css/_custom.scss` – light CSS overrides imported by the theme

Theme skin experiments (e.g., custom Minimal Mistakes skins) live under
`_sass/minimal-mistakes/skins/`. Keep them minimal and in sync with upstream
where possible.

---

## Deploying

This repo is deployed as a static site (currently Amazon S3). A typical sync
might look like:

```zsh
JEKYLL_ENV=production bundle exec jekyll build
aws s3 sync ./_site s3://your-bucket-name --delete
```

(You can replace this with your platform’s deploy command or GitHub Actions.)

---

## Contributing / reuse

This is a personal site, but you’re welcome to learn from the setup. If you fork
or reuse code:
- Keep the Minimal Mistakes license and attribution intact.
- Credit Michael Rose and link to the upstream repo.
- Call out your changes in your own README or comments.

---

## Troubleshooting tips

- **“Include not found: reveallinks.html”**  
  Ensure `_includes/reveallinks.html` exists. The `reveal-duke` layout requires it.

- **HTMLProofer timeouts/403s on external sites**  
  Adjust `.htmlproofer.yml` timeouts or add specific `ignore_urls` entries.
  Avoid blanket disables.

- **Stale output**  
  Run `scripts/clean-build-proof.zsh` to clear caches and rebuild fresh.

---

## Credits

- Theme: **Minimal Mistakes** by Michael Rose — MIT License
- Reveal.js by Hakim El Hattab — MIT License
- All other content © Kyle Skrinak (see individual post/page front matter)
