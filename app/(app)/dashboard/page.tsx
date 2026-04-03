import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

async function createGoal(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await prisma.goal.create({
    data: {
      userId: session.user.id,
      title: String(formData.get("title")),
      description: String(formData.get("description"))
    }
  });
  redirect("/dashboard");
}

async function createJournal(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await prisma.journalEntry.create({
    data: {
      userId: session.user.id,
      mood: String(formData.get("mood")),
      content: String(formData.get("content"))
    }
  });
  redirect("/dashboard");
}

async function runAI(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const goal = String(formData.get("goal"));
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal })
  });

  redirect("/dashboard");
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [goals, journals, routines, affirmations] = await Promise.all([
    prisma.goal.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } }),
    prisma.journalEntry.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.routine.findMany({ where: { userId: session.user.id, isActive: true }, orderBy: { order: "asc" } }),
    prisma.affirmation.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 4 })
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Seu Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Objetivos</p><p className="text-2xl font-bold">{goals.length}</p></Card>
        <Card><p className="text-sm text-slate-500">Rotinas ativas</p><p className="text-2xl font-bold">{routines.length}</p></Card>
        <Card><p className="text-sm text-slate-500">Entradas no diário</p><p className="text-2xl font-bold">{journals.length}</p></Card>
        <Card><p className="text-sm text-slate-500">Afirmações</p><p className="text-2xl font-bold">{affirmations.length}</p></Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Novo objetivo</h2>
          <form action={createGoal} className="space-y-2">
            <Input name="title" placeholder="Título" required />
            <Textarea name="description" placeholder="Descrição" required />
            <Button>Salvar objetivo</Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-semibold">Novo registro no diário</h2>
          <form action={createJournal} className="space-y-2">
            <Input name="mood" placeholder="Como você está se sentindo?" required />
            <Textarea name="content" placeholder="Escreva sua reflexão" required />
            <Button>Salvar diário</Button>
          </form>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Coach IA</h2>
        <form action={runAI} className="flex gap-2">
          <Input name="goal" placeholder="Digite um objetivo para refinamento" required />
          <Button type="submit">Gerar</Button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">Objetivos recentes</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {goals.length === 0 ? <li>Nenhum objetivo criado.</li> : goals.map((g) => <li key={g.id}>• {g.title}</li>)}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Diário recente</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {journals.length === 0 ? <li>Nenhuma entrada.</li> : journals.map((j) => <li key={j.id}>• {j.mood}: {j.content.slice(0, 70)}...</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
}
