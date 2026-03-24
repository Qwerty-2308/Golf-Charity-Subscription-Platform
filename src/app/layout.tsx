import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Good Drive Club",
  description:
    "A subscription golf platform blending score-driven prize draws with charitable impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-0 top-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(241,131,92,0.28),_transparent_70%)] blur-3xl" />
          <div className="absolute right-0 top-40 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,_rgba(41,118,108,0.24),_transparent_68%)] blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,_rgba(238,197,98,0.2),_transparent_70%)] blur-3xl" />
        </div>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
