import Link from "next/link";

export function PricingSection() {
  return (
    <section className="pricing-section" id="pricing">
      {/* Centered header like reference */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <h2 className="bebas" style={{ fontSize: "clamp(48px, 7vw, 80px)", textTransform: "uppercase", lineHeight: .95, letterSpacing: ".02em", marginBottom: 20 }}>Subscrições Mensais</h2>
        <p style={{ maxWidth: 600, margin: "0 auto", fontSize: 15, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8 }}>
          Oferecemos planos flexíveis para artistas em diferentes estágios da tua jornada musical, desde quem está a começar até quem já vive da música. Cada pack foi pensado para dar o máximo de valor, organização e qualidade em cada sessão.
        </p>
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
          <div className="glass" style={{ padding: "6px 24px", borderRadius: 40, fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text3)" }}>Mensal</div>
        </div>
      </div>

      <div className="pricing-grid">
        {/* Standard */}
        <div className="glass pricing-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(255,255,255,.3)" }}>radio_button_checked</span>
            <span className="pricing-name bebas" style={{ marginBottom: 0, fontSize: 28 }}>Standard</span>
          </div>
          <div className="pricing-desc">Para começar com consistência</div>
          <div className="pricing-price bebas" style={{ marginBottom: 4 }}><span className="currency">€</span>150<span className="period">/ por mês</span></div>
          <Link href="/login" className="pricing-btn" style={{ display: "block", textAlign: "center" }}>Saber mais</Link>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text)", marginBottom: 16 }}>O que está incluído:</div>
          <ul className="pricing-features">
            <li><span className="material-symbols-outlined">check_circle</span>Captação Vocal</li>
            <li><span className="material-symbols-outlined">check_circle</span>4 horas semanais <small style={{ color: "var(--text3)" }}>(16 horas mensais)</small></li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de 1h cada</li>
            <li><span className="material-symbols-outlined">check_circle</span>2 Mix/Masters incluídos</li>
          </ul>
        </div>

        {/* Professional - Featured/Scaled */}
        <div className="glass pricing-card featured" style={{ transform: "scale(1.03)", zIndex: 5, background: "rgba(255,255,255,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--primary)" }}>radio_button_checked</span>
            <span className="pricing-name bebas" style={{ marginBottom: 0, fontSize: 28 }}>Professional</span>
          </div>
          <div className="pricing-desc">Para quem já está ativo.</div>
          <div className="pricing-price bebas" style={{ marginBottom: 4 }}><span className="currency">€</span>190<span className="period">/ por mês</span></div>
          <Link href="/login" className="pricing-btn" style={{ display: "block", textAlign: "center", background: "#fff", color: "#000", borderColor: "#fff" }}>Saber mais</Link>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text)", marginBottom: 16 }}>O que está incluído:</div>
          <ul className="pricing-features">
            <li><span className="material-symbols-outlined">check_circle</span>Captação Vocal</li>
            <li><span className="material-symbols-outlined">check_circle</span>6 horas semanais <small style={{ color: "var(--text3)" }}>(24 horas mensais)</small></li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de 1h30 cada</li>
            <li><span className="material-symbols-outlined">check_circle</span>2 Mix/Masters incluídos</li>
          </ul>
        </div>

        {/* Avançado */}
        <div className="glass pricing-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(255,255,255,.3)" }}>radio_button_checked</span>
            <span className="pricing-name bebas" style={{ marginBottom: 0, fontSize: 28 }}>Avançado</span>
          </div>
          <div className="pricing-desc">Para elevar o nível máximo.</div>
          <div className="pricing-price bebas" style={{ marginBottom: 4 }}><span className="currency">€</span>250<span className="period">/ por mês</span></div>
          <Link href="/login" className="pricing-btn" style={{ display: "block", textAlign: "center" }}>Saber mais</Link>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text)", marginBottom: 16 }}>O que está incluído:</div>
          <ul className="pricing-features">
            <li><span className="material-symbols-outlined">check_circle</span>Captação Vocal</li>
            <li><span className="material-symbols-outlined">check_circle</span>8 horas semanais <small style={{ color: "var(--text3)" }}>(32 horas mensais)</small></li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de 2h cada</li>
            <li><span className="material-symbols-outlined">check_circle</span>1 Sessão fotográfica (15 fotos)</li>
            <li><span className="material-symbols-outlined">check_circle</span>1 Instrumental Exclusivo</li>
            <li><span className="material-symbols-outlined">check_circle</span>Direção Criativa personalizada</li>
          </ul>
        </div>
      </div>

      {/* Payment methods */}
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <h3 className="bebas" style={{ fontSize: 40, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 32 }}>Métodos de pagamento</h3>
      </div>
      <div className="payment-grid">
        <div className="glass pay-card"><span style={{ fontSize: 22, fontWeight: 700, color: "#003087" }}>PayPal</span></div>
        <div className="glass pay-card">
          <div style={{ display: "flex" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#EB001B", opacity: .85 }} />
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#F79E1B", opacity: .85, marginLeft: -14 }} />
          </div>
        </div>
        <div className="glass pay-card"><span style={{ fontSize: 20, fontWeight: 700 }}>Revolut</span></div>
        <div className="glass pay-card">
          <span style={{ fontSize: 16, fontWeight: 700, border: "2px solid #c00", padding: "2px 6px" }}>MB <span style={{ fontSize: 11, fontWeight: 400 }}>WAY</span></span>
        </div>
      </div>

      {/* Policy */}
      <div className="pricing-policy">
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".3em", textTransform: "uppercase" as const, color: "var(--primary-c)", marginBottom: 16 }}>Política de Serviços e Condições</p>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8, marginBottom: 14 }}>Não são efetuados reembolsos em nenhuma circunstância.</p>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8, marginBottom: 14 }}>Todas as entregas serão realizadas conforme o pedido do cliente. No entanto, este pedido deve ser efetuado no prazo máximo de <strong style={{ color: "var(--text)", fontWeight: 600 }}>30 dias após a última sessão realizada.</strong></p>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8 }}>Sessões canceladas pelo cliente <strong style={{ color: "var(--text)", fontWeight: 600 }}>não poderão ser remarcadas.</strong></p>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8, marginBottom: 14 }}>As horas de utilização semanal <strong style={{ color: "var(--text)", fontWeight: 600 }}>não são acumuláveis.</strong></p>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8 }}>A marcação será realizada de acordo com a <strong style={{ color: "var(--text)", fontWeight: 600 }}>disponibilidade conjunta</strong> do fotógrafo e do cliente.</p>
        </div>
      </div>
    </section>
  );
}
