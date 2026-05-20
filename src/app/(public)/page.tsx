import { Hero } from "@/components/site/hero";
import { CycloSection } from "@/components/site/cyclo";
import { BentoGallery } from "@/components/site/bento-gallery";
import { TestimonialsSection } from "@/components/site/testimonials";
import { TeamSection } from "@/components/site/team";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CycloSection />
      <BentoGallery />
      <TestimonialsSection />
      <TeamSection />
    </main>
  );
}
