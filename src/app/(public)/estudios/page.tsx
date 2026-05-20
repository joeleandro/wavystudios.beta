export default function EstudiosPage() {
  return (
    <div style={{ paddingTop: 100 }}>
      {/* ── Lisboa — Nave ── */}
      <section className="estudios-section">
        <div className="estudios-title-block">
          <span className="section-eyebrow">Estúdio 01 — Nave</span>
          <h2 className="bebas" style={{ fontSize: "clamp(52px, 10vw, 120px)", color: "var(--text)", lineHeight: 0.9 }}>
            LISBOA
          </h2>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--text3)", lineHeight: 1.7 }}>
            Praceta João de Lemos 2A, Odivelas, 2675-233 Lisboa
          </p>
        </div>

        <div className="estudios-photo-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="estudios-photo-placeholder">
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Foto Estúdio {i}</span>
            </div>
          ))}
        </div>

        <div className="glass estudios-info-card">
          <div className="estudios-info-grid">
            <div>
              <div className="estudios-info-label">Microfones</div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 14, color: "var(--text2)", lineHeight: 2 }}>
                <li>Neumann U87</li>
                <li>AKG 220</li>
                <li>Rode NT1</li>
              </ul>
            </div>
            <div>
              <div className="estudios-info-label">DAW</div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 14, color: "var(--text2)", lineHeight: 2 }}>
                <li>Pro Tools</li>
                <li>Logic Pro X</li>
                <li>FL Studio</li>
              </ul>
            </div>
            <div>
              <div className="estudios-info-label">Monitores</div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 14, color: "var(--text2)", lineHeight: 2 }}>
                <li>Genelec 8341 AP</li>
                <li>Yamaha HS8</li>
                <li>Yamaha HS5</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Porto — Cube ── */}
      <section className="estudios-section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="estudios-title-block">
          <span className="section-eyebrow">Estúdio 02 — Cube</span>
          <h2 className="bebas" style={{ fontSize: "clamp(52px, 10vw, 120px)", color: "var(--text)", lineHeight: 0.9 }}>
            PORTO
          </h2>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--text3)", lineHeight: 1.7 }}>
            Rua dos Mártires da Liberdade, 4050 Porto
          </p>
        </div>

        <div className="estudios-photo-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="estudios-photo-placeholder">
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Foto Estúdio {i}</span>
            </div>
          ))}
        </div>

        <div className="glass estudios-info-card">
          <div className="estudios-info-grid">
            <div>
              <div className="estudios-info-label">Microfones</div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 14, color: "var(--text2)", lineHeight: 2 }}>
                <li>Rode NT1</li>
                <li>AKG C414</li>
              </ul>
            </div>
            <div>
              <div className="estudios-info-label">Pré-Amp</div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 14, color: "var(--text2)", lineHeight: 2 }}>
                <li>Universal Audio Apollo Twin X</li>
              </ul>
              <div className="estudios-info-label" style={{ marginTop: 16 }}>DAW</div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 14, color: "var(--text2)", lineHeight: 2 }}>
                <li>Logic Pro X</li>
                <li>Ableton Live</li>
                <li>FL Studio</li>
                <li>Pro Tools</li>
              </ul>
            </div>
            <div>
              <div className="estudios-info-label">Monitores</div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 14, color: "var(--text2)", lineHeight: 2 }}>
                <li>Yamaha HS8</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
