import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth.config";
import { Analytics } from "@vercel/analytics/react";
import "./prism-theme.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SolBlog",
  description: "Create and read blogs!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-300 text-black dark:bg-slate-900 dark:text-white`}
      >
        <SessionProviderWrapper session={session}>
          <SidebarProvider>
            <div className="flex h-screen w-full">
              <AppSidebar session={session} />
              <div className="flex-1 overflow-auto">
                <Navbar />
                <main className="container mx-auto px-4">
                  {children}
                  <Analytics />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
