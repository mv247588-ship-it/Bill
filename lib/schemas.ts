import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  description: z.string().min(10, "Descreva melhor seu objetivo")
});

export const journalSchema = z.object({
  mood: z.string().min(2),
  content: z.string().min(10)
});

export const routineProgressSchema = z.object({
  routineId: z.string().cuid(),
  completed: z.boolean()
});
