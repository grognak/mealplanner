import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { vi } from "vitest";
import { signIn } from "next-auth/react";

vi.mock("next-auth/react");

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(),
    }),
  };
});

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

describe("LoginPage", () => {
  it("renders form fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByRole("button", { name: "" }); // eye icon has no accessible name
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("calls signIn with correct values", async () => {
    const mockSignIn = signIn as jest.Mock;
    mockSignIn.mockResolvedValue({ ok: true });

    render(<LoginPage />);
    fireEvent.input(screen.getByPlaceholderText(/username or email/i), {
      target: { value: "testuser" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({
          identifier: "testuser",
          password: "password123",
        }),
      ),
    );
  });
});
