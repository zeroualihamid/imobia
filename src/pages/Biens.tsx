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
import { useLanguage } from '@/contexts/LanguageContext';
import BienSearchDialog from '@/components/BienSearchDialog';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const Biens = () => {
  const { t, isRTL } = useLanguage();
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
        return <Badge className="bg-emerald-100 text-emerald-800">{t('property.available')}</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">{t('property.pending')}</Badge>;
      case 'sold':
        return <Badge className="bg-slate-100 text-slate-800">{t('property.sold')}</Badge>;
      default:
        return <Badge className="bg-emerald-100 text-emerald-800">{t('property.available')}</Badge>;
    }
  };

  const formatLocation = (location: PropertyMetadata['location']): string => {
    if (!location) return t('property.locationNotDefined');
    
    if (typeof location === 'string') {
      return location;
    }
    
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.neighborhood) parts.push(location.neighborhood);
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    
    return parts.length > 0 ? parts.join(', ') : t('property.locationNotDefined');
  };

  const getPropertyImage = (property: { id: string; property_media?: Array<{ file_path: string }>; bien_media?: Array<{ file_path: string }> }) => {
    if (property.bien_media && property.bien_media.length > 0) {
      return `https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/bien-media/${property.bien_media[0].file_path}`;
    }
    
    if (property.property_media && property.property_media.length > 0) {
      return `https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/property-media/${property.property_media[0].file_path}`;
    }
    
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

      const biensData = [...(biensWithOwnerData || []), ...(biensWithoutOwnerData || [])];

      const { data: allPropertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

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

      const convertedProperties = filteredProperties.map((property: any) => ({
        id: property.id,
        user_id: property.user_id,
        metadata: property.metadata as PropertyMetadata,
        created_at: property.created_at,
        updated_at: property.updated_at,
        property_media: property.property_media || [],
        source: 'properties' as const,
      }));

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

  const displayProperties = isSearchMode ? searchResults : properties;

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">{t('property.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">{t('property.loadError')}</h3>
          <p className="text-red-600">{t('property.loadErrorDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="bg-white border border-slate-200">
        <CardContent className="pt-6">
          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
            <div className="flex-1 relative">
              <Search className={cn("absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400", isRTL ? "right-3" : "left-3")} />
              <Input
                type="text"
                placeholder={t('property.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className={cn(isRTL ? "pr-10 pl-10" : "pl-10 pr-10")}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className={cn("absolute top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600", isRTL ? "left-3" : "right-3")}
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
                  <div className={cn("animate-spin rounded-full h-4 w-4 border-b-2 border-white", isRTL ? "ml-2" : "mr-2")}></div>
                  {t('property.searching')}
                </>
              ) : (
                <>
                  <Search className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {t('property.searchBtn')}
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowAdvancedSearch(true);
              }}
            >
              <Filter className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('property.advancedSearch')}
            </Button>
          </div>
          {isSearchMode && (
            <div className={cn("mt-2 text-sm text-slate-600", isRTL && "text-right")}>
              {searchResults.length > 0 ? (
                <span>{t('property.resultsFound').replace('{count}', searchResults.length.toString())}</span>
              ) : (
                <span>{t('property.noResults')}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
                // Route to correct detail page based on property source
                const route = property.source === 'properties' 
                  ? `/property/${property.id}` 
                  : `/biens/${property.id}`;
                navigate(route);
              }}
            >
              <div className={cn("flex flex-col sm:flex-row", isRTL && "sm:flex-row-reverse")}>
                {(() => {
                  const imageUrl = getPropertyImage(property);
                  return imageUrl ? (
                    <div className="w-full sm:w-48 h-32 flex-shrink-0">
                      <img 
                        src={imageUrl}
                        alt={metadata?.title || t('property.noTitle')}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null;
                })()}

                <div className={cn("flex-1 p-4", isRTL && "text-right")}>
                  <div className={cn("flex items-start justify-between mb-2", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {metadata?.title || t('property.noTitle')}
                      </h3>
                      {property.isShared && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          <Share2 className={cn("h-3 w-3", isRTL ? "ml-1" : "mr-1")} />
                          {t('property.shared')}
                        </Badge>
                      )}
                    </div>
                    {getStatusBadge(metadata?.status || 'available')}
                  </div>
                  
                  <div className={cn("flex items-center text-slate-600 text-sm mb-3", isRTL && "flex-row-reverse")}>
                    <MapPin className={cn("h-4 w-4", isRTL ? "ml-1" : "mr-1")} />
                    {locationStr}
                  </div>

                  <div className={cn("flex items-center gap-4 text-sm text-slate-600", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                      <CheckSquare className={cn("h-4 w-4", isRTL ? "ml-1" : "mr-1")} />
                      {metadata?.surface ? 
                        (typeof metadata.surface === 'number' ? `${metadata.surface} m²` : 
                         metadata.surface.builtArea ? `${metadata.surface.builtArea} m²` : '-') 
                        : '-'}
                    </div>
                    <div className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                      <Bed className={cn("h-4 w-4", isRTL ? "ml-1" : "mr-1")} />
                      {metadata?.bedrooms || '-'}
                    </div>
                    <div className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                      <Bath className={cn("h-4 w-4", isRTL ? "ml-1" : "mr-1")} />
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
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('property.noProperties')}</h3>
          <p className="text-slate-600 mb-4">
            {isSearchMode 
              ? t('property.noPropertiesSearch')
              : properties.length === 0 
                ? t('property.noPropertiesYet')
                : t('property.noPropertiesSearch')
            }
          </p>
          {!isSearchMode && (
            <Link to="/biens/ajouter">
              <Button>
                <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {properties.length === 0 ? t('property.addFirst') : t('property.addNew')}
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Biens;
