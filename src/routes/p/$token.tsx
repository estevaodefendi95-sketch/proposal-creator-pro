import { createFileRoute } from "@tanstack/react-router";
import ProposalEditor from "@/components/ProposalEditor";

const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/VWMmCbdJlhS2rkMlcOZ3l8kBSRo1/social-images/social-1783716201166-Gemini_Generated_Image_ytj6mhytj6mhytj6.webp";

export const Route = createFileRoute("/p/$token")({
  loader: async ({ params }) => {
    // Server-only import: keeps the service-role client out of the client bundle.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    try {
      const { data } = await supabaseAdmin.rpc("get_proposal_by_token", { token: params.token });
      const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
      const clientName = row?.client_name && row.client_name !== "[Nome do Cliente]" ? row.client_name : null;
      return { clientName };
    } catch {
      return { clientName: null as string | null };
    }
  },
  head: ({ loaderData }) => {
    const clientName = loaderData?.clientName;
    const title = clientName ? `Proposta Comercial — ${clientName}` : "Proposta Comercial — Nortyx";
    const description = clientName
      ? `Proposta comercial preparada especialmente para ${clientName}.`
      : "Consultoria financeira e soluções digitais";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:image", content: OG_IMAGE },
      ],
    };
  },
  component: PublicViewPage,
});

function PublicViewPage() {
  const { token } = Route.useParams();
  return <ProposalEditor shareToken={token} mode="view" />;
}
