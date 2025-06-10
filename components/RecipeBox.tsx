"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MealCardComponent from "@/components/MealCard";
import { MealFormData } from "@/lib/validators/mealSchema";
import MealFormComponent from "@/components/MealForm";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RecipeBox() {
  const { data: session, status } = useSession();
  const [meals, setMeals] = useState<MealFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState<MealFormData | null>(null);
  const [deleteMeal, setDeleteMeal] = useState<MealFormData | null>(null);

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

  useEffect(() => {
    console.log("selectedMeal updated: ", selectedMeal);
  }, [selectedMeal]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleMealSelect = (meal: MealFormData) => {
    setSelectedMeal(meal);
  };

  const handleDelete = () => {
    console.log("Delete Meal Button clicked: ", JSON.stringify(deleteMeal));

    setDeleteMeal(null);
  };

  const handleFormSubmit = async (data: MealFormData) => {
    try {
      const method = isCreating ? "POST" : "PATCH";
      const url = isCreating ? "/api/meals" : `/api/meals/${data.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.id}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save meal");

      const updatedMeal = await response.json();

      setMeals((prev) => {
        if (isCreating) {
          return [...prev, updatedMeal];
        } else {
          return prev.map((m) => (m.id === updatedMeal.id ? updatedMeal : m));
        }
      });
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSelectedMeal(null);
      setIsCreating(false);
    }
  };

  const handleAddMeal = () => {
    setSelectedMeal({
      id: "",
      name: "",
      tags: [],
      lastMade: undefined,
      notes: [],
      img_file: "",
      recipe_link: "",
      userId: session?.user.id,
    });
    setIsCreating(true);
  };

  return (
    <div className="recipe-box">
      <div className="options-menu">
        <Button onClick={handleAddMeal}>Create Meal</Button>
      </div>

      <div className="recipe-grid">
        {meals.length === 0 ? (
          <div>No meals found.</div>
        ) : (
          <div className="meal-grid">
            {meals.map((meal, idx) => (
              <MealCardComponent
                key={idx}
                meal={meal}
                onClick={() => handleMealSelect(meal)}
                onDelete={() => setDeleteMeal(meal)}
              />
            ))}
          </div>
        )}
      </div>

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
          {selectedMeal && (
            <MealFormComponent
              meal={selectedMeal}
              onSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteMeal}
        onOpenChange={(open) => !open && setDeleteMeal(null)}
      >
        <AlertDialogTrigger>Delete Meal</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              meal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
