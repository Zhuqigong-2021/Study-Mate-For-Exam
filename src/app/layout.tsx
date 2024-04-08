import type { Metadata, Viewport } from "next";
import { ClerkProvider, auth } from "@clerk/nextjs";

import "./globals.css";
import { Toaster } from "react-hot-toast";

import { Inter, Roboto_Mono, Open_Sans } from "next/font/google";

import CommonNavbar from "@/components/CommonNavbar";
import { checkRole } from "./utils/roles/role";

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
  themeColor: "#ccfbf1",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  const isAdmin = checkRole("admin");

  // console.log("isAdmin: " + isAdmin);
  // className={`${inter.variable} ${roboto_mono.variable}`}
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${open_sans.variable} ${roboto_mono.variable}`}
      >
        <body className="">
          <CommonNavbar isAdmin={isAdmin} userId={userId ? userId : ""} />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
