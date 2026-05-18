export function ArtistsSection() {
  return (
    <section className="artists-section" id="artists">
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".6em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 16, display: "block" }}>Nosso Coletivo</span>
        <h2 className="artists-title" style={{ marginBottom: 0 }}>ARTISTAS</h2>
        <div style={{ width: 80, height: 1, background: "var(--primary-c)", margin: "24px auto 0" }} />
      </div>

      {/* Overlapping circles row - exactly like the reference with negative margins */}
      <div style={{ display: "flex", overflow: "hidden", justifyContent: "center", alignItems: "center", padding: "0 40px" }}>
        <div className="artist-circle" style={{ width: 180, height: 180, flexShrink: 0 }}>
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" alt="Artist 1" />
        </div>
        <div className="artist-circle" style={{ width: 260, height: 260, flexShrink: 0, marginLeft: -40, zIndex: 2 }}>
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" alt="Artist 2" />
        </div>
        <div className="artist-circle" style={{ width: 320, height: 320, flexShrink: 0, marginLeft: -50, zIndex: 3 }}>
          <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80" alt="Artist 3" />
        </div>
        <div className="artist-circle" style={{ width: 240, height: 240, flexShrink: 0, marginLeft: -50, zIndex: 2 }}>
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80" alt="Artist 4" />
        </div>
        <div className="artist-circle" style={{ width: 180, height: 180, flexShrink: 0, marginLeft: -40, zIndex: 1 }}>
          <img src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&q=80" alt="Artist 5" />
        </div>
      </div>

      <div className="artists-quote" style={{ marginTop: 56 }}>
        <div className="artists-quote-line" />
        <p>&ldquo;Aqueles que trazem arte às pessoas com os olhos e ouvidos abertos.&rdquo;</p>
      </div>
    </section>
  );
}
