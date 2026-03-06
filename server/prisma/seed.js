const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'carlos@motoxcult.com' },
    update: {},
    create: {
      email: 'carlos@motoxcult.com',
      password: 'hashedpassword', // Change in real app
      name: 'Carlos R.',
      nickname: 'El Aventurero',
      location: 'Medellín, Colombia',
      karma: 450,
      bikes: {
        create: [
          { brand: 'BMW', model: 'R1250GS', year: 2023, photo: '/assets/garage-bg.jpg' },
          { brand: 'Harley Davidson', model: 'Iron 883', year: 2018, photo: '/assets/ride-map.jpg' }
        ]
      }
    },
  });
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
