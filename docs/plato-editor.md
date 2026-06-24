# Plato Editor

## Overview

Plato Editor is a local-first Markdown editor for personal knowledge work. The product direction is similar to Obsidian: users work inside a local vault, keep control of their files, and can build connections between notes without depending on a hosted service.

The first milestone is a desktop MVP. Web support, sync, collaboration, and richer language tooling are future directions, not part of the first build.

## MVP Scope

The MVP should focus on a small, reliable editing loop:

- Open or create a local vault
- Create, rename, delete, and organize Markdown notes
- Edit Markdown files with a responsive editor
- Persist notes as plain files on disk
- Build a local index for metadata, backlinks, and search
- Search notes quickly
- Navigate between linked notes

The app should work offline by default. The user's Markdown files are the source of truth; any database should be treated as an index or cache that can be rebuilt.

## Initial Architecture

The initial implementation should use a desktop-first architecture:

```txt
apps/
  desktop/       -> Tauri desktop shell
packages/
  editor/        -> reusable React editor surface
  core/          -> vault, note, link, and indexing domain logic
  db/            -> SQLite schema and query helpers
  ui/            -> shared UI components
docs/            -> product, architecture, and workflow notes
intents/         -> AI-DLC units of work
```

Recommended stack for the MVP:

- Tauri 2 for the desktop app shell
- React and Vite for the frontend
- TypeScript for shared application code
- Rust for native Tauri commands when needed
- SQLite for local indexing, metadata, backlinks, and full-text search
- Markdown files on disk as the canonical note format

## Frontend Architecture

The frontend should use a pragmatic modular architecture: reusable UI primitives live outside the product domain, while feature-specific flows stay close to the feature they support.

Initial frontend stack:

- React and Vite for the application surface
- TypeScript for component and domain contracts
- shadcn/ui for owned, customizable base components
- Radix primitives when shadcn components need accessible behavior extensions
- lucide-react for action, navigation, status, and toolbar icons
- Tailwind CSS for utility-first styling in shared UI layers

Recommended frontend layout:

```txt
apps/
  desktop/                    -> Tauri desktop shell and app entry
packages/
  editor/                     -> reusable React editor surface
  ui/
    components/
      ui/                     -> shadcn/ui primitives and thin base components
      common/                 -> reusable app-level compositions
    styles/                   -> shared Tailwind entrypoints and global CSS
  core/                       -> vault, note, link, and indexing domain logic
  db/                         -> SQLite schema and query helpers
```

When the app grows, feature modules should be introduced inside the app or a dedicated package:

```txt
features/
  notes/
    components/
    hooks/
    services/
    types.ts
  vaults/
  search/
  backlinks/
```

Component placement rules:

- `components/ui` is for small, generic primitives with no Plato Editor business rules. This is where shadcn components should live.
- `components/common` is for reusable application compositions such as empty states, status badges, confirm dialogs, and toolbar controls.
- `features/*` is for components, hooks, services, and types that use feature vocabulary or feature-specific behavior.
- A feature component should stay as a single file while it is simple.
- Split a feature component into `container`, `view`, and `style` files when it has enough data loading, state orchestration, or interaction logic to justify the separation.

CSS placement rules:

- Use Tailwind classes directly in `components/ui` and `components/common`.
- Keep shared Tailwind setup, global CSS, and theme entrypoints in the shared UI styles layer.
- For feature modules, use a separate style file whenever the feature has non-trivial layout, feature-specific state styling, or styles that would make the component hard to scan.
- Avoid creating separate style files for tiny feature components that only need a few Tailwind utilities.

This is inspired by atomic design, but the project should not require strict `atom`, `molecule`, `organism`, and `template` folders. The preferred naming is based on ownership and domain coupling: `ui`, `common`, and `features`.

## Backend And Data Model

The MVP should not start with a hosted backend. A remote backend can be added later for sync, accounts, publishing, or collaboration.

For now:

- Notes live as Markdown files in a vault directory
- SQLite stores derived data such as search index, note metadata, outgoing links, backlinks, and recently opened files
- The index must be rebuildable from the vault contents
- App state that is not user content can live in local configuration storage

Backend architecture is the next major design topic. The initial assumption is that Rust should own filesystem-sensitive and native desktop operations through Tauri commands, SQLite should remain local and rebuildable where possible, and TypeScript should coordinate frontend state and user workflows.

## Future Directions

Future features can include:

- Web app support
- Optional sync
- Publishing or sharing flows
- Plugin API
- Graph view
- Rich Markdown preview
- LSP-style intelligence for notes, links, frontmatter, snippets, or embedded code blocks

LSP support is explicitly a future feature. For the MVP, the editor should stay focused on reliable local Markdown editing and fast vault navigation.
