import { Navigation } from "@/components/site/navigation";
import { ArtistsSection } from "@/components/site/artists";
import { SiteFooter } from "@/components/site/footer";
import { GlobalEffects } from "@/components/site/global-effects";

export default function ArtistasPage() {
  return (
    <>
      <GlobalEffects />
      <Navigation />
      <main>
        <div style={{ padding: "180px 64px 60px", position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 20 }}>Nosso Coletivo</div>
          <h1 className="bebas" style={{ fontSize: "clamp(64px, 10vw, 140px)", lineHeight: .9, textTransform: "uppercase" }}>Artistas</h1>
          <p style={{ maxWidth: 540, fontSize: 16, fontWeight: 300, color: "var(--text2)", marginTop: 32, lineHeight: 1.8 }}>
            Os talentos que passam pelo nosso estúdio. Cada um com a sua identidade, todos com o mesmo nível de exigência.
          </p>
        </div>
        <ArtistsSection />
      </main>
      <SiteFooter />
    </>
  );
}
