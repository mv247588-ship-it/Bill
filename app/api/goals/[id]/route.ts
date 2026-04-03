import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const goal = await prisma.goal.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!goal) return NextResponse.json({ error: "Objetivo não encontrado" }, { status: 404 });

  const data = (await request.json()) as { title?: string; description?: string; archived?: boolean };

  const updated = await prisma.goal.update({
    where: { id: params.id },
    data: {
      title: data.title,
      description: data.description,
      status: data.archived ? "ARCHIVED" : undefined,
      archivedAt: data.archived ? new Date() : null
    }
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const goal = await prisma.goal.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!goal) return NextResponse.json({ error: "Objetivo não encontrado" }, { status: 404 });

  await prisma.goal.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
