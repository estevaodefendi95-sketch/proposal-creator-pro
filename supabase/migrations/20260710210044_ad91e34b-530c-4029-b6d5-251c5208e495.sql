-- Fix mutable search_path on function
CREATE OR REPLACE FUNCTION public.update_proposal_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Replace overly-permissive policy with ownership-scoped ones
DROP POLICY IF EXISTS authenticated_full_access ON public.proposals;

CREATE POLICY proposals_owner_select ON public.proposals
  FOR SELECT TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY proposals_owner_insert ON public.proposals
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY proposals_owner_update ON public.proposals
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY proposals_owner_delete ON public.proposals
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());