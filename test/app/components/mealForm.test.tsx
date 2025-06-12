import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  await userEvent.type(nameInput, "Pizza");

  const submitButton = await screen.findByRole("button", { name: /submit/i });
  await userEvent.click(submitButton);

  await screen.findByDisplayValue("Pizza");

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ name: "Pizza" }),
  );
});
