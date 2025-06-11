
export interface PropertyMetadata {
  title?: string;
  location?: string;
  status?: 'available' | 'pending' | 'sold';
  price?: number;
  surface?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  propertyType?: string;
  [key: string]: any; // Pour permettre d'autres propriétés
}

export interface Property {
  id: string;
  user_id: string;
  metadata: PropertyMetadata;
  created_at: string;
  updated_at: string;
  property_media?: PropertyMedia[];
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}
