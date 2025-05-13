import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import type { Response } from 'express';
import { CategoryService } from './category.service';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  findAll = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.categoryService.getAllCategories();

    return res.status(200).json(result);
  };
}
