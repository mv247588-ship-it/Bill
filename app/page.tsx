import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">ManifestAI: clareza, ação e evolução diária</h1>
        <p className="mx-auto max-w-2xl text-slate-600">
          Defina objetivos, gere afirmações com IA, acompanhe sua rotina e evolua com insights personalizados.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/onboarding">
            <Button size="lg">Começar agora</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              Ver planos
            </Button>
          </Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card><h3 className="font-semibold">Objetivos inteligentes</h3></Card>
        <Card><h3 className="font-semibold">Coach com IA</h3></Card>
        <Card><h3 className="font-semibold">Insights semanais</h3></Card>
      </section>
    </div>
  );
}
