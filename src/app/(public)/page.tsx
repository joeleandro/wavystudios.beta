import { Hero } from "@/components/site/hero";
import { BentoGallery } from "@/components/site/bento-gallery";
import { TestimonialsSection } from "@/components/site/testimonials";
import { TeamSection } from "@/components/site/team";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BentoGallery />
      <TestimonialsSection />
      <TeamSection />
    </main>
  );
}
