"use server";

import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import Providers from "@/providers";
import { hasLocale, Locale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cn } from "@/lib/utils";
import "../globals.css";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata(
  props: Omit<LocaleLayoutProps, "children">,
): Promise<Metadata> {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "LocaleLayout",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html className="h-full" lang={locale}>
      <body
        id="root"
        className={cn(
          geistSans.variable,
          geistMono.variable,
          bricolage.variable,
          "antialiased font-primary overflow-y-scroll!",
        )}
      >
        <Providers>
          <div className="min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
