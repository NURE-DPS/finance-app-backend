import { z } from 'zod';

const SIGNUP_SCHEMA = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(1),
});

type SIGNUP_SCHEMA_TYPE = z.infer<typeof SIGNUP_SCHEMA>;

export { SIGNUP_SCHEMA };
export type { SIGNUP_SCHEMA_TYPE };
