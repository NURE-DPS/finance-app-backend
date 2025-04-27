import { z } from 'zod';

const CREATE_USER_SCHEMA = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(1),
});

type CREATE_USER_SCHEMA_TYPE = z.infer<typeof CREATE_USER_SCHEMA>;

export { CREATE_USER_SCHEMA };
export type { CREATE_USER_SCHEMA_TYPE };
