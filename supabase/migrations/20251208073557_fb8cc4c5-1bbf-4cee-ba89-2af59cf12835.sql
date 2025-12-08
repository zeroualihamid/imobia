-- Create table for sharing biens with users
CREATE TABLE public.bien_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bien_id uuid NOT NULL REFERENCES public.biens(id) ON DELETE CASCADE,
  shared_with_user_id uuid NOT NULL,
  shared_by_user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(bien_id, shared_with_user_id)
);

-- Enable RLS
ALTER TABLE public.bien_shares ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view shares for biens they own or are shared with them
CREATE POLICY "Users can view shares for their biens"
ON public.bien_shares
FOR SELECT
USING (
  shared_by_user_id = auth.uid() 
  OR shared_with_user_id = auth.uid()
  OR user_has_role(auth.uid(), 'Admin')
);

-- Policy: Users can create shares for biens they own
CREATE POLICY "Users can create shares for their biens"
ON public.bien_shares
FOR INSERT
WITH CHECK (
  shared_by_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM biens b
    JOIN proprietaires p ON b.proprietaire_id = p.id
    WHERE b.id = bien_shares.bien_id
    AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
  )
);

-- Policy: Users can delete shares they created
CREATE POLICY "Users can delete shares they created"
ON public.bien_shares
FOR DELETE
USING (
  shared_by_user_id = auth.uid()
  OR user_has_role(auth.uid(), 'Admin')
);

-- Update biens RLS to allow shared users to view
DROP POLICY IF EXISTS "Users can view biens of proprietaires they created or admins ca" ON public.biens;

CREATE POLICY "Users can view biens they own or are shared with"
ON public.biens
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM proprietaires p
    WHERE p.id = biens.proprietaire_id
    AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
  )
  OR EXISTS (
    SELECT 1 FROM bien_shares bs
    WHERE bs.bien_id = biens.id
    AND bs.shared_with_user_id = auth.uid()
  )
);

-- Update bien_media RLS to allow shared users to view
DROP POLICY IF EXISTS "Users can view media of biens they can access" ON public.bien_media;

CREATE POLICY "Users can view media of biens they can access"
ON public.bien_media
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM biens b
    JOIN proprietaires p ON b.proprietaire_id = p.id
    WHERE b.id = bien_media.bien_id
    AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
  )
  OR EXISTS (
    SELECT 1 FROM bien_shares bs
    WHERE bs.bien_id = bien_media.bien_id
    AND bs.shared_with_user_id = auth.uid()
  )
);