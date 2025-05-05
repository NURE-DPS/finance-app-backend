import type { Request, Response, NextFunction } from 'express';

export const asyncHandler =
  <Req extends Request = Request, Res extends Response = Response>(
    fn: (req: Req, res: Res, next: NextFunction) => Promise<any>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    return (fn as any)(req, res, next).catch(next);
  };
