"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MealCardComponent from "@/components/MealCard";
import { MealFormData } from "@/lib/validators/mealSchema";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

export default function RecipeBox() {
  const { data: session, status } = useSession();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          setError(err.message);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleMealSelect = (meal: MealFormData) => {
    setSelectedMeal(meal);
    console.log(`Meal Selected:  ${JSON.stringify(meal)}`);
  };

  return (
    <div className="recipe-box">
      {meals.length === 0 ? (
        <div>No meals found.</div>
      ) : (
        <div className="meal-grid">
          {meals.map((meal, idx) => (
            <MealCardComponent
              key={idx}
              meal={meal}
              onClick={() => handleMealSelect(meal)}
            />
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedMeal}
        onOpenChange={(open) => !open && setSelectedMeal(null)}
      >
        <DialogHeader>
          <DialogTitle>{"Meal Details"}</DialogTitle>
          <DialogDescription>
            The details for the selected meal.
          </DialogDescription>
        </DialogHeader>

        <DialogContent>
          {selectedMeal && <p>I have selected a meal!</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
