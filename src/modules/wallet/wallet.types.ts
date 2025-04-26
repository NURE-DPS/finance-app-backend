import { z } from 'zod';

const CREATE_WALLET_SCHEMA = z.object({
  userId: z.string(),
  name: z.string(),
  currency: z.string(),
  balance: z.number(),
});

type CREATE_WALLET_SCHEMA_TYPE = z.infer<typeof CREATE_WALLET_SCHEMA>;

export { CREATE_WALLET_SCHEMA, CREATE_WALLET_SCHEMA_TYPE };
