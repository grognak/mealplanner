import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupPage from "../../../app/signup/page";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    }),
  ) as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SignupForm", () => {
  it("displays validation errors when submitting empty form", async () => {
    render(<SignupPage />);

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByText(/must be at least/)).toHaveLength(2);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
