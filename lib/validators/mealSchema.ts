import { z } from "zod";

export const mealFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Meal name is required"),
  tags: z.array(z.string()).optional(),
  lastMade: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    if (typeof val === "string") return new Date(val);
    return val;
  }, z.date().optional()),
  notes: z.array(z.string()).optional(),
  img_file: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
  recipe_link: z
    .string()
    .url("Recipe must be a valid URL")
    .optional()
    .or(z.literal("")),
  userId: z.string().optional(),
});

export type MealFormData = z.infer<typeof mealFormSchema>;
