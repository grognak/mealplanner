"use client";

import { useState, useEffect } from "react";
import { Meal } from "@/types/custom";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card>
        <CardHeader>
          <CardTitle>{meal.name}</CardTitle>
        </CardHeader>
        <CardFooter>
          {meal.tags.map((tag, idx) => (
            <span className="text-sm font-light" key={idx}>
              #{tag}{" "}
            </span>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
