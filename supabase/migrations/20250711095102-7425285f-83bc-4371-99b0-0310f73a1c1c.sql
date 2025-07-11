
-- Enum pour les types de propriétaires
CREATE TYPE proprietaire_type AS ENUM ('PARTICULIER', 'PROMOTEUR', 'FONCIERE');

-- Enum pour les types de biens
CREATE TYPE bien_type AS ENUM ('VENTE', 'LOCATION', 'LOCATION_SAISONNIERE');

-- Enum pour les statuts de mandat
CREATE TYPE mandat_status AS ENUM ('ACTIF', 'EXPIRE', 'RESILIE', 'EN_ATTENTE');

-- Table des propriétaires
CREATE TABLE public.proprietaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Référence au conseiller qui a créé
  type proprietaire_type NOT NULL DEFAULT 'PARTICULIER',
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT,
  telephone TEXT NOT NULL,
  adresse TEXT,
  ville TEXT,
  code_postal TEXT,
  pays TEXT DEFAULT 'Maroc',
  date_naissance DATE,
  numero_cin TEXT,
  numero_rc TEXT, -- Pour les promoteurs/foncières
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des biens immobiliers
CREATE TABLE public.biens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietaire_id UUID NOT NULL REFERENCES public.proprietaires(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- Conseiller gestionnaire
  titre TEXT NOT NULL,
  description TEXT,
  type bien_type NOT NULL,
  superficie NUMERIC,
  nombre_pieces INTEGER,
  nombre_chambres INTEGER,
  nombre_salles_bain INTEGER,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  quartier TEXT,
  code_postal TEXT,
  prix_demande NUMERIC NOT NULL,
  prix_negociable BOOLEAN DEFAULT true,
  frais_agence NUMERIC,
  disponible_le DATE,
  caracteristiques JSONB, -- Ascenseur, parking, terrasse, etc.
  photos TEXT[], -- URLs des photos
  status TEXT DEFAULT 'DISPONIBLE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des conditions imposées par le propriétaire
CREATE TABLE public.conditions_proprietaire (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bien_id UUID NOT NULL REFERENCES public.biens(id) ON DELETE CASCADE,
  prix_minimum NUMERIC,
  delai_vente_max INTEGER, -- en jours
  exclusivite BOOLEAN DEFAULT false,
  commission_max NUMERIC,
  visites_autorisees_semaine INTEGER,
  horaires_visites JSONB, -- {"lundi": ["9h-12h", "14h-18h"], ...}
  garanties_requises TEXT[],
  conditions_particulieres TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des mandats
CREATE TABLE public.mandats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietaire_id UUID NOT NULL REFERENCES public.proprietaires(id) ON DELETE CASCADE,
  bien_id UUID NOT NULL REFERENCES public.biens(id) ON DELETE CASCADE,
  conseiller_id UUID NOT NULL, -- Conseiller signataire
  numero_mandat TEXT NOT NULL UNIQUE,
  type bien_type NOT NULL,
  prix_mandat NUMERIC NOT NULL,
  commission_taux NUMERIC NOT NULL, -- Pourcentage
  commission_fixe NUMERIC, -- Montant fixe optionnel
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  exclusivite BOOLEAN DEFAULT false,
  status mandat_status DEFAULT 'EN_ATTENTE',
  document_url TEXT, -- URL du document signé
  conditions_specifiques TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour l'historique des interactions
CREATE TABLE public.interactions_proprietaire (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietaire_id UUID NOT NULL REFERENCES public.proprietaires(id) ON DELETE CASCADE,
  conseiller_id UUID NOT NULL,
  type_interaction TEXT NOT NULL, -- APPEL, EMAIL, VISITE, SIGNATURE
  description TEXT,
  date_interaction TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Politiques RLS pour les propriétaires
ALTER TABLE public.proprietaires ENABLE ROW LEVEL SECURITY;

-- Seul le conseiller créateur et les admins peuvent voir le téléphone
CREATE POLICY "Proprietaires - Select avec restriction téléphone" 
ON public.proprietaires FOR SELECT 
USING (
  CASE 
    WHEN user_has_role(auth.uid(), 'Admin') THEN true
    WHEN auth.uid() = user_id THEN true
    ELSE false
  END
);

CREATE POLICY "Proprietaires - Insert" 
ON public.proprietaires FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Proprietaires - Update" 
ON public.proprietaires FOR UPDATE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  auth.uid() = user_id
);

CREATE POLICY "Proprietaires - Delete" 
ON public.proprietaires FOR DELETE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  auth.uid() = user_id
);

-- Politiques RLS pour les biens
ALTER TABLE public.biens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Biens - Select" 
ON public.biens FOR SELECT 
USING (true); -- Tous peuvent voir les biens

CREATE POLICY "Biens - Insert" 
ON public.biens FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Biens - Update" 
ON public.biens FOR UPDATE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  auth.uid() = user_id
);

CREATE POLICY "Biens - Delete" 
ON public.biens FOR DELETE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  auth.uid() = user_id
);

-- Politiques RLS pour les conditions
ALTER TABLE public.conditions_proprietaire ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conditions - Select" 
ON public.conditions_proprietaire FOR SELECT 
USING (true);

CREATE POLICY "Conditions - Insert" 
ON public.conditions_proprietaire FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.biens 
    WHERE id = bien_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Conditions - Update" 
ON public.conditions_proprietaire FOR UPDATE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  EXISTS (
    SELECT 1 FROM public.biens 
    WHERE id = bien_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Conditions - Delete" 
ON public.conditions_proprietaire FOR DELETE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  EXISTS (
    SELECT 1 FROM public.biens 
    WHERE id = bien_id AND user_id = auth.uid()
  )
);

-- Politiques RLS pour les mandats
ALTER TABLE public.mandats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mandats - Select" 
ON public.mandats FOR SELECT 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  auth.uid() = conseiller_id
);

CREATE POLICY "Mandats - Insert" 
ON public.mandats FOR INSERT 
WITH CHECK (auth.uid() = conseiller_id);

CREATE POLICY "Mandats - Update" 
ON public.mandats FOR UPDATE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  auth.uid() = conseiller_id
);

CREATE POLICY "Mandats - Delete" 
ON public.mandats FOR DELETE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  auth.uid() = conseiller_id
);

-- Politiques RLS pour les interactions
ALTER TABLE public.interactions_proprietaire ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Interactions - Select" 
ON public.interactions_proprietaire FOR SELECT 
USING (true);

CREATE POLICY "Interactions - Insert" 
ON public.interactions_proprietaire FOR INSERT 
WITH CHECK (auth.uid() = conseiller_id);

CREATE POLICY "Interactions - Update" 
ON public.interactions_proprietaire FOR UPDATE 
USING (
  user_has_role(auth.uid(), 'Admin') OR 
  auth.uid() = conseiller_id
);

-- Fonction pour masquer le téléphone selon les permissions
CREATE OR REPLACE FUNCTION public.get_proprietaire_with_privacy(proprietaire_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type proprietaire_type,
  nom TEXT,
  prenom TEXT,
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  ville TEXT,
  code_postal TEXT,
  pays TEXT,
  date_naissance DATE,
  numero_cin TEXT,
  numero_rc TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.type,
    p.nom,
    p.prenom,
    p.email,
    CASE 
      WHEN user_has_role(auth.uid(), 'Admin') OR auth.uid() = p.user_id 
      THEN p.telephone 
      ELSE '***-***-****'
    END as telephone,
    p.adresse,
    p.ville,
    p.code_postal,
    p.pays,
    p.date_naissance,
    p.numero_cin,
    p.numero_rc,
    p.notes,
    p.created_at,
    p.updated_at
  FROM public.proprietaires p
  WHERE p.id = proprietaire_id;
$$;

-- Fonction pour générer le numéro de mandat
CREATE OR REPLACE FUNCTION public.generate_mandat_number()
RETURNS TEXT
LANGUAGE SQL
AS $$
  SELECT 'MAN-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('mandat_sequence')::TEXT, 4, '0');
$$;

-- Séquence pour les numéros de mandat
CREATE SEQUENCE IF NOT EXISTS mandat_sequence START 1;

-- Trigger pour auto-générer le numéro de mandat
CREATE OR REPLACE FUNCTION public.set_mandat_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.numero_mandat IS NULL OR NEW.numero_mandat = '' THEN
    NEW.numero_mandat := public.generate_mandat_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_mandat_number
  BEFORE INSERT ON public.mandats
  FOR EACH ROW
  EXECUTE FUNCTION public.set_mandat_number();

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_proprietaires_updated_at 
  BEFORE UPDATE ON public.proprietaires 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_biens_updated_at 
  BEFORE UPDATE ON public.biens 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conditions_updated_at 
  BEFORE UPDATE ON public.conditions_proprietaire 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mandats_updated_at 
  BEFORE UPDATE ON public.mandats 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
