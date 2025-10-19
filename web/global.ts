import { routing } from "@/i18n/routing";
import enMessages from "./messages/en.json";
import skMessages from "./messages/sk.json";

// https://next-intl.dev/docs/workflows/typescript
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof enMessages | typeof skMessages;
  }
}
