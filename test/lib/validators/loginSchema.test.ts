import { describe, it, expect } from "vitest";
import { loginFormSchema } from "../../../lib/validators/loginSchema";

describe("signupSchema", () => {
  it("validates correct input", () => {
    const result = loginFormSchema.safeParse({
      usernameEmail: "testuser",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });
});
