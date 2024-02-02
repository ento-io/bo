import { z } from "zod";

const passwordFieldSchema = z.string()
  .min(6, { message: 'Password should be 6 characters minimum' });

const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  firstName: z.string().min(1, { message: 'Title required' }),
  lastName: z.string().max(500, { message: 'The content should be 500 characters max' }),
  password: passwordFieldSchema,
});

export const signUpSchema = userSchema.extend({
  passwordConfirmation: passwordFieldSchema
}).refine((value: any) => value.password === value.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

export const loginSchema = userSchema.pick({ email: true, password: true });