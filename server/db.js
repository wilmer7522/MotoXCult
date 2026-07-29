const { PrismaClient } = require('@prisma/client');
const { PrismaD1 } = require('@prisma/adapter-d1');

let prismaInstance = null;

function initPrisma(env) {
  if (env && env.motoxcult_db) {
    const adapter = new PrismaD1(env.motoxcult_db);
    prismaInstance = new PrismaClient({ adapter });
  } else if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

function getPrisma() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

module.exports = { initPrisma, getPrisma };
