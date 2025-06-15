import { z } from "zod";

export const mealFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Meal name is required"),
  tags: z.array(z.string()).optional().default([]),
  lastMade: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    if (typeof val === "string") return new Date(val);
    if (val === null || val === undefined) return undefined;
    return val;
  }, z.date().optional()),
  notes: z.array(z.string()).optional().default([]),
  img_file: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return "";
      return val;
    },
    z.string().url("Image must be a valid URL").or(z.literal("")),
  ),
  recipe_link: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return "";
      return val;
    },
    z.string().url("Recipe must be a valid URL").or(z.literal("")),
  ),
  calories: z.number().int().nonnegative().optional(),
  protein: z.number().nonnegative().optional(),
  fat: z.number().nonnegative().optional(),
  carbs: z.number().nonnegative().optional(),
  userId: z.string().optional(),
});

export type MealFormData = z.infer<typeof mealFormSchema>;
