import { z } from 'zod';

export const articleFormSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(500, 'Title must not exceed 500 characters'),

  description: z.string().optional(),

  content: z.string().optional(),

  url: z.string().url('Must be a valid URL'),

  imageUrl: z.string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),

  source: z.string().optional(),

  author: z.string().optional(),

  category: z.enum([
    'business',
    'technology',
    'sports',
    'entertainment',
    'health',
    'science'
  ]),

  publishedAt: z.string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Must be a valid date',
    }),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
