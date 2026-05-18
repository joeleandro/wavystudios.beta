import { Navigation } from "@/components/site/navigation";
import { SiteFooter } from "@/components/site/footer";
import { GlobalEffects } from "@/components/site/global-effects";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalEffects />
      <Navigation />
      {children}
      <SiteFooter />
    </>
  );
}
