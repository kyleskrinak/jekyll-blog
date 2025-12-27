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
# Cleans caches and _site, builds, then runs HTMLProofer via scripts/proof.rb
scripts/clean-build-proof.zsh
```

## Workflow (repo hygiene)

This is the single flow used for all changes: branch from  main , stage on  staging , then promote back to  main .

### Workflow: main → feature → staging → main

1. Start from `main`
   - Use the helper to create a fresh branch from an up‑to‑date `main`:
     ```
     # scripts/new-post.zsh <prefix> "<slug>"
     scripts/new-post.zsh feature "todo-27-disqus-improvements"
     ```
   - The script:
     - Fetches `origin`
     - Switches to `main`
     - Fast‑forwards with `git pull --ff-only origin main`
     - Creates and switches to `<prefix>-YYYY-MM-DD-<slug>`

2. Do the work on the feature branch
   - For issue or TODO-driven work, follow the convention in "Work Items," below.
   - Update README and CHANGELOG at the start of the branch so docs travel with the code.
   - CHANGELOG policy (unmistakable):
     - For this repo, **released = merged to `main`**.
     - Add CHANGELOG entries under a dated heading for the day the change is merged to `main`.
     - Do not maintain an “Unreleased” section.
   - Make all changes for this unit of work: (post content, assets, config, docs).
   - Before any PR:
     - Run `scripts/clean-build-proof.zsh`.
     - Run a local `jekyll serve` to spot obvious issues.

3. Promote feature → `staging`
   - Push the feature branch to GitHub.
   - Open a PR with **base = `staging`**, **head = feature branch**.
   - Let CI run (if configured) and then manually verify the staging site.

4. Promote `staging` → `main`
   - Once staging looks correct, open a PR with **base = `main`**, **head = `staging`**.
   - Merge using the allowed method (typically squash or merge commit, per repo rules).
   - Accept that commit SHAs may differ between branches; what matters is that file content matches.

5. Guard rails
   - Always branch from `main`, never from `staging`.
   - Do not force‑push protected branches.
   - Avoid rebasing or cherry‑picking on shared branches; if branches drift, realign them with PRs instead of history edits.

### Work items

For changes tied to a GitHub Issue or TODO:

- Include the issue number in the branch slug where practical  
  (for example: `feature-2025-12-21-todo-14-and-doc-updates`).
- Reference the issue number in the commit message.  
- Reference the issue number in the pull request title or description.

This keeps the code, documentation (README), and CHANGELOG updates
for a given piece of work grouped cleanly under a single branch and PR.

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
  proof.rb                # HTMLProofer runner (PROOF_MODE=internal|subset|staging)
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

HTMLProofer settings live in scripts/proof.rb (selected via PROOF_MODE).
You can run proofer directly or via the helper script.

**Internal-only (fast, no externals):**
```zsh
PROOF_MODE=internal bundle exec ruby scripts/proof.rb _site
```

**Subset (single file, allows externals but ignores known noisy hosts):**
```zsh
PROOF_MODE=subset bundle exec ruby scripts/proof.rb _site/index.html
```

**Staging (CI parity):**
```zsh
PROOF_MODE=staging bundle exec ruby scripts/proof.rb _site
```

### External links (nightly monitoring)

External link checking is handled by a scheduled GitHub Actions workflow (`.github/workflows/linkwatch.yml`). It runs link-only HTMLProofer against the built `_site` output and, on failure, files/updates a single “External link rot report” issue for visibility. This check does **not** block production deployments.

The script:
1. Cleans `_site/` and Jekyll caches.
2. Builds the site (`bundle exec jekyll build`).
3. Runs HTMLProofer via  scripts/proof.rb (see PROOF_MODE).

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
  Adjust the settings inside scripts/proof.rb (timeouts, ignore_urls, etc.).  
  Avoid blanket disables.

- **Stale output**  
  Run `scripts/clean-build-proof.zsh` to clear caches and rebuild fresh.

---

## Credits

- Theme: **Minimal Mistakes** by Michael Rose — MIT License
- Reveal.js by Hakim El Hattab — MIT License
- All other content © Kyle Skrinak (see individual post/page front matter)
