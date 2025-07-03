import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Add this output configuration to ensure the query engine is properly bundled
    // This is needed for Vercel deployment
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
