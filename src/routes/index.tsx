import { createFileRoute } from "@tanstack/react-router";
import ProposalEditor from "@/components/ProposalEditor";

export const Route = createFileRoute("/")({
  component: ProposalEditor,
});
