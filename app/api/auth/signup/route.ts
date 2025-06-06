import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    });

    return new Response(JSON.stringify({ user }), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `User already exists: ${err}` }),
      {
        status: 400,
      },
    );
  }
}
