import { z } from "zod";

export const signupFormSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters." })
      .max(50, { message: "Username must be less than 50 characters." }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "The password must be at least 8 characters." }),
    confirm: z.string().min(8),
  })
  .superRefine(({ confirm, password }, ctx) => {
    if (confirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ["confirm"],
      });
    }
  });
