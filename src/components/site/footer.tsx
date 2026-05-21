import Link from "next/link";

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconSpotify() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 01-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.223-2.722a.779.779 0 01-1.072.257C14.15 12.246 10.68 11.7 7.435 12.6a.779.779 0 01-.45-1.49c3.7-1.12 7.7-.577 10.568 1.52a.779.779 0 01.256 1.072zm.105-2.836C15.2 8.87 10.5 8.7 7.4 9.67a.935.935 0 11-.54-1.79C10.4 6.78 15.7 6.98 19 9.16a.935.935 0 01-1.086 1.506z"/>
    </svg>
  );
}
function IconAppleMusic() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.297.228.473.044.95.07 1.426.07 4.28.002 8.56.002 12.84 0 .47 0 .94-.022 1.41-.065.745-.07 1.472-.194 2.138-.54 1.16-.604 1.946-1.51 2.37-2.747.2-.588.302-1.2.34-1.82.05-.79.062-1.58.062-2.37V6.125zm-6.74 5.04c0 1.47-.012 2.94.004 4.41.004.378-.05.736-.2 1.08-.36.82-1.01 1.26-1.87 1.39-.38.06-.77.05-1.14-.07-.6-.2-1.03-.59-1.23-1.2-.2-.59-.07-1.15.27-1.65.34-.5.84-.76 1.41-.89.36-.08.73-.12 1.09-.19.27-.05.42-.2.46-.48.01-.07.01-.14.01-.21V9.59c0-.18-.06-.3-.24-.34-.56-.12-1.12-.24-1.68-.37-.46-.1-.92-.2-1.38-.31-.12-.02-.2.02-.22.16-.01.06-.01.12-.01.18v6.03c.01.41 0 .82-.05 1.23-.1.7-.47 1.23-1.1 1.57-.38.2-.8.3-1.23.33-.35.03-.7.02-1.05-.07-.74-.2-1.2-.7-1.36-1.44-.12-.56-.01-1.08.35-1.53.32-.4.76-.65 1.24-.79.35-.1.72-.15 1.08-.22.27-.05.42-.19.46-.47.01-.06.01-.12.01-.18V7.41c0-.31.1-.46.4-.53.69-.16 1.37-.32 2.06-.48l2.47-.56c.58-.13 1.16-.27 1.74-.4.16-.03.28.02.31.2.01.06.01.12.01.18v5.4z"/>
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* Block 1 — Logo + nav links */}
      <div className="footer-block-logo">
        <div className="footer-logo bebas" style={{ fontSize: 36 }}>WAVY STUDIOS</div>
        <div className="footer-block-links" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/" className="footer-link">Início</Link>
          <Link href="/precos" className="footer-link">Serviços</Link>
          <Link href="/portfolio" className="footer-link">Portfólio</Link>
          <Link href="/estudios" className="footer-link">Estúdios</Link>
          <Link href="/sobre" className="footer-link">Sobre</Link>
          <Link href="/sobre#contacto" className="footer-link">Contacto</Link>
        </div>
      </div>

      {/* Block 2 — Contact + socials */}
      <div className="footer-block-contact" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="footer-contact-label">Contacto</div>
          <div style={{ fontSize: 15, color: "var(--text)" }}>wavystudiosinfo@gmail.com</div>
          <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 6 }}>+351 939 910 528</div>
        </div>
        <div className="footer-block-socials" style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="https://www.instagram.com/wavystudioss/" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram"><IconInstagram /></a>
          <a href="https://open.spotify.com/intl-pt/artist/6DGmebMhwunFzbWodIcMsW" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Spotify"><IconSpotify /></a>
          <a href="https://music.apple.com/pt/artist/wavy/1552201533?l=en-GB" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Apple Music"><IconAppleMusic /></a>
          <a href="https://www.youtube.com/@WavyStudiosWeOn/featured" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="YouTube"><IconYouTube /></a>
          <a href="https://wa.me/351939910528" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="WhatsApp"><IconWhatsApp /></a>
        </div>
      </div>

      {/* Block 3 — Address + legal */}
      <div className="footer-block-address" style={{ textAlign: "right" }}>
        <div className="footer-contact-label">Estúdios</div>
        <div style={{ fontSize: 13, fontWeight: 300, color: "var(--text2)", lineHeight: 2 }}>
          Lisboa — Nave<br />Porto — Cube
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "flex-end", marginTop: 24, flexWrap: "wrap" }}>
          <span className="footer-link">Privacidade</span>
          <span className="footer-link">Termos</span>
        </div>
        <div className="footer-copy" style={{ marginTop: 20 }}>© 2025 WAVY STUDIOS</div>
      </div>
    </footer>
  );
}
