import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (!dbUser || !dbUser.passwordHash) return null;

        const valid = await compare(password, dbUser.passwordHash);
        if (!valid) return null;

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;
      return session;
    }
  },
  pages: { signIn: "/login" }
});

export async function registerUser(payload: { email: string; password: string; name?: string }) {
  const passwordHash = await hash(payload.password, 10);
  return prisma.user.create({
    data: {
      email: payload.email.toLowerCase(),
      name: payload.name,
      passwordHash
    }
  });
}
