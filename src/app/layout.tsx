import type { Metadata } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/session-provider";
import { defaultLocale, isLocale, isRtl } from "@/i18n/config";
import { I18nProvider } from "@/i18n/provider";
import { getServerI18n } from "@/i18n/server";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = localFont({
  src: [
    {
      path: "../fonts/fraunces-latin.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../fonts/fraunces-italic-latin.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const instrumentSans = localFont({
  src: [
    {
      path: "../fonts/instrument-sans-latin.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../fonts/instrument-sans-italic-latin.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-instrument-sans",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();

  return {
    title: t("meta.homeTitle"),
    description: t("meta.homeDescription"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${instrumentSans.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <I18nProvider initialLocale={locale}>
          <ThemeProvider>
            <SessionProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </SessionProvider>
            <Toaster />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
