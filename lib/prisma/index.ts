// Re-export everything from @prisma/client
export * from "@prisma/client";

// Export the prisma instance from lib/prisma.ts
import prisma from "@/lib/prisma";
export default prisma;
