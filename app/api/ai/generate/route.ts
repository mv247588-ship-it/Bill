import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateManifestContent } from "@/lib/openai";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = (await request.json()) as { goal: string; limitingBelief?: string; goalId?: string };
    const content = await generateManifestContent({ goal: body.goal, limitingBelief: body.limitingBelief });

    await prisma.aiMessage.create({
      data: {
        userId: session.user.id,
        goalId: body.goalId,
        type: "manifest_generation",
        prompt: JSON.stringify(body),
        response: JSON.stringify(content)
      }
    });

    if (content.primaryAffirmation) {
      await prisma.affirmation.create({
        data: {
          userId: session.user.id,
          goalId: body.goalId,
          content: content.primaryAffirmation,
          primary: true
        }
      });
    }

    if (Array.isArray(content.secondaryAffirmations)) {
      await prisma.affirmation.createMany({
        data: content.secondaryAffirmations.map((item: string) => ({
          userId: session.user.id,
          goalId: body.goalId,
          content: item,
          primary: false
        }))
      });
    }

    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Falha ao gerar conteúdo de IA" }, { status: 500 });
  }
}
