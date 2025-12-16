import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Bed, 
  Bath, 
  CheckSquare,
  Send,
  Share2,
  Search,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCombinedProperties } from '@/hooks/useCombinedProperties';
import { PropertyMetadata } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import BienSearchDialog from '@/components/BienSearchDialog';
import { Filter } from 'lucide-react';

const Biens = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const navigate = useNavigate();
  const { properties, isLoading, error, refetch } = useCombinedProperties();
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'sold':
        return <Badge className="bg-slate-100 text-slate-800">Vendu</Badge>;
      default:
        return <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>;
    }
  };

  const formatLocation = (location: PropertyMetadata['location']): string => {
    if (!location) return 'Localisation non définie';
    
    if (typeof location === 'string') {
      return location;
    }
    
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.neighborhood) parts.push(location.neighborhood);
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    
    return parts.length > 0 ? parts.join(', ') : 'Localisation non définie';
  };

  const getPropertyImage = (property: { id: string; property_media?: Array<{ file_path: string }>; bien_media?: Array<{ file_path: string }> }) => {
    // Check for bien_media first (from biens table)
    if (property.bien_media && property.bien_media.length > 0) {
      return `https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/bien-media/${property.bien_media[0].file_path}`;
    }
    
    // Check for property_media (from properties table)
    if (property.property_media && property.property_media.length > 0) {
      return `https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/property-media/${property.property_media[0].file_path}`;
    }
    
    // Return null if no image available
    return null;
  };

  const performSearch = async (query: string) => {
    if (!query.trim() || !user?.id) {
      setIsSearchMode(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setIsSearchMode(true);
    
    try {
      const searchLower = query.toLowerCase().trim();
      
      // Search in biens table (with user permissions)
      // First, get biens with proprietaires created by user
      const { data: biensWithOwnerData, error: biensWithOwnerError } = await supabase
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
        .or(`titre.ilike.%${searchLower}%,description.ilike.%${searchLower}%,adresse.ilike.%${searchLower}%,ville.ilike.%${searchLower}%,quartier.ilike.%${searchLower}%`)
        .order('created_at', { ascending: false });

      if (biensWithOwnerError) throw biensWithOwnerError;

      // Get biens without proprietaire
      const { data: biensWithoutOwnerData, error: biensWithoutOwnerError } = await supabase
        .from('biens')
        .select(`
          *,
          bien_media (*)
        `)
        .is('proprietaire_id', null)
        .or(`titre.ilike.%${searchLower}%,description.ilike.%${searchLower}%,adresse.ilike.%${searchLower}%,ville.ilike.%${searchLower}%,quartier.ilike.%${searchLower}%`)
        .order('created_at', { ascending: false });

      if (biensWithoutOwnerError) throw biensWithoutOwnerError;

      // Combine both biens queries
      const biensData = [...(biensWithOwnerData || []), ...(biensWithoutOwnerData || [])];

      // Search in properties table (fetch all and filter client-side for JSONB)
      const { data: allPropertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Filter properties client-side by searching in metadata JSONB
      const filteredProperties = (allPropertiesData || []).filter((property: any) => {
        const metadata = property.metadata || {};
        const title = (metadata.title || '').toLowerCase();
        const description = (metadata.description || '').toLowerCase();
        const address = (metadata.location?.address || '').toLowerCase();
        const city = (metadata.location?.city || '').toLowerCase();
        const neighborhood = (metadata.location?.neighborhood || '').toLowerCase();
        
        return title.includes(searchLower) ||
               description.includes(searchLower) ||
               address.includes(searchLower) ||
               city.includes(searchLower) ||
               neighborhood.includes(searchLower);
      });

      // Convert biens to the same format as useCombinedProperties
      const convertedBiens = (biensData || []).map((bien: any) => ({
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

      // Convert properties to same format
      const convertedProperties = filteredProperties.map((property: any) => ({
        id: property.id,
        user_id: property.user_id,
        metadata: property.metadata as PropertyMetadata,
        created_at: property.created_at,
        updated_at: property.updated_at,
        property_media: property.property_media || [],
        source: 'properties' as const,
      }));

      // Combine results
      const combined = [...convertedProperties, ...convertedBiens].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSearchResults(combined);
    } catch (err) {
      console.error('Error searching properties:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    performSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setSearchResults([]);
    refetch();
  };

  const handleAdvancedSearch = (results: any[]) => {
    setSearchResults(results);
    setIsSearchMode(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Use search results if in search mode, otherwise show all properties
  const displayProperties = isSearchMode ? searchResults : properties;

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle chat message
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement des biens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600">
            Impossible de charger les biens. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="bg-white border border-slate-200">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Rechercher un bien (titre, adresse, ville, quartier...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowAdvancedSearch(true);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Recherche avancée
            </Button>
          </div>
          {isSearchMode && (
            <div className="mt-2 text-sm text-slate-600">
              {searchResults.length > 0 ? (
                <span>{searchResults.length} résultat(s) trouvé(s)</span>
              ) : (
                <span>Aucun résultat trouvé</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Search Dialog */}
      <BienSearchDialog
        open={showAdvancedSearch}
        onOpenChange={setShowAdvancedSearch}
        onSearch={handleAdvancedSearch}
        onSearchingChange={setIsSearching}
      />

      {/* Property Cards */}
      <div className="space-y-4">
        {displayProperties.map((property) => {
          const metadata = property.metadata as PropertyMetadata;
          const locationStr = formatLocation(metadata?.location);
          
          return (
            <Card 
              key={property.id} 
              className="bg-white border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                navigate(`/biens/${property.id}`);
              }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Property Image - only show if image exists */}
                {(() => {
                  const imageUrl = getPropertyImage(property);
                  return imageUrl ? (
                    <div className="w-full sm:w-48 h-32 flex-shrink-0">
                      <img 
                        src={imageUrl}
                        alt={metadata?.title || 'Bien immobilier'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null;
                })()}

                {/* Property Details */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {metadata?.title || 'Sans titre'}
                      </h3>
                      {property.isShared && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          <Share2 className="h-3 w-3 mr-1" />
                          Partagé
                        </Badge>
                      )}
                    </div>
                    {getStatusBadge(metadata?.status || 'available')}
                  </div>
                  
                  <div className="flex items-center text-slate-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {locationStr}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center">
                      <CheckSquare className="h-4 w-4 mr-1" />
                      {metadata?.surface ? 
                        (typeof metadata.surface === 'number' ? `${metadata.surface} m²` : 
                         metadata.surface.builtArea ? `${metadata.surface.builtArea} m²` : '-') 
                        : '-'}
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {metadata?.bedrooms || '-'}
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {metadata?.bathrooms || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {displayProperties.length === 0 && !isLoading && !isSearching && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun bien trouvé</h3>
          <p className="text-slate-600 mb-4">
            {isSearchMode 
              ? "Aucun bien ne correspond à votre recherche."
              : properties.length === 0 
                ? "Vous n'avez pas encore ajouté de bien." 
                : "Aucun bien ne correspond à votre recherche."
            }
          </p>
          {!isSearchMode && (
            <Link to="/biens/ajouter">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {properties.length === 0 ? "Ajouter votre premier bien" : "Ajouter un bien"}
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Biens;
