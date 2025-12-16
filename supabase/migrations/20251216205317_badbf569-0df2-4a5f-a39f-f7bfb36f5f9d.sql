-- Create demande_shares table
CREATE TABLE public.demande_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demande_id uuid NOT NULL REFERENCES public.demandes(id) ON DELETE CASCADE,
  shared_with_user_id uuid NOT NULL,
  shared_by_user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(demande_id, shared_with_user_id)
);

-- Enable Row Level Security
ALTER TABLE public.demande_shares ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create shares for their own demandes
CREATE POLICY "Users can create shares for their demandes"
ON public.demande_shares
FOR INSERT
WITH CHECK (
  (shared_by_user_id = auth.uid()) 
  AND (EXISTS (
    SELECT 1 FROM demandes d
    WHERE d.id = demande_shares.demande_id 
    AND (d.user_id = auth.uid() OR user_has_role(auth.uid(), 'Admin'::text))
  ))
);

-- Policy: Users can view shares for demandes they own or are shared with
CREATE POLICY "Users can view demande shares"
ON public.demande_shares
FOR SELECT
USING (
  shared_by_user_id = auth.uid() 
  OR shared_with_user_id = auth.uid() 
  OR user_has_role(auth.uid(), 'Admin'::text)
);

-- Policy: Users can delete shares they created
CREATE POLICY "Users can delete demande shares they created"
ON public.demande_shares
FOR DELETE
USING (
  shared_by_user_id = auth.uid() 
  OR user_has_role(auth.uid(), 'Admin'::text)
);

-- Update demandes RLS to allow shared users to view
DROP POLICY IF EXISTS "Users can view their own demandes" ON public.demandes;
CREATE POLICY "Users can view their own or shared demandes"
ON public.demandes
FOR SELECT
USING (
  (auth.uid() = user_id) 
  OR user_has_role(auth.uid(), 'Admin'::text)
  OR (EXISTS (
    SELECT 1 FROM demande_shares ds
    WHERE ds.demande_id = demandes.id 
    AND ds.shared_with_user_id = auth.uid()
  ))
);