import type { Metadata, Viewport } from "next";
import { ClerkProvider, auth } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { Inter, Roboto_Mono, Open_Sans } from "next/font/google";
import Head from "next/head";
import { checkMetaDataRole, checkRole } from "./utils/roles/role";
import { getMessages } from "next-intl/server";
import CommonNavbar from "@/components/Navbar/CommonNavbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/navigation";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Study Mate",
  description: "The intelligent note-taking app",
};

const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f5f5f4",
};
export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { userId } = auth();
  if (!locales.includes(locale)) {
    notFound();
  }
  // const isAdmin = checkRole("admin");
  let isAdmin;
  if (userId) {
    isAdmin = await checkMetaDataRole("admin");
  } else {
    isAdmin = checkRole("admin");
  }
  // console.log("isAdmin: " + isAdmin);
  // className={`${inter.variable} ${open_sans.variable} ${roboto_mono.variable}`}
  const messages = await getMessages();
  return (
    <ClerkProvider>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="google" content="notranslate" />
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link
          href="/img-512.png"
          sizes="512x512"
          rel="apple-touch-startup-image"
        />
      </Head>

      <html
        lang={locale}
        className={`${inter.variable} ${roboto_mono.variable}`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <body
            className="bg-slate-50 font-sans"
            suppressHydrationWarning={true}
          >
            <CommonNavbar isAdmin={isAdmin} userId={userId ? userId : ""} />
            {children}
            <Toaster />
          </body>
        </NextIntlClientProvider>
      </html>
    </ClerkProvider>
  );
}
