import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-brand-700">
          ManifestAI
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">
            Preços
          </Link>
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost">Sair</Button>
            </form>
          ) : (
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
