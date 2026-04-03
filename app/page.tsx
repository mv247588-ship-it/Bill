import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Onboarding guiado",
    description: "Ative novos usuários com uma experiência simples e rápida."
  },
  {
    title: "Assistente com IA",
    description: "Gere planos de ação, rotinas e acompanhamento personalizado."
  },
  {
    title: "Cobrança recorrente",
    description: "Monetize com Stripe e evolua seu produto por assinatura."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-8">
      <section className="space-y-5 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-center text-white md:px-12">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">Seu SaaS pronto para lançar</h1>
        <p className="mx-auto max-w-2xl text-brand-100">
          Landing page, autenticação, dashboard e pagamentos em uma base moderna com Next.js.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg" variant="outline">Entrar / Criar conta</Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-slate-100">Ver planos</Button>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-center text-3xl font-bold tracking-tight">Recursos principais</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="space-y-2">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center md:p-8">
        <h2 className="text-2xl font-bold">Acesse agora</h2>
        <p className="mt-2 text-slate-600">Use o usuário de demonstração para entrar rapidamente.</p>
        <p className="mt-2 text-sm font-medium text-slate-700">demo@manifestai.com • 12345678</p>
      </section>
    </div>
  );
}
