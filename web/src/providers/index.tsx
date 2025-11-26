import { Toaster } from "sonner";
import { I18nProvider } from "./i18nProvider";
import { QueryProvider } from "./queryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <QueryProvider>
        <Toaster richColors />
        {children}
      </QueryProvider>
    </I18nProvider>
  );
}
