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