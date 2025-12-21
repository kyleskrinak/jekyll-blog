
#!/usr/bin/env zsh
set -euo pipefail

# Usage:
#   scripts/new-branch.zsh contentnew-post "short-slug"
# Example:
#   scripts/new-branch.zsh contentnew-post "disqus-fallback-reveal"

prefix="${1:-contentnew-post}"
slug="${2:-}"

date_ymd="$(date +%F)"  # YYYY-MM-DD

if [[ -n "$slug" ]]; then
  branch="${prefix}-${date_ymd}-${slug}"
else
  branch="${prefix}-${date_ymd}"
fi

git fetch origin
git switch main
git pull --ff-only origin main
git switch -c "$branch"

echo "Created and switched to: $branch"