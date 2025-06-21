
-- Créer la table pour les conseillers
CREATE TABLE public.conseillers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT,
  date_naissance DATE,
  nationalite TEXT,
  numero_cin TEXT,
  date_embauche DATE,
  salaire NUMERIC,
  commission NUMERIC,
  ville TEXT,
  formation TEXT,
  specialisations TEXT[],
  langues TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS pour sécuriser l'accès
ALTER TABLE public.conseillers ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs authentifiés de voir leurs conseillers
CREATE POLICY "Users can view their own conseillers" 
  ON public.conseillers 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs authentifiés de créer des conseillers
CREATE POLICY "Users can create conseillers" 
  ON public.conseillers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs authentifiés de modifier leurs conseillers
CREATE POLICY "Users can update their own conseillers" 
  ON public.conseillers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs authentifiés de supprimer leurs conseillers
CREATE POLICY "Users can delete their own conseillers" 
  ON public.conseillers 
  FOR DELETE 
  USING (auth.uid() = user_id);
