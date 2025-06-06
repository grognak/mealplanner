import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupPage from "@/app/signup/page";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("SignupForm", () => {
  it("displays validation errors when submitting empty form", async () => {
    render(<SignupPage />);

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByText(/must be at least/)).toHaveLength(2);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it("submits successfully with valid input", async () => {
    const logSpy = vi.spyOn(console, "log");

    render(<SignupPage />);
    await userEvent.type(screen.getByPlaceholderText(/username/i), "testuser");
    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      "test@test.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText(/^password$/i),
      "password123",
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm/i),
      "password123",
    );
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(logSpy).toHaveBeenCalledWith({
      username: "testuser",
      email: "test@test.com",
      password: "password123",
      confirm: "password123",
    });

    logSpy.mockRestore();
  });
});
