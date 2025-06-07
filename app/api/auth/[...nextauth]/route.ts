import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";

// Extend the Session type to include 'id' on user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { identifier, password } = credentials ?? {};

          if (!identifier || !password) {
            throw new Error("Missing credentials");
          }

          const user = await prisma.user.findFirst({
            where: {
              OR: [{ email: identifier }, { username: identifier }],
            },
          });

          if (!user) throw new Error("No user found");

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) throw new Error("Invalid password");

          return { id: user.id, name: user.username, email: user.email };
        } catch (err) {
          console.error("Authorization error: ", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = String(token.id);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
