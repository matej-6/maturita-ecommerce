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
        <div className="fixed bottom-0 right-2 sm:right-4 lg:right-32 flex justify-end z-[99]">
          <Chatbot />
        </div>
      </div>

      <Footer />
    </>
  );
}
