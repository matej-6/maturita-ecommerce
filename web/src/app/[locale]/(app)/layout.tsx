import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Header />
      <div className="h-screen">{children}</div>
      <Footer />
    </>
  );
}
