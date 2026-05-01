import z from 'zod';

export const schemaLogin = z.object({
  email: z
    .string()
    .trim()
    .min(5, { message: 'Email must be at least 5 characters long!' })
    .max(45, { message: 'Username must be at most 45 characters long!' })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email address'),
  password: z
    .string()
    .trim()
    .min(3, { message: 'Password must be at least 3 characters long!' })
    .max(32, { message: 'Password must be at most 32 characters long!' }),
});

export type LoginFormData = z.infer<typeof schemaLogin>;
