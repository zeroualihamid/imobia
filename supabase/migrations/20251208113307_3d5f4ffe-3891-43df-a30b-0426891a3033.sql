-- Make proprietaire_id nullable to allow adding biens without an owner
ALTER TABLE public.biens ALTER COLUMN proprietaire_id DROP NOT NULL;

-- Update RLS policies to handle null proprietaire_id
DROP POLICY IF EXISTS "Users can create biens for proprietaires they created" ON public.biens;
CREATE POLICY "Users can create biens" 
ON public.biens 
FOR INSERT 
WITH CHECK (
  (proprietaire_id IS NULL) OR 
  (EXISTS (
    SELECT 1 FROM proprietaires p
    WHERE p.id = biens.proprietaire_id AND p.created_by = auth.uid()
  ))
);

DROP POLICY IF EXISTS "Users can view biens they own or are shared with" ON public.biens;
CREATE POLICY "Users can view biens they own or are shared with" 
ON public.biens 
FOR SELECT 
USING (
  (EXISTS (
    SELECT 1 FROM proprietaires p
    WHERE p.id = biens.proprietaire_id AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
  )) OR 
  (EXISTS (
    SELECT 1 FROM bien_shares bs
    WHERE bs.bien_id = biens.id AND bs.shared_with_user_id = auth.uid()
  )) OR
  (proprietaire_id IS NULL)
);

DROP POLICY IF EXISTS "Users can update biens of proprietaires they created or admins" ON public.biens;
CREATE POLICY "Users can update biens of proprietaires they created or admins" 
ON public.biens 
FOR UPDATE 
USING (
  (proprietaire_id IS NULL) OR
  (EXISTS (
    SELECT 1 FROM proprietaires p
    WHERE p.id = biens.proprietaire_id AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
  ))
);

DROP POLICY IF EXISTS "Users can delete biens of proprietaires they created or admins" ON public.biens;
CREATE POLICY "Users can delete biens of proprietaires they created or admins" 
ON public.biens 
FOR DELETE 
USING (
  (proprietaire_id IS NULL) OR
  (EXISTS (
    SELECT 1 FROM proprietaires p
    WHERE p.id = biens.proprietaire_id AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
  ))
);