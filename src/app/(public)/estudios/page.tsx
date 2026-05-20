export default function EstudiosPage() {
  return (
    <div style={{ paddingTop: 100 }}>
      {/* Lisboa */}
      <section className="estudios-section">
        <div className="estudios-title-block">
          <span className="section-eyebrow">Estúdio 01</span>
          <h2
            className="bebas"
            style={{
              fontSize: "clamp(52px, 10vw, 120px)",
              color: "var(--text)",
              lineHeight: 0.9,
            }}
          >
            LISBOA
          </h2>
        </div>

        <div className="estudios-photo-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="estudios-photo-placeholder">
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                Foto Estúdio {i}
              </span>
            </div>
          ))}
        </div>

        <div className="glass estudios-info-card">
          <div className="estudios-info-grid">
            <div>
              <div className="estudios-info-label">Endereço</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
                Rua do Som, 100
                <br />
                1200-000 Lisboa, Portugal
              </p>
            </div>
            <div>
              <div className="estudios-info-label">Equipamento</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
                Microfone Neumann U87
                <br />
                Pré-amp Universal Audio
                <br />
                Pro Tools HDX
                <br />
                Monitores Adam A77X
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Porto */}
      <section
        className="estudios-section"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="estudios-title-block">
          <span className="section-eyebrow">Estúdio 02</span>
          <h2
            className="bebas"
            style={{
              fontSize: "clamp(52px, 10vw, 120px)",
              color: "var(--text)",
              lineHeight: 0.9,
            }}
          >
            PORTO
          </h2>
        </div>

        <div className="estudios-photo-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="estudios-photo-placeholder">
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                Foto Estúdio {i}
              </span>
            </div>
          ))}
        </div>

        <div className="glass estudios-info-card">
          <div className="estudios-info-grid">
            <div>
              <div className="estudios-info-label">Endereço</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
                Rua da Música, 50
                <br />
                4000-000 Porto, Portugal
              </p>
            </div>
            <div>
              <div className="estudios-info-label">Equipamento</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
                Microfone AKG C414
                <br />
                Pré-amp Avalon VT-737
                <br />
                Logic Pro X
                <br />
                Monitores Yamaha HS8
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
