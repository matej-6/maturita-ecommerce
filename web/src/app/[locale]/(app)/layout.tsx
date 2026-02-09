import { Chatbot } from "@/components/chatbot";
import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        {children}
        <Chatbot />
      </div>

      <Footer />
    </>
  );
}
