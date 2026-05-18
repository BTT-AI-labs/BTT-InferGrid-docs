# BTT InferGrid Docs — Agent Guide

This file describes the project structure, build system, and conventions for AI agents working on the BTT InferGrid documentation site.

## Project Overview

This is the **bilingual documentation site** for BTT InferGrid, a decentralized AI compute network (DePIN). The site is built with [Docusaurus](https://docusaurus.io/) v2.4.3 and targets GitHub Pages deployment.

- **Package name:** `@btt-ai-labs/infergrid-docs`
- **Primary language:** English (`en`)
- **Secondary locale:** Simplified Chinese (`zh-Hans`)
- **Deployment target:** GitHub Pages at `https://btt-ai-labs.github.io/BTT-InferGrid-docs/`
- **Repository:** `https://github.com/BTT-AI-labs/BTT-InferGrid-docs`

The documentation covers two open-source miner-side components:
- `miner-cli` — Docker-based deployment helper for single Linux GPU hosts.
- `miner-agent` — FastAPI control-plane sidecar for miner identity, registration, heartbeat, and challenge flow.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Docusaurus 2.4.3 (preset-classic) |
| React | React 18 |
| MDX | `@mdx-js/react` v1 |
| Styling | Infima (Docusaurus default) + custom CSS overrides |
| Diagrams | Mermaid (via `@docusaurus/theme-mermaid`) |
| Math | KaTeX (via `remark-math` + `rehype-katex`) |
| Package Manager | Yarn v1 (classic) |
| Node | >= 18 |
| Formatter | Prettier 2.7.1 |
| TS Config | Extends `@tsconfig/docusaurus` |

## Build and Development Commands

All commands use `yarn`:

```bash
# Install dependencies
yarn install

# Start local dev server (English, default)
yarn start

# Start local dev server with Chinese locale
yarn start-zh

# Production build
yarn build

# Serve the production build locally
yarn serve

# Clear Docusaurus cache
yarn clear
```

> **Note:** `start`, `start-zh`, and `build` set `NODE_OPTIONS='--openssl-legacy-provider'` to work around Node.js/OpenSSL compatibility issues with the Docusaurus 2.x build pipeline. Do not remove this flag unless you have verified the build passes without it on your Node version.

## Project Structure

```
.
├── docs/                                    # English documentation source
│   ├── intro.md                             # Landing page (slug: /)
│   ├── getting-started/
│   │   ├── prerequisites.md
│   │   └── quick-start.md
│   ├── architecture/
│   │   └── topology-and-flows.md
│   ├── miner-cli/
│   │   ├── overview.md
│   │   ├── commands.md
│   │   └── configuration.md
│   ├── miner-agent/
│   │   ├── overview.md
│   │   ├── configuration.md
│   │   └── local-api.md
│   ├── reference/
│   │   └── control-plane-contract.md
│   └── operations/
│       ├── troubleshooting.md
│       └── security.md
├── i18n/
│   └── zh-Hans/
│       ├── code.json                        # Docusaurus theme UI strings (zh)
│       ├── docusaurus-plugin-content-docs/
│       │   └── current/                     # Chinese doc translations
│       │       ├── intro.md
│       │       ├── getting-started/
│       │       ├── architecture/
│       │       ├── miner-cli/
│       │       ├── miner-agent/
│       │       ├── reference/
│       │       ├── operations/
│       │       ├── sidebars.js              # Chinese sidebar labels
│       │       └── infergrid/               # Extra zh-only pages (not in en docs)
│       │           ├── introduction.md
│       │           ├── quick-start.md
│       │           ├── architecture.md
│       │           └── api-reference.md
│       └── docusaurus-theme-classic/
│           ├── navbar.json
│           └── footer.json
├── static/
│   ├── css/custom.css                       # Brand colors, typography, layout overrides
│   └── img/                                 # Logos, favicon, social preview image
├── sidebars.js                              # English sidebar configuration
├── docusaurus.config.js                     # Main Docusaurus config
├── babel.config.js                          # Babel preset (standard Docusaurus)
├── tsconfig.json                            # TypeScript (extends @tsconfig/docusaurus)
├── package.json
└── yarn.lock
```

## Content Organization

- **English docs** live under `docs/`. This is the source of truth.
- **Chinese docs** live under `i18n/zh-Hans/docusaurus-plugin-content-docs/current/`. File paths inside this directory must mirror the English `docs/` structure so Docusaurus can resolve translations.
- **Sidebars:** There are two sidebar files:
  - `sidebars.js` (English)
  - `i18n/zh-Hans/docusaurus-plugin-content-docs/current/sidebars.js` (Chinese)
  Both files share the same doc IDs and category structure; only the `label` values are localized.
- **Orphaned Chinese pages:** The `infergrid/` subdirectory under the Chinese locale contains four pages (`introduction.md`, `quick-start.md`, `architecture.md`, `api-reference.md`) that do **not** exist in the English `docs/` tree. They are not linked from the current Chinese sidebar. Treat them as stale or legacy content.

## Content Conventions

### Frontmatter

Every doc should include at minimum:

```yaml
---
title: Page Title
sidebar_label: Short Label
---
```

Optional fields used in this project:
- `id` — overrides the file-based ID (e.g., `intro` for the landing page).
- `slug` — overrides the URL path (e.g., `slug: /` makes the doc the index).
- `description` — used for SEO/meta.

### Writing Style

- Write in clear, imperative, technical English for the primary docs.
- Use tables for structured comparisons and option lists.
- Use fenced code blocks with language tags (`bash`, `yaml`, `text`, `mermaid`).
- Use Mermaid sequence diagrams where they clarify control-plane flows.
- Keep headings sentence-case (e.g., "Quick Start", "Control Plane Contract").
- Chinese translations should preserve structure and meaning; do not translate CLI commands, file paths, or config keys.

### Custom CSS

Brand theming is in `static/css/custom.css`. Key customizations:
- Light-mode background: warm off-white (`#fffdf8`)
- Dark-mode background: near-black (`#171716`)
- Primary link color: teal (`#0f766e` in light, `#5eead4` in dark)
- Font stack: Inter + system UI stack
- Content max-width: `820px`

If you modify CSS, verify both light and dark modes.

## Internationalization (i18n)

- Default locale: `en`
- Supported locales: `en`, `zh-Hans`
- Locale dropdown is enabled in the navbar.
- When adding a new English doc, create the corresponding Chinese file in the mirrored `i18n/zh-Hans/...` path if you want it to appear in both locales. If a Chinese translation is missing, Docusaurus falls back to English.
- Theme strings (buttons, labels, etc.) are translated in `i18n/zh-Hans/code.json`.
- Sidebar category labels are translated in `i18n/zh-Hans/docusaurus-plugin-content-docs/current.json` and the Chinese `sidebars.js`.

## Configuration Notes

### `docusaurus.config.js`

- `url` + `baseUrl` are set for GitHub Pages (`/BTT-InferGrid-docs/`). Do not change unless the deployment domain changes.
- `trailingSlash: true` — all generated URLs end with `/`.
- `onBrokenLinks: 'warn'` and `onBrokenMarkdownLinks: 'warn'` — broken links will log warnings but not fail the build.
- `blog: false` — blog feature is disabled.
- Docs are served at the site root (`routeBasePath: '/'`).
- A custom webpack plugin adds a `url` polyfill fallback.

### `package.json`

- `cytoscape` is pinned to `3.23.0` via `resolutions` (Mermaid dependency stability).
- `dotenv` is a dependency and `.config()` is called in `docusaurus.config.js`, but there is no committed `.env` file. It is safe to add a `.env` locally for build-time variables if needed.

## Testing and Quality

There is **no automated test suite** in this repo. Quality checks are manual:

1. Run `yarn build` and confirm it exits without errors.
2. Run `yarn start` and visually verify navigation, sidebar, and code blocks.
3. If you changed Chinese content, run `yarn start-zh` and verify the locale switcher works.
4. Check both light and dark mode when modifying CSS.
5. Verify that internal markdown links resolve (watch the build warnings).

## Deployment

The site is configured for GitHub Pages:
- `organizationName: 'BTT-AI-labs'`
- `projectName: 'BTT-InferGrid-docs'`

There are **no GitHub Actions workflows** in this repository at this time. Deployment is likely manual or handled outside this repo. To deploy manually:

```bash
yarn build
# Serve or copy the contents of the build/ directory to the GitHub Pages branch
```

The `build/` output is a static site suitable for any static host.

## Security Considerations

- Do not commit secrets or tokens in markdown examples. If a doc must show a config snippet with a placeholder secret, use a clear placeholder such as `replace-me` or `hf_xxx`.
- The documentation describes systems that handle private keys (`miner-agent` identity), wallet keys, API tokens, and Hugging Face tokens. When editing those sections, keep the security warnings accurate and do not soften them.
- `miner-agent` local APIs should be bound to `127.0.0.1` unless network controls are in place — this is documented in `docs/operations/security.md`.

## Common Tasks for Agents

| Task | What to do |
|------|------------|
| Add a new doc page | Create the `.md` file in `docs/<section>/`, add its ID to `sidebars.js`, and create the mirrored Chinese file if maintaining parity. |
| Rename or move a page | Update the file path, update `sidebars.js`, and update any internal markdown links. Also move the Chinese mirror file. |
| Update Chinese sidebar labels | Edit `i18n/zh-Hans/docusaurus-plugin-content-docs/current/sidebars.js` (only the `label` fields). |
| Change brand colors | Edit CSS variables in `static/css/custom.css`. Test both themes. |
| Add a new section/category | Add a new category object in both `sidebars.js` files (English and Chinese). |
| Fix a broken link | Verify the target doc ID exists in `docs/` or `i18n/`, then correct the markdown link. |
