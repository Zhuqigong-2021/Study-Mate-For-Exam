import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { Toaster } from "react-hot-toast";

import { Inter, Roboto_Mono } from "next/font/google";
import NavBar from "./NavBar";
import CommonNavbar from "@/components/CommonNavbar";

export const metadata: Metadata = {
  title: "Study Mate",
  description: "The intelligent note-taking app",
};

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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
        <body>
          <NavBar />

          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
