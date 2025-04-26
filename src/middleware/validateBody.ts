import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, z, ZodError } from 'zod';

export function validateBody(schema: z.Schema<any>) {
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