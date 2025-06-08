import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.meal.deleteMany();

  const user1_passwordHash = await bcrypt.hash("password", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "test@user.com",
      username: "TestUser",
      passwordHash: user1_passwordHash,
    },
  });

  const mealData = [
    {
      name: "Berry Smoothie",
      tags: ["breakfast", "vegetarian", "quick"],
      notes: [
        "Use a variety of different berry combos; frozen berry medley, frozen super medley (with cherries), or whatever fresh berries are on hand).",
      ],
    },
    {
      name: "Bagel & Cream Cheese",
      tags: ["breakfast", "vegetarian", "quick"],
      notes: ["Use a variety of different bagel and cream cheese combos."],
    },
    {
      name: "Egg Scramble",
      tags: ["breakfast"],
      notes: [
        "Usually use a chicken sausage with peppers, onions, and whatever shredded cheese is on hand.",
      ],
    },
    {
      name: "PB&J",
      tags: ["quick"],
      notes: [],
    },
    {
      name: "Lomo Saltado",
      tags: ["mexican", "steak", "stir-fry"],
      notes: ["Goes well with pico de gallo"],
    },
    {
      name: "Pico de Gallo",
      tags: ["mexican", "vegetarian", "side"],
      notes: [],
    },
    {
      name: "Homemade Pizza",
      tags: ["italian", "long prep", "pizza"],
      notes: [],
    },
    {
      name: "Beef Stew",
      tags: ["comfort food"],
      notes: [],
    },
  ];

  for (const meal of mealData) {
    await prisma.meal.create({
      data: {
        userId: user1.id,
        name: meal.name,
        tags: meal.tags,
        notes: meal.notes,
      },
    });
  }

  console.log("Seed successful");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
