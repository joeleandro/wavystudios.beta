import { CycloSection } from "@/components/site/cyclo";

export const metadata = {
  title: "Cyclo — Wavy Studios",
  description: "Uma viagem visual pelo universo Wavy Studios — sessões, artistas e momentos que definem o nosso som.",
};

export default function CycloPage() {
  return (
    <main style={{ paddingTop: 80 }}>
      <CycloSection />
    </main>
  );
}
