import { createFileRoute } from "@tanstack/react-router";
import ProposalEditor from "@/components/ProposalEditor";

export const Route = createFileRoute("/propostas/$id/editar")({
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  return <ProposalEditor proposalId={id} mode="edit" />;
}