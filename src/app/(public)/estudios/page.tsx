export default function EstudiosPage() {
  return (
    <div style={{ paddingTop: 100 }}>
      {/* Lisboa */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 12 }}>Estúdio 01</span>
          <h2 className="bebas" style={{ fontSize: "clamp(60px, 10vw, 120px)", color: "var(--text)", lineHeight: .9 }}>LISBOA</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 32 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ aspectRatio: "4/3", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Foto Estúdio {i}</span>
            </div>
          ))}
        </div>
        <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary-c)", marginBottom: 8 }}>Endereço</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>Rua do Som, 100<br />1200-000 Lisboa, Portugal</p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary-c)", marginBottom: 8 }}>Equipamento</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>Microfone Neumann U87<br />Pré-amp Universal Audio<br />Pro Tools HDX<br />Monitores Adam A77X</p>
            </div>
          </div>
        </div>
      </section>

      {/* Porto */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 12 }}>Estúdio 02</span>
          <h2 className="bebas" style={{ fontSize: "clamp(60px, 10vw, 120px)", color: "var(--text)", lineHeight: .9 }}>PORTO</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 32 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ aspectRatio: "4/3", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Foto Estúdio {i}</span>
            </div>
          ))}
        </div>
        <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary-c)", marginBottom: 8 }}>Endereço</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>Rua da Música, 50<br />4000-000 Porto, Portugal</p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary-c)", marginBottom: 8 }}>Equipamento</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>Microfone AKG C414<br />Pré-amp Avalon VT-737<br />Logic Pro X<br />Monitores Yamaha HS8</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
