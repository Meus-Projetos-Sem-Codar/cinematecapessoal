import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineList — Entre na sua coleção" },
      { name: "description", content: "Gerencie sua lista de filmes para assistir." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    navigate({ to: "/movies" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Sua cinemateca pessoal
          </div>
          <h1 className="font-display text-6xl font-bold leading-[1.05] tracking-tight text-foreground">
            Toda história
            <br />
            que você quer
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              assistir.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Organize sua watchlist, marque o que já viu e dê suas notas. Cinema sob seus próprios termos.
          </p>
        </div>

        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl">
            <div className="mb-8 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Film className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">CineList</span>
            </div>

            <h2 className="font-display text-2xl font-semibold text-foreground">
              {mode === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login" ? "Entre para acessar sua lista." : "Comece a montar sua watchlist."}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="h-11 w-full bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:bg-primary/90"
              >
                {mode === "login" ? "Entrar" : "Criar conta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {mode === "login" ? "Criar conta" : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
