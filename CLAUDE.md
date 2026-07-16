# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ilib-mono-webos is a **pnpm workspaces + Turborepo** monorepo containing **webOS-specific** loctool and ilib-lint plugins for the [iLib-js](https://github.com/iLib-js) project. All packages are published independently to npm.

The project follows the same structure and conventions as [ilib-mono](https://github.com/iLib-js/ilib-mono). When in doubt, refer to that project's documentation.

## Setup

```bash
corepack enable pnpm   # enable pnpm via Node.js Corepack (once per machine)
pnpm install           # installs all workspace deps and git hooks
```

Git hooks are installed automatically via `postinstall`.

## Commands

All commands run from the repo root unless noted.

```bash
# Build
pnpm build

# Test — affected packages only (recommended)
pnpm test

# Test — all packages
pnpm test:all

# Force re-run all tests ignoring Turborepo cache
pnpm test:all:force

# Single package (from root)
pnpm --filter ilib-loctool-webos-javascript test

# Single test file (from root)
pnpm --filter ilib-loctool-webos-javascript test -- "JavaScriptFile.test.js"

# From package directory
cd packages/ilib-loctool-webos-javascript && pnpm test
cd packages/ilib-loctool-webos-javascript && pnpm test -- "JavaScriptFile.test.js"

# Debug a package (uses --inspect-brk)
cd packages/ilib-loctool-webos-javascript && pnpm debug
# or from root:
pnpm --filter ilib-loctool-webos-javascript debug

# Coverage
pnpm coverage              # all packages
pnpm coverage:affected     # affected packages only

# Clean build artifacts
pnpm clean
```

### Shell scripts (scripts/)

The `scripts/` directory holds standalone loctool-wrapper shell scripts (not part of
the pnpm workspace). They are tested with [bats](https://github.com/bats-core/bats-core):

```bash
pnpm test:scripts:all            # run all script bats suites
pnpm test:scripts:xliff-compare  # a single suite (also :xliff-delete-units, :xliff-split-merge)
```

## Architecture

Turborepo task dependency chain: `build` (outputs `lib/`) → `test` → `coverage`.

### Packages

| Package | Category | Description |
|---------|----------|-------------|
| `ilib-loctool-webos-c` | loctool plugin | C source filetype handler |
| `ilib-loctool-webos-cpp` | loctool plugin | C++ source filetype handler |
| `ilib-loctool-webos-javascript` | loctool plugin | JavaScript filetype handler |
| `ilib-loctool-webos-qml` | loctool plugin | QML filetype handler |
| `ilib-loctool-webos-dart` | loctool plugin | Dart filetype handler |
| `ilib-loctool-webos-json` | loctool plugin | JSON filetype handler |
| `ilib-loctool-webos-json-resource` | loctool plugin | JSON resource filetype handler |
| `ilib-loctool-webos-ts-resource` | loctool plugin | Qt TS resource filetype handler |
| `ilib-loctool-webos-common` | shared library | Utilities shared by webOS plugins |
| `ilib-loctool-webos-dist` | distribution | Bundle for webOS platform distribution |
| `ilib-lint-webos` | ilib-lint plugin | webOS XLIFF parser and translation lint rules |
| `ilib-xliff-webos` | library | Parser/generator for webOS XLIFF files |
| `samples-loctool` | samples | Sample apps for validating loctool plugins |
| `samples-lint` | samples | Sample app for validating the lint plugin |

### Plugin architecture

Each `ilib-loctool-webos-*` plugin extends the loctool plugin base class and implements `parse()`, `write()`, and `getDataType()`. `ilib-loctool-webos-common` provides shared utilities used across these plugins.

When a loctool plugin changes, also create a changeset for `ilib-loctool-webos-dist` to keep the distribution bundle updated.

### Internal dependencies

Use the workspace protocol:
```json
"ilib-loctool-webos-common": "workspace:^"
```

### Shell scripts (`scripts/`)

Standalone bash scripts that wrap loctool for batch localization tasks. Unlike the
packages, they are **directory-level wrappers** around **file-level** loctool commands:
each walks a `<projectId>/<locale>.xliff` tree, invokes loctool per file, and reassembles
an output tree.

- **Writing/reviewing scripts**: follow [`scripts/loctool-script-patterns.md`](scripts/loctool-script-patterns.md)
  (strict mode, `require_value` argument guards, loctool discovery, output-tree handling,
  bats test structure).
- **Scaffolding**: the `/create-xliff-script` and `/create-xliff-bats` skills
  (in `.claude/skills/`) generate new scripts and their bats suites from those patterns.

## Versioning and publishing

Publishing is automated via GitHub Actions. When a PR is merged, the workflow opens a "Version Packages" PR. Merge that PR to trigger npm publish.

To create a changeset before your PR:
```bash
npx changeset
# or
pnpm changeset
```

PR title format: `<package-short-name>: Summary of changes`
Example: `webos-javascript: Fix plural string extraction`

Every PR must include: code documentation, tests, and a changeset entry. If a loctool plugin changes, include a changeset for `ilib-loctool-webos-dist` as well.
