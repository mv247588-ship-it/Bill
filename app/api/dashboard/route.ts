import { NextResponse } from "next/server";
import { subDays } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const today = new Date();
  const weekAgo = subDays(today, 7);

  const [goalCount, journalWeek, routineWeek] = await Promise.all([
    prisma.goal.count({ where: { userId: session.user.id, status: "ACTIVE" } }),
    prisma.journalEntry.findMany({ where: { userId: session.user.id, createdAt: { gte: weekAgo } } }),
    prisma.routineProgress.count({ where: { userId: session.user.id, completed: true, date: { gte: weekAgo } } })
  ]);

  const moods = journalWeek.reduce<Record<string, number>>((acc, item) => {
    acc[item.mood] = (acc[item.mood] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    streak: routineWeek,
    activeGoals: goalCount,
    journalEntriesWeek: journalWeek.length,
    topMoods: moods,
    insight:
      routineWeek >= 5
        ? "Ótima consistência! Você manteve uma frequência alta na rotina."
        : "Aumente sua consistência diária para acelerar seus resultados."
  });
}
