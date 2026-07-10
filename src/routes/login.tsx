import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message ?? "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", padding: 24, fontFamily: "Segoe UI, Arial, sans-serif" }}>
      <h1 style={{ fontSize: 22, color: "#1a3a5c", marginBottom: 20 }}>
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, border: "1px solid #e2e5ea", borderRadius: 6 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ padding: 10, border: "1px solid #e2e5ea", borderRadius: 6 }}
        />
        {error && <div style={{ color: "#c0392b", fontSize: 13 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, background: "#1a3a5c", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        style={{ marginTop: 14, background: "none", border: "none", color: "#2d5f8f", cursor: "pointer", fontSize: 13 }}
      >
        {mode === "login" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
      </button>
    </div>
  );
}