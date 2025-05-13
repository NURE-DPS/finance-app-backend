import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { verifyAuth } from '../auth/auth.middleware';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

const router = Router();
const repository = new CategoryRepository();
const service = new CategoryService(repository);
const controller = new CategoryController(service);

router.get('/', verifyAuth, asyncHandler(controller.findAll));

export { router as categoriesRoutes };
