
export interface Proprietaire {
  id: string;
  type: 'PARTICULIER' | 'PROMOTEUR' | 'FONCIERE';
  nom: string;
  prenom?: string;
  raison_sociale?: string;
  email?: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  date_naissance?: string;
  cin?: string;
  ice?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Bien {
  id: string;
  proprietaire_id: string;
  titre: string;
  description?: string;
  type: 'VENTE' | 'LOCATION' | 'VENTE_LOCATION';
  status: 'DISPONIBLE' | 'RESERVE' | 'VENDU' | 'LOUE' | 'RETIRE';
  adresse: string;
  ville: string;
  quartier?: string;
  code_postal?: string;
  surface_habitable?: number;
  surface_terrain?: number;
  nombre_chambres?: number;
  nombre_salles_bain?: number;
  nombre_etages?: number;
  annee_construction?: number;
  prix_vente?: number;
  prix_location?: number;
  charges_mensuelles?: number;
  meuble: boolean;
  parking: boolean;
  jardin: boolean;
  piscine: boolean;
  ascenseur: boolean;
  climatisation: boolean;
  chauffage: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConditionProprietaire {
  id: string;
  proprietaire_id: string;
  bien_id?: string;
  prix_minimum?: number;
  prix_maximum?: number;
  delai_vente?: number;
  delai_location?: number;
  commission_negociable: boolean;
  exclusivite_requise: boolean;
  visite_accompagnee: boolean;
  horaires_visite?: string;
  conditions_speciales?: string;
  created_at: string;
  updated_at: string;
}

export interface Mandat {
  id: string;
  proprietaire_id: string;
  bien_id: string;
  type: 'SIMPLE' | 'EXCLUSIF' | 'SEMI_EXCLUSIF';
  status: 'ACTIF' | 'EXPIRE' | 'RESILIE' | 'SUSPENDU';
  date_debut: string;
  date_fin: string;
  commission_pourcentage: number;
  commission_fixe?: number;
  prix_mandat?: number;
  conditions_particulieres?: string;
  document_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface InteractionProprietaire {
  id: string;
  proprietaire_id: string;
  conseiller_id: string;
  type_interaction: string;
  description: string;
  date_interaction: string;
  created_at: string;
}
