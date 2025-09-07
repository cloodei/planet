import "./globals.css";
import { type Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Providers } from "../components/providers";
import Layout from "../components/root-layout";

const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontHeading = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanetHeat",
  description: "Machine Learning based prediction model for global temperature",
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background antialiased ${fontSans.variable} ${fontMono.variable} ${fontHeading.variable}`}>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
