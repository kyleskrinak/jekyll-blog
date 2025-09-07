#!/usr/bin/env zsh
set -euo pipefail

# ---------- helpers ----------
msg()  { print -P "%F{blue}→%f $*"; }
ok()   { print -P "%F{green}✓%f $*"; }
err()  { print -P "%F{red}✗%f $*" >&2; }
need() { command -v "$1" >/dev/null 2>&1 || { err "Required command not found: $1"; exit 1; } }

# On failure, show the most recent logs (if they exist)
LAST_BUILD_LOG=""
LAST_PROOF_LOG=""
trap 'err "Build/proof failed."
     [[ -n "$LAST_BUILD_LOG" && -f "$LAST_BUILD_LOG" ]] && print "\n--- Build log: $LAST_BUILD_LOG ---" && tail -n 50 "$LAST_BUILD_LOG"
     [[ -n "$LAST_PROOF_LOG" && -f "$LAST_PROOF_LOG" ]] && print "\n--- Proofer log: $LAST_PROOF_LOG ---" && tail -n 50 "$LAST_PROOF_LOG"
     exit 1' INT TERM HUP
set +e    # allow trap to run on pipeline failures
set -o pipefail
set -e

# ---------- repo root & tmp ----------
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

mkdir -p tmp
ok "Ensured tmp/ exists."

# ---------- prerequisite checks ----------
need ruby
need bundle

if [[ ! -f Gemfile ]]; then
  err "No Gemfile found in $REPO_ROOT"
  exit 1
fi

# Check gems we rely on
msg "Checking Bundler gems…"
bundle exec jekyll -v >/dev/null 2>&1 || { err "Jekyll not available via Bundler. Run: bundle install"; exit 1; }
bundle exec htmlproofer --version >/dev/null 2>&1 || { err "html-proofer not available via Bundler. Run: bundle install"; exit 1; }
ok "Required gems available."

# Basic project sanity
[[ -f _config.yml ]] || { err "_config.yml is missing at repo root."; exit 1; }

# reveal-duke uses the include; ensure it's present (create a minimal stub if missing)
if rg -nF "{% include reveallinks.html %}" _layouts/reveal-duke.html >/dev/null 2>&1; then
  if [[ ! -f _includes/reveallinks.html ]]; then
    msg "Missing _includes/reveallinks.html; creating a minimal stub."
    mkdir -p _includes
    cat > _includes/reveallinks.html <<'HTML'
<h1>External Links</h1>
<ul class="slide-menu-items">
  <li class="slide-menu-item"><a href="/">Back to home page</a></li>
</ul>
HTML
    ok "Created _includes/reveallinks.html"
  fi
fi

# ---------- clean old artifacts ----------
msg "Cleaning old build artifacts…"
rm -rf _site .jekyll-cache .sass-cache
ok "Cleaned."

# ---------- build ----------
timestamp="$(date +%F_%H-%M-%S)"
LAST_BUILD_LOG="tmp/build.$timestamp.log"
msg "Building site (JEKYLL_ENV=production)…"
JEKYLL_ENV=production bundle exec jekyll build --verbose 2>&1 | tee "$LAST_BUILD_LOG" >/dev/null
build_ec=$?
if [[ $build_ec -ne 0 ]]; then
  err "Jekyll build failed. See $LAST_BUILD_LOG"
  exit $build_ec
fi
ok "Build complete."

# ---------- html proofer ----------
LAST_PROOF_LOG="tmp/proof.$timestamp.log"
msg "Running HTML Proofer…"
bundle exec htmlproofer ./_site \
  --checks "Links,Images,Scripts,Favicon,OpenGraph" \
  --ignore-urls "/^mailto:/,/^tel:/" \
  --ignore-files ".*/assets/reveal/plugin/.*" \
  --ignore-status-codes "0,302,403,417,429,999" \
  --hydra '{"max_concurrency":20}' \
  --typhoeus '{"timeout":45,"connecttimeout":10}' 2>&1 | tee "$LAST_PROOF_LOG" >/dev/null
proof_ec=$?
if [[ $proof_ec -ne 0 ]]; then
  err "HTML Proofer reported issues. See $LAST_PROOF_LOG"
  exit $proof_ec
fi
ok "HTML Proofer passed."

print -P "\n%F{green}All done.%f Logs:\n  Build:  $LAST_BUILD_LOG\n  Proofer:$LAST_PROOF_LOG"