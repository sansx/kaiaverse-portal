import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaiaverse Portal",
  description: "Your AI-First Gateway to the Kaia Ecosystem",
  icons: {
    icon: '/images/kaiaverse_icon.svg',
    apple: '/images/kaiaverse_icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="container mx-auto px-4 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 