#!/usr/bin/env zsh
# Find repo assets not referenced anywhere in the built site.
# Dry-run only: writes lists under tmp/ and prints a summary.

set -euo pipefail

# Optional: build when called with --build
if [[ "${1:-}" == "--build" ]]; then
  rm -rf _site .jekyll-cache
  bundle exec jekyll build --verbose
fi

mkdir -p tmp

# Extensions we consider "assets"
EXT_RE='png|jpe?g|gif|svg|webp|pdf|mp4|webm|mov|m4v|ico|ttf|otf|woff2?|eot|mp3|ogg'

# Text files to scan inside _site
SITE_GLOB='**/*.{html,htm,css,js,json,xml,txt,md}'

# Build candidate list (tracked files only), skipping generated/vendor/plugin dirs
git ls-files \
| grep -E "\.(${EXT_RE})$" \
| grep -Ev '^(_site/|node_modules/|\.jekyll-cache/|vendor/|\.git/)' \
| grep -Ev '^assets/reveal/plugin/' \
| sort -u > tmp/asset_candidates.txt || true

CANDIES=$(wc -l < tmp/asset_candidates.txt | tr -d ' ')

# Prepare output buckets
: > tmp/referenced_assets.txt
: > tmp/unreferenced_assets.txt
: > tmp/not_copied_to_site.txt

echo "=== Unreferenced Asset Scan ==="
echo "Candidates found: $CANDIES"
[[ -d _site ]] && echo "_site present: yes" || echo "_site present: no (run with --build to populate)"

if [[ "$CANDIES" -eq 0 ]]; then
  echo "No asset candidates matched extensions (${EXT_RE}). Nothing to review. ✅"
  exit 0
fi

# Search helper (prefers ripgrep)
has_rg=0
if command -v rg >/dev/null 2>&1; then
  has_rg=1
fi

search_site() {
  local needle="$1"
  if [[ $has_rg -eq 1 ]]; then
    rg -n --fixed-strings --glob "$SITE_GLOB" "$needle" _site >/dev/null 2>&1
  else
    # grep fallback
    grep -R -n -F \
      --include='*.html' --include='*.htm' --include='*.css' --include='*.js' \
      --include='*.json' --include='*.xml' --include='*.txt' --include='*.md' \
      -e "$needle" _site >/dev/null 2>&1
  fi
}

echo "Scanning references in built site content…"
while IFS= read -r rel; do
  site_rel="_site/$rel"
  base="$(basename "$rel")"

  # If Jekyll didn't copy it, flag it (often unused/excluded)
  if [[ ! -f "$site_rel" ]]; then
    print -r -- "$rel" >> tmp/not_copied_to_site.txt
    continue
  fi

  # Consider referenced if any of these appear in site text:
  #  /path/from/root, relative path, or bare filename (weak signal)
  if search_site "/$rel" || search_site "$rel" || search_site "$base"; then
    print -r -- "$rel" >> tmp/referenced_assets.txt
  else
    print -r -- "$rel" >> tmp/unreferenced_assets.txt
  fi
done < tmp/asset_candidates.txt

REF=$(wc -l < tmp/referenced_assets.txt | tr -d ' ')
UNREF=$(wc -l < tmp/unreferenced_assets.txt | tr -d ' ')
NOCOPY=$(wc -l < tmp/not_copied_to_site.txt | tr -d ' ')

echo
echo "=== Results ==="
echo "Referenced assets:    $REF"
echo "Unreferenced assets:  $UNREF    -> tmp/unreferenced_assets.txt"
echo "Not copied to _site:  $NOCOPY   -> tmp/not_copied_to_site.txt"

if [[ "$UNREF" -eq 0 && "$NOCOPY" -eq 0 ]]; then
  echo "No unreferenced or un-copied assets. Nothing to clean. ✅"
else
  echo
  echo "Review the lists above. If you choose to remove unreferenced files later:"
  echo "  xargs -a tmp/unreferenced_assets.txt -I{} git rm -- '{}'   # then commit"
fi
