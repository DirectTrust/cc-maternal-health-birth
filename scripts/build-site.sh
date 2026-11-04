#!/usr/bin/env bash
# Builds every published version of the guide into one directory tree, ready to be
# uploaded as the single GitHub Pages artifact:
#
#   <out>/                  main          (current published version; a placeholder until the first release)
#   <out>/develop/          develop       (DRAFT preview of the next version)
#   <out>/<tag>/            one per git tag (archived versions)
#
# Every tag is published -- tagging a commit is how a version is declared released.
# Each ref is built from its own checkout with its own dependencies, so old versions keep
# building the way they did when they were released.
#
# Usage: scripts/build-site.sh <out-dir>
# Optional env: MAIN_REF (default origin/main), DEVELOP_REF (default origin/develop)
set -euo pipefail

SITE_BASE="/cc-maternal-health-birth"
MAIN_REF="${MAIN_REF:-origin/main}"
DEVELOP_REF="${DEVELOP_REF:-origin/develop}"

OUT="${1:?usage: build-site.sh <out-dir>}"
ROOT="$(git rev-parse --show-toplevel)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"; git -C "$ROOT" worktree prune' EXIT

mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd)"

# The Version History page lists every version, so generate it once and put the same copy in every
# build -- each rebuild of an archived version then also shows releases made after it.
MAIN_REF="$MAIN_REF" DEVELOP_REF="$DEVELOP_REF" node "$ROOT/scripts/generate-history.mjs" "$WORK/version-history.md"

# build_ref <name> <git-ref> <channel> <url-path> <dest-dir>
build_ref() {
  local name="$1" ref="$2" channel="$3" url_path="$4" dest="$5"
  local dir="$WORK/$name"

  echo "::group::Build $name ($ref) -> $url_path"
  git -C "$ROOT" worktree add --detach "$dir" "$ref" >/dev/null
  cp "$WORK/version-history.md" "$dir/docs/version-history.md"

  # Refs from before the Version History page existed have no sidebar entry for it. Wrap their
  # config (without touching the ref itself) so Version History is appended below the last group.
  if ! grep -q "version-history" "$dir/docs/.vitepress/config.mts"; then
    mv "$dir/docs/.vitepress/config.mts" "$dir/docs/.vitepress/config.base.mts"
    cat > "$dir/docs/.vitepress/config.mts" <<'EOF_SHIM'
import base from './config.base.mts'
const tc: any = base.themeConfig ?? {}
export default {
  ...base,
  // Divider above Version History (current refs get this from theme/custom.css)
  head: [...(base.head ?? []), ['style', {}, '.VPSidebarItem:has(> .item > a[href$="/version-history"]) { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--vp-c-divider); }']],
  themeConfig: { ...tc, sidebar: [...(tc.sidebar ?? []), { text: 'Version History', link: '/version-history' }] }
}
EOF_SHIM
  fi
  (
    cd "$dir"
    npm ci --no-audit --no-fund
    # The VitePress CLI has no --base flag, but the build API does. Overriding it here
    # means old refs (whose config.mts hard-codes the root base) build unchanged.
    DOCS_CHANNEL="$channel" node --input-type=module \
      -e "import { build } from 'vitepress'; await build('docs', { base: process.argv[1] }); process.exit(0)" \
      "$url_path"
  )

  mkdir -p "$dest"
  cp -R "$dir/docs/.vitepress/dist/." "$dest/"

  # Older refs hard-code absolute /cc-maternal-health-birth/... hrefs in the home page
  # hero buttons, which would jump to the current version. Point them at this build.
  if [ "$url_path" != "$SITE_BASE/" ] && [ -f "$dest/index.html" ]; then
    sed -i.bak -E "s#(class=\"home-hero-btn[^>]*href=\")$SITE_BASE/#\1$url_path#g" "$dest/index.html"
    rm -f "$dest/index.html.bak"
  fi
  echo "::endgroup::"
}

# Before the first release main holds no guide (only repo scaffolding), so there is nothing to build
# for the site root. Publish a placeholder there that points at the draft preview instead.
if git -C "$ROOT" cat-file -e "$MAIN_REF:docs/.vitepress/config.mts" 2>/dev/null; then
  build_ref main "$MAIN_REF" release "$SITE_BASE/" "$OUT"
else
  echo "No guide on $MAIN_REF yet; publishing placeholder at $SITE_BASE/"
  cat > "$OUT/index.html" <<EOF_PLACEHOLDER
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>cc-maternal-health-birth Use Case Guide</title>
</head>
<body style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.5">
  <h1>cc-maternal-health-birth Use Case Guide</h1>
  <p>No version of this guide has been released yet.</p>
  <p>The guide is under development. You can read the <a href="${SITE_BASE}/develop/">draft version</a>, which is not the published standard and will change.</p>
</body>
</html>
EOF_PLACEHOLDER
fi
build_ref develop "$DEVELOP_REF" draft "$SITE_BASE/develop/" "$OUT/develop"

while IFS= read -r tag; do
  [ -n "$tag" ] || continue
  if [ "$tag" = "develop" ]; then
    echo "Tag named 'develop' would collide with the draft preview; rename it." >&2
    exit 1
  fi
  build_ref "tag-$tag" "refs/tags/$tag" release "$SITE_BASE/$tag/" "$OUT/$tag"
done < <(git -C "$ROOT" tag --list)
