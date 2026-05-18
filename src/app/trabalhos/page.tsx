import { Navigation } from "@/components/site/navigation";
import { SiteFooter } from "@/components/site/footer";
import { GlobalEffects } from "@/components/site/global-effects";

const works = [
  { cat: "Captação Vocal · Mix & Master", title: "PROJETO ECLIPSE", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80", span: true },
  { cat: "Mix & Master", title: "SILÊNCIO NEON", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80" },
  { cat: "Produção · Captação", title: "NOITE URBANA", img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80" },
  { cat: "Sessão fotográfica · Vocal", title: "RAÍZES SONORAS", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" },
  { cat: "Instrumental · Mix", title: "FREQUÊNCIA 432", img: "https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=800&q=80" },
];

export default function TrabalhosPage() {
  return (
    <>
      <GlobalEffects />
      <Navigation />
      <main>
        <div style={{ padding: "180px 64px 60px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 20 }}>Portfólio</div>
          <h1 className="bebas" style={{ fontSize: "clamp(64px, 10vw, 140px)", lineHeight: .9, textTransform: "uppercase" }}>Nossos<br />Trabalhos</h1>
          <p style={{ maxWidth: 540, fontSize: 16, fontWeight: 300, color: "var(--text2)", marginTop: 32, lineHeight: 1.8 }}>
            Cada projeto é uma história sonora. Aqui estão alguns dos trabalhos que nos definem.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
          {works.map((w) => (
            <div key={w.title} style={{ position: "relative", aspectRatio: w.span ? "21/9" : "16/10", overflow: "hidden", cursor: "pointer", background: "var(--bg3)", gridColumn: w.span ? "span 2" : undefined }}>
              <img style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(.8)", transition: "filter .7s, transform .7s" }} src={w.img} alt={w.title} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 50%)", opacity: 0, transition: "opacity .4s" }} className="work-hover-overlay" />
              <div style={{ position: "absolute", bottom: 0, left: 0, padding: 32 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 6 }}>{w.cat}</div>
                <div className="bebas" style={{ fontSize: 32, letterSpacing: ".04em" }}>{w.title}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
