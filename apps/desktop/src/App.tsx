export function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Vault navigation">
        <div className="brand">
          <span className="brand-mark">P</span>
          <span>Plato Editor</span>
        </div>
        <nav className="nav-list" aria-label="Primary">
          <button type="button" className="nav-item active">
            Notes
          </button>
          <button type="button" className="nav-item">
            Search
          </button>
          <button type="button" className="nav-item">
            Backlinks
          </button>
        </nav>
      </aside>

      <section className="workspace" aria-label="Editor workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Local-first markdown workspace</p>
            <h1>Untitled Vault</h1>
          </div>
          <button type="button" className="primary-action">
            Open Vault
          </button>
        </header>

        <div className="editor-layout">
          <section className="note-list" aria-label="Notes">
            <button type="button" className="note-item selected">
              <span>Welcome to Plato</span>
              <small>Getting started</small>
            </button>
            <button type="button" className="note-item">
              <span>Daily notes</span>
              <small>Planned</small>
            </button>
          </section>

          <article className="editor-surface">
            <p className="document-path">welcome.md</p>
            <h2>Welcome to Plato</h2>
            <p>
              This is the first desktop shell for Plato Editor. Vault opening,
              Markdown editing, backlinks, and local indexing will grow from
              this foundation.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
