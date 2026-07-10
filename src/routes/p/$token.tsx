import { createFileRoute } from "@tanstack/react-router";
import ProposalEditor from "@/components/ProposalEditor";

export const Route = createFileRoute("/p/$token")({
  component: PublicViewPage,
});

function PublicViewPage() {
  const { token } = Route.useParams();
  return <ProposalEditor shareToken={token} mode="view" />;
}