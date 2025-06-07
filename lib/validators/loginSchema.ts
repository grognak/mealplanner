import { z } from "zod";

export const loginFormSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "You must enter your username or email" }),
  password: z.string().min(1, { message: "You must enter your passowrd" }),
});
