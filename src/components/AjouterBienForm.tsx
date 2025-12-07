
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Building, MapPin, Euro, Home, ChevronDown, ChevronUp, ChevronsUpDown, ImageIcon, Navigation, Loader2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FileUpload, { UploadedFile } from '@/components/ui/FileUpload';
import PropertyMap from '@/components/PropertyMap';
import type { Database } from '@/integrations/supabase/types';

type BienType = Database['public']['Enums']['bien_type'];
type BienStatus = Database['public']['Enums']['bien_status'];

interface AjouterBienFormProps {
  proprietaireId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AjouterBienForm = ({ proprietaireId, onSuccess, onCancel }: AjouterBienFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'VENTE' as BienType,
    status: 'DISPONIBLE' as BienStatus,
    adresse: '',
    ville: '',
    quartier: '',
    code_postal: '',
    description_localisation: '',
    surface_habitable: '',
    surface_terrain: '',
    nombre_chambres: '',
    nombre_salles_bain: '',
    nombre_etages: '',
    annee_construction: '',
    description_caracteristiques: '',
    prix_vente: '',
    prix_location: '',
    charges_mensuelles: '',
    description_prix: '',
    description_photos: '',
    meuble: false,
    parking: false,
    jardin: false,
    piscine: false,
    ascenseur: false,
    climatisation: false,
    chauffage: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [openSections, setOpenSections] = useState({
    general: true,
    location: true,
    characteristics: true,
    price: true,
    images: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const allOpen = Object.values(openSections).every(v => v);
  
  const toggleAllSections = () => {
    const newState = !allOpen;
    setOpenSections({
      general: newState,
      location: newState,
      characteristics: newState,
      price: newState,
      images: newState
    });
  };

  const handleImagesChange = (files: UploadedFile[]) => {
    setUploadedImages(files);
  };

  const handleLocationUpdate = (coords: [number, number]) => {
    setCoordinates(coords);
  };

  const handleGetGpsLocation = () => {
    console.log('GPS button clicked');
    
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      toast({
        title: "Erreur",
        description: "La géolocalisation n'est pas supportée par votre navigateur",
        variant: "destructive"
      });
      return;
    }

    // Check if we're on HTTPS (required for geolocation on mobile)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.log('Not on HTTPS');
      toast({
        title: "Attention",
        description: "La géolocalisation nécessite une connexion sécurisée (HTTPS)",
        variant: "destructive"
      });
    }

    setGpsLoading(true);
    toast({
      title: "Localisation",
      description: "Recherche de votre position GPS..."
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('GPS position obtained:', position.coords);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates([lng, lat]);

        // Reverse geocode to get address
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
          console.log('Reverse geocode result:', data);
          
          if (data && data.address) {
            const address = data.address;
            const streetNumber = address.house_number || '';
            const street = address.road || address.street || '';
            const fullAddress = streetNumber ? `${streetNumber} ${street}` : street;
            
            if (fullAddress) {
              handleInputChange('adresse', fullAddress.trim());
            }
            if (address.city || address.town || address.village) {
              handleInputChange('ville', address.city || address.town || address.village);
            }
            if (address.suburb || address.neighbourhood) {
              handleInputChange('quartier', address.suburb || address.neighbourhood);
            }
            if (address.postcode) {
              handleInputChange('code_postal', address.postcode);
            }
          }
        } catch (error) {
          console.error('Erreur de géocodage inverse:', error);
        }
        
        setGpsLoading(false);
        toast({
          title: "Localisation obtenue",
          description: "Votre position a été détectée avec succès"
        });
      },
      (error) => {
        console.error('GPS error:', error.code, error.message);
        setGpsLoading(false);
        let message = "Impossible d'obtenir votre position";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Veuillez autoriser l'accès à votre position dans les paramètres de votre navigateur";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Position non disponible. Vérifiez que le GPS est activé sur votre appareil";
            break;
          case error.TIMEOUT:
            message = "Délai dépassé. Réessayez dans un endroit avec meilleure réception GPS";
            break;
        }
        
        toast({
          title: "Erreur GPS",
          description: message,
          variant: "destructive"
        });
      },
      { 
        enableHighAccuracy: true, 
        timeout: 30000,  // Increased timeout for mobile
        maximumAge: 0    // Always get fresh position
      }
    );
  };

  const handleSearchAddress = async () => {
    const fullAddress = [formData.adresse, formData.quartier, formData.ville, 'Maroc']
      .filter(Boolean)
      .join(', ');

    if (!fullAddress.trim() || fullAddress === 'Maroc') {
      toast({
        title: "Adresse manquante",
        description: "Veuillez saisir une adresse pour la rechercher sur la carte",
        variant: "destructive"
      });
      return;
    }

    setSearchLoading(true);
    toast({
      title: "Recherche",
      description: "Recherche de l'adresse en cours..."
    });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=ma&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr'
          }
        }
      );
      const data = await response.json();
      console.log('Geocode result:', data);

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setCoordinates([lng, lat]);
        
        toast({
          title: "Adresse trouvée",
          description: "La carte a été mise à jour avec la position"
        });
      } else {
        toast({
          title: "Adresse non trouvée",
          description: "Impossible de localiser cette adresse. Essayez d'être plus précis ou cliquez sur la carte.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche de l'adresse",
        variant: "destructive"
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const validateField = (field: string, value: string) => {
    const requiredFields = ['titre', 'adresse', 'ville'];
    if (requiredFields.includes(field) && !value.trim()) {
      return 'Ce champ est obligatoire';
    }
    return '';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (typeof value === 'string' && touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['titre', 'adresse', 'ville'];
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string;
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    setTouched({ titre: true, adresse: true, ville: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (!proprietaireId) {
      toast({
        title: "Erreur",
        description: "Propriétaire non spécifié",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const bienData = {
        proprietaire_id: proprietaireId,
        titre: formData.titre,
        description: formData.description || null,
        type: formData.type,
        status: formData.status,
        adresse: formData.adresse,
        ville: formData.ville,
        quartier: formData.quartier || null,
        code_postal: formData.code_postal || null,
        surface_habitable: formData.surface_habitable ? parseFloat(formData.surface_habitable) : null,
        surface_terrain: formData.surface_terrain ? parseFloat(formData.surface_terrain) : null,
        nombre_chambres: formData.nombre_chambres ? parseInt(formData.nombre_chambres) : null,
        nombre_salles_bain: formData.nombre_salles_bain ? parseInt(formData.nombre_salles_bain) : null,
        nombre_etages: formData.nombre_etages ? parseInt(formData.nombre_etages) : null,
        annee_construction: formData.annee_construction ? parseInt(formData.annee_construction) : null,
        prix_vente: formData.prix_vente ? parseFloat(formData.prix_vente) : null,
        prix_location: formData.prix_location ? parseFloat(formData.prix_location) : null,
        charges_mensuelles: formData.charges_mensuelles ? parseFloat(formData.charges_mensuelles) : null,
        meuble: formData.meuble,
        parking: formData.parking,
        jardin: formData.jardin,
        piscine: formData.piscine,
        ascenseur: formData.ascenseur,
        climatisation: formData.climatisation,
        chauffage: formData.chauffage
      };

      const { error } = await supabase
        .from('biens')
        .insert([bienData]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Bien ajouté avec succès"
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding bien:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du bien",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toggle All Button */}
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={toggleAllSections}
          className="flex items-center gap-2"
        >
          <ChevronsUpDown className="h-4 w-4" />
          {allOpen ? 'Réduire tout' : 'Ouvrir tout'}
        </Button>
      </div>

      {/* Informations générales */}
      <Collapsible open={openSections.general} onOpenChange={() => toggleSection('general')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Informations générales
                </span>
                {openSections.general ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="titre" className="flex items-center gap-1">
                    Titre du bien <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => handleInputChange('titre', e.target.value)}
                    onBlur={() => handleBlur('titre')}
                    placeholder="Ex: Appartement 3 pièces"
                    className={errors.titre && touched.titre ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.titre && touched.titre && (
                    <p className="text-sm text-destructive">{errors.titre}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value: BienType) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VENTE">Vente</SelectItem>
                      <SelectItem value="LOCATION">Location</SelectItem>
                      <SelectItem value="VENTE_LOCATION">Vente/Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value: BienStatus) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                      <SelectItem value="RESERVE">Réservé</SelectItem>
                      <SelectItem value="VENDU">Vendu</SelectItem>
                      <SelectItem value="LOUE">Loué</SelectItem>
                      <SelectItem value="RETIRE">Retiré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée du bien..."
                  rows={3}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Localisation */}
      <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </span>
                {openSections.location ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* GPS Button for Mobile */}
              <div className="md:hidden">
                <Button
                  type="button"
                  onClick={handleGetGpsLocation}
                  disabled={gpsLoading}
                  className="w-full bg-primary text-primary-foreground"
                >
                  {gpsLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Localisation en cours...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-5 w-5 mr-2" />
                      Utiliser ma position GPS
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="adresse" className="flex items-center gap-1">
                    Adresse <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange('adresse', e.target.value)}
                      onBlur={() => handleBlur('adresse')}
                      className={`flex-1 ${errors.adresse && touched.adresse ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSearchAddress}
                      disabled={searchLoading}
                      title="Rechercher sur la carte"
                    >
                      {searchLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.adresse && touched.adresse && (
                    <p className="text-sm text-destructive">{errors.adresse}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ville" className="flex items-center gap-1">
                    Ville <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    onBlur={() => handleBlur('ville')}
                    className={errors.ville && touched.ville ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.ville && touched.ville && (
                    <p className="text-sm text-destructive">{errors.ville}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quartier">Quartier</Label>
                  <Input
                    id="quartier"
                    value={formData.quartier}
                    onChange={(e) => handleInputChange('quartier', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="code_postal">Code postal</Label>
                  <Input
                    id="code_postal"
                    value={formData.code_postal}
                    onChange={(e) => handleInputChange('code_postal', e.target.value)}
                  />
                </div>
              </div>

              {/* Map */}
              <div className="mt-4">
                <Label className="mb-2 block">Carte</Label>
                <PropertyMap
                  address={formData.adresse}
                  city={formData.ville}
                  region="Maroc"
                  onLocationUpdate={handleLocationUpdate}
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description_localisation">Notes sur la localisation</Label>
                <Textarea
                  id="description_localisation"
                  value={formData.description_localisation}
                  onChange={(e) => handleInputChange('description_localisation', e.target.value)}
                  placeholder="Informations complémentaires sur l'emplacement, accès, transports..."
                  rows={2}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Caractéristiques */}
      <Collapsible open={openSections.characteristics} onOpenChange={() => toggleSection('characteristics')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Caractéristiques
                </span>
                {openSections.characteristics ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="surface_habitable">Surface habitable (m²)</Label>
                  <Input
                    id="surface_habitable"
                    type="number"
                    value={formData.surface_habitable}
                    onChange={(e) => handleInputChange('surface_habitable', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="surface_terrain">Surface terrain (m²)</Label>
                  <Input
                    id="surface_terrain"
                    type="number"
                    value={formData.surface_terrain}
                    onChange={(e) => handleInputChange('surface_terrain', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="nombre_chambres">Nombre de chambres</Label>
                  <Input
                    id="nombre_chambres"
                    type="number"
                    value={formData.nombre_chambres}
                    onChange={(e) => handleInputChange('nombre_chambres', e.target.value)}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="nombre_salles_bain">Salles de bain</Label>
                  <Input
                    id="nombre_salles_bain"
                    type="number"
                    value={formData.nombre_salles_bain}
                    onChange={(e) => handleInputChange('nombre_salles_bain', e.target.value)}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="nombre_etages">Nombre d'étages</Label>
                  <Input
                    id="nombre_etages"
                    type="number"
                    value={formData.nombre_etages}
                    onChange={(e) => handleInputChange('nombre_etages', e.target.value)}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="annee_construction">Année de construction</Label>
                  <Input
                    id="annee_construction"
                    type="number"
                    value={formData.annee_construction}
                    onChange={(e) => handleInputChange('annee_construction', e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              {/* Équipements */}
              <div>
                <Label className="text-base font-medium">Équipements</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {[
                    { key: 'meuble', label: 'Meublé' },
                    { key: 'parking', label: 'Parking' },
                    { key: 'jardin', label: 'Jardin' },
                    { key: 'piscine', label: 'Piscine' },
                    { key: 'ascenseur', label: 'Ascenseur' },
                    { key: 'climatisation', label: 'Climatisation' },
                    { key: 'chauffage', label: 'Chauffage' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData[key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleInputChange(key, checked)}
                      />
                      <Label htmlFor={key}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description_caracteristiques">Notes sur les caractéristiques</Label>
                <Textarea
                  id="description_caracteristiques"
                  value={formData.description_caracteristiques}
                  onChange={(e) => handleInputChange('description_caracteristiques', e.target.value)}
                  placeholder="Détails supplémentaires sur les caractéristiques du bien..."
                  rows={2}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Prix */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  Prix
                </span>
                {openSections.price ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prix_vente">Prix de vente (MAD)</Label>
                  <Input
                    id="prix_vente"
                    type="number"
                    value={formData.prix_vente}
                    onChange={(e) => handleInputChange('prix_vente', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="prix_location">Prix de location/mois (MAD)</Label>
                  <Input
                    id="prix_location"
                    type="number"
                    value={formData.prix_location}
                    onChange={(e) => handleInputChange('prix_location', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="charges_mensuelles">Charges mensuelles (MAD)</Label>
                  <Input
                    id="charges_mensuelles"
                    type="number"
                    value={formData.charges_mensuelles}
                    onChange={(e) => handleInputChange('charges_mensuelles', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description_prix">Notes sur le prix</Label>
                <Textarea
                  id="description_prix"
                  value={formData.description_prix}
                  onChange={(e) => handleInputChange('description_prix', e.target.value)}
                  placeholder="Informations sur la négociation, conditions de paiement..."
                  rows={2}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Photos et médias */}
      <Collapsible open={openSections.images} onOpenChange={() => toggleSection('images')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Photos et médias
                </span>
                {openSections.images ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <FileUpload 
                onFilesChange={handleImagesChange}
                maxFiles={10}
                acceptedTypes={['image/*']}
              />

              {/* Description */}
              <div>
                <Label htmlFor="description_photos">Notes sur les photos</Label>
                <Textarea
                  id="description_photos"
                  value={formData.description_photos}
                  onChange={(e) => handleInputChange('description_photos', e.target.value)}
                  placeholder="Instructions pour les photos, pièces à mettre en avant..."
                  rows={2}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Ajout en cours...' : 'Ajouter le bien'}
        </Button>
      </div>
    </form>
  );
};

export default AjouterBienForm;
