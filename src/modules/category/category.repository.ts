import prisma from '../../config/prismaClient';

export class CategoryRepository {
  async findAll() {
    return await prisma.category.findMany();
  }
}
