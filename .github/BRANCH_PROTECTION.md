# Branch Protection Rules

This document describes the branch protection rules configured for this repository to ensure code quality and prevent accidental deletions.

## Protected Branches

### `staging`
**Purpose:** Pre-production deployment branch for testing before main deployment.

**Protection Rules:**
- ✅ Require a pull request before merging
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging (`build`)
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings (applies to admins)
- ✅ Force pushes disabled
- ✅ Deletions disabled

**Why:** Prevents accidental branch deletion and ensures only tested, reviewed code reaches staging.

### `main`
**Purpose:** Production branch.

**Recommended Protection Rules:**
- Require a pull request before merging
- Dismiss stale pull request approvals when new commits are pushed
- Require status checks to pass before merging (`build-and-deploy`)
- Require branches to be up to date before merging
- Do not allow bypassing the above settings (applies to admins)
- Force pushes disabled
- Deletions disabled

**Setup:** Navigate to **Settings → Branches → Add rule** and enter `main` as the branch name pattern, then apply the same rules as `staging`.

## Workflow

1. Create a feature branch from `staging` or `main`
2. Make your changes and push
3. Open a pull request
4. GitHub Actions automatically runs the CI pipeline
5. Once all status checks pass and the branch is up to date, the PR can be merged
6. Branch protection ensures the branch is never accidentally deleted or force-pushed

## Why These Rules Matter

- **PR Requirement:** Code review before merge
- **Status Checks:** CI/CD validation (Jekyll build, HTMLProofer, visual tests)
- **Up-to-date:** Prevents merging with stale code
- **No Bypass for Admins:** Even repository owners must follow the rules
- **No Force Pushes/Deletions:** Prevents accidental history rewriting or branch loss

## Emergency Override

If you absolutely need to bypass these rules, you must:
1. Temporarily disable the rule via GitHub UI (Settings → Branches)
2. Make your change
3. Re-enable the rule immediately

This should only be done in genuine emergencies and should be documented.
