import { Hero } from "@/components/site/hero";
import { ArtistsSection } from "@/components/site/artists";
import { PricingSection } from "@/components/site/pricing";
import { TeamSection } from "@/components/site/team";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ArtistsSection />
      <PricingSection />
      <TeamSection />
    </main>
  );
}
