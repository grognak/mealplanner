import { z } from "zod";

export const loginSchema = z.object({
  usernameEmail: z
    .string()
    .min(1, { message: "You must enter your username or email" }),
  password: z.string().min(1, { message: "You must enter your passowrd" }),
});
