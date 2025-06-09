import { z } from "zod";

export const mealFormSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  tags: z.array(z.string()).optional(),
  lastMade: z.coerce.date().optional(),
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

export type MealFormData = z.output<typeof mealFormSchema>;
