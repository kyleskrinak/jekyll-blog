
#!/usr/bin/env zsh
set -euo pipefail

# Usage:
#   scripts/new-post.zsh feature-content/fix-linkwatch-pdf
# Example:
#   scripts/new-post.zsh feature-content/disqus-fallback-reveal

prefix="${1:-}"

if [[ -z "$prefix" ]]; then
  echo "❌ Error: Branch name required"
  echo "Usage: scripts/new-post.zsh <prefix>"
  echo "Example: scripts/new-post.zsh feature-content/my-fix"
  exit 1
fi

# Enforce feature-content/* naming
if [[ ! "$prefix" =~ ^feature-content/ ]]; then
  echo "❌ Error: Branch must start with 'feature-content/'"
  echo "Got: $prefix"
  echo "Expected: feature-content/descriptive-name"
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "❌ Error: Uncommitted changes in working directory"
  echo "Commit or stash changes before creating a new branch"
  git status
  exit 1
fi

# Fetch and prune
echo "📡 Syncing with origin..."
git fetch origin --prune

# Verify local main is aligned with origin
echo "🔍 Checking local/origin alignment..."
local_main=$(git rev-parse main)
origin_main=$(git rev-parse origin/main)

if [[ "$local_main" != "$origin_main" ]]; then
  echo "⚠️  Local main is behind origin/main"
  echo "Attempting fast-forward..."
  git switch main
  if ! git pull --ff-only origin main; then
    echo "❌ Error: Could not fast-forward main"
    echo "Manual intervention required: git pull origin main"
    exit 1
  fi
else
  echo "✓ Local main aligned with origin/main"
  git switch main
fi

# Create feature branch
git switch -c "$prefix"

echo "✅ Created and switched to: $prefix"
echo ""
echo "Next steps:"
echo "  1. Make your changes"
echo "  2. Commit: git commit -m 'message'"
echo "  3. Push: git push -u origin $prefix"
echo "  4. Open PR against staging (not main)"