import { describe, it, expect } from "vitest";
import { signupFormSchema } from "../../../lib/validators/signupSchema";

describe("signupSchema", () => {
  it("validates correct input", () => {
    const result = signupFormSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirm: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("fails if passwords do not match", () => {
    const result = signupFormSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirm: "wrongpassword",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().confirm?._errors[0]).toBe(
        "The passwords do not match",
      );
    }
  });
});
