const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client singleton
const prisma = new PrismaClient();

module.exports = prisma;
