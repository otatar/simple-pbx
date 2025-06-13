import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.classOfService.create({
    data: {
      name: "Extensions",
      cos: 0,
      createdBy: "system",
    },
  });

  await prisma.globalSettings.create({
    data: {
      ringTimeout: 40,
      maxCallDuration: 18000,
      createdBy: "system",
    },
  });
}

main()
  .then(async () => {
    console.log("Seeding completed.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
