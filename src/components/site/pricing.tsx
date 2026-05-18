import Link from "next/link";

export function PricingSection() {
  return (
    <section className="pricing-section" id="pricing">
      <span className="section-eyebrow">Subscrições Mensais</span>
      <h2 className="section-title bebas">Escolhe o<br />teu plano</h2>
      <p className="pricing-intro">
        Planos flexíveis para artistas em diferentes estágios da jornada musical. Cada pack foi pensado para dar o máximo valor, organização e qualidade em cada sessão.
      </p>

      <div className="pricing-grid">
        {/* Standard */}
        <div className="glass pricing-card">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".25em", textTransform: "uppercase" as const, color: "var(--text3)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--primary-c)" }}>radio_button_checked</span>Para começar
          </div>
          <div className="pricing-name bebas">Standard</div>
          <div className="pricing-desc">Consistência desde o primeiro dia</div>
          <div className="pricing-price bebas"><span className="currency">€</span>150<span className="period">/ mês</span></div>
          <Link href="/login" className="pricing-btn" style={{ display: "block", textAlign: "center" }}>Saber mais</Link>
          <ul className="pricing-features">
            <li><span className="material-symbols-outlined">check_circle</span>Captação Vocal</li>
            <li><span className="material-symbols-outlined">check_circle</span>4h semanais <small style={{ color: "var(--text3)" }}>(16h mensais)</small></li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de 1h cada</li>
            <li><span className="material-symbols-outlined">check_circle</span>2 Mix/Masters incluídos</li>
          </ul>
        </div>

        {/* Professional */}
        <div className="glass pricing-card featured">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".25em", textTransform: "uppercase" as const, color: "var(--text3)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--primary)" }}>radio_button_checked</span>Para ativos
          </div>
          <div className="pricing-name bebas">Professional</div>
          <div className="pricing-desc">Para quem já está em movimento</div>
          <div className="pricing-price bebas"><span className="currency">€</span>190<span className="period">/ mês</span></div>
          <Link href="/login" className="pricing-btn" style={{ display: "block", textAlign: "center" }}>Saber mais</Link>
          <ul className="pricing-features">
            <li><span className="material-symbols-outlined">check_circle</span>Captação Vocal</li>
            <li><span className="material-symbols-outlined">check_circle</span>6h semanais <small style={{ color: "var(--text3)" }}>(24h mensais)</small></li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de 1h30 cada</li>
            <li><span className="material-symbols-outlined">check_circle</span>2 Mix/Masters incluídos</li>
          </ul>
        </div>

        {/* Avançado */}
        <div className="glass pricing-card">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".25em", textTransform: "uppercase" as const, color: "var(--text3)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--primary-c)" }}>radio_button_checked</span>Nível máximo
          </div>
          <div className="pricing-name bebas">Avançado</div>
          <div className="pricing-desc">Para elevar sem limites</div>
          <div className="pricing-price bebas"><span className="currency">€</span>250<span className="period">/ mês</span></div>
          <Link href="/login" className="pricing-btn" style={{ display: "block", textAlign: "center" }}>Saber mais</Link>
          <ul className="pricing-features">
            <li><span className="material-symbols-outlined">check_circle</span>Captação Vocal</li>
            <li><span className="material-symbols-outlined">check_circle</span>8h semanais <small style={{ color: "var(--text3)" }}>(32h mensais)</small></li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de 2h cada</li>
            <li><span className="material-symbols-outlined">check_circle</span>1 Sessão fotográfica (15 fotos)</li>
            <li><span className="material-symbols-outlined">check_circle</span>1 Instrumental Exclusivo</li>
            <li><span className="material-symbols-outlined">check_circle</span>Direção Criativa personalizada</li>
          </ul>
        </div>
      </div>

      {/* Payment methods */}
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
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".3em", textTransform: "uppercase" as const, color: "var(--primary-c)", marginBottom: 16 }}>Política de Serviços</p>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8, marginBottom: 14 }}>Não são efetuados reembolsos em nenhuma circunstância.</p>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8 }}>Sessões canceladas pelo cliente <strong style={{ color: "var(--text)", fontWeight: 600 }}>não poderão ser remarcadas.</strong></p>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8, marginBottom: 14 }}>As horas de utilização semanal <strong style={{ color: "var(--text)", fontWeight: 600 }}>não são acumuláveis.</strong></p>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8 }}>A marcação será realizada de acordo com a <strong style={{ color: "var(--text)", fontWeight: 600 }}>disponibilidade conjunta</strong> do cliente e do estúdio.</p>
        </div>
      </div>
    </section>
  );
}
