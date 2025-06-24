
-- Drop the existing restrictive SELECT policy that only allows users to see their own conseillers
DROP POLICY IF EXISTS "Users can view their own conseillers" ON public.conseillers;

-- Create a new SELECT policy that allows all authenticated users to view all conseillers
CREATE POLICY "Authenticated users can view all conseillers" 
  ON public.conseillers 
  FOR SELECT 
  TO authenticated
  USING (true);
