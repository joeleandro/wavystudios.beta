import { GlobalEffects } from "@/components/site/global-effects";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalEffects />
      {children}
    </>
  );
}
