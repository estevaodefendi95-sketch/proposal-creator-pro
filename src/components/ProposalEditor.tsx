import { useEffect, useRef, useState } from "react";
import "./proposal-editor.css";

const STORAGE_KEY = "nortyx.proposal.html.v1";

const DEFAULT_HTML = `
  <div class="header">
    <div class="logo">NORTYX<span>.</span></div>
    <div class="header-meta" data-editable>
      Consultoria Financeira e Soluções Digitais<br>
      Franca/SP · contato@nortyx.com.br<br>
      10 de julho de 2026
    </div>
  </div>

  <h1 data-editable>Proposta Comercial</h1>
  <div class="subtitle" data-editable>Sistema de Catálogo e Pedidos B2B com Gestão de Representantes — para [Nome do Cliente]</div>

  <div class="destaque-box">
    <p data-editable style="margin:0;">Desenvolvimento de plataforma web para catálogo digital de produtos, com fluxo de pedidos direcionado automaticamente ao representante responsável via WhatsApp, painel de gestão para representantes e visão consolidada para a matriz.</p>
  </div>

  <h2 data-editable>1. Escopo do Projeto</h2>
  <ul class="modulo-list">
    <li data-editable><b>Catálogo digital</b> — até 3.000 itens organizados por categoria, com busca, itens em destaque e área de promoções</li>
    <li data-editable><b>Carrinho de compras</b> — cliente monta o pedido e envia automaticamente para o WhatsApp do representante vinculado</li>
    <li data-editable><b>Histórico de compras</b> — área com os produtos mais comprados por cada cliente, para agilizar novos pedidos</li>
    <li data-editable><b>Estrutura de acesso em 3 níveis</b> — Matriz, Representante e Cliente, cada um com sua própria visão e permissões</li>
    <li data-editable><b>Cadastro de clientes pelo representante</b> — o representante cadastra seus próprios clientes, com vínculo automático</li>
    <li data-editable><b>Painel administrativo (Matriz)</b> — gestão de categorias, preços, promoções e destaques do catálogo; visão consolidada de todos os representantes e clientes</li>
    <li data-editable><b>Disparo de promoções via WhatsApp</b> — cada representante pode enviar mensagens promocionais ou personalizadas para sua própria carteira de clientes, com registro de envio</li>
  </ul>

  <h2 data-editable>2. Estrutura de Acesso</h2>
  <table>
    <thead>
      <tr><th>Perfil</th><th>Cadastro</th><th>Visão</th><th>Principais ações</th></tr>
    </thead>
    <tbody>
      <tr><td data-editable>Matriz</td><td data-editable>Administrador geral</td><td data-editable>Todos os representantes e clientes</td><td data-editable>Gestão do catálogo, preços e promoções; relatórios consolidados</td></tr>
      <tr><td data-editable>Representante</td><td data-editable>Cadastrado pela Matriz</td><td data-editable>Apenas seus próprios clientes</td><td data-editable>Cadastra clientes, recebe pedidos, dispara promoções</td></tr>
      <tr><td data-editable>Cliente</td><td data-editable>Cadastrado pelo Representante</td><td data-editable>Catálogo e histórico próprio</td><td data-editable>Monta e envia pedidos via WhatsApp</td></tr>
    </tbody>
  </table>

  <h2 data-editable>3. Cronograma Estimado — 6 a 8 semanas</h2>
  <div class="fase">
    <div class="fase-num">1</div>
    <div class="fase-content"><b data-editable>Semanas 1–2</b><span data-editable>Estrutura de banco de dados, autenticação e níveis de acesso, catálogo básico</span></div>
  </div>
  <div class="fase">
    <div class="fase-num">2</div>
    <div class="fase-content"><b data-editable>Semanas 3–4</b><span data-editable>Carrinho de compras com envio ao WhatsApp, histórico de compras, painel do representante</span></div>
  </div>
  <div class="fase">
    <div class="fase-num">3</div>
    <div class="fase-content"><b data-editable>Semanas 5–6</b><span data-editable>Cadastro de clientes pelo representante, integração de disparo via WhatsApp, testes de permissões</span></div>
  </div>
  <div class="fase">
    <div class="fase-num">4</div>
    <div class="fase-content"><b data-editable>Semanas 7–8</b><span data-editable>Painel da matriz com relatórios, ajustes finais, testes com o cliente e publicação</span></div>
  </div>

  <h2 data-editable>4. Tecnologia</h2>
  <p data-editable>Plataforma desenvolvida em React com banco de dados Supabase (PostgreSQL), garantindo segurança por níveis de acesso (RLS), performance para grande volume de itens e hospedagem em nuvem. O disparo de mensagens via WhatsApp é feito por integração com provedor especializado (API oficial ou parceiro homologado), com custo de mensageria repassado à parte, conforme volume de uso.</p>

  <h2 data-editable>5. Investimento</h2>
  <div class="investimento-box">
    <div data-editable>Valor total do projeto</div>
    <div class="valor" data-editable>Não disponível</div>
    <div class="obs" data-editable>Entrada de 30% no início do projeto · Restante em até 10x, conforme condições comerciais</div>
  </div>

  <table>
    <thead>
      <tr><th>Item</th><th>Valor</th><th>Observação</th></tr>
    </thead>
    <tbody>
      <tr><td data-editable>Mensalidade do sistema</td><td data-editable>R$ 350,00/mês</td><td data-editable>Hospedagem, manutenção e suporte da plataforma</td></tr>
      <tr><td data-editable>Por representante cadastrado</td><td data-editable>R$ 50,00/mês</td><td data-editable>Valor adicional por representante ativo no sistema</td></tr>
      <tr><td data-editable>Mensageria (WhatsApp)</td><td data-editable>Cobrado à parte</td><td data-editable>Repassado diretamente pelo provedor, conforme volume de disparos</td></tr>
    </tbody>
  </table>

  <h2 data-editable>6. Próximos Passos</h2>
  <p data-editable>Após aprovação desta proposta, damos início ao levantamento detalhado do catálogo de produtos e à estruturação do banco de dados, seguindo o cronograma acima.</p>

  <div class="footer">
    <div class="footer-brand">NORTYX<span>.</span> Consultoria Financeira</div>
    <div data-editable>Proposta válida por 15 dias</div>
  </div>
`;

function applyEditableFlag(root: HTMLElement, editing: boolean) {
  root.querySelectorAll<HTMLElement>("[data-editable]").forEach((el) => {
    if (editing) el.setAttribute("contenteditable", "true");
    else el.removeAttribute("contenteditable");
  });
}

export default function ProposalEditor() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    if (!pageRef.current) return;
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    pageRef.current.innerHTML = stored ?? DEFAULT_HTML;
    applyEditableFlag(pageRef.current, false);
  }, []);

  // Toggle editing mode
  useEffect(() => {
    if (pageRef.current) applyEditableFlag(pageRef.current, editing);
  }, [editing]);

  // Ctrl+Shift+E shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) {
        e.preventDefault();
        setEditing((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scheduleSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (!pageRef.current) return;
      // Remove contenteditable attributes before saving so it round-trips clean
      const clone = pageRef.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));
      window.localStorage.setItem(STORAGE_KEY, clone.innerHTML);
      setSavedAt(new Date().toLocaleTimeString("pt-BR"));
    }, 500);
  };

  const handleReset = () => {
    if (!confirm("Restaurar o conteúdo original? Suas edições serão perdidas.")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    if (pageRef.current) {
      pageRef.current.innerHTML = DEFAULT_HTML;
      applyEditableFlag(pageRef.current, editing);
    }
    setSavedAt("");
  };

  return (
    <div className="proposal-wrapper">
      <div className="toolbar no-print">
        <button
          className={`btn ${editing ? "btn-active" : ""}`}
          onClick={() => setEditing((v) => !v)}
          title="Ctrl+Shift+E"
        >
          {editing ? "✓ Editando" : "✎ Editar"}
        </button>
        <button className="btn" onClick={() => window.print()}>🖨 Imprimir / PDF</button>
        <button className="btn btn-ghost" onClick={handleReset}>↺ Restaurar</button>
        <span className="save-status">
          {savedAt ? `Salvo às ${savedAt}` : "Autosave ativo"}
        </span>
      </div>

      <div
        className="page"
        ref={pageRef}
        onInput={scheduleSave}
        suppressContentEditableWarning
      />

      {editing && <div className="edit-hint no-print">Modo edição · Ctrl+Shift+E para sair</div>}
    </div>
  );
}