import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <div className="footer-logo bebas">SG</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/" className="footer-link">Início</Link>
          <Link href="/trabalhos" className="footer-link">Trabalhos</Link>
          <Link href="/servicos" className="footer-link">Serviços</Link>
          <Link href="/sobre" className="footer-link">Sobre</Link>
          <Link href="/contatos" className="footer-link">Contato</Link>
        </div>
        <div className="footer-copy" style={{ marginTop: 32 }}>© 2024 SG STUDIO — FUTURE BASED SOUND.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, justifyContent: "center" }}>
        <div>
          <div className="footer-contact-label">Contacto</div>
          <div style={{ fontSize: 16, color: "var(--text)" }}>mail@sgstudio.pt</div>
          <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 6 }}>+351 912 345 678</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="footer-social"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>public</span></div>
          <div className="footer-social"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>bolt</span></div>
          <div className="footer-social"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>graphic_eq</span></div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="footer-contact-label">Endereço</div>
        <div style={{ fontSize: 13, fontWeight: 300, color: "var(--text2)", lineHeight: 2 }}>Rua do Som, 100<br />Lisboa, Portugal</div>
        <div style={{ display: "flex", gap: 20, justifyContent: "flex-end", marginTop: 24 }}>
          <span className="footer-link">Privacidade</span>
          <span className="footer-link">Termos</span>
        </div>
      </div>
    </footer>
  );
}
