import { z } from 'zod';

export const CREATE_TRANSACTION_SCHEMA = z.object({
  walletId: z.string(),
  categoryId: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number(),
  currency: z.string(),
  description: z.string().optional(),
});

export type CREATE_TRANSACTION_SCHEMA_TYPE = z.infer<
  typeof CREATE_TRANSACTION_SCHEMA
>;
