// Generates docs/version-history.md: the "Version History" page listing the current, in-development and
// every released version of the guide. Run on every build (scripts/build-site.sh for the
// published site, the predocs:* npm hooks locally), so it is never edited by hand and is
// gitignored.
//
//   - "Develop" is always listed. "Latest" (main) is listed with a link once a version has been
//     released; before that main is empty, so it is shown without a link.
//   - Every git tag is a released version. Its description is the body of the GitHub
//     release for that tag (fetched with the gh CLI); with no release, it falls back to
//     the tag's own message.
//   - "Other working versions" is reserved for tagged working versions that follow a
//     naming convention we do not have yet, so it is empty for now.
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

const link = (href, text) => `<a class="vp-raw" href="${href}">${text}</a>`
const day = (d) => d.toISOString().slice(0, 10)

// "Latest" is whatever main currently is, so name the release it corresponds to: the newest
// tag reachable from main (the tag on main's head commit when main has not moved past it).
const MAIN_REF = process.env.MAIN_REF ?? 'origin/main'
let latest = null
let latestDate = ''
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
  const t = tags.find((t) => merged.has(t.name)) // tags are sorted newest first
  latest = t?.name ?? null
  latestDate = t ? day(t.date) : ''
  // Until the first release, main holds no guide (just the repo scaffolding), so there is no
  // published version to link to; build-site.sh serves a placeholder at the root instead.
  hasRelease = tags.length > 0 || mainHasSite()
} catch (e) {
  console.warn(`generate-history: could not map ${MAIN_REF} to a tag (${e.message.split('\n')[0]})`)
}

// Develop has no release date, so show when its branch was last modified.
const DEVELOP_REF = process.env.DEVELOP_REF ?? 'origin/develop'
let developDate = ''
try {
  developDate = day(new Date(run('git', ['log', '-1', '--format=%cI', DEVELOP_REF]).trim()))
} catch (e) {
  console.warn(`generate-history: could not read the last commit date of ${DEVELOP_REF} (${e.message.split('\n')[0]})`)
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
  `| ${link(`${SITE_BASE}/${encodeURIComponent(t.name)}/`, `Version ${t.name}`)} | ${day(t.date)} | ${cell(t.description)} |`

const latestRow = hasRelease
  ? `| ${link(`${SITE_BASE}/`, latest ? `**Latest (${latest})**` : '**Latest**')} | ${latestDate} | Latest released version${latest ? ` (${latest})` : ''} |`
  : '| **Latest** | | _No version has been released yet._ |'

const page = `---
title: Version History
---

# Version History

## Current and upcoming

| Version | Date | Description |
|---|---|---|
${latestRow}
| ${link(`${SITE_BASE}/develop/`, '**Develop**')} | ${developDate} | Next version in development |

## Released versions

${tags.length ? `| Version | Date | Change |\n|---|---|---|\n${tags.map(row).join('\n')}\n` : '_No tagged releases yet._\n'}
## Other working versions

None at this time.
`

fs.writeFileSync(out, page)
console.log(`generate-history: wrote ${path.relative(REPO_ROOT, out)} (${tags.length} released version${tags.length === 1 ? '' : 's'}; latest = ${latest ?? (hasRelease ? 'untagged' : 'none')})`)
