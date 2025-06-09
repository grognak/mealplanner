"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MealCardComponent from "@/components/MealCard";
import MealForm from "./MealForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { MealFormData } from "@/lib/validators/mealSchema";

export default function RecipeBox() {
  const { data: session, status } = useSession();
  const [meals, setMeals] = useState<MealFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMeal, setSelectedMeal] = useState<MealFormData | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      const fetchMeals = async () => {
        try {
          const response = await fetch(`/api/meals`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.id}`,
            },
          });

          console.log("Response from server: ", response);

          if (!response.ok) {
            throw new Error("Failed to fetch meals");
          }

          const data = await response.json();
          setMeals(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchMeals();
    } else if (status === "unauthenticated") {
      setError("You must be logged in to see your meals.");
      setLoading(false);
    }
  }, [status, session]);

  const handleMealSelect = (meal: MealFormData) => {
    setSelectedMeal(meal);
  };

  const handleFormSubmit = async (data: MealFormData) => {
    // update or create logic here
    console.log("Submitting meal: ", data);
    setSelectedMeal(null);
  };

  return (
    <div className="recipe-box">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && meals.length === 0 && <div>No meals found.</div>}

      <div className="meal-grid">
        {meals.map((meal) => (
          <MealCardComponent
            key={meal.name}
            slug={meal}
            onClick={() => handleMealSelect(meal)}
          />
        ))}
      </div>

      <Dialog
        open={!!selectedMeal}
        onOpenChange={(open) => !open && setSelectedMeal(null)}
      >
        <DialogContent>
          {selectedMeal && (
            <MealForm defaultMeal={selectedMeal} onSubmit={handleFormSubmit} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
