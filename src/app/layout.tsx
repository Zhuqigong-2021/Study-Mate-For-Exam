import type { Metadata, Viewport } from "next";
import { ClerkProvider, auth } from "@clerk/nextjs";

import "./globals.css";
import { Toaster } from "react-hot-toast";

import { Inter, Roboto_Mono, Open_Sans } from "next/font/google";

import CommonNavbar from "@/components/CommonNavbar";
import { checkMetaDataRole, checkRole } from "./utils/roles/role";

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
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  // const isAdmin = checkRole("admin");
  let isAdmin;
  if (userId) {
    isAdmin = await checkMetaDataRole("admin");
  } else {
    isAdmin = checkRole("admin");
  }
  // console.log("isAdmin: " + isAdmin);
  // className={`${inter.variable} ${open_sans.variable} ${roboto_mono.variable}`}
  return (
    <ClerkProvider>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link
          href="/img-512.png"
          sizes="512x512"
          rel="apple-touch-startup-image"
        />
      </head>

      <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
        <body className="font-sans">
          <CommonNavbar isAdmin={isAdmin} userId={userId ? userId : ""} />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
