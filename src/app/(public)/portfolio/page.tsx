import { BentoGallery } from "@/components/site/bento-gallery";

export const metadata = {
  title: "Portfólio — Wavy Studios",
  description: "Explora os projectos do Wavy Studios — captação vocal, mix & master, produção musical e direcção criativa.",
};

export default function PortfolioPage() {
  return (
    <main style={{ paddingTop: 80 }}>
      <BentoGallery showAll />
    </main>
  );
}
