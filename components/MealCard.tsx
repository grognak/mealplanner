"use client";

import { Meal } from "@/types/custom";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
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
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const imageUrl =
    meal.img_file ??
    (meal.img_public_id
      ? `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,q_auto,f_auto,w_400,h_200/${meal.img_public_id}`
      : null);

  return (
    <Card
      className="w-full max-w-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={meal.name}
          className="w-full h-48 object-cover"
        />
      )}

      <CardHeader className="p-4">
        <CardTitle className="flex justify-between items-start text-lg">
          <span className="truncate max-w-[80%]">{meal.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // keep card click from opening the form
              onDelete();
            }}
          >
            <Trash2 size={16} className="text-red-500 hover:text-red-700" />
          </Button>
        </CardTitle>
      </CardHeader>

      {meal.tags?.length ? (
        <CardContent className="px-4 pb-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
          {meal.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-muted rounded-full uppercase tracking-wide"
            >
              #{tag}
            </span>
          ))}
        </CardContent>
      ) : null}

      <CardFooter className="p-2" />
    </Card>
  );
}
