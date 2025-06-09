import { describe, it, expect } from "vitest";
import { mealFormSchema } from "@/lib/validators/mealSchema";

describe("mealFormSchema", () => {
  it("validates a fully populated valid meal", () => {
    const result = mealFormSchema.safeParse({
      name: "Spaghetti Bolognese",
      tags: ["dinner", "italian"],
      lastMade: "2024-06-01T12:00:00Z",
      notes: ["Use fresh basil", "Simmer sauce for 2 hours"],
      img_file: "https://example.com/image.jpg",
      recipe_link: "https://example.com/recipe",
      userId: "user_123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lastMade).toBeInstanceOf(Date);
    }
  });

  it("fails when name is missing", () => {
    const result = mealFormSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("fails when name is an empty string", () => {
    const result = mealFormSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL for img_file", () => {
    const result = mealFormSchema.safeParse({
      name: "Pancakes",
      img_file: "not-a-valid-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-array for tags", () => {
    const result = mealFormSchema.safeParse({
      name: "Soup",
      tags: "vegetarian",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-string values in notes", () => {
    const result = mealFormSchema.safeParse({
      name: "Stew",
      notes: [42, "Cook on low"],
    });
    expect(result.success).toBe(false);
  });
});
