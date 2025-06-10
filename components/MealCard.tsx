"use client";

import { Meal } from "@/types/custom";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface MealCardProps {
  meal: Meal;
  onClick: () => void;
}

export default function MealCardComponent({ meal, onClick }: MealCardProps) {
  return (
    <div onClick={onClick}>
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
