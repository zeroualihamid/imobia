
-- Create enum for proprietaire types
CREATE TYPE proprietaire_type AS ENUM ('PARTICULIER', 'PROMOTEUR', 'FONCIERE');

-- Create enum for bien types
CREATE TYPE bien_type AS ENUM ('VENTE', 'LOCATION', 'VENTE_LOCATION');

-- Create enum for bien status
CREATE TYPE bien_status AS ENUM ('DISPONIBLE', 'RESERVE', 'VENDU', 'LOUE', 'RETIRE');

-- Create enum for mandat types
CREATE TYPE mandat_type AS ENUM ('SIMPLE', 'EXCLUSIF', 'SEMI_EXCLUSIF');

-- Create enum for mandat status
CREATE TYPE mandat_status AS ENUM ('ACTIF', 'EXPIRE', 'RESILIE', 'SUSPENDU');

-- Create proprietaires table
CREATE TABLE public.proprietaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type proprietaire_type NOT NULL DEFAULT 'PARTICULIER',
  nom TEXT NOT NULL,
  prenom TEXT,
  raison_sociale TEXT,
  email TEXT,
  telephone TEXT NOT NULL,
  adresse TEXT,
  ville TEXT,
  code_postal TEXT,
  pays TEXT DEFAULT 'Maroc',
  date_naissance DATE,
  cin TEXT,
  ice TEXT, -- For companies
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create biens table
CREATE TABLE public.biens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietaire_id UUID REFERENCES public.proprietaires(id) ON DELETE CASCADE NOT NULL,
  titre TEXT NOT NULL,
  description TEXT,
  type bien_type NOT NULL,
  status bien_status NOT NULL DEFAULT 'DISPONIBLE',
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  quartier TEXT,
  code_postal TEXT,
  surface_habitable DECIMAL(10,2),
  surface_terrain DECIMAL(10,2),
  nombre_chambres INTEGER,
  nombre_salles_bain INTEGER,
  nombre_etages INTEGER,
  annee_construction INTEGER,
  prix_vente DECIMAL(15,2),
  prix_location DECIMAL(15,2),
  charges_mensuelles DECIMAL(10,2),
  meuble BOOLEAN DEFAULT FALSE,
  parking BOOLEAN DEFAULT FALSE,
  jardin BOOLEAN DEFAULT FALSE,
  piscine BOOLEAN DEFAULT FALSE,
  ascenseur BOOLEAN DEFAULT FALSE,
  climatisation BOOLEAN DEFAULT FALSE,
  chauffage BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conditions_proprietaire table
CREATE TABLE public.conditions_proprietaire (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietaire_id UUID REFERENCES public.proprietaires(id) ON DELETE CASCADE NOT NULL,
  bien_id UUID REFERENCES public.biens(id) ON DELETE CASCADE,
  prix_minimum DECIMAL(15,2),
  prix_maximum DECIMAL(15,2),
  delai_vente INTEGER, -- en jours
  delai_location INTEGER, -- en jours
  commission_negociable BOOLEAN DEFAULT TRUE,
  exclusivite_requise BOOLEAN DEFAULT FALSE,
  visite_accompagnee BOOLEAN DEFAULT TRUE,
  horaires_visite TEXT,
  conditions_speciales TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mandats table
CREATE TABLE public.mandats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietaire_id UUID REFERENCES public.proprietaires(id) ON DELETE CASCADE NOT NULL,
  bien_id UUID REFERENCES public.biens(id) ON DELETE CASCADE NOT NULL,
  type mandat_type NOT NULL,
  status mandat_status NOT NULL DEFAULT 'ACTIF',
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  commission_pourcentage DECIMAL(5,2) NOT NULL,
  commission_fixe DECIMAL(10,2),
  prix_mandat DECIMAL(15,2),
  conditions_particulieres TEXT,
  document_url TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interactions_proprietaire table for tracking communications
CREATE TABLE public.interactions_proprietaire (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietaire_id UUID REFERENCES public.proprietaires(id) ON DELETE CASCADE NOT NULL,
  conseiller_id UUID REFERENCES auth.users(id) NOT NULL,
  type_interaction TEXT NOT NULL, -- 'APPEL', 'EMAIL', 'SMS', 'VISITE', 'REUNION'
  description TEXT NOT NULL,
  date_interaction TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.proprietaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions_proprietaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions_proprietaire ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proprietaires
CREATE POLICY "Users can view proprietaires they created or admins can view all" 
  ON public.proprietaires 
  FOR SELECT 
  USING (
    created_by = auth.uid() OR 
    user_has_role(auth.uid(), 'Admin')
  );

CREATE POLICY "Users can create proprietaires" 
  ON public.proprietaires 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update proprietaires they created or admins can update all" 
  ON public.proprietaires 
  FOR UPDATE 
  USING (
    created_by = auth.uid() OR 
    user_has_role(auth.uid(), 'Admin')
  );

CREATE POLICY "Users can delete proprietaires they created or admins can delete all" 
  ON public.proprietaires 
  FOR DELETE 
  USING (
    created_by = auth.uid() OR 
    user_has_role(auth.uid(), 'Admin')
  );

-- RLS Policies for biens
CREATE POLICY "Users can view biens of proprietaires they created or admins can view all" 
  ON public.biens 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = biens.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

CREATE POLICY "Users can create biens for proprietaires they created" 
  ON public.biens 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = biens.proprietaire_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update biens of proprietaires they created or admins can update all" 
  ON public.biens 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = biens.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

CREATE POLICY "Users can delete biens of proprietaires they created or admins can delete all" 
  ON public.biens 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = biens.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

-- RLS Policies for conditions_proprietaire
CREATE POLICY "Users can view conditions of proprietaires they created or admins can view all" 
  ON public.conditions_proprietaire 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = conditions_proprietaire.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

CREATE POLICY "Users can create conditions for proprietaires they created" 
  ON public.conditions_proprietaire 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = conditions_proprietaire.proprietaire_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update conditions of proprietaires they created or admins can update all" 
  ON public.conditions_proprietaire 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = conditions_proprietaire.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

CREATE POLICY "Users can delete conditions of proprietaires they created or admins can delete all" 
  ON public.conditions_proprietaire 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = conditions_proprietaire.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

-- RLS Policies for mandats
CREATE POLICY "Users can view mandats of proprietaires they created or admins can view all" 
  ON public.mandats 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = mandats.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

CREATE POLICY "Users can create mandats for proprietaires they created" 
  ON public.mandats 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = mandats.proprietaire_id 
      AND p.created_by = auth.uid()
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Users can update mandats of proprietaires they created or admins can update all" 
  ON public.mandats 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = mandats.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

CREATE POLICY "Users can delete mandats of proprietaires they created or admins can delete all" 
  ON public.mandats 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = mandats.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

-- RLS Policies for interactions_proprietaire
CREATE POLICY "Users can view interactions of proprietaires they created or admins can view all" 
  ON public.interactions_proprietaire 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = interactions_proprietaire.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

CREATE POLICY "Users can create interactions for proprietaires they created" 
  ON public.interactions_proprietaire 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = interactions_proprietaire.proprietaire_id 
      AND p.created_by = auth.uid()
    ) AND conseiller_id = auth.uid()
  );

CREATE POLICY "Users can update interactions of proprietaires they created or admins can update all" 
  ON public.interactions_proprietaire 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = interactions_proprietaire.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

CREATE POLICY "Users can delete interactions of proprietaires they created or admins can delete all" 
  ON public.interactions_proprietaire 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.proprietaires p 
      WHERE p.id = interactions_proprietaire.proprietaire_id 
      AND (p.created_by = auth.uid() OR user_has_role(auth.uid(), 'Admin'))
    )
  );

-- Create function to mask phone numbers for non-authorized users
CREATE OR REPLACE FUNCTION public.mask_phone_number(
  phone_number TEXT,
  proprietaire_created_by UUID
) RETURNS TEXT AS $$
BEGIN
  -- Show full phone number to creator or admin
  IF auth.uid() = proprietaire_created_by OR user_has_role(auth.uid(), 'Admin') THEN
    RETURN phone_number;
  ELSE
    -- Mask phone number for others
    RETURN REGEXP_REPLACE(phone_number, '(.{2})(.*)(.{2})', '\1****\3');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_proprietaires_created_by ON public.proprietaires(created_by);
CREATE INDEX idx_proprietaires_type ON public.proprietaires(type);
CREATE INDEX idx_biens_proprietaire_id ON public.biens(proprietaire_id);
CREATE INDEX idx_biens_type ON public.biens(type);
CREATE INDEX idx_biens_status ON public.biens(status);
CREATE INDEX idx_mandats_proprietaire_id ON public.mandats(proprietaire_id);
CREATE INDEX idx_mandats_bien_id ON public.mandats(bien_id);
CREATE INDEX idx_mandats_status ON public.mandats(status);
CREATE INDEX idx_interactions_proprietaire_id ON public.interactions_proprietaire(proprietaire_id);
CREATE INDEX idx_interactions_conseiller_id ON public.interactions_proprietaire(conseiller_id);
