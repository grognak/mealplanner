"use client";

import { Meal } from "@/types/custom";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface MealCardProps {
  slug: Meal;
  onClick: () => void;
}

export default function MealCardComponent({ slug, onClick }: MealCardProps) {
  return (
    <div onClick={onClick}>
      <Card>
        <CardHeader>
          <CardTitle>{slug.name}</CardTitle>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-2">
          {slug.tags.map((tag, idx) => (
            <span
              className="text-sm font-light bg-gray-100 px-2 py-1 rounded"
              key={idx}
            >
              #{tag}{" "}
            </span>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
