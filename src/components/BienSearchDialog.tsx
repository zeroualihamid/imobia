import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Building, MapPin, Euro, Home, ChevronDown, ChevronUp, ChevronsUpDown, Filter, Loader2, Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyMetadata } from '@/types/property';
import type { Database } from '@/integrations/supabase/types';

type BienType = Database['public']['Enums']['bien_type'];
type BienStatus = Database['public']['Enums']['bien_status'];

interface Proprietaire {
  id: string;
  nom: string;
  prenom: string | null;
  telephone: string;
  email: string | null;
  type: string;
}

export interface SearchFilters {
  proprietaire_id: string | null;
  titre: string;
  type_bien: string;
  type: string;
  status: string;
  description: string;
  adresse: string;
  ville: string;
  quartier: string;
  code_postal: string;
  surface_habitable_min: string;
  surface_habitable_max: string;
  surface_terrain_min: string;
  surface_terrain_max: string;
  nombre_chambres_min: string;
  nombre_chambres_max: string;
  nombre_salles_bain_min: string;
  nombre_salles_bain_max: string;
  nombre_etages_min: string;
  nombre_etages_max: string;
  annee_construction_min: string;
  annee_construction_max: string;
  prix_vente_min: string;
  prix_vente_max: string;
  prix_location_min: string;
  prix_location_max: string;
  meuble: boolean | null;
  parking: boolean | null;
  jardin: boolean | null;
  piscine: boolean | null;
  ascenseur: boolean | null;
  climatisation: boolean | null;
  chauffage: boolean | null;
}

interface BienSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (results: any[]) => void;
  onSearchingChange?: (isSearching: boolean) => void;
}

const typesBien = [
  'Appartement',
  'Bureau',
  'Duplex',
  'Ferme',
  'Local commercial',
  'Maison',
  'Riad',
  'Studio',
  'Terrain',
  'Triplex',
  'Villa ou maison de luxe'
];

const BienSearchDialog: React.FC<BienSearchDialogProps> = ({
  open,
  onOpenChange,
  onSearch,
  onSearchingChange
}) => {
  const { user } = useAuth();
  const [proprietairesList, setProprietairesList] = useState<Proprietaire[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openSections, setOpenSections] = useState({
    proprietaire: true,
    general: true,
    location: true,
    characteristics: true,
    price: true
  });

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    proprietaire_id: null,
    titre: '',
    type_bien: '',
    type: '',
    status: '',
    description: '',
    adresse: '',
    ville: '',
    quartier: '',
    code_postal: '',
    surface_habitable_min: '',
    surface_habitable_max: '',
    surface_terrain_min: '',
    surface_terrain_max: '',
    nombre_chambres_min: '',
    nombre_chambres_max: '',
    nombre_salles_bain_min: '',
    nombre_salles_bain_max: '',
    nombre_etages_min: '',
    nombre_etages_max: '',
    annee_construction_min: '',
    annee_construction_max: '',
    prix_vente_min: '',
    prix_vente_max: '',
    prix_location_min: '',
    prix_location_max: '',
    meuble: null,
    parking: null,
    jardin: null,
    piscine: null,
    ascenseur: null,
    climatisation: null,
    chauffage: null
  });

  useEffect(() => {
    if (open && user?.id) {
      fetchProprietairesList();
    }
  }, [open, user?.id]);

  const fetchProprietairesList = async () => {
    try {
      const { data, error } = await supabase
        .from('proprietaires')
        .select('id, nom, prenom, telephone, email, type')
        .order('nom');

      if (error) throw error;
      if (data) {
        setProprietairesList(data);
      }
    } catch (err) {
      console.error('Error fetching proprietaires list:', err);
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const allOpen = Object.values(openSections).every(v => v);
  
  const toggleAllSections = () => {
    const newState = !allOpen;
    setOpenSections({
      proprietaire: newState,
      general: newState,
      location: newState,
      characteristics: newState,
      price: newState
    });
  };

  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const performSearch = async () => {
    if (!user?.id) return;

    setIsSearching(true);
    if (onSearchingChange) {
      onSearchingChange(true);
    }

    try {
      // Get biens with user permissions
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
        .eq('proprietaires.created_by', user.id);

      if (biensWithOwnerError) throw biensWithOwnerError;

      // Get biens without proprietaire
      const { data: biensWithoutOwnerData, error: biensWithoutOwnerError } = await supabase
        .from('biens')
        .select(`
          *,
          bien_media (*)
        `)
        .is('proprietaire_id', null);

      if (biensWithoutOwnerError) throw biensWithoutOwnerError;

      // Combine and apply filters client-side
      const allBiens = [...(biensWithOwnerData || []), ...(biensWithoutOwnerData || [])];
      
      const filteredBiens = allBiens.filter((bien: any) => {
        if (searchFilters.proprietaire_id && bien.proprietaire_id !== searchFilters.proprietaire_id) return false;
        if (searchFilters.titre && !bien.titre?.toLowerCase().includes(searchFilters.titre.toLowerCase())) return false;
        if (searchFilters.type_bien && bien.type_bien !== searchFilters.type_bien) return false;
        if (searchFilters.type && bien.type !== searchFilters.type) return false;
        if (searchFilters.status && bien.status !== searchFilters.status) return false;
        if (searchFilters.description && !bien.description?.toLowerCase().includes(searchFilters.description.toLowerCase())) return false;
        if (searchFilters.adresse && !bien.adresse?.toLowerCase().includes(searchFilters.adresse.toLowerCase())) return false;
        if (searchFilters.ville && !bien.ville?.toLowerCase().includes(searchFilters.ville.toLowerCase())) return false;
        if (searchFilters.quartier && !bien.quartier?.toLowerCase().includes(searchFilters.quartier.toLowerCase())) return false;
        if (searchFilters.code_postal && bien.code_postal !== searchFilters.code_postal) return false;
        if (searchFilters.surface_habitable_min && (!bien.surface_habitable || bien.surface_habitable < parseFloat(searchFilters.surface_habitable_min))) return false;
        if (searchFilters.surface_habitable_max && (!bien.surface_habitable || bien.surface_habitable > parseFloat(searchFilters.surface_habitable_max))) return false;
        if (searchFilters.surface_terrain_min && (!bien.surface_terrain || bien.surface_terrain < parseFloat(searchFilters.surface_terrain_min))) return false;
        if (searchFilters.surface_terrain_max && (!bien.surface_terrain || bien.surface_terrain > parseFloat(searchFilters.surface_terrain_max))) return false;
        if (searchFilters.nombre_chambres_min && (!bien.nombre_chambres || bien.nombre_chambres < parseInt(searchFilters.nombre_chambres_min))) return false;
        if (searchFilters.nombre_chambres_max && (!bien.nombre_chambres || bien.nombre_chambres > parseInt(searchFilters.nombre_chambres_max))) return false;
        if (searchFilters.nombre_salles_bain_min && (!bien.nombre_salles_bain || bien.nombre_salles_bain < parseInt(searchFilters.nombre_salles_bain_min))) return false;
        if (searchFilters.nombre_salles_bain_max && (!bien.nombre_salles_bain || bien.nombre_salles_bain > parseInt(searchFilters.nombre_salles_bain_max))) return false;
        if (searchFilters.nombre_etages_min && (!bien.nombre_etages || bien.nombre_etages < parseInt(searchFilters.nombre_etages_min))) return false;
        if (searchFilters.nombre_etages_max && (!bien.nombre_etages || bien.nombre_etages > parseInt(searchFilters.nombre_etages_max))) return false;
        if (searchFilters.annee_construction_min && (!bien.annee_construction || bien.annee_construction < parseInt(searchFilters.annee_construction_min))) return false;
        if (searchFilters.annee_construction_max && (!bien.annee_construction || bien.annee_construction > parseInt(searchFilters.annee_construction_max))) return false;
        if (searchFilters.prix_vente_min && (!bien.prix_vente || bien.prix_vente < parseFloat(searchFilters.prix_vente_min))) return false;
        if (searchFilters.prix_vente_max && (!bien.prix_vente || bien.prix_vente > parseFloat(searchFilters.prix_vente_max))) return false;
        if (searchFilters.prix_location_min && (!bien.prix_location || bien.prix_location < parseFloat(searchFilters.prix_location_min))) return false;
        if (searchFilters.prix_location_max && (!bien.prix_location || bien.prix_location > parseFloat(searchFilters.prix_location_max))) return false;
        if (searchFilters.meuble !== null && bien.meuble !== searchFilters.meuble) return false;
        if (searchFilters.parking !== null && bien.parking !== searchFilters.parking) return false;
        if (searchFilters.jardin !== null && bien.jardin !== searchFilters.jardin) return false;
        if (searchFilters.piscine !== null && bien.piscine !== searchFilters.piscine) return false;
        if (searchFilters.ascenseur !== null && bien.ascenseur !== searchFilters.ascenseur) return false;
        if (searchFilters.climatisation !== null && bien.climatisation !== searchFilters.climatisation) return false;
        if (searchFilters.chauffage !== null && bien.chauffage !== searchFilters.chauffage) return false;
        return true;
      });

      // Convert to same format as useCombinedProperties
      const convertedBiens = filteredBiens.map((bien: any) => ({
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

      // Also search in properties table
      const { data: allPropertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Filter properties client-side (simplified - can be enhanced)
      const filteredProperties = (allPropertiesData || []).filter((property: any) => {
        const metadata = property.metadata || {};
        if (searchFilters.titre && !(metadata.title || '').toLowerCase().includes(searchFilters.titre.toLowerCase())) return false;
        if (searchFilters.description && !(metadata.description || '').toLowerCase().includes(searchFilters.description.toLowerCase())) return false;
        if (searchFilters.ville && !(metadata.location?.city || '').toLowerCase().includes(searchFilters.ville.toLowerCase())) return false;
        if (searchFilters.adresse && !(metadata.location?.address || '').toLowerCase().includes(searchFilters.adresse.toLowerCase())) return false;
        return true;
      });

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

      onSearch(combined);
      onOpenChange(false);
    } catch (err) {
      console.error('Error performing advanced search:', err);
      onSearch([]);
    } finally {
      setIsSearching(false);
      if (onSearchingChange) {
        onSearchingChange(false);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchFilters({
      proprietaire_id: null,
      titre: '',
      type_bien: '',
      type: '',
      status: '',
      description: '',
      adresse: '',
      ville: '',
      quartier: '',
      code_postal: '',
      surface_habitable_min: '',
      surface_habitable_max: '',
      surface_terrain_min: '',
      surface_terrain_max: '',
      nombre_chambres_min: '',
      nombre_chambres_max: '',
      nombre_salles_bain_min: '',
      nombre_salles_bain_max: '',
      nombre_etages_min: '',
      nombre_etages_max: '',
      annee_construction_min: '',
      annee_construction_max: '',
      prix_vente_min: '',
      prix_vente_max: '',
      prix_location_min: '',
      prix_location_max: '',
      meuble: null,
      parking: null,
      jardin: null,
      piscine: null,
      ascenseur: null,
      climatisation: null,
      chauffage: null
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recherche avancée</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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

          {/* Propriétaire */}
          <Collapsible open={openSections.proprietaire} onOpenChange={() => toggleSection('proprietaire')}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Propriétaire
                    </span>
                    {openSections.proprietaire ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Propriétaire</Label>
                    <Select
                      value={searchFilters.proprietaire_id || 'none'}
                      onValueChange={(value) => handleFilterChange('proprietaire_id', value === 'none' ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les propriétaires" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tous les propriétaires</SelectItem>
                        {proprietairesList.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nom} {p.prenom || ''} - {p.telephone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

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
                    <div className="space-y-2">
                      <Label>Titre</Label>
                      <Input
                        value={searchFilters.titre}
                        onChange={(e) => handleFilterChange('titre', e.target.value)}
                        placeholder="Rechercher par titre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type de bien</Label>
                      <Select
                        value={searchFilters.type_bien || 'all'}
                        onValueChange={(value) => handleFilterChange('type_bien', value === 'all' ? '' : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          {typesBien.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <Select
                        value={searchFilters.type || 'all'}
                        onValueChange={(value) => handleFilterChange('type', value === 'all' ? '' : value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          <SelectItem value="VENTE">Vente</SelectItem>
                          <SelectItem value="LOCATION">Location</SelectItem>
                          <SelectItem value="VENTE_LOCATION">Vente/Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Statut</Label>
                      <Select
                        value={searchFilters.status || 'all'}
                        onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                          <SelectItem value="RESERVE">Réservé</SelectItem>
                          <SelectItem value="VENDU">Vendu</SelectItem>
                          <SelectItem value="LOUE">Loué</SelectItem>
                          <SelectItem value="RETIRE">Retiré</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={searchFilters.description}
                      onChange={(e) => handleFilterChange('description', e.target.value)}
                      placeholder="Rechercher dans la description"
                      rows={2}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Adresse</Label>
                      <Input
                        value={searchFilters.adresse}
                        onChange={(e) => handleFilterChange('adresse', e.target.value)}
                        placeholder="Rechercher par adresse"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ville</Label>
                      <Input
                        value={searchFilters.ville}
                        onChange={(e) => handleFilterChange('ville', e.target.value)}
                        placeholder="Rechercher par ville"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quartier</Label>
                      <Input
                        value={searchFilters.quartier}
                        onChange={(e) => handleFilterChange('quartier', e.target.value)}
                        placeholder="Rechercher par quartier"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Code postal</Label>
                      <Input
                        value={searchFilters.code_postal}
                        onChange={(e) => handleFilterChange('code_postal', e.target.value)}
                        placeholder="Code postal"
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
                    <div className="space-y-2">
                      <Label>Surface habitable min (m²)</Label>
                      <Input
                        type="number"
                        value={searchFilters.surface_habitable_min}
                        onChange={(e) => handleFilterChange('surface_habitable_min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Surface habitable max (m²)</Label>
                      <Input
                        type="number"
                        value={searchFilters.surface_habitable_max}
                        onChange={(e) => handleFilterChange('surface_habitable_max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Surface terrain min (m²)</Label>
                      <Input
                        type="number"
                        value={searchFilters.surface_terrain_min}
                        onChange={(e) => handleFilterChange('surface_terrain_min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Surface terrain max (m²)</Label>
                      <Input
                        type="number"
                        value={searchFilters.surface_terrain_max}
                        onChange={(e) => handleFilterChange('surface_terrain_max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chambres min</Label>
                      <Input
                        type="number"
                        value={searchFilters.nombre_chambres_min}
                        onChange={(e) => handleFilterChange('nombre_chambres_min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chambres max</Label>
                      <Input
                        type="number"
                        value={searchFilters.nombre_chambres_max}
                        onChange={(e) => handleFilterChange('nombre_chambres_max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Salles de bain min</Label>
                      <Input
                        type="number"
                        value={searchFilters.nombre_salles_bain_min}
                        onChange={(e) => handleFilterChange('nombre_salles_bain_min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Salles de bain max</Label>
                      <Input
                        type="number"
                        value={searchFilters.nombre_salles_bain_max}
                        onChange={(e) => handleFilterChange('nombre_salles_bain_max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Étages min</Label>
                      <Input
                        type="number"
                        value={searchFilters.nombre_etages_min}
                        onChange={(e) => handleFilterChange('nombre_etages_min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Étages max</Label>
                      <Input
                        type="number"
                        value={searchFilters.nombre_etages_max}
                        onChange={(e) => handleFilterChange('nombre_etages_max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Année construction min</Label>
                      <Input
                        type="number"
                        value={searchFilters.annee_construction_min}
                        onChange={(e) => handleFilterChange('annee_construction_min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Année construction max</Label>
                      <Input
                        type="number"
                        value={searchFilters.annee_construction_max}
                        onChange={(e) => handleFilterChange('annee_construction_max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-2">Équipements</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                          <Select
                            value={searchFilters[key as keyof SearchFilters] === null ? 'all' : searchFilters[key as keyof SearchFilters] === true ? 'yes' : 'no'}
                            onValueChange={(value) => handleFilterChange(key as keyof SearchFilters, value === 'all' ? null : value === 'yes')}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous</SelectItem>
                              <SelectItem value="yes">Oui</SelectItem>
                              <SelectItem value="no">Non</SelectItem>
                            </SelectContent>
                          </Select>
                          <Label>{label}</Label>
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
                    <div className="space-y-2">
                      <Label>Prix de vente min (MAD)</Label>
                      <Input
                        type="number"
                        value={searchFilters.prix_vente_min}
                        onChange={(e) => handleFilterChange('prix_vente_min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix de vente max (MAD)</Label>
                      <Input
                        type="number"
                        value={searchFilters.prix_vente_max}
                        onChange={(e) => handleFilterChange('prix_vente_max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix location min (MAD/mois)</Label>
                      <Input
                        type="number"
                        value={searchFilters.prix_location_min}
                        onChange={(e) => handleFilterChange('prix_location_min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix location max (MAD/mois)</Label>
                      <Input
                        type="number"
                        value={searchFilters.prix_location_max}
                        onChange={(e) => handleFilterChange('prix_location_max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClearFilters}>
            Réinitialiser
          </Button>
          <Button onClick={performSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Recherche...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BienSearchDialog;
export type { SearchFilters };

