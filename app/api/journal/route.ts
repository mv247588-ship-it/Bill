import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { journalSchema } from "@/lib/schemas";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const url = new URL(request.url);
  const mood = url.searchParams.get("mood");

  const entries = await prisma.journalEntry.findMany({
    where: { userId: session.user.id, ...(mood ? { mood } : {}) },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const data = journalSchema.parse(await request.json());
  const entry = await prisma.journalEntry.create({ data: { ...data, userId: session.user.id } });
  return NextResponse.json(entry, { status: 201 });
}
