import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Token on server: ", token);
    if (!token?.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const meals = await prisma.meal.findMany({
      where: {
        userId: String(token.id),
      },
    });

    return new Response(JSON.stringify(meals), { status: 200 });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const newMeal = await prisma.meal.create({
    data: {
      name: body.name,
      tags: body.tags,
      lastMade: body.lastMade,
      notes: body.notes,
      img_file: body.img_file,
      recipe_link: body.recipe_link,
      userId: String(token.id),
    },
  });

  return new Response(JSON.stringify(newMeal), { status: 201 });
}
