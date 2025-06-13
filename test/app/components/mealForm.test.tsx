import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MealFormComponent from "@/components/MealForm";

const mockMeal = {
  id: "1",
  name: "Test Meal",
  tags: ["dinner"],
  lastMade: undefined,
  notes: [],
  img_file: "",
  recipe_link: "",
  userId: "user1",
  img_public_id: "",
};

describe("MealFormComponent", () => {
  let onSubmit: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    onSubmit = vi.fn();
  });

  it("Handles ❌ button to remove image", async () => {
    render(
      <MealFormComponent
        meal={{ ...mockMeal, img_file: "data:image/png;base64,..." }}
        onSubmit={onSubmit}
      />,
    );

    const removeButton = await screen.findByLabelText(/remove image/i);
    fireEvent.click(removeButton);

    await waitFor(() => {
      const img = screen.queryByAltText("Meal preview");
      expect(img).not.toBeInTheDocument();
    });
  });
});
