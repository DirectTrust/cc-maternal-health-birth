# IG conversion convention (docx -> VitePress)

`node scripts/build-ig.mjs [--source <dir>]` rebuilds `docs/` from the source Word documents (requires `pandoc`).
Layout is declared in `ig-layout.json`; the script is generic so other use cases can reuse it with a different manifest.

## Rules

- Each source subfolder (`03-02 MAP Transaction Definitions`) becomes a docs folder (`03-02-map-transaction-definitions/`) and one top-level sidebar group.
- Group order and display names come from `ig-layout.json`.
- `kind: chapter` — the docx is split at its `##` headings.
  - `index.md` (group landing page) = chapter title + intro + the first section (`N.1`).
  - Every later `##` becomes its own page `N-k-slug.md`, titled `N.k Heading`; deeper headings move up one level.
  - Optional `merge: [{ sections: [a, b], title }]` combines source sections a–b (1-based `##` numbers) into one page; their headings become H2s and later pages renumber.
- `kind: single` — whole docx is the group's `index.md` (References, Vocabulary, Examples).
- `kind: transactions` — a catalog docx is the landing page; each TX docx is one page (`txN-name.md`).
- `kind: appendices` — landing page is the appendices docx, with its table linking to one page per appendix docx.
- `downloads` — non-docx artifacts (JSON, XML, zip) are copied to `docs/public/downloads/<folder>/` and linked at the bottom of the landing page.
- Images are extracted to `docs/public/images/<folder>/`.
- `docs/index.md` (site home) and the `.vitepress` config/theme are hand-maintained; the sidebar is generated into `docs/.vitepress/ig-sidebar.json`.

The generated folders are overwritten on each run — edit the docx (or the manifest), not the `.md`.
