
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Square, Bed, Bath, Calendar, Euro, User, Phone, Mail } from 'lucide-react';
import { useCombinedProperties } from '@/hooks/useCombinedProperties';
import { PropertyMetadata } from '@/types/property';

const DetailBien = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, isLoading, error } = useCombinedProperties();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-600">Impossible de charger les informations du bien</p>
        </div>
      </div>
    );
  }

  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Bien non trouvé</h2>
          <p className="text-gray-600 mb-4">Le bien demandé n'existe pas ou n'est plus disponible</p>
          <Button onClick={() => navigate('/biens')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const metadata = property.metadata as PropertyMetadata;

  const formatLocation = (location: PropertyMetadata['location']): string => {
    if (!location) return 'Non spécifiée';
    
    if (typeof location === 'string') {
      return location;
    }
    
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.neighborhood) parts.push(location.neighborhood);
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    
    return parts.length > 0 ? parts.join(', ') : 'Non spécifiée';
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/biens')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
        {getStatusBadge(metadata?.status || 'available')}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{metadata?.title || 'Bien sans titre'}</CardTitle>
          <div className="flex items-center text-slate-600">
            <MapPin className="h-4 w-4 mr-2" />
            {formatLocation(metadata?.location)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prix */}
          <div className="text-3xl font-bold text-primary">
            {metadata?.price ? `${metadata.price.toLocaleString()} €` : 'Prix non défini'}
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Square className="h-5 w-5 text-slate-500" />
              <span className="text-sm text-slate-600">Surface:</span>
              <span className="font-medium">
                {metadata?.surface ? 
                  (typeof metadata.surface === 'number' ? `${metadata.surface} m²` : 
                   metadata.surface.builtArea ? `${metadata.surface.builtArea} m²` : 'Non spécifiée') 
                  : 'Non spécifiée'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Bed className="h-5 w-5 text-slate-500" />
              <span className="text-sm text-slate-600">Chambres:</span>
              <span className="font-medium">{metadata?.bedrooms || 'Non spécifié'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bath className="h-5 w-5 text-slate-500" />
              <span className="text-sm text-slate-600">Salles de bain:</span>
              <span className="font-medium">{metadata?.bathrooms || 'Non spécifié'}</span>
            </div>
          </div>

          {/* Description */}
          {metadata?.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-slate-700 whitespace-pre-wrap">{metadata.description}</p>
            </div>
          )}

          {/* Caractéristiques supplémentaires */}
          {metadata?.features && metadata.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Équipements</h3>
              <div className="flex flex-wrap gap-2">
                {metadata.features.map((feature, index) => (
                  <Badge key={index} variant="outline">{feature}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations générales</h3>
              <div className="space-y-2 text-sm">
                {metadata?.propertyType && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium capitalize">{metadata.propertyType}</span>
                  </div>
                )}
                {metadata?.category && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Catégorie:</span>
                    <span className="font-medium">{metadata.category}</span>
                  </div>
                )}
                {metadata?.condition && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">État:</span>
                    <span className="font-medium">{metadata.condition}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Dates</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Créé le:</span>
                  <span className="font-medium">
                    {new Date(property.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Modifié le:</span>
                  <span className="font-medium">
                    {new Date(property.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailBien;
