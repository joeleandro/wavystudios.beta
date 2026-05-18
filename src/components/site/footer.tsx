import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* Block 1 — Logo + nav links */}
      <div className="footer-block-logo">
        <div className="footer-logo bebas">WAVY</div>
        <div className="footer-block-links" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/" className="footer-link">Início</Link>
          <Link href="/precos" className="footer-link">Serviços</Link>
          <Link href="/estudios" className="footer-link">Estúdios</Link>
          <Link href="/sobre" className="footer-link">Sobre</Link>
          <Link href="/sobre#contacto" className="footer-link">Contacto</Link>
        </div>
      </div>

      {/* Block 2 — Contact + socials */}
      <div className="footer-block-contact" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="footer-contact-label">Contacto</div>
          <div style={{ fontSize: 16, color: "var(--text)" }}>wavystudiosinfo@gmail.com</div>
          <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 6 }}>+351 939 910 528</div>
        </div>
        <div className="footer-block-socials" style={{ display: "flex", gap: 10 }}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>photo_camera</span>
          </a>
          <a href="https://wa.me/351939910528" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="WhatsApp">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="YouTube">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_circle</span>
          </a>
        </div>
      </div>

      {/* Block 3 — Address + legal */}
      <div className="footer-block-address" style={{ textAlign: "right" }}>
        <div className="footer-contact-label">Estúdios</div>
        <div style={{ fontSize: 13, fontWeight: 300, color: "var(--text2)", lineHeight: 2 }}>
          Lisboa<br />Porto
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "flex-end", marginTop: 24, flexWrap: "wrap" }}>
          <span className="footer-link">Privacidade</span>
          <span className="footer-link">Termos</span>
        </div>
        <div className="footer-copy" style={{ marginTop: 20 }}>© 2024 WAVY STUDIOS</div>
      </div>
    </footer>
  );
}
