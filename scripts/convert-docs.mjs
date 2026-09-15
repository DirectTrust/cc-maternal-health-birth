// One-time migration script: converts the pandoc-generated Markdown export of each
// source .docx (one per chapter/appendix/transaction) into the VitePress Markdown
// pages under docs/, remapping heading levels per page, extracting embedded images
// into docs/public/images/<slug>/, and applying a handful of source-specific fixups
// (stray Word artifacts, mis-styled paragraphs, cross-links between related pages).
//
// Usage:
//   for f in ~/Downloads/cc-maternal-health-birth_20260913/*.docx; do
//     base=$(basename "$f" .docx)
//     pandoc "$f" -f docx -t gfm --wrap=none \
//       --extract-media="scratchpad/media/$base" \
//       -o "scratchpad/src2/$base.md"
//   done
//   node scripts/convert-docs.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const SCRATCH = path.join(REPO_ROOT, 'scratchpad')
const SRC_DIR = path.join(SCRATCH, 'src2')
const MEDIA_DIR = path.join(SCRATCH, 'media')
const DOCS_DIR = path.join(REPO_ROOT, 'docs')
const IMAGES_ROOT = path.join(DOCS_DIR, 'public', 'images')

fs.mkdirSync(DOCS_DIR, { recursive: true })

function readSrcLines(basename) {
  return fs.readFileSync(path.join(SRC_DIR, `${basename}.md`), 'utf8').split('\n')
}

// Word tables with "repeat header row" enabled on every row make pandoc emit
// every row as <th> inside <thead>, with an empty <tbody>. Demote every row
// after the first back into a normal <tbody> of <td> cells.
function fixBrokenHeaderTables(markdown) {
  return markdown.replace(
    /<thead>([\s\S]*?)<\/thead>\s*<tbody>\s*<\/tbody>/g,
    (match, theadContent) => {
      const rows = theadContent.match(/<tr>[\s\S]*?<\/tr>/g) || []
      if (rows.length <= 1) return match
      const [headerRow, ...bodyRows] = rows
      const bodyHtml = bodyRows
        .map((row) => row.replace(/<th>/g, '<td>').replace(/<\/th>/g, '</td>'))
        .join('\n')
      return `<thead>\n${headerRow}\n</thead>\n<tbody>\n${bodyHtml}\n</tbody>`
    }
  )
}

function stripWordArtifacts(markdown) {
  return markdown
    .replace(/<span class="mark">([\s\S]*?)<\/span>/g, '$1')
    .replace(/<mark>([\s\S]*?)<\/mark>/g, '$1')
    .replace(/<u>([\s\S]*?)<\/u>/g, '$1')
    .replace(/^\\$/gm, '')
    .replace(/^#{1,6}\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
}

// Shift '#'*n headings to '#'*(n-shift) for a slice of lines. `overrides` maps
// an absolute 1-indexed source line number to an explicit target level.
function shiftHeadings(lines, shift, overrides = {}, baseLineOffset = 0) {
  return lines.map((line, i) => {
    const absLine = baseLineOffset + i + 1
    const m = line.match(/^(#{1,6})\s+(.*)$/)
    if (!m) return line
    const origLevel = m[1].length
    const text = m[2].trim()
    const newLevel = Object.prototype.hasOwnProperty.call(overrides, absLine)
      ? overrides[absLine]
      : origLevel - shift
    if (newLevel < 1) return `**${text}**`
    if (newLevel > 6) return `${'#'.repeat(6)} ${text}`
    return `${'#'.repeat(newLevel)} ${text}`
  })
}

function writePage(slug, title, bodyLines) {
  let markdown = bodyLines.join('\n')
  markdown = fixBrokenHeaderTables(markdown)
  markdown = stripWordArtifacts(markdown).trim()
  const yamlTitle = /[:#]/.test(title) ? `"${title.replace(/"/g, '\\"')}"` : title
  const frontmatter = `---\ntitle: ${yamlTitle}\n---\n\n`
  fs.writeFileSync(path.join(DOCS_DIR, `${slug}.md`), frontmatter + markdown + '\n')
  console.log(`wrote ${slug}.md`)
}

function copyImage(srcBasename, num, ext, slug, destIndex) {
  const srcFile = path.join(MEDIA_DIR, srcBasename, 'media', `image${num}.${ext}`)
  const destDir = path.join(IMAGES_ROOT, slug)
  fs.mkdirSync(destDir, { recursive: true })
  const destExt = ext === 'jpeg' ? 'jpg' : ext
  const destName = `${destIndex}.${destExt}`
  fs.copyFileSync(srcFile, path.join(destDir, destName))
  return `/images/${slug}/${destName}`
}

// ---------------------------------------------------------------------------
// Chapter 1 -> use-case-overview.md
// ---------------------------------------------------------------------------
{
  const basename = 'MAP_cc-maternal-health-birth_Chapter1_20260913_v14'
  let lines = readSrcLines(basename)

  const imgPath = copyImage(basename, 2, 'svg', 'use-case-overview', 1)
  lines = lines.map((line) =>
    line.includes('media/image2.svg')
      ? `![Figure 1. Conceptualizing Minimally Structured Document Architecture](${imgPath})`
      : line
  )

  let markdown = lines.join('\n')
  markdown = markdown.replace(/^(NOT PREGNANT|PREGNANCY|BIRTH|POSTPARTUM)$/gm, '**$1**')

  writePage('use-case-overview', 'Use Case Overview: cc-maternal-health-birth', markdown.split('\n'))
}

// ---------------------------------------------------------------------------
// Chapter 2 -> actors-and-transactions.md
// ---------------------------------------------------------------------------
{
  const basename = 'MAP_cc-maternal-health-birth_Chapter2_20260913_v9'
  let lines = readSrcLines(basename)

  const captions = {
    1: 'O1 - Provide Notification of Pregnancy and Risk Factors: Two-Actor Option',
    2: 'O1 - Provide Notification of Pregnancy and Risk Factors: Three-Actor Option',
    3: 'O2 - Provide Referral/Orders for Birth Services: Two-Actor Option',
    4: 'O2 - Provide Referral/Orders for Birth Services: Three-Actor Option',
    5: 'O3 - Provide Antepartum Summary Information Across Care Settings: Two-Actor Option (Unsolicited)',
    6: 'O3 - Provide Antepartum Summary Information Across Care Settings: Two-Actor Option (Triggered)',
    7: 'O3 - Provide Antepartum Summary Information Across Care Settings: Three-Actor Option (Unsolicited or Triggered)',
    8: 'O4 - Enable Postpartum Planning Across Care Settings: Two-Actor Option',
    9: 'O4 - Enable Postpartum Planning Across Care Settings: Three-Actor Option',
    10: 'O5 - Improve Patient Matching When Key Information Changes',
    11: 'O6 - Communicate Workflow Status for Improved Orchestration: General Pattern'
  }

  lines = lines.map((line) => {
    const m = line.match(/media\/image(\d+)\.png/)
    if (!m) return line
    const num = Number(m[1])
    const dest = copyImage(basename, num, 'png', 'actors-and-transactions', num)
    return `![${captions[num]}](${dest})`
  })

  let markdown = lines.join('\n')
  markdown = markdown.replace(/^(Two-Actor Option|Three-Actor Option)(\s*\(.*\))?$/gm, '**$1$2**')
  markdown = markdown.replace(
    /\|\s*\*\*DIAGRAM PLACEHOLDER - (.+?)\*\*\s*\|\n\|----\|/g,
    '::: info Diagram placeholder\n$1\n:::'
  )

  writePage('actors-and-transactions', 'Actors and Transactions Overview', markdown.split('\n'))
}

// ---------------------------------------------------------------------------
// Chapter 3 -> transaction-requirements.md
// ---------------------------------------------------------------------------
{
  const basename = 'MAP_cc-maternal-health-birth_Chapter3_20260913_v8'
  let lines = readSrcLines(basename)

  // Three paragraphs were mis-styled as Heading 2 in the source; demote to body text.
  lines = lines.map((line) =>
    /^## (The Content Creator SHALL|The Message Receiver SHALL)/.test(line)
      ? line.replace(/^## /, '')
      : line
  )

  let markdown = lines.join('\n')
  const txLinks = [
    ['send-outpatient-visit-notification', 'tx1-send-outpatient-visit-notification'],
    ['send-admission-notification', 'tx2-send-admission-notification'],
    ['send-birth-notification', 'tx3-send-birth-notification'],
    ['send-discharge-notification', 'tx4-send-discharge-notification'],
    ['send-documents', 'tx5-send-documents'],
    ['query-for-documents', 'tx6-query-for-documents'],
    ['send-patient-update', 'tx7-send-patient-update'],
    ['send-workflow-status', 'tx8-send-workflow-status']
  ]
  for (const [name, slug] of txLinks) {
    markdown = markdown.replace(
      new RegExp(`modular transaction specification for ${name}\\.`, 'g'),
      `[modular transaction specification for ${name}](/${slug}).`
    )
  }

  writePage('transaction-requirements', 'Transaction Requirements', markdown.split('\n'))
}

// ---------------------------------------------------------------------------
// Chapter 4 -> endpoint-capability-statement.md (direct copy)
// Chapter 5 -> ai-autonomous-system-considerations.md (direct copy)
// ---------------------------------------------------------------------------
{
  const basename = 'MAP_cc-maternal-health-birth_Chapter4_20260913_V3'
  writePage('endpoint-capability-statement', 'Endpoint Capability Statement', readSrcLines(basename))
}
{
  const basename = 'MAP_cc-maternal-health-birth_Chapter5_20260913_V2'
  writePage('ai-autonomous-system-considerations', 'AI and Autonomous System Considerations', readSrcLines(basename))
}

// ---------------------------------------------------------------------------
// Appendix A / Appendix B -> shift headings down one level under a synthesized H1
// ---------------------------------------------------------------------------
{
  const basename = 'MAP_cc-maternal-health-birth_Appendix_A_Understanding_Clinical_Documents_20260914_v2'
  const title = 'Appendix A: Understanding Clinical Documents as Information Collections'
  const lines = readSrcLines(basename)
  const shifted = shiftHeadings(lines, -1)
  writePage('appendix-a-understanding-clinical-documents', title, [`# ${title}`, '', ...shifted])
}
{
  const basename = 'MAP_cc-maternal-health-birth_Appendix_B_Understanding_Identity_Context_and_Status_20260914_v6'
  const title = 'Appendix B: Understanding Identity, Context, and Status'
  const lines = readSrcLines(basename)
  const shifted = shiftHeadings(lines, -1)
  writePage('appendix-b-identity-context-status', title, [`# ${title}`, '', ...shifted])
}

// ---------------------------------------------------------------------------
// Implementer Guidance -> implementer-guidance.md (sections 1-2) plus one page
// per section 3-8, each already structured with its own top-level heading.
// ---------------------------------------------------------------------------
{
  const basename = 'MAP_cc-maternal-health-birth_Implementer_Guidance_20260914_v5'
  const lines = readSrcLines(basename)

  // Lines 1-34 (1-indexed): title/subtitle/purpose paragraph + sections 1-2.
  const introSlice = lines.slice(0, 34)
  const introShifted = shiftHeadings(introSlice, -1, {}, 0)
  // introSlice[0] is the bold "**Implementer Guidance**" title line, replaced
  // by a synthesized H1; the italic subtitle and purpose paragraph are kept.
  writePage('implementer-guidance', 'Implementer Guidance', [
    '# Implementer Guidance',
    '',
    ...introShifted.slice(1)
  ])

  const sections = [
    { slug: 'cda-document-construction', title: '3. CDA Document Construction', start: 35, end: 84 },
    { slug: 'identifier-context-management', title: '4. Identifier and Context Management', start: 85, end: 153 },
    { slug: 'mailroom-processing', title: '5. Outbound and Inbound Mailroom Processing', start: 154, end: 204 },
    { slug: 'workflow-status-closed-loop', title: '6. Workflow Status and Closed-Loop Signaling', start: 205, end: 232 },
    { slug: 'detailed-conformance', title: '7. Where Detailed Conformance Belongs', start: 233, end: 238 },
    { slug: 'reference-notes', title: '8. Reference Notes Retained', start: 239, end: lines.length }
  ]
  for (const { slug, title, start, end } of sections) {
    const slice = lines.slice(start - 1, end)
    writePage(slug, title, slice)
  }
}

// ---------------------------------------------------------------------------
// TX1-TX8 -> one page each. Every source file's body starts at the literal
// heading "# Transaction Overview"; anything before that (an ad-hoc title
// paragraph, or a Word TOC field for tx2/tx4/tx5) is replaced by a
// synthesized page title. The body is then shifted down one heading level.
// ---------------------------------------------------------------------------
{
  const txFiles = [
    { basename: 'tx1-send-outpatient-visit-notification_20260913_v7', slug: 'tx1-send-outpatient-visit-notification', title: 'TX1: send-outpatient-visit-notification' },
    { basename: 'tx2-send-admission-notification_20260913_v3', slug: 'tx2-send-admission-notification', title: 'TX2: send-admission-notification' },
    { basename: 'tx3-send-birth-notification_20260913_v3', slug: 'tx3-send-birth-notification', title: 'TX3: send-birth-notification' },
    { basename: 'tx4-send-discharge-notification_20260913_v3', slug: 'tx4-send-discharge-notification', title: 'TX4: send-discharge-notification' },
    { basename: 'tx5-send-documents_20260913_v3', slug: 'tx5-send-documents', title: 'TX5: send-documents' },
    { basename: 'tx6-query-for-documents_20260913_v2', slug: 'tx6-query-for-documents', title: 'TX6: query-for-documents' },
    { basename: 'tx7-send-patient-update_20260913_v3', slug: 'tx7-send-patient-update', title: 'TX7: send-patient-update' },
    { basename: 'tx8-send-workflow-status_20260913_v3', slug: 'tx8-send-workflow-status', title: 'TX8: send-workflow-status' }
  ]

  for (const { basename, slug, title } of txFiles) {
    const lines = readSrcLines(basename)
    const bodyStart = lines.findIndex((l) => l.trim() === '# Transaction Overview')
    if (bodyStart === -1) throw new Error(`${basename}: could not find "# Transaction Overview"`)
    const body = lines.slice(bodyStart)
    const shifted = shiftHeadings(body, -1, {}, bodyStart)
    writePage(slug, title, [`# ${title}`, '', ...shifted])
  }
}

console.log('\nDone.')
