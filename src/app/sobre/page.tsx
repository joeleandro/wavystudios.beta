import { Navigation } from "@/components/site/navigation";
import { TeamSection } from "@/components/site/team";
import { SiteFooter } from "@/components/site/footer";
import { GlobalEffects } from "@/components/site/global-effects";

export default function SobrePage() {
  return (
    <>
      <GlobalEffects />
      <Navigation />
      <main>
        <div style={{ padding: "180px 64px 60px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 20 }}>A Nossa História</div>
          <h1 className="bebas" style={{ fontSize: "clamp(64px, 10vw, 140px)", lineHeight: .9, textTransform: "uppercase" }}>Sobre o<br />Estúdio</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", padding: "80px 64px" }}>
          <div style={{ position: "relative" }}>
            <img style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", filter: "grayscale(.5)", borderRadius: 4 }} src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80" alt="Estúdio" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".4em", textTransform: "uppercase", color: "var(--primary-c)", marginBottom: 20 }}>Est. 2024 · Lisboa, Portugal</div>
            <h2 className="bebas" style={{ fontSize: "clamp(40px, 5vw, 72px)", lineHeight: .95, marginBottom: 28 }}>Som com<br />propósito</h2>
            <p style={{ fontSize: 16, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 24 }}>
              O SG Studio nasceu da paixão pelo som autêntico e pela vontade de criar um espaço onde os artistas podem expressar-se sem limites técnicos. Somos um estúdio de serviço completo especializado em captação vocal, produção musical e direção criativa.
            </p>
            <p style={{ fontSize: 16, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 24 }}>
              A nossa abordagem combina equipamento de topo com um ambiente que inspira. Cada sessão é pensada para extrair o melhor do artista, desde o primeiro take até à entrega final.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
              <div><div className="bebas" style={{ fontSize: 56, lineHeight: 1 }}>50+</div><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text3)", marginTop: 4 }}>Artistas</div></div>
              <div><div className="bebas" style={{ fontSize: 56, lineHeight: 1 }}>200+</div><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text3)", marginTop: 4 }}>Sessões</div></div>
              <div><div className="bebas" style={{ fontSize: 56, lineHeight: 1 }}>30+</div><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text3)", marginTop: 4 }}>Projetos</div></div>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 64px 40px" }}>
          <h3 className="bebas" style={{ fontSize: 56, marginBottom: 8 }}>A Equipa</h3>
        </div>
        <TeamSection />
      </main>
      <SiteFooter />
    </>
  );
}
