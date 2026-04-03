import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function PricingPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-center text-3xl font-bold">Planos do ManifestAI</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mb-4 text-slate-600">Para começar sua transformação.</p>
          <ul className="mb-4 list-disc pl-5 text-sm text-slate-600">
            <li>1 objetivo ativo</li>
            <li>Diário básico</li>
            <li>3 gerações de IA por semana</li>
          </ul>
          <Button variant="outline" className="w-full" disabled>
            Plano atual
          </Button>
        </Card>
        <Card className="border-brand-500">
          <h2 className="text-xl font-semibold">Premium</h2>
          <p className="mb-4 text-slate-600">Acesso completo ao coach e insights.</p>
          <ul className="mb-4 list-disc pl-5 text-sm text-slate-600">
            <li>Objetivos ilimitados</li>
            <li>Coach com IA ilimitado</li>
            <li>Insights avançados</li>
          </ul>
          <form action="/api/stripe/checkout" method="post">
            <Button className="w-full" disabled={!session?.user}>
              {session?.user ? "Assinar Premium" : "Faça login para assinar"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
