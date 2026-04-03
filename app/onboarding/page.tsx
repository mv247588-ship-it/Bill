import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

async function onboardingAction(formData: FormData) {
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

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Vamos definir seu primeiro objetivo</h1>
      <form action={onboardingAction} className="space-y-3">
        <Input name="title" placeholder="Ex.: Melhorar minha renda mensal" required />
        <Textarea name="description" placeholder="Descreva o que você quer manifestar e por quê" required rows={5} />
        <Button>Salvar e continuar</Button>
      </form>
    </div>
  );
}
