"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) redirect("/login");

  return (
    <div>
      <p>Dashboard Page</p>
      <Tabs
        defaultValue="planner"
        className="w-5/6 h-5/6 mx-8 border-4 border-zinc-400 rounded-2xl"
      >
        <TabsList>
          <TabsTrigger value="planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="recipes">Recipe Box</TabsTrigger>
        </TabsList>
        <TabsContent value="planner">Meal Planner</TabsContent>
        <TabsContent value="recipes">Recipe Box</TabsContent>
      </Tabs>
    </div>
  );
}
