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

## Backend And Data Model

The MVP should not start with a hosted backend. A remote backend can be added later for sync, accounts, publishing, or collaboration.

For now:

- Notes live as Markdown files in a vault directory
- SQLite stores derived data such as search index, note metadata, outgoing links, backlinks, and recently opened files
- The index must be rebuildable from the vault contents
- App state that is not user content can live in local configuration storage

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
