import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "早点下班",
    template: "%s - 早点下班",
  },
  description: "让你早点下班的在线工具集合，提升工作效率",
  metadataBase: new URL("https://school-down.vercel.app"),
  authors: [{ name: "Larry Xue", url: "https://larryxue.dev" }],
  creator: "Larry Xue",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://school-down.vercel.app",
    title: "早点下班",
    description: "让你早点下班的在线工具集合，提升工作效率",
    siteName: "早点下班",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <SiteHeader />
        <main className="flex-1">
          <div className="container max-w-screen-2xl px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
