import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateManifestContent(input: {
  goal: string;
  limitingBelief?: string;
}) {
  const prompt = `Você é um coach de manifestação em pt-BR. Gere JSON com campos: refinedGoal, primaryAffirmation, secondaryAffirmations (array de 3), dailyRoutine (array de 5), limitingBeliefRewrite. Objetivo: ${input.goal}. Crença limitante: ${input.limitingBelief ?? "não informada"}.`;

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(result.choices[0]?.message?.content ?? "{}");
}
