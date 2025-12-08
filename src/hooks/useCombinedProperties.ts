
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyMetadata } from '@/types/property';
import { Bien } from '@/types/proprietaire';

interface CombinedProperty {
  id: string;
  user_id: string;
  metadata: PropertyMetadata;
  created_at: string;
  updated_at: string;
  property_media?: any[];
  bien_media?: any[];
  source: 'properties' | 'biens';
  original_data?: Bien;
  isShared?: boolean;
}

export const useCombinedProperties = () => {
  const [properties, setProperties] = useState<CombinedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchCombinedProperties = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from properties table
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Fetch from biens table (via proprietaires created by user)
      const { data: biensData, error: biensError } = await supabase
        .from('biens')
        .select(`
          *,
          bien_media (*),
          proprietaires!inner (
            id,
            nom,
            prenom,
            raison_sociale,
            created_by
          )
        `)
        .eq('proprietaires.created_by', user.id)
        .order('created_at', { ascending: false });

      if (biensError) throw biensError;

      // Fetch shared biens (properties shared with this user)
      const { data: sharedBiensData, error: sharedBiensError } = await supabase
        .from('bien_shares')
        .select(`
          bien_id,
          biens!inner (
            *,
            bien_media (*)
          )
        `)
        .eq('shared_with_user_id', user.id);

      if (sharedBiensError) throw sharedBiensError;

      // Convert owned biens to properties format
      const convertedBiens: CombinedProperty[] = (biensData || []).map((bien: any) => ({
        id: bien.id,
        user_id: user.id,
        source: 'biens' as const,
        original_data: bien,
        created_at: bien.created_at,
        updated_at: bien.updated_at,
        isShared: false,
        metadata: {
          title: bien.titre,
          description: bien.description,
          location: {
            address: bien.adresse,
            city: bien.ville,
            neighborhood: bien.quartier,
          },
          status: bien.status?.toLowerCase() === 'disponible' ? 'available' : 
                 bien.status?.toLowerCase() === 'vendu' ? 'sold' : 'pending',
          price: bien.prix_vente || bien.prix_location,
          surface: {
            builtArea: bien.surface_habitable,
            livingArea: bien.surface_habitable,
          },
          bedrooms: bien.nombre_chambres,
          bathrooms: bien.nombre_salles_bain,
          propertyType: bien.type?.toLowerCase(),
          features: [
            ...(bien.parking ? ['Parking'] : []),
            ...(bien.jardin ? ['Jardin'] : []),
            ...(bien.piscine ? ['Piscine'] : []),
            ...(bien.ascenseur ? ['Ascenseur'] : []),
            ...(bien.climatisation ? ['Climatisation'] : []),
            ...(bien.chauffage ? ['Chauffage'] : []),
            ...(bien.meuble ? ['Meublé'] : []),
          ],
        },
        bien_media: bien.bien_media || [],
        property_media: [],
      }));

      // Convert shared biens to properties format
      const convertedSharedBiens: CombinedProperty[] = (sharedBiensData || []).map((share: any) => {
        const bien = share.biens;
        return {
          id: bien.id,
          user_id: user.id,
          source: 'biens' as const,
          original_data: bien,
          created_at: bien.created_at,
          updated_at: bien.updated_at,
          isShared: true,
          metadata: {
            title: bien.titre,
            description: bien.description,
            location: {
              address: bien.adresse,
              city: bien.ville,
              neighborhood: bien.quartier,
            },
            status: bien.status?.toLowerCase() === 'disponible' ? 'available' : 
                   bien.status?.toLowerCase() === 'vendu' ? 'sold' : 'pending',
            price: bien.prix_vente || bien.prix_location,
            surface: {
              builtArea: bien.surface_habitable,
              livingArea: bien.surface_habitable,
            },
            bedrooms: bien.nombre_chambres,
            bathrooms: bien.nombre_salles_bain,
            propertyType: bien.type?.toLowerCase(),
            features: [
              ...(bien.parking ? ['Parking'] : []),
              ...(bien.jardin ? ['Jardin'] : []),
              ...(bien.piscine ? ['Piscine'] : []),
              ...(bien.ascenseur ? ['Ascenseur'] : []),
              ...(bien.climatisation ? ['Climatisation'] : []),
              ...(bien.chauffage ? ['Chauffage'] : []),
              ...(bien.meuble ? ['Meublé'] : []),
            ],
          },
          bien_media: bien.bien_media || [],
          property_media: [],
        };
      });

      // Convert properties to same format - fix the TypeScript error
      const convertedProperties: CombinedProperty[] = (propertiesData || []).map((property: any) => ({
        id: property.id,
        user_id: property.user_id,
        metadata: property.metadata as PropertyMetadata,
        created_at: property.created_at,
        updated_at: property.updated_at,
        property_media: property.property_media || [],
        source: 'properties' as const,
      }));

      // Combine and sort by creation date (excluding duplicates)
      const ownedIds = new Set([...convertedProperties, ...convertedBiens].map(p => p.id));
      const uniqueSharedBiens = convertedSharedBiens.filter(p => !ownedIds.has(p.id));
      
      const combined = [...convertedProperties, ...convertedBiens, ...uniqueSharedBiens].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setProperties(combined);
    } catch (err) {
      console.error('Error fetching combined properties:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCombinedProperties();
  }, [user?.id]);

  return {
    properties,
    isLoading,
    error,
    refetch: fetchCombinedProperties,
  };
};
