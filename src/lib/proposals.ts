import { supabase } from "@/integrations/supabase/client";

export interface ProposalRow {
  id: string;
  client_name: string;
  content: { html: string };
  status: string;
  created_at: string;
  updated_at: string;
}

export async function listProposals() {
  const { data, error } = await supabase
    .from("proposals")
    .select("id, client_name, status, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProposal(id: string) {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as unknown as ProposalRow;
}

export async function createProposal(clientName: string, html: string) {
  const { data, error } = await supabase
    .from("proposals")
    .insert({ client_name: clientName, content: { html } })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as ProposalRow;
}

export async function updateProposalContent(id: string, html: string) {
  const { error } = await supabase
    .from("proposals")
    .update({ content: { html } })
    .eq("id", id);
  if (error) throw error;
}

export async function updateProposalClientName(id: string, clientName: string) {
  const { error } = await supabase
    .from("proposals")
    .update({ client_name: clientName })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProposal(id: string) {
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) throw error;
}