import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ClipboardList, Home, MapPin, FileText, Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PropertyMap from '@/components/PropertyMap';
import ShareDemandeDialog from '@/components/demandes/ShareDemandeDialog';
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

const typesBien = [
  'Appartement', 'Villa', 'Bureau', 'Commerce', 'Terrain',
  'Maison', 'Duplex', 'Studio', 'Triplex', 'Local commercial', 'Ferme', 'Riad'
];

const DetailDemande = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [demande, setDemande] = useState<Demande | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Demande>>({});
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [saving, setSaving] = useState(false);
  const viewMapContainer = useRef<HTMLDivElement>(null);
  const viewMapRef = useRef<L.Map | null>(null);

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
        setFormData(data);
        if (data.longitude && data.latitude) {
          setCoordinates([data.longitude, data.latitude]);
        }
      }
      setLoading(false);
    };

    fetchDemande();
  }, [id, navigate]);

  // Initialize read-only map when not editing
  useEffect(() => {
    // Don't initialize if editing or loading, or if container not ready
    if (editingSection === 'localisation' || loading || !viewMapContainer.current || !demande) {
      return;
    }

    // Clean up existing map
    if (viewMapRef.current) {
      viewMapRef.current.remove();
      viewMapRef.current = null;
    }

    // Use stored coordinates or default to Casablanca
    const lat = demande.latitude || 33.5731;
    const lng = demande.longitude || -7.5898;

    viewMapRef.current = L.map(viewMapContainer.current).setView([lat, lng], demande.latitude ? 15 : 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(viewMapRef.current);

    // Only add marker if we have actual coordinates
    if (demande.latitude && demande.longitude) {
      const blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      L.marker([demande.latitude, demande.longitude], { icon: blueIcon })
        .addTo(viewMapRef.current)
        .bindPopup('Position de la demande');
    }

    return () => {
      if (viewMapRef.current) {
        viewMapRef.current.remove();
        viewMapRef.current = null;
      }
    };
  }, [demande, loading, editingSection]);

  const handleChange = (field: keyof Demande, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const startEditing = (section: string) => {
    setEditingSection(section);
    setFormData({ ...demande });
    if (demande?.longitude && demande?.latitude) {
      setCoordinates([demande.longitude, demande.latitude]);
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setFormData({ ...demande });
    if (demande?.longitude && demande?.latitude) {
      setCoordinates([demande.longitude, demande.latitude]);
    }
  };

  const saveSection = async () => {
    if (!id) return;
    setSaving(true);

    try {
      const updateData: Partial<Demande> = {};
      
      if (editingSection === 'client') {
        updateData.client_nom_complet = formData.client_nom_complet || '';
        updateData.telephone = formData.telephone || null;
        updateData.email = formData.email || '';
        updateData.budget = formData.budget || null;
      } else if (editingSection === 'caracteristiques') {
        updateData.type_bien = formData.type_bien || null;
        updateData.superficie = formData.superficie || null;
      } else if (editingSection === 'localisation') {
        updateData.adresse_complete = formData.adresse_complete || null;
        updateData.latitude = coordinates ? coordinates[1] : null;
        updateData.longitude = coordinates ? coordinates[0] : null;
      } else if (editingSection === 'description') {
        updateData.description = formData.description || null;
      }

      const { error } = await supabase
        .from('demandes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setDemande(prev => prev ? { ...prev, ...updateData } : null);
      setEditingSection(null);
      toast.success('Modifications enregistrées');
    } catch (error) {
      console.error('Error updating demande:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

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

  const EditButton = ({ section }: { section: string }) => (
    <Button variant="ghost" size="sm" onClick={() => startEditing(section)}>
      <Pencil className="h-4 w-4" />
    </Button>
  );

  const SaveCancelButtons = () => (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={cancelEditing} disabled={saving}>
        <X className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={saveSection} disabled={saving}>
        <Save className="h-4 w-4" />
      </Button>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </Layout>
    );
  }

  if (!demande) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/demandes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Demande de {demande.client_nom_complet}</h1>
              <p className="text-muted-foreground mt-1">
                Créée le {format(new Date(demande.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareDemandeDialog demandeId={demande.id} clientName={demande.client_nom_complet} />
            {getStatusBadge(demande.status)}
          </div>
        </div>

        {/* Client Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Informations du client
            </CardTitle>
            {editingSection === 'client' ? <SaveCancelButtons /> : <EditButton section="client" />}
          </CardHeader>
          <CardContent className="space-y-6">
            {editingSection === 'client' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_nom_complet">Client (Nom complet) *</Label>
                  <Input
                    id="client_nom_complet"
                    value={formData.client_nom_complet || ''}
                    onChange={(e) => handleChange('client_nom_complet', e.target.value)}
                    placeholder="Nom et prénom du client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone || ''}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (MAD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => handleChange('budget', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="250000"
                    min="0"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client (Nom complet)</p>
                  <p className="font-medium">{demande.client_nom_complet}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{demande.telephone || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{demande.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">{formatCurrency(demande.budget)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Caracteristiques Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Caractéristiques du bien recherché
            </CardTitle>
            {editingSection === 'caracteristiques' ? <SaveCancelButtons /> : <EditButton section="caracteristiques" />}
          </CardHeader>
          <CardContent className="space-y-6">
            {editingSection === 'caracteristiques' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type_bien">Type de bien</Label>
                  <Select
                    value={formData.type_bien || 'all'}
                    onValueChange={(value) => handleChange('type_bien', value === 'all' ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de bien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Sélectionner...</SelectItem>
                      {typesBien.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="superficie">Superficie (m²)</Label>
                  <Input
                    id="superficie"
                    type="number"
                    value={formData.superficie || ''}
                    onChange={(e) => handleChange('superficie', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type de bien</p>
                  <p className="font-medium">{demande.type_bien || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Superficie</p>
                  <p className="font-medium">{demande.superficie ? `${demande.superficie} m²` : 'Non spécifiée'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Localisation Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Localisation
            </CardTitle>
            {editingSection === 'localisation' ? <SaveCancelButtons /> : <EditButton section="localisation" />}
          </CardHeader>
          <CardContent className="space-y-6">
            {editingSection === 'localisation' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="adresse_complete">Adresse complète</Label>
                  <Textarea
                    id="adresse_complete"
                    value={formData.adresse_complete || ''}
                    onChange={(e) => handleChange('adresse_complete', e.target.value)}
                    placeholder="Rue, quartier, ville, code postal..."
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-base font-medium">Localisation sur la carte</Label>
                  <PropertyMap
                    address={formData.adresse_complete || ''}
                    city=""
                    region="Maroc"
                    onLocationUpdate={(coords) => setCoordinates(coords)}
                    onAddressUpdate={(addressData) => {
                      const addressParts = [];
                      if (addressData.adresse) addressParts.push(addressData.adresse);
                      if (addressData.quartier) addressParts.push(addressData.quartier);
                      if (addressData.ville) addressParts.push(addressData.ville);
                      if (addressData.code_postal) addressParts.push(addressData.code_postal);
                      const fullAddress = addressParts.join(', ');
                      if (fullAddress) handleChange('adresse_complete', fullAddress);
                    }}
                    initialCoordinates={coordinates || undefined}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse complète</p>
                  <p className="font-medium">{demande.adresse_complete || 'Non spécifiée'}</p>
                </div>
                {demande.latitude && demande.longitude && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Coordonnées GPS</p>
                    <p className="font-mono text-sm">{demande.latitude.toFixed(6)}, {demande.longitude.toFixed(6)}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Localisation sur la carte</Label>
                  <div 
                    ref={viewMapContainer}
                    className="h-80 rounded-lg overflow-hidden border border-border"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Description
            </CardTitle>
            {editingSection === 'description' ? <SaveCancelButtons /> : <EditButton section="description" />}
          </CardHeader>
          <CardContent>
            {editingSection === 'description' ? (
              <div className="space-y-2">
                <Label htmlFor="description">Description de la demande</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Décrivez les besoins et préférences du client..."
                  rows={6}
                />
              </div>
            ) : (
              <p className="text-foreground whitespace-pre-wrap">
                {demande.description || 'Aucune description fournie'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetailDemande;
