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

Workflow: main → feature → staging → main. Create a feature branch from main, PR to staging to verify, then PR staging to main to ship. More detail: .github/CONTRIBUTING.md.

---

## Project layout (high level)
```
/
├─ _includes/               # Reusable HTML fragments (headers, footers, reveal menu, etc.)
├─ _layouts/                # Page layouts (Minimal Mistakes + custom layouts like `reveal-duke`)
├─ _pages/                  # Site pages (about, archive, etc.)
├─ _posts/                  # Blog posts (files named `YYYY-MM-DD-title.md`)
├─ _drafts/                 # Draft posts (not published unless --drafts)
├─ _sass/                   # Theme overrides and skins
├─ assets/                  # Static assets (css, images, reveal/ distribution, JS)
│  ├─ css/_custom.scss
│  └─ reveal/               # Reveal.js assets and plugins
├─ _data/                   # YAML data files (navigation, ui text, etc.)
├─ scripts/                 # Helper scripts (clean/build/proof, asset checks)
├─ docs/                    # Docs, notes, or exportable site docs (optional)
├─ _site/                   # Generated site output (ignored in Git)
├─ .github/workflows/       # CI workflows (linkwatch, nightly jobs)
├─ Gemfile                  # Ruby/Gems for Jekyll + tools
├─ package.json             # Node tooling (if used)
├─ Dockerfile, docker-compose.yml # Optional containerized dev/build environment
├─ _config.yml              # Main Jekyll config
├─ _config_dev.yml          # Dev override config (e.g., local baseurl)
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

Presentations use Reveal.js without custom menu plugins. To add custom presentation features, modify the layouts in `_layouts/reveal.html` or `_layouts/reveal-duke.html`.

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
3. Runs HTMLProofer via scripts/proof.rb

---

## Asset hygiene

Find image/asset files that are **not** referenced by the generated site:
```zsh
scripts/find-unreferenced-assets.zsh
# Outputs lists in scripts/tmp/ (kept out of Git via .gitignore)
```

> **Note:** Only review and remove files you’re confident are unused.

---

## CSS Customization

Custom SCSS overrides live in `assets/css/_custom.scss` and are loaded **last** in the cascade, ensuring they take precedence over theme defaults. This file uses the SASS `@use` module system and currently includes:

- **Color corrections** for the Air skin (`#eeeeee` home bg, `#0092ca` footer, transparent nav bar)
- Additional theme overrides (reveal.js styles, minimal-mistakes customizations)

To add or modify CSS:
1. Edit `assets/css/_custom.scss`
2. Run `bundle exec jekyll build` locally to verify
3. CSS is automatically compiled into `_site/assets/css/main.css` (minified)

---

## Asset Vendoring Philosophy

This repo uses **self-hosted assets** to reduce external dependencies and improve performance:

- **Font Awesome**: Vendored from npm (`@fortawesome/fontawesome-free@5.15.4`) to `assets/fontawesome/`. Removes CDN dependency.
- **Reveal.js**: Vendored from npm (`reveal.js@5.2.1`) to `assets/reveal/`. Includes ESM build, plugins, and theme files.

### Vendor scripts

After updating versions in `package.json`, run:

```zsh
npm run vendor:fontawesome    # Copy Font Awesome files
npm run vendor:reveal         # Copy Reveal.js distribution
```

Both scripts clean old assets before copying, ensuring clean builds. CI automatically runs these steps before Jekyll build.

**See also:** [Reveal.js Vendoring & Attribution](assets/reveal/MAINTAINERS.md)

---

## Minimal Mistakes customizations

### Include structure

The repo uses only **5 customized includes** (most theme defaults removed):

- `head.html` – Self-hosted Font Awesome CSS link
- `masthead.html` – Subtitle display for custom branding
- `page__hero.html` – CTA compatibility fix
- `reveallinks.html` – Reveal.js presentation menu wiring
- `seo.html` – Custom JSON-LD structured data

This minimal set reduces maintenance burden and update complexity.

---

## Visual Regression Testing

Presentation pages are monitored via **Playwright snapshot tests** (`tests/reveal.spec.js`). Tests run automatically in CI and can be run locally:

```zsh
npx playwright test                # Run all visual tests
npx playwright test --ui           # Interactive mode
npx playwright test --update-snapshots  # Update baselines after intentional changes
```

**Test coverage:**
- Visual snapshots (regression detection)
- Menu functionality (button visibility, open/close, content verification)
- Reveal.js API initialization

**Snapshots stored in:** `tests/reveal.spec.js-snapshots/`

---

## Custom styling

Place site-specific overrides here:

- `assets/css/_vars.scss` – SASS variables and design tokens (shared via @use modules)
- `assets/css/_custom.scss` – Light CSS overrides imported by the theme

Theme skin experiments (e.g., custom Minimal Mistakes skins) live under
`_sass/minimal-mistakes/skins/`. Keep them minimal and in sync with upstream
where possible.

### SASS module system

All SASS files use the `@use` module system (no `@import`):

```scss
@use "vars";           // Import design tokens
@use "minimal-mistakes/themes/light";  // Theme imports
```

Prefer adding variables/tokens to `assets/css/_vars.scss` rather than duplicating across files.

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
