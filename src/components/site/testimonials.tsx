"use client";

const testimonials = [
  {
    nome: "Dj Khalid",
    texto: "O estúdio da Wavy transformou completamente o meu som. Profissionalismo a outro nível.",
    plano: "Professional",
    avatar: "K",
  },
  {
    nome: "Ana Beatriz",
    texto: "Desde que comecei a subscrição mensal a minha música evoluiu imenso. Equipa incrível.",
    plano: "Avançado",
    avatar: "A",
  },
  {
    nome: "Leandro M.",
    texto: "A qualidade do mix & master é brutal. Recomendo a qualquer artista sério.",
    plano: "Standard",
    avatar: "L",
  },
];

export function TestimonialsSection() {
  return (
    <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".6em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 16 }}>O que dizem</span>
        <h2 className="bebas" style={{ fontSize: "clamp(48px, 7vw, 80px)", color: "var(--text)" }}>TESTEMUNHOS</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {testimonials.map((t) => (
          <div key={t.nome} className="glass" style={{ padding: 28, borderRadius: 16, transition: "all .3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-c), #c41a1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#fff" }}>
                {t.avatar}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{t.nome}</div>
                <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 600 }}>{t.plano}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, fontStyle: "italic" }}>
              &ldquo;{t.texto}&rdquo;
            </p>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@media(max-width:768px){[style*="grid-template-columns: repeat(3"]{grid-template-columns:1fr!important}}` }} />
    </section>
  );
}
