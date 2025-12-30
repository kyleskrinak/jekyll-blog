# Contributing / Workflow (short)

This repo uses a simple promotion model: work on a short-lived branch from `main`, validate via `staging`, then promote `staging` back to `main`.

## Branch flow

- Always branch from `main` (never from `staging`).
- Create a short-lived branch (examples: `chore/foo`, `fix/bar`, `post/new-thing`, `feature/todo-27-disqus-improvements`).
- Open a PR **into `staging`** to preview/verify.
- When `staging` looks good, open a PR **from `staging` into `main`** to deploy.
- Commit SHAs may differ across branches depending on merge method—what matters is that the resulting file content matches.

## Create a branch

Preferred: use the helper so branches start from an up-to-date `main`.

Example:

- `scripts/new-post.zsh <prefix> <slug>`
- `scripts/new-post.zsh feature todo-27-disqus-improvements`

What the helper does (high level):

- Fetches `origin`
- Switches to `main`
- Fast-forwards via `git pull --ff-only origin main`
- Creates and switches to `prefix-YYYY-MM-DD-slug`

## Commit & PR conventions

- Keep commits small and focused; use imperative mood in messages.
- Prefer squash merges for feature branches (unless repo rules require otherwise).
- For issue/TODO-driven work:
  - Include the issue number in the branch slug when practical.
  - Reference the issue in commit messages.
  - Reference the issue in the PR title or description.

## Before opening a PR

Run the standard “clean build + link proof” flow:

- `scripts/clean-build-proof.zsh`

Also sanity-check locally:

- Local preview: `bundle exec jekyll serve --livereload --drafts --config _config.yml,_config_dev.yml`

## Promote to staging

1. Push your branch to GitHub.
2. Open a PR with:
   - base: `staging`
   - compare/head: your feature branch
3. Let CI run (if configured) and manually verify the staging site.

## Promote to main

1. After staging verification, open a PR with:
   - base: `main`
   - compare/head: `staging`
2. Merge using the allowed method per repo rules (often squash or merge commit).

## Guard rails

- Do not force-push protected branches.
- Avoid rebasing or cherry-picking on shared branches. If branches drift, realign them via PRs rather than rewriting history.

---

# Development Guide

This section covers local development setup, testing, and contribution workflows specific to this Jekyll site.

## Prerequisites

- **Ruby** 3.2.x (tested with 3.2.9; use rbenv/rvm/asdf to manage versions)
- **Bundler** (install via `gem install bundler`)
- **Node.js** 18.x+ (for asset vendoring and Playwright tests)
- **zsh** (scripts are written in zsh; bash may work with modifications)

## Initial Setup

### Install Ruby dependencies

```zsh
bundle install
```

This installs Jekyll, Minimal Mistakes, and supporting gems listed in `Gemfile.lock`.

### Install Node dependencies

```zsh
npm install
```

This installs vendor copy scripts and Playwright for visual regression testing.

## Local Development

### Live-reload preview

```zsh
bundle exec jekyll serve --livereload --drafts \
  --config _config.yml,_config_dev.yml
```

- `--livereload` – Auto-refresh browser on file changes
- `--drafts` – Include unpublished posts from `_drafts/`
- `--config _config.yml,_config_dev.yml` – Apply dev overrides (e.g., local `baseurl`)

Visit `http://localhost:4000` in your browser.

### Single clean build

```zsh
bundle exec jekyll build
```

Output lives in `_site/`.

### Clean build + validation

```zsh
scripts/clean-build-proof.zsh
```

This script:
1. Clears Jekyll caches and previous `_site/` output
2. Rebuilds the site
3. Runs HTMLProofer (internal links only; see [README.md](../README.md) for other modes)

## Asset Vendoring

Third-party assets (Font Awesome, Reveal.js) are vendored from npm into `assets/`.

### Update vendored assets

If you update package.json with new versions:

```zsh
npm run vendor:fontawesome    # Copy Font Awesome to assets/fontawesome/
npm run vendor:reveal         # Copy Reveal.js to assets/reveal/
```

**Note:** Both scripts clean old assets before copying, ensuring a fresh copy.

### Verify vendoring

After running vendor scripts:

```zsh
ls -la assets/fontawesome/     # Should contain CSS, webfonts/, SVG/
ls -la assets/reveal/          # Should contain dist/, plugins/, themes/
```

Both directories are tracked in `_site/` but marked as vendored in `.gitattributes` to avoid noise in diffs.

## Testing & Validation

### HTMLProofer (link checking)

**Internal links only (fast):**
```zsh
PROOF_MODE=internal bundle exec ruby scripts/proof.rb _site
```

**Staging mode (includes external checks; used in CI):**
```zsh
PROOF_MODE=staging bundle exec ruby scripts/proof.rb _site
```

See [README.md](../README.md) for details on proof modes and external link monitoring.

### Visual Regression Testing

Presentation pages are monitored via Playwright snapshot tests.

**Run all tests:**
```zsh
npx playwright test
```

**Interactive mode (useful for debugging):**
```zsh
npx playwright test --ui
```

**Update baselines after intentional changes:**
```zsh
npx playwright test --update-snapshots
```

Tests cover key Reveal.js presentations and verify:
- No unintended visual changes (snapshot comparison)
- Menu functionality (hamburger button, open/close, content verification)
- Reveal.js API initialization

**Note:** Snapshots are stored in `tests/reveal.spec.js-snapshots/` and committed to Git for CI parity.

## Code Standards

### SASS / Styling

All stylesheets use the `@use` module system (no `@import`):

```scss
// ✅ Correct
@use "vars";                   // Import design tokens
@use "minimal-mistakes/themes/light";

// ❌ Avoid
@import "vars";
```

Add new variables/tokens to `assets/css/_vars.scss` rather than duplicating across files:

```scss
// assets/css/_vars.scss
$brand-color: #3498db;
$link-color: color.mix($brand-color, #000, 80%);

// assets/css/_custom.scss
@use "vars";
.my-link { color: vars.$link-color; }
```

### Includes

Only 5 theme includes are customized. Others have been removed to reduce maintenance burden:

**Customized (keep these in sync with upstream when possible):**
- `_includes/head.html` – Font Awesome CSS link
- `_includes/masthead.html` – Subtitle branding
- `_includes/page__hero.html` – CTA fix
- `_includes/reveallinks.html` – Reveal menu wiring
- `_includes/seo.html` – Custom structured data

**Removed (do not re-add without justification):**
- All other theme-default includes; rely on Minimal Mistakes defaults instead

If you need a theme customization, consider:
1. Checking if Minimal Mistakes has a config option instead
2. Adding a CSS override in `assets/css/_custom.scss`
3. Only if necessary: Add a minimal `_includes/` override with a comment explaining why

### Layouts

- `_layouts/reveal.html` – Standard Reveal.js presentation layout
- `_layouts/reveal-duke.html` – Duke-branded variant with custom Links menu
- Other layouts use Minimal Mistakes defaults

## Commit Conventions

- Keep commits **small and focused** on a single logical change
- Use **imperative mood** (e.g., "Add", "Fix", "Remove", not "Added", "Fixes")
- Reference issue numbers when applicable (e.g., "Fixes #42" in body)

**Examples:**
```
chore: Update Reveal.js to 5.2.1

Add npm run vendor:reveal script and integrate into CI.
```

```
docs: Clarify asset vendoring strategy in README

Fixes #99
```

## Before Opening a Pull Request

1. **Run local tests:**
   ```zsh
   scripts/clean-build-proof.zsh  # Build + HTMLProofer
   npx playwright test             # Visual regression tests
   ```

2. **Preview locally:**
   ```zsh
   bundle exec jekyll serve --livereload --drafts \
     --config _config.yml,_config_dev.yml
   ```

3. **Check for stale vendor assets:**
   ```zsh
   # If you touched package.json, re-vendor:
   npm run vendor:fontawesome && npm run vendor:reveal
   ```

4. **Commit and push to your branch:**
   ```zsh
   git add -A
   git commit -m "..."
   git push origin <branch-name>
   ```

5. **Open PR into `staging`** (not `main`); see the Workflow section above for promotion flow.

## Troubleshooting

### "Include not found" errors

**Error:** `Liquid Exception: Liquid syntax error: Unknown tag 'include' in _layouts/reveal-duke.html:line X`

**Solution:** Ensure `_includes/reveallinks.html` exists. It's required by Reveal layouts.

### Stale vendor assets

**Error:** Reveal.js or Font Awesome changes don't appear in built site

**Solution:** Re-run vendor scripts:
```zsh
npm run vendor:fontawesome && npm run vendor:reveal
bundle exec jekyll clean
bundle exec jekyll build
```

### SASS compilation errors

**Error:** `Error on line X: Invalid CSS after "@use"…`

**Solution:** Verify `@use` statements come before other SASS code and that module names are quoted:
```scss
@use "vars";           // ✅ Correct
@use "minimal-mistakes/themes/light";

// ... rest of code follows
```

### Playwright timeouts

**Error:** `TimeoutError: Page.goto: Timeout 30000ms exceeded while waiting for 'load'`

**Solution:** Presentation may be slow to load (e.g., remote images). The test automatically skips known problematic pages. If a new page times out, add it to the skip list in `tests/reveal.spec.js`.

## Questions or Issues?

Refer to [README.md](../README.md) for project overview and links to documentation. Open a GitHub issue for bugs or feature requests.