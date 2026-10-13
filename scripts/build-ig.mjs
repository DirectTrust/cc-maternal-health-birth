// Converts the source Word documents into the VitePress site under docs/, driven by
// scripts/ig-layout.json (one entry per source subfolder). See docs/CONVENTIONS.md.
//
// Usage: node scripts/build-ig.mjs [--source <dir>]
// Requires pandoc on the PATH.
//
// For each group the script writes docs/<folder-slug>/index.md (the group landing page)
// plus one .md per breakout section, copies images to docs/public/images/<folder-slug>/,
// copies downloadable artifacts to docs/public/downloads/<folder-slug>/, and writes the
// sidebar to docs/.vitepress/ig-sidebar.json (imported by config.mts).
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS_DIR = path.join(REPO_ROOT, 'docs')
const SCRATCH = path.join(REPO_ROOT, 'scratchpad', 'pandoc')
const layout = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'scripts', 'ig-layout.json'), 'utf8'))

const srcArg = process.argv.indexOf('--source')
const SOURCE_DIR = (srcArg > -1 ? process.argv[srcArg + 1] : layout.sourceDir).replace(/^~/, os.homedir())

// ---------------------------------------------------------------- helpers

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function globToRegex(glob) {
  return new RegExp('^' + glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i')
}

function findOne(dir, glob, ext) {
  const re = globToRegex(glob.endsWith(ext) ? glob : glob + ext)
  const hits = fs.readdirSync(dir).filter((f) => re.test(f) && !f.startsWith('~$'))
  if (hits.length !== 1) throw new Error(`${dir}: expected exactly 1 match for ${glob}${ext}, got [${hits}]`)
  return path.join(dir, hits[0])
}

function pandoc(docxPath) {
  const base = path.basename(docxPath, '.docx')
  const out = path.join(SCRATCH, base)
  fs.rmSync(out, { recursive: true, force: true })
  fs.mkdirSync(out, { recursive: true })
  execFileSync('pandoc', [docxPath, '-f', 'docx', '-t', 'gfm', '--wrap=none', '--extract-media=.', '-o', 'doc.md'], { cwd: out })
  return { dir: out, lines: fs.readFileSync(path.join(out, 'doc.md'), 'utf8').split('\n') }
}

// Word tables with "repeat header row" on every row make pandoc emit every row as <th>.
function fixBrokenHeaderTables(md) {
  return md.replace(/<thead>([\s\S]*?)<\/thead>\s*<tbody>\s*<\/tbody>/g, (match, head) => {
    const rows = head.match(/<tr>[\s\S]*?<\/tr>/g) || []
    if (rows.length <= 1) return match
    const [h, ...rest] = rows
    const body = rest.map((r) => r.replace(/<th>/g, '<td>').replace(/<\/th>/g, '</td>')).join('\n')
    return `<thead>\n${h}\n</thead>\n<tbody>\n${body}\n</tbody>`
  })
}

function cleanWordArtifacts(md) {
  return md
    .replace(/^<span class="smallcaps">(.*?)<\/span>$/gm, '_$1_')
    .replace(/\*\*<span class="smallcaps">(.*?)<\/span>\*\*/g, '_$1_')
    .replace(/<span class="(?:mark|smallcaps)">([\s\S]*?)<\/span>/g, '$1')
    .replace(/<mark>([\s\S]*?)<\/mark>/g, '$1')
    .replace(/<u>([\s\S]*?)<\/u>/g, '$1')
    .replace(/^\\$/gm, '')
    .replace(/^#{1,6}\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
}

// Shift heading levels by `delta` (negative = promote), skipping fenced code.
function shiftHeadings(lines, delta) {
  let fence = false
  return lines.map((line) => {
    if (/^```/.test(line)) fence = !fence
    const m = !fence && line.match(/^(#{1,6})\s+(.*)$/)
    if (!m) return line
    return `${'#'.repeat(Math.min(6, Math.max(1, m[1].length + delta)))} ${m[2]}`
  })
}

// Split on top-level headings of the given level: [{ heading, lines }], plus preamble.
function splitAt(lines, level) {
  const marker = '#'.repeat(level) + ' '
  const parts = [{ heading: null, lines: [] }]
  let fence = false
  for (const line of lines) {
    if (/^```/.test(line)) fence = !fence
    if (!fence && line.startsWith(marker)) parts.push({ heading: line.slice(marker.length).trim(), lines: [line] })
    else parts[parts.length - 1].lines.push(line)
  }
  return parts
}

const yamlStr = (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`

// Writes one page: relocates images, cleans artifacts, writes frontmatter + body.
function writePage({ folderSlug, fileSlug, title, lines, mediaDir, extra = '' }) {
  let md = fixBrokenHeaderTables(cleanWordArtifacts(lines.join('\n')))
  let n = 0
  md = md.replace(/<img\s+src="\.\/(media\/[^"]+)"([^>]*?)\/?>/g, (_, rel, attrs) => {
    const alt = (attrs.match(/alt="([^"]*)"/) || [, ''])[1]
    const ext = path.extname(rel).toLowerCase().replace('.jpeg', '.jpg')
    const destDir = path.join(DOCS_DIR, 'public', 'images', folderSlug)
    fs.mkdirSync(destDir, { recursive: true })
    const destName = `${fileSlug}-${++n}${ext}`
    fs.copyFileSync(path.join(mediaDir, rel), path.join(destDir, destName))
    return `![${alt}](/images/${folderSlug}/${destName})`
  })
  const outDir = path.join(DOCS_DIR, folderSlug)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, `${fileSlug}.md`), `---\ntitle: ${yamlStr(title)}\n---\n\n${md.trim()}\n${extra}`)
  console.log(`  ${folderSlug}/${fileSlug}.md`)
}

function downloadsBlock(group, folderSlug, groupDir) {
  if (!group.downloads) return ''
  const destDir = path.join(DOCS_DIR, 'public', 'downloads', folderSlug)
  fs.mkdirSync(destDir, { recursive: true })
  const items = group.downloads.map(({ file, label }) => {
    const src = findOne(groupDir, file, '')
    fs.copyFileSync(src, path.join(destDir, path.basename(src)))
    return `- [${label}](/downloads/${folderSlug}/${path.basename(src)})`
  })
  return `\n## Downloads\n\n${items.join('\n')}\n`
}

// ---------------------------------------------------------------- build

// Clean previously generated output.
const folderSlugs = layout.groups.map((g) => slugify(g.folder))
for (const s of folderSlugs) {
  for (const sub of ['', 'public/images/', 'public/downloads/']) {
    fs.rmSync(path.join(DOCS_DIR, sub, s), { recursive: true, force: true })
  }
}

const sidebar = []

for (const group of layout.groups) {
  const folderSlug = slugify(group.folder)
  const groupDir = path.join(SOURCE_DIR, group.folder)
  const items = []
  console.log(group.folder)

  if (group.kind === 'chapter') {
    const { dir, lines } = pandoc(findOne(groupDir, group.docx, '.docx'))
    const [pre, ...sections] = splitAt(lines, 2)
    const h1 = pre.lines.find((l) => l.startsWith('# ')).slice(2).trim()
    const body = pre.lines.filter((l) => !l.startsWith('# '))
    const label = (i) => `${group.number}.${i + 1}`
    // Landing page: chapter title + intro + first section; remaining sections are breakouts.
    const [first, ...rest] = sections
    const landing = [
      `# ${group.number} ${h1}`,
      ...body,
      ...shiftHeadings(first.lines, 0).map((l, i) => (i === 0 ? `## ${label(0)} ${first.heading}` : l))
    ]
    writePage({ folderSlug, fileSlug: 'index', title: h1, lines: landing, mediaDir: dir, extra: downloadsBlock(group, folderSlug, groupDir) })
    // Breakout pages: one per remaining section, except ranges listed in group.merge
    // (1-based source section numbers), which are combined into one page whose
    // original headings become H2s.
    const pages = []
    for (let i = 0; i < rest.length; i++) {
      const srcNum = i + 2
      const m = (group.merge || []).find((r) => r.sections[0] === srcNum)
      if (m) {
        const span = rest.slice(m.sections[0] - 2, m.sections[1] - 1)
        pages.push({ title: m.title, body: span.flatMap((sec) => ['', ...sec.lines]) })
        i += span.length - 1
      } else {
        pages.push({ title: rest[i].heading, body: ['', ...shiftHeadings(rest[i].lines.slice(1), -1)] })
      }
    }
    pages.forEach((pg, idx) => {
      const num = label(idx + 1)
      const fileSlug = `${num.toLowerCase().replace('.', '-')}-${slugify(pg.title)}`
      writePage({ folderSlug, fileSlug, title: `${num} ${pg.title}`, lines: [`# ${num} ${pg.title}`, ...pg.body], mediaDir: dir })
      items.push({ text: `${num} ${pg.title}`, link: `/${folderSlug}/${fileSlug}` })
    })
  } else if (group.kind === 'single') {
    const { dir, lines } = pandoc(findOne(groupDir, group.docx, '.docx'))
    const h1 = lines.find((l) => l.startsWith('# ')).slice(2).trim()
    writePage({ folderSlug, fileSlug: 'index', title: h1, lines, mediaDir: dir, extra: downloadsBlock(group, folderSlug, groupDir) })
  } else if (group.kind === 'transactions') {
    const landing = pandoc(findOne(groupDir, group.landing, '.docx'))
    writePage({ folderSlug, fileSlug: 'index', title: group.title, lines: landing.lines, mediaDir: landing.dir })
    for (const tx of group.transactions) {
      const file = findOne(groupDir, tx.docx, '.docx')
      const name = path.basename(file).replace(/_\d{8}_v\d+.*\.docx$/i, '')
      const title = `${tx.label}: ${name.replace(/^tx\d+-/, '')}`
      const { dir, lines } = pandoc(file)
      // Sources differ: some start with "# TXn: name" then "## Transaction Overview",
      // others begin straight at "## 1 Transaction Overview". Normalise to H1 = title, H2 sections.
      const firstH2 = lines.findIndex((l) => /^##?\s+(\d+\s+)?Transaction Overview/.test(l))
      if (firstH2 < 0) throw new Error(`${file}: no "Transaction Overview" heading`)
      const body = lines.slice(firstH2)
      const topLevel = Math.min(...body.filter((l) => /^#{1,6}\s/.test(l)).map((l) => l.match(/^#+/)[0].length))
      const pageLines = [`# ${title}`, '', ...shiftHeadings(body, 2 - topLevel)]
      const fileSlug = slugify(name)
      writePage({ folderSlug, fileSlug, title, lines: pageLines, mediaDir: dir })
      items.push({ text: title, link: `/${folderSlug}/${fileSlug}` })
    }
  } else if (group.kind === 'appendices') {
    const landing = pandoc(findOne(groupDir, group.landing, '.docx'))
    const pages = []
    for (const ap of group.appendices) {
      const { dir, lines } = pandoc(findOne(groupDir, ap.docx, '.docx'))
      const h1 = lines.find((l) => l.startsWith('# ')).slice(2).trim()
      const title = `Appendix ${ap.letter}: ${h1}`
      const fileSlug = `appendix-${ap.letter.toLowerCase()}-${slugify(h1)}`
      const pageLines = [`# ${title}`, ...lines.slice(lines.findIndex((l) => l.startsWith('# ')) + 1)]
      writePage({ folderSlug, fileSlug, title, lines: pageLines, mediaDir: dir })
      pages.push({ letter: ap.letter, fileSlug })
      items.push({ text: title, link: `/${folderSlug}/${fileSlug}` })
    }
    // Link each "Appendix X — ..." table cell to its page.
    let md = landing.lines.join('\n')
    for (const { letter, fileSlug } of pages) {
      md = md.replace(new RegExp(`^\\| (Appendix ${letter} — [^|]*?) \\|`, 'm'), `| [$1](/${folderSlug}/${fileSlug}) |`)
    }
    writePage({ folderSlug, fileSlug: 'index', title: group.title, lines: md.split('\n'), mediaDir: landing.dir })
  } else {
    throw new Error(`Unknown kind ${group.kind}`)
  }

  sidebar.push({ text: group.title, link: `/${folderSlug}/`, collapsed: true, ...(items.length ? { items } : {}) })
}

fs.writeFileSync(path.join(DOCS_DIR, '.vitepress', 'ig-sidebar.json'), JSON.stringify(sidebar, null, 2) + '\n')
console.log('\nWrote docs/.vitepress/ig-sidebar.json')
