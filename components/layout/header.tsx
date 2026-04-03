import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-brand-700">
          ManifestAI
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">
            Preços
          </Link>
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">
            Entrar
          </Link>
          <Link href="/login">
            <Button size="sm">Começar grátis</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
