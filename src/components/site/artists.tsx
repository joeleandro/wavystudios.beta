"use client";

export function ArtistsSection() {
  return (
    <section className="artists-section" id="artists" style={{ position: "relative", overflow: "hidden" }}>
      {/* Dark burgundy animated background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {/* Slow moving gradient orbs */}
        <div style={{ position: "absolute", top: "10%", left: "50%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.08) 0%, transparent 60%)", animation: "artist-bg1 20s ease-in-out infinite alternate", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.06) 0%, transparent 70%)", animation: "artist-bg2 25s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,168,.03) 0%, transparent 60%)", animation: "artist-bg3 18s ease-in-out infinite alternate" }} />
        {/* Subtle horizontal light sweep */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(139,0,0,.03) 50%, transparent 100%)", animation: "artist-sweep 12s ease-in-out infinite" }} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 60, position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".6em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 16, display: "block" }}>Quem passa por aqui</span>
        <h2 className="artists-title" style={{ marginBottom: 0 }}>ARTISTAS</h2>
        <div style={{ width: 80, height: 1, background: "var(--primary-c)", margin: "24px auto 0" }} />
      </div>

      {/* Overlapping circles row - exactly like the reference with negative margins */}
      <div style={{ display: "flex", overflow: "hidden", justifyContent: "center", alignItems: "center", padding: "0 40px", position: "relative", zIndex: 1 }}>
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

      <div className="artists-quote" style={{ marginTop: 56, position: "relative", zIndex: 1 }}>
        <div className="artists-quote-line" />
        <p>&ldquo;Cada voz que entra aqui sai com algo que não existia antes.&rdquo;</p>
      </div>

      {/* Inline keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes artist-bg1 { from { transform: translateX(-50%) scale(1); opacity: .6; } to { transform: translateX(-50%) scale(1.2); opacity: 1; } }
        @keyframes artist-bg2 { from { transform: translate(0, 0) scale(1); } to { transform: translate(30px, -20px) scale(1.15); } }
        @keyframes artist-bg3 { from { transform: scale(1); opacity: .5; } to { transform: scale(1.3); opacity: .9; } }
        @keyframes artist-sweep { 0%, 100% { transform: translateX(-100%); } 50% { transform: translateX(100%); } }
      `}} />
    </section>
  );
}
