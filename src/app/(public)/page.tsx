import { Hero } from "@/components/site/hero";
import { ArtistsSection } from "@/components/site/artists";
import { TestimonialsSection } from "@/components/site/testimonials";
import { TeamSection } from "@/components/site/team";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ArtistsSection />
      <TestimonialsSection />
      <TeamSection />
    </main>
  );
}
