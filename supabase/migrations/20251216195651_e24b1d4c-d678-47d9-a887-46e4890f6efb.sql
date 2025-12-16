-- Create demandes table for client requests
CREATE TABLE public.demandes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_nom_complet TEXT NOT NULL,
  telephone TEXT,
  email TEXT NOT NULL,
  budget NUMERIC,
  type_bien TEXT,
  superficie NUMERIC,
  adresse_complete TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  description TEXT,
  status TEXT DEFAULT 'NOUVELLE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own demandes"
ON public.demandes
FOR SELECT
USING (auth.uid() = user_id OR user_has_role(auth.uid(), 'Admin'));

CREATE POLICY "Users can create their own demandes"
ON public.demandes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own demandes"
ON public.demandes
FOR UPDATE
USING (auth.uid() = user_id OR user_has_role(auth.uid(), 'Admin'));

CREATE POLICY "Users can delete their own demandes"
ON public.demandes
FOR DELETE
USING (auth.uid() = user_id OR user_has_role(auth.uid(), 'Admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_demandes_updated_at
BEFORE UPDATE ON public.demandes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();