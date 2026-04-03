import { redirect } from "next/navigation";
import { auth, registerUser, signIn } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

async function loginAction(formData: FormData) {
  "use server";
  await signIn("credentials", {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    redirectTo: "/dashboard"
  });
}

async function registerAction(formData: FormData) {
  "use server";
  await registerUser({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    name: String(formData.get("name") ?? "")
  });
  await signIn("credentials", {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    redirectTo: "/onboarding"
  });
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-xl font-semibold">Entrar</h2>
        <form action={loginAction} className="space-y-3">
          <Input name="email" type="email" placeholder="seu@email.com" required />
          <Input name="password" type="password" placeholder="Sua senha" required />
          <Button className="w-full">Entrar</Button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-4 text-xl font-semibold">Criar conta</h2>
        <form action={registerAction} className="space-y-3">
          <Input name="name" placeholder="Seu nome" required />
          <Input name="email" type="email" placeholder="seu@email.com" required />
          <Input name="password" type="password" placeholder="Mínimo 8 caracteres" minLength={8} required />
          <Button className="w-full">Começar grátis</Button>
        </form>
      </Card>
    </div>
  );
}
