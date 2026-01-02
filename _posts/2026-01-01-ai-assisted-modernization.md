layout: single
title: "AI-Assisted Modernization: Two Days, Ten Years Strong"
date: 2026-01-01
classes: wide
categories: [DevOps, Jekyll]
tags: [ai, copilot, minimal-mistakes, revealjs, workflow, testing]
excerpt: "How an AI-assisted sprint refreshed my decade-old Jekyll stack: asset vendoring, visual tests, workflow guardrails, and a renewed commitment to Minimal Mistakes."

I have had my personal blog for many years now. It will be 10 years old next October. They grow up so fast, don’t they? What started as a way to share my thoughts, wins, and work notes has now become a “skin in the game” playground for me. I host it entirely in the cloud (minus local dev), which lets me ply my trade for my own edification.

A playful “what if” session with VS Code’s integrated Copilot turned into mowing down long-standing issues in minutes. In one sitting, the AI assistant reviewed my repo and suggested a plan for critical updates I had parked: security hardening, modernized asset management, and workflow documentation gaps. A 48-hour back-and-forth condensed what would have been two weeks of evenings into two winter-break days. Sharing this is part of my learning process—I hope it helps anyone evaluating whether these tools are worth the investment.

## My changes, by the numbers
- Major PRs merged: 2 (#53 MM4 upgrade, #55 CI cleanup)
- Total files changed: 92
- Lines added: 11,707; Lines deleted: 1,160
- Includes reduced: 46 → 18 (28 removed)
- SASS overrides added: 2 new files (16 lines total)
- Playwright tests: 8 snapshot tests + 111 lines (Wraith replacement)
- Maintainers documentation: 229 lines filling an empty `MAINTAINERS_NOTE.txt`
- CSS customizations: 4 → 20 lines using `@use` modules
- Font Awesome: CDN → self-hosted 5.15.4 (18 files)
- Reveal.js: 5.2.1 with a formalized npm vendor script
- Reveal.js menu: Restored/pinned at v2.1.0 with complete documentation
- New npm scripts: `vendor:fontawesome`, `vendor:reveal`

## What I learned from all this

1) **Documentation is a necessary guardrail.** Natural-language interaction invites a false sense of “memory and intuition.” Without persistent context, the AI will re-analyze the same situation differently. Lead with your documentation. Keep workflow docs updated and reference them in prompts:
   - CONTRIBUTING: <https://github.com/kyleskrinak/kyleskrinak.github.io/blob/main/.github/CONTRIBUTING.md>
   - BRANCH_PROTECTION: <https://github.com/kyleskrinak/kyleskrinak.github.io/blob/main/.github/BRANCH_PROTECTION.md>
   - README: <https://github.com/kyleskrinak/kyleskrinak.github.io/blob/main/README.md>
   - MAINTAINERS_NOTE (Reveal menu): <https://github.com/kyleskrinak/kyleskrinak.github.io/blob/main/assets/reveal/plugin/menu/MAINTAINERS_NOTE.txt>
   - CHANGELOG: <https://github.com/kyleskrinak/kyleskrinak.github.io/blob/main/CHANGELOG.md>

2) **Hallucinations remain a critical issue.** Roughly 1 in 3 prompts were problematic: confusing staging vs. main, implying the MM4 upgrade was already done, trying to create blog files outside the documented workflow, ignoring that Reveal.js was already self-hosted, and even honoring a bad note I’d written about “.htmlproofer.yml.” Bad docs get “respected,” too. Mitigation: always human-in-the-loop—review → approve/reject → execute.

3) **Effective prompting requires specificity.** Specific prompts (exact colors, exact branches/SHAs, exact files/paths) reduce errors. When the AI gets it wrong, it often exposes vagueness in my own thinking. Using the AI as a call-and-response stress test for clarity: if I can’t explain it precisely enough for an AI to understand, my documentation probably isn’t clear enough for humans either.

4) **Verify all suggested actions.** Never blind-trust AI output. Read commands, understand consequences, check diffs, run local builds, run tests, and confirm alignment with the workflow. Skipping this invites unresolvable complexity.

5) **The productivity multiplier is real.** Two weeks compressed into two days. AI handled diffs, log analysis, boilerplate docs/scripts, and pattern recognition; I focused on decisions and verification.

6) **AI helps best at scale—cohesion is human.** AI can juggle best practices, assets, tests, docs, branch rules, and CSS precedence. Deciding what fits and what to reject is human work. Without that, the train goes off the rails.

## Conclusion: New life in my Jekyll + Minimal Mistakes stack
I no longer wonder whether to migrate to faster/newer stacks (Hugo, Eleventy, etc.). The refactor gave my stack a new lease on life: reliable asset vendoring, far more complete documentation, visual regression testing for Reveal pages, and tighter theme integration. I’m sticking with this stack. It’s funny how radical and unexpected this all is—but I like it. Hrm. I wonder if there’s a better way to manage Jekyll assets and serve device-dependent images? Stay tuned.
---

## Epilogue: Post-Publication QA & Polish (2026-01-01)

After publishing, I continued iterating on visual fidelity and testing infrastructure:

### Visual Regression Enhancements

**Pixel-Perfect Local/Production Parity:**
- Extended visual regression suite to all 54+ pages, not just Reveal presentations
- Created `tests/full-visual-regression.spec.js` with 2% pixel tolerance, revealing 5 color mismatches:
  - Archive item H2 links: `#575b62` (was inheriting `$link-color`)
  - ToC header: `#0099cc` (production shade vs local `$primary-color`)
  - ToC box: `#f5f5f5` background + `#d3d3d3` borders (was lighter)
  - Page H2 underlines: `#babdbd` (production rgb(186, 187, 189))
  - HR elements: `#cccccc` (was darker default)
- Fixed all 5 colors in `assets/css/_custom.scss` with `!important` overrides
- Confirmed 54/54 pages pass pixel-perfect comparison

**Interactive QA Tool:**
- Built `/compare/` page for side-by-side local/production inspection
- Left/right iframes, Previous/Next navigation, keyboard shortcuts
- Developed-only (excluded from staging/production builds via config)
- Invaluable for spot-checking color accuracy during CSS tweaks

### Sitemap & Artifact Cleanup

**Removed Non-Public Assets from Sitemap:**
- Updated `_config.yml` to exclude `assets/files/` (PDFs) and `assets/reveal/plugin/notes/speaker-view.html`
- Ensured legitimate pages remain indexed (55 URLs now vs bloated prior list)
- Added jekyll-sitemap plugin configuration with explicit exclusions

**Playwright Artifact Consolidation:**
- Unified test outputs under single `tmp/playwright/` root
- Added `.gitignore` entries to exclude test artifacts
- Cleaner workspace, easier cleanup

### Documentation & Workflow

**README.md enhancements:**
- Added "Full-Page Visual Regression Testing" section with workflow details
- Documented `/compare/` tool and its purpose as dev-only QA
- Updated snapshot location references to `tmp/playwright/`

**CHANGELOG.md expansion:**
- Comprehensive "Unreleased" section logging all QA refinements
- Color fix inventory + rationale
- Explain changed Playwright directory structure

**.github/CONTRIBUTING.md updates:**
- New "Full-Page Visual Regression Testing" guide with typical output
- Interactive "Side-by-Side Comparison" tool documentation
- Expanded PR checklist: CSS changes now require full visual regression run
- Clear dev-only status and exclusion config for compare tool

### Changes Unpublished

- Marked `_pages/location.md` and `_pages/calendar.md` as `published: false` (outdated content, not removed entirely)

### Final Validation

All test suites pass with zero warnings:
- `npx playwright test tests/full-visual-regression.spec.js` → 54 passed, 1 skipped (PDF timeout)
- `npx playwright test tests/reveal.spec.js` → 8 passed
- `bundle exec jekyll build` → clean output, no deprecation warnings (SASS `@use` modules)
- Local serve at `http://localhost:4000` shows full visual parity with production

This post and the work it documents represent a full refresh of both codebase maturity and developer ergonomics for this personal project. The AI-assisted approach worked best as a force multiplier for documentation, pattern recognition, and boilerplate generation—but human judgment on architecture, testing strategy, and QA discipline remained essential. The payoff is a Jekyll stack that feels modern, well-tested, and ready for another decade.