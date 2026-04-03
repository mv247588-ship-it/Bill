import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const entry = await prisma.journalEntry.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!entry) return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });

  await prisma.journalEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
