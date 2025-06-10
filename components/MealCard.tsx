"use client";

import { Meal } from "@/types/custom";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MealCardProps {
  meal: Meal;
  onClick: () => void;
  onDelete: () => void;
}

export default function MealCardComponent({
  meal,
  onClick,
  onDelete,
}: MealCardProps) {
  return (
    <div onClick={onClick}>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between items-start">
            {meal.name}
            <Button
              variant="ghost"
              size="icon"
              className="top-2 right-2 z-10"
              onClick={(e) => {
                e.stopPropagation(); // prevent the meal form from opening
                onDelete();
              }}
            >
              <Trash2 size={16} className="text-red-500 hover:text-red-700" />
            </Button>
          </CardTitle>
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
