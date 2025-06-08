"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealCardComponent from "@/components/MealCard";
import RecipeBox from "@/components/RecipeBox";

import { Meal } from "@/types/custom";
const testMeal: Meal = {
  id: "001",
  name: "Berry Smoothie",
  tags: ["breakfast", "vegetarian", "quick"],
  notes: ["Use different berry mixes"],
};

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) redirect("/login");

  return (
    <div>
      <p>Dashboard Page</p>
      <MealCardComponent slug={testMeal} />
      <Tabs
        defaultValue="planner"
        className="w-5/6 h-5/6 mx-8 border-4 border-zinc-400 rounded-2xl"
      >
        <TabsList>
          <TabsTrigger value="planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="recipes">Recipe Box</TabsTrigger>
        </TabsList>
        <TabsContent value="planner">Meal Planner</TabsContent>
        <TabsContent value="recipes">
          <RecipeBox />
        </TabsContent>
      </Tabs>
    </div>
  );
}
