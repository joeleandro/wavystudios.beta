import { Navigation } from "@/components/site/navigation";
import { Hero } from "@/components/site/hero";
import { ArtistsSection } from "@/components/site/artists";
import { PricingSection } from "@/components/site/pricing";
import { TeamSection } from "@/components/site/team";
import { SiteFooter } from "@/components/site/footer";
import { GlobalEffects } from "@/components/site/global-effects";

export default function HomePage() {
  return (
    <>
      <GlobalEffects />
      <Navigation />
      <main>
        <Hero />
        <ArtistsSection />
        <PricingSection />
        <TeamSection />
      </main>
      <SiteFooter />
    </>
  );
}
