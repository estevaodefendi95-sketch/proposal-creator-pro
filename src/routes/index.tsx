import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listProposals, createProposal } from "@/lib/proposals";

export const Route = createFileRoute("/")({
  component: ProposalsList,
});

const BLANK_HTML = `<h1 data-editable>Proposta Comercial</h1><p data-editable>Clique em editar para começar a preencher o conteúdo desta proposta.</p>`;

function ProposalsList() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(undefined);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) navigate({ to: "/login" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) navigate({ to: "/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;
    listProposals()
      .then(setProposals)
      .finally(() => setLoading(false));
  }, [session]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const proposal = await createProposal("[Nome do Cliente]", BLANK_HTML);
      navigate({ to: "/propostas/$id/editar", params: { id: proposal.id } });
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  const handleCopyLink = (token: string, id: string) => {
    const url = `${window.location.origin}/p/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!session) return null;

  return (
    <div style={{ maxWidth: 860, margin: "40px auto", padding: "0 20px", fontFamily: "Segoe UI, Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, color: "#1a3a5c" }}>Propostas</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleCreate} disabled={creating} style={btnStyle}>
            {creating ? "Criando..." : "+ Nova proposta"}
          </button>
          <button onClick={handleLogout} style={{ ...btnStyle, background: "transparent", color: "#6b7280", border: "1px solid #e2e5ea" }}>
            Sair
          </button>
        </div>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : proposals.length === 0 ? (
        <p style={{ color: "#6b7280" }}>Nenhuma proposta ainda. Clique em "+ Nova proposta" para criar a primeira.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {proposals.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                border: "1px solid #e2e5ea",
                borderRadius: 8,
                background: "white",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: "#1a3a5c" }}>{p.client_name || "(sem nome)"}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {p.status} · atualizado em {new Date(p.updated_at).toLocaleString("pt-BR")}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link to="/propostas/$id/editar" params={{ id: p.id }} style={linkBtnStyle}>
                  Editar
                </Link>
                <button onClick={() => handleCopyLink(p.share_token, p.id)} style={{ ...linkBtnStyle, background: "transparent", color: "#2d5f8f", border: "1px solid #2d5f8f", cursor: "pointer" }}>
                  {copiedId === p.id ? "✓ Copiado!" : "🔗 Copiar link"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "#1a3a5c",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const linkBtnStyle: React.CSSProperties = {
  background: "#1a3a5c",
  color: "white",
  padding: "8px 14px",
  borderRadius: 6,
  fontSize: 12,
  textDecoration: "none",
  fontWeight: 600,
  border: "none",
};