"use client";

import { MealFormData } from "@/lib/validators/mealSchema";
import { Meal } from "@/types/custom";

type MealFormProps = {
  meal: Meal;
  onSubmit: (data: MealFormData) => void;
};

// eslint-disable-next-line
export default function MealFormComponent({ meal, onSubmit }: MealFormProps) {
  console.log("meal form: ", meal);
  return <p>Meal Form Is Here!</p>;
}
