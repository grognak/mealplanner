"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) redirect("/login");

  return (
    <div>
      <p>Dashboard Page</p>
    </div>
  );
}
