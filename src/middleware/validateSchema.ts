import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import { AnyZodObject, ZodError } from 'zod';

export function validateSchema(schema: z.Schema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error.format());
      return;
    }
    req.body = parsed.data;
    next();
  };
}
