"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Session } from "next-auth";

interface SessionProviderWrapperProps {
  children: ReactNode;
  session: Session | null | undefined;
}

export default function SessionProviderWrapper({
  children,
  session,
}: SessionProviderWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}