
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Plus, MapPin, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Property, PropertyMetadata } from '@/types/property';

const Biens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Fetch properties from Supabase
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data as Property[] || [];
    },
    enabled: !!user?.id,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Disponible</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>;
      case 'sold':
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">Vendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPropertyImage = (property: Property) => {
    const firstMedia = property.property_media?.[0];
    if (firstMedia) {
      const { data } = supabase.storage.from('property-media').getPublicUrl(firstMedia.file_path);
      return data.publicUrl;
    }
    return null;
  };

  const filteredProperties = properties.filter(property => {
    const metadata = property.metadata as PropertyMetadata;
    const title = metadata?.title || '';
    const location = metadata?.location || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.toLowerCase().includes(searchTerm.toLowerCase());
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
          const imageUrl = getPropertyImage(property);
          
          return (
            <Card key={property.id} className="bg-white hover:shadow-lg transition-all duration-200 border border-slate-200 overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={metadata?.title || 'Photo du bien'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><Building2 class="h-12 w-12 text-muted-foreground" /></div>';
                    }}
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                    {metadata?.title || 'Sans titre'}
                  </CardTitle>
                  {getStatusBadge(metadata?.status || 'available')}
                </div>
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {metadata?.location || 'Localisation non définie'}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-primary">
                    {metadata?.price ? `${metadata.price} €` : 'Prix non défini'}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {metadata?.surface ? `${metadata.surface} m²` : '-'}
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
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Aucun bien trouvé</h3>
          <p className="text-muted-foreground mb-4">
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
