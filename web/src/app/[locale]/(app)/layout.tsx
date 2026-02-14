import { getCurrentSessionAction } from "@/app/data-access-layer/auth/actions";
import { Chatbot } from "@/components/chatbot";
import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const sessionPromise = getCurrentSessionAction();

  return (
    <>
      <Header />
      <div className="min-h-screen">
        {children}
        <Chatbot sessionPromise={sessionPromise} />
      </div>

      <Footer />
    </>
  );
}
