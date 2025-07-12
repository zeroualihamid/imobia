import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Plus, MapPin, Bed, Bath, Square, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCombinedProperties } from '@/hooks/useCombinedProperties';
import { PropertyMetadata } from '@/types/property';

const Biens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { properties, isLoading, error } = useCombinedProperties();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'sold':
        return <Badge className="bg-slate-100 text-slate-800">Vendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  const getPropertyImage = (property: any) => {
    // Pour les propriétés avec media
    if (property.property_media && property.property_media.length > 0) {
      return `https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/property-media/${property.property_media[0].file_path}`;
    }
    
    // Images placeholder par défaut
    const placeholderImages = [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
    ];
    
    // Utiliser l'ID pour sélectionner une image de manière déterministe
    const index = property.id.charCodeAt(0) % placeholderImages.length;
    return placeholderImages[index];
  };

  const filteredProperties = properties.filter(property => {
    const metadata = property.metadata as PropertyMetadata;
    const title = metadata?.title || '';
    const locationStr = formatLocation(metadata?.location);
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           locationStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              Gestion des Biens
            </h1>
            <p className="text-slate-600">
              Gérez votre portefeuille immobilier
            </p>
          </div>
          <Link to="/biens/ajouter">
            <Button className="bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un bien
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des biens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              Gestion des Biens
            </h1>
            <p className="text-slate-600">
              Gérez votre portefeuille immobilier
            </p>
          </div>
          <Link to="/biens/ajouter">
            <Button className="bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un bien
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
            <p className="text-red-600">
              Impossible de charger les biens. Veuillez réessayer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Gestion des Biens
          </h1>
          <p className="text-slate-600">
            Gérez votre portefeuille immobilier
          </p>
        </div>
        <Link to="/biens/ajouter">
          <Button className="bg-blue-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un bien
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par titre ou localisation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const metadata = property.metadata as PropertyMetadata;
          const locationStr = formatLocation(metadata?.location);
          
          return (
            <Card 
              key={property.id} 
              className="bg-white transition-all duration-200 border border-slate-200 overflow-hidden cursor-pointer"
              onClick={() => {
                navigate(`/biens/${property.id}`);
              }}
            >
              <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden relative">
                {property.property_media && property.property_media.length > 0 ? (
                  <img 
                    src={`https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/property-media/${property.property_media[0].file_path}`}
                    alt={metadata?.title || 'Bien immobilier'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                    {metadata?.title || 'Sans titre'}
                  </CardTitle>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(metadata?.status || 'available')}
                    {property.source === 'biens' && (
                      <Badge variant="outline" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Propriétaire
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-slate-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {locationStr}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-primary">
                    {metadata?.price ? `${metadata.price} €` : 'Prix non défini'}
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProperties.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun bien trouvé</h3>
          <p className="text-slate-600 mb-4">
            {properties.length === 0 
              ? "Vous n'avez pas encore ajouté de bien." 
              : "Aucun bien ne correspond à votre recherche."
            }
          </p>
          <Link to="/biens/ajouter">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {properties.length === 0 ? "Ajouter votre premier bien" : "Ajouter un bien"}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Biens;
