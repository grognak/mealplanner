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
      calories: 360,
      protein: 22,
      fat: 9,
      carbs: 59,
    },
    {
      name: "Bagel & Cream Cheese",
      tags: ["breakfast", "vegetarian", "quick"],
      notes: ["Use a variety of different bagel and cream cheese combos."],
      calories: 386,
      protein: 12,
      fat: 12,
      carbs: 54,
    },
    {
      name: "Egg Scramble",
      tags: ["breakfast"],
      notes: [
        "Usually use a chicken sausage with peppers, onions, and whatever shredded cheese is on hand.",
      ],
      calories: 540,
      protein: 37,
      fat: 34,
      carbs: 18,
    },
    {
      name: "PB&J",
      tags: ["quick"],
      notes: [],
      calories: 380,
    },
    {
      name: "Lomo Saltado",
      tags: ["mexican", "steak", "stir-fry"],
      notes: ["Goes well with pico de gallo"],
      calories: 652,
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
        calories: meal.calories,
        fat: meal.fat,
        protein: meal.protein,
        carbs: meal.carbs,
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
