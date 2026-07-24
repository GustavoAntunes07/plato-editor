---
id: INTENT-i3q3
title: Inicializar Plato Editor com setup basico Tauri
status: ready_for_testing
story_points: 1
retry_count: 0
branch: intent/i3q3-inicializar-plato-editor-com-setup-b-sico-tauri
---

# Description

Inicializar o Plato Editor com uma base minima de aplicativo desktop Tauri, usando Vite, React e TypeScript como frontend.

# Acceptance Criteria

- [x] Criar a estrutura basica do app Tauri em `apps/desktop`
- [x] Configurar scripts do workspace para rodar, validar e compilar o app
- [x] Adicionar uma tela inicial funcional do Plato Editor
- [x] Garantir que lint, testes e doctor passem

# Related Files

- `package.json`
- `eslint.config.mjs`
- `apps/desktop/`
- `docs/plato-editor.md`

# Implementation Notes

- Usar setup conservador de Tauri + Vite + React.
- Manter o app inicial pequeno, sem implementar o editor completo neste intent.
- Criado shell inicial em React com navegacao, lista de notas e superficie de editor.
- Criada configuracao Tauri 2 em `apps/desktop/src-tauri`.

# Test Notes

- `bun run check` passou fora do sandbox.
- `node node_modules\eslint\bin\eslint.js .` passou.
- `bun test` passou com 16 testes.
- `bun scripts\aidlc.ts doctor` passou.
- `node_modules\.bin\tsc.exe --noEmit -p apps\desktop\tsconfig.json` passou.
- `vite build` passou fora do sandbox.
- Browser local em `http://127.0.0.1:1420/` renderizou `Plato Editor`, `Open Vault` e `Welcome to Plato`.
- `rustc` e `cargo` nao estao instalados neste ambiente, entao o build nativo Tauri ainda depende da instalacao do toolchain Rust.

# Review Notes

# Commits
