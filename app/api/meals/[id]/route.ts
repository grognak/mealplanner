import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = await context.params;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();

  const updatedMeal = await prisma.meal.update({
    where: {
      id,
      userId: token.id,
    },
    data: body,
  });

  return new Response(JSON.stringify(updatedMeal), { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const meal = await prisma.meal.findFirst({
      where: {
        id: params.id,
        userId: token.id,
      },
    });

    if (!meal) {
      return new Response("Meal not found", { status: 404 });
    }

    await prisma.meal.delete({
      where: { id: params.id },
    });

    return new Response("Meal deleted", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}
