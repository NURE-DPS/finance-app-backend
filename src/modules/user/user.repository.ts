import type { User } from '@prisma/client';
import { CREATE_USER_SCHEMA_TYPE } from './user.types';
import prisma from '../../config/prismaClient';

export class UserRepository {
  async createOne(data: {
    name: string;
    id: string;
    email: string;
  }): Promise<User> {
    return await prisma.user.create({ data });
  }

  async findOne(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
