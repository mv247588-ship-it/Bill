import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { routineProgressSchema } from "@/lib/schemas";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const routines = await prisma.routine.findMany({
    where: { userId: session.user.id, isActive: true },
    include: { progress: { orderBy: { date: "desc" }, take: 7 } },
    orderBy: { order: "asc" }
  });
  return NextResponse.json(routines);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { routineId, completed } = routineProgressSchema.parse(await request.json());
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const progress = await prisma.routineProgress.upsert({
    where: { routineId_date: { routineId, date } },
    update: { completed },
    create: { routineId, userId: session.user.id, date, completed }
  });

  return NextResponse.json(progress);
}
