import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { Session } from "next-auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUsers } from "@/lib/handleRequest";

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
  title: "BlogApp",
  description: "Create and read blogs!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const users = await getUsers();
  console.log(users);

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-300 text-black dark:bg-slate-900 dark:text-white`}
      >
        <SessionProviderWrapper session={session}>
          <SidebarProvider>
            <div className="flex h-screen w-full">
              <AppSidebar session={session} users={users} />
              <div className="flex-1 overflow-auto">
                <Navbar />
                <main className="container mx-auto px-4">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
