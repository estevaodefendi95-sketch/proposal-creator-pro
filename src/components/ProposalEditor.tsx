import { useEffect, useRef, useState } from "react";
import "./proposal-editor.css";

const STORAGE_KEY = "nortyx.proposal.html.v1";

const LOGO_SRC = "data:image/png;base64,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";
const ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAADAFBMVEVHcEySkpIiK0ogK0shKkkhLEofKkgiK0ghKkcgKUghLEggK0kfKkqTk5MgK0cgKkseK0seKkmUlJQfKUohKkgeKUciK0keKUgfK0oeK00dJ0ggKEUfKEcfKEkhK0shK0cgK0whK0kgKUcgKk0gKkggKkkhKU0hKUr///8dKUofJ0QgKkYiK0weKkYeJkYdJ0QWFhgiKUYfKkseK0gfKEwcJ0ciLUwhKEgjK0ghLEccJEQkLEoiLEsfKkcjKUk6QVkkLkwUFBmJipAcJUL///8VFhkdKUsbIkCFh4yTlZN6eXyFh4woKzi5u8U+RF0nKTQcKUk2PlZ7e4AhLEn8/Pu3usO9v8f7+/uFiIwyOlV3e4YSExzz8/eIipETGjH7+/tydX6TkZIlKDYlLUkUGzK3usS2uMNzdYIREReDhIsmLk64usUTExZwcHTd3uN+f4n///8ZGR+Bg4p0dHh5e4pESF6bm5vHx8fEw8qEio2+wcoXHTL19/nk5OTl5edvcYDNzc3X190SExp1doIbIDZ4eofGxsy2uMCwsLAVFiBtbnaen5+5usNhY3JlZXNoaXUkJznb29uam5oQECYOECOgoKClpqW2t7asrKwpLTt2eYlISVgPEi7T1NWLjZejpa4sMERbXGiIiZaioqGtrbWsq7FFR1VWV2U6PEySlKGanKiwsrrHx8dOT1yZmqSkpKRdYG1KTFo9P0swM0XDw8Pg4OCRkZGQkI+Xl5fR0dGQkJNbXWrV1dWfoKl2d4QaHDEREx4cHCFPUGCgnqgUFCM6O0lQUV5PUF8rLkFzd4m1tbWLjZlaW2lGR1UwNEsVFRkmLEiZmZg9PEwaHCwXFx+SlJORkZEDCiwjLU4hJ0eQkJAfJkMeJEIhJkSPj48lKj+VlpaSk5ITHDMkKkEZID4eJEMgJkIEDC+NjY0eJD8dIzsZHzolK0UVGzcXHDMbIj4ODxWKi4oaHzYOESoHCR8WGi8jKUOTk5EPFDGSkY8hJj0KDiiRkpKJiYgTFyuHh4fVw4xdAAAA1XRSTlMA/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+Af7+/v7+/v74/v7+/v7+/v7+/v7+/v73/vUz/gLy/v5C/k1L6mn17P72U/4GZG0JLfkS/hc4sxEh/uX+ul9tFvpq/nPsOjFeDPs6RKrt0JQdDU/CHTkneHgg4InNnTowyuud9BXat2v1XP3x/Pzh2e3wf9b4glJY09SGo414fLa4lW9Kv8aEu/Nn5f2uTOj1+FfIVpZCu+nG9/0p2Zme4p7ZnbKN++6239/++JP0R1SUAAAEtUlEQVR42u2Y32scRRzAc/NrZ3b3dm/v9vY2uUuyzd3lklxyIQ1pfpgE4/mQYEExfRDUB/sg/sBatFqRYDVFFJVG8aVKiwgWwRYfCoL0wT76F9xhm5hqEkOIDbFqwPbJ2Ysxsdzm4TKhD87n4WB3Bj58f8zszNXVSSQSiUQikUgkEolEIpFIJPeeY09/8fWF15/YT8WJt0+cPvXp6VMzj269+erxhaGWAz1otD9f+PP7t/ZLPFegIxShUeuZzedX7hQIaySMdRkUaSyX2nh2f8RDiSwjpJfoY/7Td+vdfZBoJqKGYQCg66au9//Wth/igkX6CSHMFx9f6G5o1GKGphkZPImHHQw8EGfg5hvivW2FrN5LiJ5Nj9VN3WxIJeKWiWOtrU2KoiqKMjCgGNiMdbwn3pxscRmLEdI6NlVoSMQ1rYXmqYYn7WYF2KqqqCpwgNJzUbT3wSGrieUwyqTPbbR39VrxBOlLpRKpbIrEETIp93OMpiXx4paciZCNYmloMYto8VTy941z0x//Mcu62KSBsS9WcdPnoms8FzMhYpqZhiSb501mr838M/TCar+lmaAiHoYLosXdepbhDHQ9ncRIPLX2wY7Bl4cKrdDvMdUw2TuCxUUuRhmNIL6Y9fu+vKsQyVynL54ccfsvCw65aGVaGN+oCOtLzR25e/T4cEXcPILjG8Ij1hgCjOlxUqzyUZg2KzVWjPiAaHFjBkGMSJz1Ha02oYf5YrXZTr4mWNyuaQjzVPd1VJ3wV0VsqL2pGbHi2YMoRtAII4npqhOuJvnG2awYKjsjWNxu8irbTMtW//KeKTQ7CqVcfFn0OoYu/wQOZgKa58XCIFBUSik6LFbcQUzIbGp7d6pPGO9W8nw9DVD0sFjxkO66BmNUu1F9wkvLPNEKVYApWFx0LZciiuBi9QkPFGmFYcER1xV4c43YeVsPiPhJX8xXFKZHBYs9qPtHn/SNoBr78eYRoIcFiy1LJ41Wrn5XMa+FLVqsWzpLQVi/uIs4gyhtES2OkZzVD+GuqT4AqA0EN1fRPwAwLx0sVtVRalMqXDyShYzl6oPED3VjjB2bGkBwqn+x3JxOeI2DxB2AH/iQqt7/n4i/OXl+ao9XGK2V8TtLOljsYAwQUN0dEZ+dL4fDoZXzexEvH8wx3YWRYLGKecwA4G3xrflQiIvL5Ut7EP9oeYi1R4LF3QoAjqMo2zV+f+V62Bdzde3mtuW0DtkjkUgkMGKMOx1+i9mOeCUUCj3FvRPh8ErtEc96LsxEInpkMUjMg3X8zXprr34+5Cc6yimFQ8dqby4u1mEkBoNrPOiLneEt8atcPBHdpPRmzeIOz4McM0g83qFWInbATnEpGg1FJ6Kl6Mnauzrt4Uh9pDPoIDCetLmVmw9tiS+EuXiC//CMlz6qvas9jXdWr+YFnUCSxqA26ajGD1vNdaTMxSW/r8PRidq7+tpwRgNYCxYnJoF/NXee+2RHV3NxuFQq/XS29q6+FnEh1iA8FBixl+PbBwCdH/77bmU+9DNPdLn87R42kLWlTYqr1ccfW13nLP26vn51O023bpdvXy+H3r0Hf/19duXKxTqJRCKRSCQSiUQikUgkEsn/i78Bv2LtOtnIPIMAAAAASUVORK5CYII=";

const DEFAULT_HTML = `
  <div class="header">
    <img src="${LOGO_SRC}" alt="Nortyx" class="logo-img" />
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
    <div class="footer-brand"><img src="${ICON_SRC}" alt="Nortyx" class="footer-icon" /><span>Nortyx Consultoria Financeira</span></div>
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