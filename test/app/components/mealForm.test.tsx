import { render, screen, fireEvent } from "@testing-library/react";
import MealFormComponent from "@/components/MealForm";
import { vi } from "vitest";

const mockMeal = {
  id: "",
  name: "",
  tags: [],
  notes: [],
  img_file: "",
  recipe_link: "",
  userId: "test-user",
  lastMade: undefined,
};

test("submits valid form", async () => {
  const onSubmit = vi.fn();
  render(<MealFormComponent meal={mockMeal} onSubmit={onSubmit} />);

  const nameInput = screen.getByLabelText(/meal name/i);
  fireEvent.change(nameInput, { target: { value: "Pizza" } });

  fireEvent.click(screen.getByRole("button", { name: /submit/i }));

  await screen.findByDisplayValue("Pizza");

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ name: "Pizza" }),
  );
});
