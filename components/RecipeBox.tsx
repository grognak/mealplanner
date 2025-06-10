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
} from "@/components/ui/alert-dialog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function RecipeBox() {
  const { data: session, status } = useSession();
  const [meals, setMeals] = useState<MealFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState<MealFormData | null>(null);
  const [deleteMeal, setDeleteMeal] = useState<MealFormData | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredMeals = meals.filter((meal) => {
    const term = searchQuery.toLowerCase();
    const nameMatches = meal.name.toLowerCase().includes(term);
    const tagMatches = meal.tags.some((tag) =>
      tag.toLowerCase().includes(term),
    );

    return nameMatches || tagMatches;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleMealSelect = (meal: MealFormData) => {
    setSelectedMeal(meal);
  };

  const handleDelete = async () => {
    if (!deleteMeal) return;

    console.log("Delete Meal Button clicked: ", JSON.stringify(deleteMeal));

    try {
      const res = await fetch(`/api/meals/${deleteMeal.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setMeals((prev) => prev.filter((meal) => meal.id !== deleteMeal.id));
      setDeleteMeal(null);
    } catch (err) {
      console.error("Failed to delete meal:", err);
    }
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

  const handleSearchChange = () => {
    console.log("Search Query: ", searchQuery);
  };

  return (
    <div className="recipe-box">
      <div className="relative w-full max-w-full">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          className="pl-10"
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchChange();
            }
          }}
          value={searchQuery}
        />
      </div>

      <div className="options-menu">
        <Button onClick={handleAddMeal}>Create Meal</Button>
      </div>

      <div className="recipe-grid">
        {filteredMeals.length === 0 ? (
          <div>No meals found.</div>
        ) : (
          <div className="meal-grid">
            {filteredMeals.map((meal, idx) => (
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"Meal Details"}</DialogTitle>
            <DialogDescription>
              The details for the selected meal.
            </DialogDescription>
          </DialogHeader>

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
