import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Phone, Mail, MapPin, Home, DollarSign, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Demande {
  id: string;
  client_nom_complet: string;
  telephone: string | null;
  email: string;
  budget: number | null;
  type_bien: string | null;
  superficie: number | null;
  adresse_complete: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

const DetailDemande = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [demande, setDemande] = useState<Demande | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemande = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        toast.error('Erreur lors du chargement de la demande');
        console.error(error);
      } else if (!data) {
        toast.error('Demande non trouvée');
        navigate('/demandes');
      } else {
        setDemande(data);
      }
      setLoading(false);
    };

    fetchDemande();
  }, [id, navigate]);

  // Initialize map when demande is loaded
  useEffect(() => {
    if (!demande?.latitude || !demande?.longitude || !mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current).setView([demande.latitude, demande.longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    L.marker([demande.latitude, demande.longitude]).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [demande]);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'NOUVELLE':
        return <Badge className="bg-blue-500">Nouvelle</Badge>;
      case 'EN_COURS':
        return <Badge className="bg-yellow-500">En cours</Badge>;
      case 'TRAITEE':
        return <Badge className="bg-green-500">Traitée</Badge>;
      default:
        return <Badge variant="secondary">{status || 'N/A'}</Badge>;
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Non spécifié';
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </Layout>
    );
  }

  if (!demande) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/demandes')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Demande de {demande.client_nom_complet}</h1>
              <p className="text-muted-foreground">
                Créée le {format(new Date(demande.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
          </div>
          {getStatusBadge(demande.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{demande.client_nom_complet}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${demande.email}`} className="text-primary hover:underline">
                  {demande.email}
                </a>
              </div>
              {demande.telephone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${demande.telephone}`} className="text-primary hover:underline">
                    {demande.telephone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Critères de Recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type de bien</p>
                  <p className="font-medium">{demande.type_bien || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Superficie</p>
                  <p className="font-medium">
                    {demande.superficie ? `${demande.superficie} m²` : 'Non spécifiée'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">{formatCurrency(demande.budget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                {demande.adresse_complete || 'Adresse non spécifiée'}
              </p>
              {demande.latitude && demande.longitude && (
                <div 
                  ref={mapContainer}
                  className="h-64 rounded-lg overflow-hidden border border-border"
                />
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">
                {demande.description || 'Aucune description fournie'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informations Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Date de création</p>
                <p className="font-medium">
                  {format(new Date(demande.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">
                  {format(new Date(demande.updated_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetailDemande;
