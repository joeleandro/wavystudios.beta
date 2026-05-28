import { Hero } from "@/components/site/hero";
import { ListenSection } from "@/components/site/listen-section";
import { BentoGallery } from "@/components/site/bento-gallery";
import { TestimonialsSection } from "@/components/site/testimonials";
import { TeamSection } from "@/components/site/team";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ListenSection />
      <BentoGallery />
      <TestimonialsSection />
      <TeamSection />
    </main>
  );
}
