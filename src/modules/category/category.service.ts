import { CategoryRepository } from './category.repository';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories() {
    return this.categoryRepository.findAll();
  }
}
