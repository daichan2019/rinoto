import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  }

  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  return global.prisma;
}

const prismaClient = createPrismaClient();

export default prismaClient;
