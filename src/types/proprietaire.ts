
export type ProprietaireType = 'PARTICULIER' | 'PROMOTEUR' | 'FONCIERE';
export type BienType = 'VENTE' | 'LOCATION' | 'LOCATION_SAISONNIERE';
export type MandatStatus = 'ACTIF' | 'EXPIRE' | 'RESILIE' | 'EN_ATTENTE';

export interface Proprietaire {
  id: string;
  user_id: string;
  type: ProprietaireType;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  date_naissance?: string;
  numero_cin?: string;
  numero_rc?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Bien {
  id: string;
  proprietaire_id: string;
  user_id: string;
  titre: string;
  description?: string;
  type: BienType;
  superficie?: number;
  nombre_pieces?: number;
  nombre_chambres?: number;
  nombre_salles_bain?: number;
  adresse: string;
  ville: string;
  quartier?: string;
  code_postal?: string;
  prix_demande: number;
  prix_negociable?: boolean;
  frais_agence?: number;
  disponible_le?: string;
  caracteristiques?: Record<string, any>;
  photos?: string[];
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface ConditionsProprietaire {
  id: string;
  bien_id: string;
  prix_minimum?: number;
  delai_vente_max?: number;
  exclusivite?: boolean;
  commission_max?: number;
  visites_autorisees_semaine?: number;
  horaires_visites?: Record<string, string[]>;
  garanties_requises?: string[];
  conditions_particulieres?: string;
  created_at: string;
  updated_at: string;
}

export interface Mandat {
  id: string;
  proprietaire_id: string;
  bien_id: string;
  conseiller_id: string;
  numero_mandat: string;
  type: BienType;
  prix_mandat: number;
  commission_taux: number;
  commission_fixe?: number;
  date_debut: string;
  date_fin: string;
  exclusivite?: boolean;
  status: MandatStatus;
  document_url?: string;
  conditions_specifiques?: string;
  created_at: string;
  updated_at: string;
}

export interface InteractionProprietaire {
  id: string;
  proprietaire_id: string;
  conseiller_id: string;
  type_interaction: 'APPEL' | 'EMAIL' | 'VISITE' | 'SIGNATURE';
  description?: string;
  date_interaction: string;
  created_at: string;
}
