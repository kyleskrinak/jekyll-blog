#!/usr/bin/env zsh
set -euo pipefail

# Range to include (default: last tag..HEAD, else from repo root)
if [[ ${1:-} != "" ]]; then
  range="$1"
elif git describe --tags --abbrev=0 >/dev/null 2>&1; then
  last_tag=$(git describe --tags --abbrev=0)
  range="${last_tag}..HEAD"
else
  first_commit=$(git rev-list --max-parents=0 HEAD | tail -n1)
  range="${first_commit}..HEAD"
fi

today=$(date +%F)

# Collect subjects (no merge commits)
all_subjects=$(git log --no-merges --pretty=format:'%s' ${range})

# Buckets by conventional prefix
types=(feat fix docs chore ci refactor perf build test style)
tmp=$(mktemp)
{
  echo "## ${today}"
  for t in $types; do
    lines=$(print -r -- "${all_subjects}" | grep -E "^${t}(\(|:)" || true)
    if [[ -n "${lines}" ]]; then
      echo ""
      echo "### ${t:u}"
      print -r -- "${lines}" | sed -E 's/^/ - /'
    fi
  done
  # Other lines that don't match a known type
  others=$(print -r -- "${all_subjects}" | grep -Ev '^(feat|fix|docs|chore|ci|refactor|perf|build|test|style)(\(|:)' || true)
  if [[ -n "${others}" ]]; then
    echo ""
    echo "### Other"
    print -r -- "${others}" | sed -E 's/^/ - /'
  fi
  echo ""
} > "$tmp"

# Prepend/initialize CHANGELOG.md
if [[ -f CHANGELOG.md ]]; then
  if grep -q '^# Changelog' CHANGELOG.md; then
    { echo "# Changelog"; echo ""; cat "$tmp"; sed '1d' CHANGELOG.md; } > CHANGELOG.md.new
  else
    { echo "# Changelog"; echo ""; cat "$tmp"; echo ""; cat CHANGELOG.md; } > CHANGELOG.md.new
  fi
else
  { echo "# Changelog"; echo ""; cat "$tmp"; } > CHANGELOG.md.new
fi

mv CHANGELOG.md.new CHANGELOG.md
echo "Updated CHANGELOG.md for range: ${range}"
