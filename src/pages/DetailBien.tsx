
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Building, MapPin, Euro, Square, Bed, Bath,
  Calendar, Edit, Trash2, Image
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type Bien = Database['public']['Tables']['biens']['Row'];

const DetailBien = () => {
  const { id } = useParams<{ id: string }>();
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadBien();
    }
  }, [id]);

  const loadBien = async () => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('biens')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBien(data);
    } catch (error) {
      console.error('Error loading bien:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return 'Disponible';
      case 'RESERVE': return 'Réservé';
      case 'VENDU': return 'Vendu';
      case 'LOUE': return 'Loué';
      case 'RETIRE': return 'Retiré';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return 'bg-green-100 text-green-800';
      case 'RESERVE': return 'bg-yellow-100 text-yellow-800';
      case 'VENDU': return 'bg-blue-100 text-blue-800';
      case 'LOUE': return 'bg-purple-100 text-purple-800';
      case 'RETIRE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBienTypeLabel = (type: string) => {
    switch (type) {
      case 'VENTE': return 'Vente';
      case 'LOCATION': return 'Location';
      case 'VENTE_LOCATION': return 'Vente/Location';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!bien) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Bien non trouvé</h3>
        <Link to="/biens">
          <Button>Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/biens">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{bien.titre}</h1>
          <p className="text-slate-600 mt-1">{bien.adresse}, {bien.ville}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image principale */}
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-lg">
              <Image className="h-16 w-16 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        {/* Informations principales */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Informations générales</CardTitle>
              <div className="flex flex-col gap-2">
                <Badge className={getStatusColor(bien.status)}>
                  {getStatusLabel(bien.status)}
                </Badge>
                <Badge variant="outline">{getBienTypeLabel(bien.type)}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {bien.prix_vente ? `${bien.prix_vente.toLocaleString()} MAD` : '-'}
                </div>
                <div className="text-sm text-slate-600">Prix de vente</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {bien.prix_location ? `${bien.prix_location.toLocaleString()} MAD/mois` : '-'}
                </div>
                <div className="text-sm text-slate-600">Prix de location</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Square className="h-4 w-4 mr-1" />
                </div>
                <div className="font-semibold">{bien.surface_habitable || '-'} m²</div>
                <div className="text-sm text-slate-600">Surface</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Bed className="h-4 w-4 mr-1" />
                </div>
                <div className="font-semibold">{bien.nombre_chambres || '-'}</div>
                <div className="text-sm text-slate-600">Chambres</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Bath className="h-4 w-4 mr-1" />
                </div>
                <div className="font-semibold">{bien.nombre_salles_bain || '-'}</div>
                <div className="text-sm text-slate-600">Salles de bain</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {bien.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700">{bien.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Équipements */}
      <Card>
        <CardHeader>
          <CardTitle>Équipements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {bien.meuble && <Badge variant="outline">Meublé</Badge>}
            {bien.parking && <Badge variant="outline">Parking</Badge>}
            {bien.jardin && <Badge variant="outline">Jardin</Badge>}
            {bien.piscine && <Badge variant="outline">Piscine</Badge>}
            {bien.ascenseur && <Badge variant="outline">Ascenseur</Badge>}
            {bien.climatisation && <Badge variant="outline">Climatisation</Badge>}
            {bien.chauffage && <Badge variant="outline">Chauffage</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Détails techniques */}
      <Card>
        <CardHeader>
          <CardTitle>Détails techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bien.surface_terrain && (
              <div>
                <label className="text-sm font-medium text-slate-600">Surface terrain</label>
                <p className="font-semibold">{bien.surface_terrain} m²</p>
              </div>
            )}
            {bien.nombre_etages && (
              <div>
                <label className="text-sm font-medium text-slate-600">Nombre d'étages</label>
                <p className="font-semibold">{bien.nombre_etages}</p>
              </div>
            )}
            {bien.annee_construction && (
              <div>
                <label className="text-sm font-medium text-slate-600">Année de construction</label>
                <p className="font-semibold">{bien.annee_construction}</p>
              </div>
            )}
            {bien.charges_mensuelles && (
              <div>
                <label className="text-sm font-medium text-slate-600">Charges mensuelles</label>
                <p className="font-semibold">{bien.charges_mensuelles} MAD</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailBien;
