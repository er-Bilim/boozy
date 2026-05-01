import z from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants';

export const schemaCreateCocktail = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Name must be at least 1 characters long!')
    .max(55, 'Name must be at most 55 characters long!'),
  recipe: z
    .string()
    .trim()
    .min(1, 'Recipe must be at least 1 characters long!')
    .max(500, 'recipe must be at most 200 characters long!'),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, 'Name must be at least 1 characters long!'),

        amount: z
          .string()
          .min(1, 'Amount must be at least 1 characters long!')
          .regex(/^\d+$/, 'Only numbers are allowed'),
      }),
    )
    .min(1, 'min 1 ingredient'),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max image size is 10MB 🫠')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported 😶',
    )
    .optional()
    .nullable(),
});

export type CreateCocktailFormData = z.infer<typeof schemaCreateCocktail>;
