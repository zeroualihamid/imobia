
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Building, MapPin, Euro, Home, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
    surface_habitable: '',
    surface_terrain: '',
    nombre_chambres: '',
    nombre_salles_bain: '',
    nombre_etages: '',
    annee_construction: '',
    prix_vente: '',
    prix_location: '',
    charges_mensuelles: '',
    meuble: false,
    parking: false,
    jardin: false,
    piscine: false,
    ascenseur: false,
    climatisation: false,
    chauffage: false
  });

  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    general: true,
    location: true,
    characteristics: true,
    price: true
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
      price: newState
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.adresse || !formData.ville) {
      toast({
        title: "Erreur",
        description: "Titre, adresse et ville sont obligatoires",
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
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('general')}>
            <CollapsibleTrigger asChild>
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Informations générales
                </span>
                {openSections.general ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titre">Titre du bien *</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => handleInputChange('titre', e.target.value)}
                    placeholder="Ex: Appartement 3 pièces"
                    required
                  />
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
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('location')}>
            <CollapsibleTrigger asChild>
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </span>
                {openSections.location ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adresse">Adresse *</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ville">Ville *</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    required
                  />
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
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Caractéristiques */}
      <Collapsible open={openSections.characteristics} onOpenChange={() => toggleSection('characteristics')}>
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('characteristics')}>
            <CollapsibleTrigger asChild>
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Caractéristiques
                </span>
                {openSections.characteristics ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
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
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Prix */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('price')}>
            <CollapsibleTrigger asChild>
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  Prix
                </span>
                {openSections.price ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
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
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Actions */}
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
