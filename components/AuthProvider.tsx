"use client";

import { SessionProvider } from "next-auth/react";

// A seperate client wrapper that avoids errors relating to client hooks inside a server component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
