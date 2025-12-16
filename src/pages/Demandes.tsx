import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, ClipboardList } from 'lucide-react';
import PropertyMap from '@/components/PropertyMap';
import { toast } from 'sonner';

const Demandes = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const [formData, setFormData] = useState({
    client_nom_complet: '',
    telephone: '',
    email: '',
    budget: '',
    type_bien: '',
    superficie: '',
    adresse_complete: '',
    description: ''
  });
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isUpdatingFromMap, setIsUpdatingFromMap] = useState(false);

  const typesBien = [
    'Appartement',
    'Villa',
    'Bureau',
    'Commerce',
    'Terrain',
    'Maison',
    'Duplex',
    'Studio',
    'Triplex',
    'Local commercial',
    'Ferme',
    'Riad'
  ];

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reverse geocode coordinates to get address when pin is moved
  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        const streetNumber = addr.house_number || '';
        const street = addr.road || addr.street || '';
        const fullAddress = streetNumber ? `${streetNumber} ${street}` : street;
        const quartier = addr.suburb || addr.neighbourhood || '';
        const ville = addr.city || addr.town || addr.village || '';
        const codePostal = addr.postcode || '';
        
        const addressParts = [];
        if (fullAddress.trim()) addressParts.push(fullAddress.trim());
        if (quartier) addressParts.push(quartier);
        if (ville) addressParts.push(ville);
        if (codePostal) addressParts.push(codePostal);
        
        return addressParts.join(', ');
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  // Automatically reverse geocode when coordinates change (pin moved)
  // Only if address field is not empty (user has entered something)
  useEffect(() => {
    if (coordinates && formData.adresse_complete && !isUpdatingFromMap) {
      const timer = setTimeout(async () => {
        setIsReverseGeocoding(true);
        const address = await reverseGeocode(coordinates[1], coordinates[0]);
        setIsReverseGeocoding(false);
        
        if (address) {
          setIsUpdatingFromMap(true);
          handleChange('adresse_complete', address);
          // Reset flag after a short delay
          setTimeout(() => setIsUpdatingFromMap(false), 100);
        }
      }, 500); // Small delay to avoid too many requests
      
      return () => clearTimeout(timer);
    }
  }, [coordinates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.client_nom_complet || !formData.email) {
        toast.error('Veuillez remplir les champs obligatoires (Nom complet et Email)');
        setLoading(false);
        return;
      }

      // TODO: Intégrer avec Supabase pour sauvegarder la demande
      const demandeData = {
        ...formData,
        coordinates: coordinates,
        created_at: new Date().toISOString()
      };

      console.log('Données de la demande:', demandeData);
      
      toast.success('Demande créée avec succès');
      // Navigate to demandes list or reset form
      navigate('/demandes');
    } catch (error) {
      console.error('Error creating demande:', error);
      toast.error('Erreur lors de la création de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/demandes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nouvelle demande</h1>
          <p className="text-slate-600 mt-1">Créer une nouvelle demande client</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Informations du client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_nom_complet">Client (Nom complet) *</Label>
                <Input
                  id="client_nom_complet"
                  value={formData.client_nom_complet}
                  onChange={(e) => handleChange('client_nom_complet', e.target.value)}
                  placeholder="Nom et prénom du client"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="client@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (MAD)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="250000"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Caractéristiques du bien recherché</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type_bien">Type de bien</Label>
                <Select
                  value={formData.type_bien || 'all'}
                  onValueChange={(value) => handleChange('type_bien', value === 'all' ? '' : value)}
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
                  value={formData.superficie}
                  onChange={(e) => handleChange('superficie', e.target.value)}
                  placeholder="100"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adresse_complete">Adresse complète</Label>
              <Textarea
                id="adresse_complete"
                value={formData.adresse_complete}
                onChange={(e) => handleChange('adresse_complete', e.target.value)}
                placeholder="Rue, quartier, ville, code postal..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Localisation sur la carte</Label>
              <PropertyMap
                address={formData.adresse_complete}
                city=""
                region="Maroc"
                onLocationUpdate={(coords) => {
                  setCoordinates(coords);
                  console.log('Coordonnées GPS mises à jour:', coords);
                }}
                onAddressUpdate={(addressData) => {
                  const addressParts = [];
                  if (addressData.adresse) addressParts.push(addressData.adresse);
                  if (addressData.quartier) addressParts.push(addressData.quartier);
                  if (addressData.ville) addressParts.push(addressData.ville);
                  if (addressData.code_postal) addressParts.push(addressData.code_postal);
                  
                  const fullAddress = addressParts.join(', ');
                  if (fullAddress) {
                    setIsUpdatingFromMap(true);
                    handleChange('adresse_complete', fullAddress);
                    setTimeout(() => setIsUpdatingFromMap(false), 100);
                  }
                }}
                initialCoordinates={coordinates || undefined}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Description de la demande</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Décrivez les besoins et préférences du client..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/demandes')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer la demande'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Demandes;

