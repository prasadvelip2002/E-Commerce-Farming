import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import MobileBottomNav from "../components/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriMart — Fresh from Verified Farmers",
  description: "India's premier agricultural marketplace connecting verified farmers directly with B2B and B2C customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F9F6F0]">
        <Providers>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <MobileBottomNav />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
