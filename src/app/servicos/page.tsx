import { Navigation } from "@/components/site/navigation";
import { PricingSection } from "@/components/site/pricing";
import { SiteFooter } from "@/components/site/footer";
import { GlobalEffects } from "@/components/site/global-effects";

const services = [
  { num: "01", name: "Captação Vocal", desc: "Gravação profissional com microfones de condensador de diafragma largo, pré-amplificadores de alta qualidade e ambiente acústico tratado.", tags: ["Pro Tools", "Studio One", "Acústica Tratada"] },
  { num: "02", name: "Mix & Master", desc: "Mixagem e masterização para todas as plataformas. Do streaming às plataformas físicas, garantimos qualidade máxima.", tags: ["Stereo", "Dolby Atmos", "Stems"] },
  { num: "03", name: "Produção Musical", desc: "Beats originais, arranjos e produção completa. Do conceito ao produto final, com identidade sonora única.", tags: ["Trap", "R&B", "Afro", "Pop"] },
  { num: "04", name: "Sessão Fotográfica", desc: "Conteúdo visual alinhado com a identidade do artista. Fotos para redes sociais, press kits e capas.", tags: ["Press Kit", "Capa de Álbum", "Social Media"] },
  { num: "05", name: "Direção Criativa", desc: "Construção de identidade artística — nome, conceito visual, estratégia de lançamento.", tags: ["Branding", "Estratégia", "Lançamento"] },
];

export default function ServicosPage() {
  return (
    <>
      <GlobalEffects />
      <Navigation />
      <main>
        <div style={{ padding: "180px 64px 60px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 20 }}>O Que Fazemos</div>
          <h1 className="bebas" style={{ fontSize: "clamp(64px, 10vw, 140px)", lineHeight: .9, textTransform: "uppercase" }}>Serviços</h1>
          <p style={{ maxWidth: 540, fontSize: 16, fontWeight: 300, color: "var(--text2)", marginTop: 32, lineHeight: 1.8 }}>
            Tudo o que um artista precisa, num só estúdio.
          </p>
        </div>

        <div style={{ padding: "0 64px 120px" }}>
          {services.map((s) => (
            <div key={s.num} style={{ display: "flex", alignItems: "flex-start", gap: 80, padding: "60px 0", borderBottom: "1px solid var(--border)", transition: "opacity .3s" }}>
              <div className="bebas" style={{ fontSize: 80, lineHeight: 1, color: "var(--text3)", flexShrink: 0, width: 80 }}>{s.num}</div>
              <div style={{ flex: 1 }}>
                <div className="bebas" style={{ fontSize: 52, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 16 }}>{s.name}</div>
                <p style={{ fontSize: 15, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8, maxWidth: 560 }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                  {s.tags.map((t) => (
                    <span key={t} style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", border: "1px solid var(--border)", color: "var(--text3)", padding: "5px 14px", borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <PricingSection />
      </main>
      <SiteFooter />
    </>
  );
}
