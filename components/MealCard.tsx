"use client";

import { useState, useEffect } from "react";
import { Meal } from "@/types/custom";

interface MealCardProps {
  slug: Meal;
}

export default function MealCardComponent({ slug }: MealCardProps) {
  const [meal, setMeal] = useState(slug);

  useEffect(() => {
    setMeal(meal);
  }, []);

  return (
    <div>
      <p>{meal.name}</p>
      {meal.tags.map((tag) => (
        <span className="text-sm font-light" key={tag.id}>
          #{tag}{" "}
        </span>
      ))}
    </div>
  );
}
