// Generates docs/version-history.md: the "Version History" page listing the current, in-development and
// every released version of the guide. Run on every build (scripts/build-site.sh for the
// published site, the predocs:* npm hooks locally), so it is never edited by hand and is
// gitignored.
//
//   - "Develop" is always listed. "Latest" (main) is listed with a link once a version has been
//     released; before that main is empty, so it is shown without a link.
//   - Every git tag is listed (see the naming rule below). Its description is the body of the GitHub
//     release for that tag (fetched with the gh CLI); with no release, it falls back to
//     the tag's own message.
//   - A tag is a released version only if its name is the standard's identifier,
//     ANSI-DS<year>-<nn>-<nnn>-<year>
//     (e.g. ANSI-DS2020-03-101-2025; a tag cannot contain a space, so "ANSI DS..." is hyphenated). Any other tag (e.g. a Standard for
//     Trial Use such as DS2020-03-101-2025-STU-1.2.1) is an "Other working version": listed
//     under that heading, never "Latest". Its site build and release notes work like any tag.
//
// Usage: node scripts/generate-history.mjs [out-file]   (default docs/version-history.md)
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE_BASE = '/cc-maternal-health-birth'
const out = path.resolve(process.argv[2] ?? path.join(REPO_ROOT, 'docs', 'version-history.md'))

const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

// Releases keyed by tag name. Drafts are unpublished, so they are skipped.
const releases = new Map()
try {
  const pages = run('gh', ['api', 'repos/{owner}/{repo}/releases', '--paginate', '--slurp'])
  for (const r of JSON.parse(pages).flat()) if (!r.draft) releases.set(r.tag_name, r)
} catch (e) {
  // In CI a missing release list would silently publish a Version History page without
  // descriptions, so fail there; locally (no gh, offline) just warn and carry on.
  if (process.env.CI) throw e
  console.warn(`generate-history: could not read GitHub releases (${e.message.split('\n')[0]}); using tag data only`)
}

const tags = run('git', ['for-each-ref', '--format=%(refname:short)%09%(creatordate:iso-strict)%09%(contents:subject)', 'refs/tags'])
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [name, created, subject] = line.split('\t')
    const release = releases.get(name)
    return {
      name,
      date: new Date(release?.published_at ?? created),
      description: (release?.body ?? '').trim() || (release ? '' : subject ?? '')
    }
  })
  // Newest release first, so the most recent version is at the top of the list.
  .sort((a, b) => b.date - a.date)

// Naming convention for released versions (see header comment); every other tag is a working version.
const isRelease = (name) => /^ANSI-DS\d{4}-\d{2}-\d{3}-\d{4}$/.test(name)
const releasedTags = tags.filter((t) => isRelease(t.name))
const workingTags = tags.filter((t) => !isRelease(t.name))

const link = (href, text) => `<a class="vp-raw" href="${href}">${text}</a>`

// "Latest" is whatever main currently is, so name the release it corresponds to: the newest
// tag reachable from main (the tag on main's head commit when main has not moved past it).
const MAIN_REF = process.env.MAIN_REF ?? 'origin/main'
let latest = null
let latestTag = null
let hasRelease = false
const mainHasSite = () => {
  try {
    run('git', ['cat-file', '-e', `${MAIN_REF}:docs/.vitepress/config.mts`])
    return true
  } catch {
    return false
  }
}
try {
  const merged = new Set(run('git', ['tag', '--merged', MAIN_REF]).split('\n').filter(Boolean))
  const t = releasedTags.find((t) => merged.has(t.name)) // tags are sorted newest first
  latest = t?.name ?? null
  latestTag = t ?? null
  // Until the first release, main holds no guide (just the repo scaffolding), so there is no
  // published version to link to; build-site.sh serves a placeholder at the root instead.
  hasRelease = releasedTags.length > 0 || mainHasSite()
} catch (e) {
  console.warn(`generate-history: could not map ${MAIN_REF} to a tag (${e.message.split('\n')[0]})`)
}

// Release notes are free-form Markdown but live in a single table cell, so flatten them to
// one line: headings become bold, line breaks become <br>, and "|" is escaped. v-pre stops
// Vue from interpreting any {{ }} in the text.
const cell = (md) => {
  const text = md
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('<br>')
    .replace(/\|/g, '\\|')
  return text ? `<span v-pre>${text}</span>` : '_No description provided._'
}

const row = (t) =>
  `| ${link(`${SITE_BASE}/${encodeURIComponent(t.name)}/`, `Version ${t.name}`)} | ${cell(t.description)} |`

const latestRow = hasRelease
  ? `| ${link(`${SITE_BASE}/`, latest ? `**Latest (${latest})**` : '**Latest**')} | ${latestTag ? cell(latestTag.description) : 'Latest released version'} |`
  : '| **Latest** | _No version has been released yet._ |'

// Every table gets identical column widths (fixed layout). The style travels with the generated page, and
// pageClass scopes it to this page, so every build (including archived tags) renders the same way.
const page = `---
title: Version History
pageClass: version-history
---

<style>
.version-history .vp-doc table { display: table; width: 100%; table-layout: fixed; }
.version-history .vp-doc th:nth-child(1), .version-history .vp-doc td:nth-child(1) { width: 35%; }
.version-history .vp-doc th:nth-child(2), .version-history .vp-doc td:nth-child(2) { width: 65%; }
</style>

# Version History

## Current and upcoming

| Version | Description |
|---|---|
${latestRow}
| ${link(`${SITE_BASE}/develop/`, '**Develop**')} | Next version in development |

## Released versions

${releasedTags.length ? `| Version | Description |\n|---|---|\n${releasedTags.map(row).join('\n')}\n` : '_No tagged releases yet._\n'}
## Other working versions

${workingTags.length ? `These versions were never published as releases (for example, Standards for Trial Use).\n\n| Version | Description |\n|---|---|\n${workingTags.map(row).join('\n')}\n` : 'None at this time.\n'}`

fs.writeFileSync(out, page)
console.log(`generate-history: wrote ${path.relative(REPO_ROOT, out)} (${releasedTags.length} released, ${workingTags.length} working; latest = ${latest ?? (hasRelease ? 'untagged' : 'none')})`)
