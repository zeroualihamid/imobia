export interface PropertyMetadata {
  title?: string;
  location?: string | {
    city?: string;
    region?: string;
    address?: string;
    district?: string;
    neighborhood?: string;
  };
  status?: 'available' | 'pending' | 'sold';
  price?: number;
  surface?: number | {
    builtArea?: number;
    livingArea?: number;
    outdoorArea?: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  rooms?: number;
  description?: string;
  propertyType?: string;
  category?: string;
  condition?: string;
  features?: string[];
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
