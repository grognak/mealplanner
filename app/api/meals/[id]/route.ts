import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

type Context = { params: { id: string } };

export async function PATCH(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.meal.findUnique({
      where: { id },
      select: { userId: true, img_public_id: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Meal not found" }, { status: 404 });
    }
    if (existing.userId !== token.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    if (
      body.img_public_id &&
      body.img_public_id !== existing.img_public_id &&
      typeof existing.img_public_id === "string"
    ) {
      try {
        await cloudinary.uploader.destroy(existing.img_public_id);
      } catch (err) {
        console.error("Cloudinary delete failed", err);
        // Not fatal – keep going
      }
    }

    const { name, tags, notes, img_url, img_public_id, recipe_link, lastMade } =
      body as {
        name?: string;
        tags?: string[];
        notes?: string[];
        img_url?: string;
        img_public_id?: string;
        recipe_link?: string;
        lastMade?: Date | null;
      };

    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: {
        name,
        tags,
        notes,
        img_file: img_url,
        img_public_id,
        recipe_link,
        lastMade,
      },
    });

    return NextResponse.json(updatedMeal, { status: 200 });
  } catch (err) {
    console.error("Error updating meal:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    const existingMeal = await prisma.meal.findUnique({
      where: { id },
      select: { img_public_id: true },
    });

    if (!existingMeal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    if (existingMeal.img_public_id) {
      try {
        await cloudinary.uploader.destroy(existingMeal.img_public_id);
      } catch (err) {
        console.error("Faied to delete image from Cloudinary", err);
        // Not fatal - proceed with deleting the meal anyway
      }
    }

    await prisma.meal.delete({ where: { id } });

    return NextResponse.json(
      { message: "Meal deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Failed to delete meal", err);
    return NextResponse.json(
      { message: "Failed to delete meal" },
      { status: 500 },
    );
  }
}
