# cc-maternal-health-birth

Implementation Guide for the **cc-maternal-health-birth** use case, built on the DirectTrust Framework for Metadata and Payloads via the Direct Standard® (see the [metadata-and-payloads-guide](https://directtrust.github.io/metadata-and-payloads-guide/)). Published as a [VitePress](https://vitepress.dev) site at `https://directtrust.github.io/cc-maternal-health-birth/` via GitHub Pages.

This repo is a project site, so VitePress is configured with `base: '/cc-maternal-health-birth/'` in `docs/.vitepress/config.mts` to match — if this repo is ever renamed, that value has to be updated or every internal link/image/asset path breaks.

## Where the files live

```
cc-maternal-health-birth/
├── docs/                                ← everything you'll actually edit
│   ├── .vitepress/
│   │   ├── config.mts                   ← site title, nav, sidebar structure, search
│   │   └── theme/                       ← extends VitePress's default theme + DirectTrust palette
│   ├── public/
│   │   ├── directtrust-logo.png
│   │   └── images/<doc-slug>/           ← diagrams extracted from the source documents
│   ├── index.md                         ← home page (hero)
│   ├── implementer-guidance.md          ← sections 1-2 of the Implementer Guidance doc
│   ├── cda-document-construction.md     ← sections 3-8, one page each
│   ├── identifier-context-management.md
│   ├── mailroom-processing.md
│   ├── workflow-status-closed-loop.md
│   ├── detailed-conformance.md
│   ├── reference-notes.md
│   ├── use-case-overview.md             ← Chapter 1
│   ├── actors-and-transactions.md       ← Chapter 2
│   ├── transaction-requirements.md      ← Chapter 3
│   ├── tx1-*.md ... tx8-*.md            ← one page per modular transaction spec
│   ├── endpoint-capability-statement.md ← Chapter 4
│   ├── ai-autonomous-system-considerations.md ← Chapter 5
│   ├── appendices.md                    ← appendices index page
│   └── appendix-a-*.md, appendix-b-*.md
├── scripts/convert-docs.mjs             ← one-time source-doc → Markdown migration script (reference only)
├── .github/workflows/deploy.yml         ← builds + publishes on every push to main
└── package.json / package-lock.json
```

## Working locally

```
npm install
npm run docs:dev       # live-reloading dev server
npm run docs:build     # static build to docs/.vitepress/dist/
npm run docs:preview   # serve the production build locally
```

## Hosting and versions

Pages is deployed from GitHub Actions (**Settings → Pages → Source → GitHub Actions**). `.github/workflows/deploy.yml` runs on every push to `main` or `develop`, and when a release is published. It runs `scripts/build-site.sh`, which builds every version into one site:

| URL | Source | Purpose |
|---|---|---|
| `/cc-maternal-health-birth/` | `main` | Current published version. A placeholder page until the first release |
| `/cc-maternal-health-birth/develop/` | `develop` | Draft preview of the next version (DRAFT banner, `noindex`) |
| `/cc-maternal-health-birth/<tag>/` | every git tag | Archived versions |

The workflow always runs the build scripts from `develop`, so `main` can stay empty (just this README, `.gitignore` and the workflow) until there is something to release. While `main` has no guide, the site root is a placeholder pointing at the draft, and the **Latest** row of the Version History page has no link.

The **Version History** page (last entry in the left navigation) is generated at build time by `scripts/generate-history.mjs`; release descriptions come from the GitHub release notes for each tag. A tag is a **release** only if it is named `ANSI-DS<year>-<nn>-<nnn>-<year>` (e.g. `ANSI-DS2020-03-101-2025`; tags cannot contain spaces, so `ANSI DS...` is hyphenated). Releases are listed under *Released versions* and the newest one is *Latest*; any other tag (for example a trial-use version such as `STU-...`) is listed under *Other working versions*. Release notes follow one format: a `##` heading line (`DS<year>-<nn>-<nnn>-<year> – Version <x>`) followed by a short paragraph (e.g. the release date).

## Branching

All work happens on `develop`. To make the first release, merge `develop` into `main`, then tag and publish a GitHub release named for the version.
