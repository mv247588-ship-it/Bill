import { PrismaClient, GoalStatus, SubscriptionStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("12345678", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@manifestai.com" },
    update: {},
    create: {
      email: "demo@manifestai.com",
      name: "Usuário Demo",
      passwordHash,
      goals: {
        create: [
          {
            title: "Lançar meu produto digital",
            description: "Estruturar e lançar um produto digital em 90 dias",
            status: GoalStatus.ACTIVE
          }
        ]
      },
      journalEntries: {
        create: [
          { mood: "Motivado", content: "Hoje dei um passo importante para validar minha ideia." }
        ]
      },
      subscriptions: {
        create: [{ status: SubscriptionStatus.FREE }]
      }
    },
    include: { goals: true }
  });

  await prisma.affirmation.createMany({
    data: [
      {
        userId: user.id,
        goalId: user.goals[0]?.id,
        content: "Eu ajo com clareza e consistência para manifestar meus objetivos.",
        primary: true
      },
      {
        userId: user.id,
        goalId: user.goals[0]?.id,
        content: "Minha disciplina diária me aproxima da vida que desejo.",
        primary: false
      }
    ]
  });

  console.log("Seed finalizada. Login demo@manifestai.com / 12345678");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
