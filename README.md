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

## How it gets hosted

GitHub Pages is configured to deploy from GitHub Actions (repo **Settings → Pages → Build and deployment → Source → GitHub Actions**), not from a branch. `.github/workflows/deploy.yml` runs on every push to `main`: checks out the repo, installs dependencies, runs `docs:build`, and hands the `dist/` folder to GitHub's official Pages deploy action. A push to `main` is live at `https://directtrust.github.io/cc-maternal-health-birth/` shortly after — watch progress under the repo's **Actions** tab.
