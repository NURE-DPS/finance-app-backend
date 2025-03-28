import { User } from '@prisma/client';
import { SIGNUP_SCHEMA, SIGNUP_SCHEMA_TYPE } from './user.types';
import prisma from '@src/config/prismaClient';

export class UserRepository {
  async createOne(data: SIGNUP_SCHEMA_TYPE): Promise<User> {
    return await prisma.user.create({data});
  }
}
