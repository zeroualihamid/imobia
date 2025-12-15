import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  MapPin, 
  Home, 
  Building, 
  Euro, 
  ImageIcon,
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown,
  Loader2,
  Check,
  X,
  Pencil,
  Save,
  Trash2,
  Plus,
  Navigation,
  ExternalLink
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PropertyMap from '@/components/PropertyMap';
import ImageLightbox from '@/components/ui/ImageLightbox';
import ShareBienDialog from '@/components/biens/ShareBienDialog';
import type { Database } from '@/integrations/supabase/types';

type Bien = Database['public']['Tables']['biens']['Row'];
type BienMedia = Database['public']['Tables']['bien_media']['Row'];
type BienType = Database['public']['Enums']['bien_type'];
type BienStatus = Database['public']['Enums']['bien_status'];

interface BienWithMedia extends Bien {
  bien_media?: BienMedia[];
}

interface Proprietaire {
  id: string;
  nom: string;
  prenom: string | null;
  telephone: string;
  email: string | null;
  type: string;
}

const DetailBien = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bien, setBien] = useState<BienWithMedia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [proprietaire, setProprietaire] = useState<Proprietaire | null>(null);
  const [proprietairesList, setProprietairesList] = useState<Proprietaire[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddProprietaire, setShowAddProprietaire] = useState(false);
  const [addingProprietaire, setAddingProprietaire] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newProprietaire, setNewProprietaire] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    type: 'PARTICULIER' as 'PARTICULIER' | 'PROMOTEUR' | 'FONCIERE'
  });
  
  // Edit mode states for each section
  const [editMode, setEditMode] = useState({
    proprietaire: false,
    general: false,
    location: false,
    characteristics: false,
    price: false
  });
  
  // Form data for editing
  const [formData, setFormData] = useState<Partial<Bien>>({});
  const [saving, setSaving] = useState<string | null>(null);
  
  const [openSections, setOpenSections] = useState({
    proprietaire: true,
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
      proprietaire: newState,
      general: newState,
      location: newState,
      characteristics: newState,
      price: newState,
      images: newState
    });
  };

  useEffect(() => {
    if (id) {
      fetchBien();
      fetchProprietairesList();
    }
  }, [id]);

  useEffect(() => {
    if (bien) {
      setFormData(bien);
    }
  }, [bien]);

  const fetchBien = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('biens')
        .select('*, bien_media(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setBien(data);
        if (data.adresse && data.ville) {
          geocodeAddress(data.adresse, data.quartier, data.ville);
        }
        // Fetch proprietaire info
        fetchProprietaire(data.proprietaire_id);
      } else {
        setError('Bien non trouvé');
      }
    } catch (err) {
      console.error('Error fetching bien:', err);
      setError('Erreur lors du chargement du bien');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProprietaire = async (proprietaireId: string | null) => {
    if (!proprietaireId) {
      setProprietaire(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('proprietaires')
        .select('id, nom, prenom, telephone, email, type')
        .eq('id', proprietaireId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProprietaire(data);
      }
    } catch (err) {
      console.error('Error fetching proprietaire:', err);
    }
  };

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

  const geocodeAddress = async (adresse: string, quartier: string | null, ville: string) => {
    const fullAddress = [adresse, quartier, ville, 'Maroc'].filter(Boolean).join(', ');
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setCoordinates([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  };

  const openGoogleMapsDirections = () => {
    if (!bien) return;
    
    // Build full address
    const addressParts = [
      bien.adresse,
      bien.quartier,
      bien.ville,
      bien.code_postal,
      'Maroc'
    ].filter(Boolean);
    
    const fullAddress = addressParts.join(', ');
    const encodedAddress = encodeURIComponent(fullAddress);
    
    // Google Maps directions URL
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    
    // Open in new tab
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEdit = (section: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [section]: true }));
  };

  const handleCancel = (section: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [section]: false }));
    if (bien) {
      setFormData(bien);
    }
  };

  const handleSave = async (section: keyof typeof editMode) => {
    if (!id) return;
    
    setSaving(section);
    try {
      const updateData: Partial<Bien> = {};
      
      if (section === 'proprietaire') {
        updateData.proprietaire_id = formData.proprietaire_id;
      } else if (section === 'general') {
        updateData.titre = formData.titre;
        updateData.description = formData.description;
        updateData.type = formData.type;
        updateData.status = formData.status;
      } else if (section === 'location') {
        updateData.adresse = formData.adresse;
        updateData.ville = formData.ville;
        updateData.quartier = formData.quartier;
        updateData.code_postal = formData.code_postal;
      } else if (section === 'characteristics') {
        updateData.surface_habitable = formData.surface_habitable;
        updateData.surface_terrain = formData.surface_terrain;
        updateData.nombre_chambres = formData.nombre_chambres;
        updateData.nombre_salles_bain = formData.nombre_salles_bain;
        updateData.nombre_etages = formData.nombre_etages;
        updateData.annee_construction = formData.annee_construction;
        updateData.meuble = formData.meuble;
        updateData.parking = formData.parking;
        updateData.jardin = formData.jardin;
        updateData.piscine = formData.piscine;
        updateData.ascenseur = formData.ascenseur;
        updateData.climatisation = formData.climatisation;
        updateData.chauffage = formData.chauffage;
      } else if (section === 'price') {
        updateData.prix_vente = formData.prix_vente;
        updateData.prix_location = formData.prix_location;
        updateData.charges_mensuelles = formData.charges_mensuelles;
      }

      const { error } = await supabase
        .from('biens')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les modifications ont été enregistrées"
      });

      setEditMode(prev => ({ ...prev, [section]: false }));
      fetchBien();
    } catch (err) {
      console.error('Error saving:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  const handleInputChange = (field: keyof Bien, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !id) return;

    setUploadingImages(true);
    const uploadPromises: Promise<void>[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Only process image files
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Erreur",
            description: `${file.name} n'est pas une image valide`,
            variant: "destructive"
          });
          continue;
        }

        const uploadPromise = (async () => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('bien-media')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
          }
          
          // Create bien_media record
          const { error: mediaError } = await supabase
            .from('bien_media')
            .insert({
              bien_id: id,
              file_name: file.name,
              file_path: fileName,
              file_type: 'image',
              file_size: file.size,
              mime_type: file.type
            });
          
          if (mediaError) {
            console.error('Error creating media record:', mediaError);
            throw mediaError;
          }
        })();

        uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);

      toast({
        title: "Succès",
        description: `${files.length} image(s) ajoutée(s) avec succès`
      });

      // Reset file inputs
      const uploadInput = document.getElementById('image-upload') as HTMLInputElement;
      const uploadInputEmpty = document.getElementById('image-upload-empty') as HTMLInputElement;
      if (uploadInput) uploadInput.value = '';
      if (uploadInputEmpty) uploadInputEmpty.value = '';

      // Refresh the bien data to show new images
      fetchBien();
    } catch (err) {
      console.error('Error uploading images:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload des images",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleAddProprietaire = async () => {
    if (!newProprietaire.nom || !newProprietaire.telephone) {
      toast({
        title: "Erreur",
        description: "Le nom et le téléphone sont requis",
        variant: "destructive"
      });
      return;
    }

    setAddingProprietaire(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('proprietaires')
        .insert({
          nom: newProprietaire.nom,
          prenom: newProprietaire.prenom || null,
          telephone: newProprietaire.telephone,
          email: newProprietaire.email || null,
          type: newProprietaire.type,
          created_by: userData.user.id
        })
        .select('id, nom, prenom, telephone, email, type')
        .single();

      if (error) throw error;

      // Refresh the proprietaires list
      await fetchProprietairesList();
      
      // Auto-select the newly created propriétaire
      setFormData(prev => ({ ...prev, proprietaire_id: data.id }));
      
      // Reset form and close dialog
      setNewProprietaire({ nom: '', prenom: '', telephone: '', email: '', type: 'PARTICULIER' });
      setShowAddProprietaire(false);

      toast({
        title: "Succès",
        description: "Propriétaire créé et associé au bien"
      });
    } catch (err) {
      console.error('Error creating proprietaire:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du propriétaire",
        variant: "destructive"
      });
    } finally {
      setAddingProprietaire(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      // First delete associated media
      const { error: mediaError } = await supabase
        .from('bien_media')
        .delete()
        .eq('bien_id', id);

      if (mediaError) throw mediaError;

      // Delete associated shares
      const { error: sharesError } = await supabase
        .from('bien_shares')
        .delete()
        .eq('bien_id', id);

      if (sharesError) throw sharesError;

      // Then delete the bien
      const { error } = await supabase
        .from('biens')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le bien a été supprimé"
      });

      navigate('/biens');
    } catch (err) {
      console.error('Error deleting bien:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du bien",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>;
      case 'RESERVE':
        return <Badge className="bg-amber-100 text-amber-800">Réservé</Badge>;
      case 'VENDU':
        return <Badge className="bg-slate-100 text-slate-800">Vendu</Badge>;
      case 'LOUE':
        return <Badge className="bg-blue-100 text-blue-800">Loué</Badge>;
      case 'RETIRE':
        return <Badge className="bg-red-100 text-red-800">Retiré</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'VENTE':
        return <Badge className="bg-primary/10 text-primary">Vente</Badge>;
      case 'LOCATION':
        return <Badge className="bg-blue-100 text-blue-800">Location</Badge>;
      case 'VENTE_LOCATION':
        return <Badge className="bg-purple-100 text-purple-800">Vente/Location</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const BooleanDisplay = ({ value, label }: { value: boolean | null; label: string }) => (
    <div className="flex items-center gap-2">
      {value ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : (
        <X className="h-4 w-4 text-slate-400" />
      )}
      <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </div>
  );

  const EditButtons = ({ section, isEditing }: { section: keyof typeof editMode; isEditing: boolean }) => (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {isEditing ? (
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleCancel(section)}
            disabled={saving === section}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave(section)}
            disabled={saving === section}
          >
            {saving === section ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleEdit(section)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (error || !bien) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            {error || 'Bien non trouvé'}
          </h2>
          <p className="text-muted-foreground mb-4">
            Le bien demandé n'existe pas ou n'est plus disponible
          </p>
          <Button onClick={() => navigate('/biens')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const images = bien.bien_media || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/biens')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold truncate">{bien.titre}</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ShareBienDialog bienId={bien.id} bienTitle={bien.titre} />
          {getTypeBadge(bien.type)}
          {getStatusBadge(bien.status)}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer ce bien ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le bien "{bien.titre}" et toutes ses images seront définitivement supprimés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

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
                <div className="flex items-center gap-2">
                  <EditButtons section="proprietaire" isEditing={editMode.proprietaire} />
                  {openSections.proprietaire ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {editMode.proprietaire ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Sélectionner un propriétaire</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.proprietaire_id || 'none'}
                        onValueChange={(value) => handleInputChange('proprietaire_id', value === 'none' ? null : value)}
                        className="flex-1"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Aucun" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucun</SelectItem>
                          {proprietairesList.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.nom} {p.prenom || ''} - {p.telephone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog open={showAddProprietaire} onOpenChange={setShowAddProprietaire}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="icon" title="Ajouter un propriétaire">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ajouter un propriétaire</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Nom *</Label>
                                <Input
                                  value={newProprietaire.nom}
                                  onChange={(e) => setNewProprietaire(prev => ({ ...prev, nom: e.target.value }))}
                                  placeholder="Nom"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Prénom</Label>
                                <Input
                                  value={newProprietaire.prenom}
                                  onChange={(e) => setNewProprietaire(prev => ({ ...prev, prenom: e.target.value }))}
                                  placeholder="Prénom"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Téléphone *</Label>
                              <Input
                                value={newProprietaire.telephone}
                                onChange={(e) => setNewProprietaire(prev => ({ ...prev, telephone: e.target.value }))}
                                placeholder="Téléphone"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={newProprietaire.email}
                                onChange={(e) => setNewProprietaire(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="Email"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select
                                value={newProprietaire.type}
                                onValueChange={(value: 'PARTICULIER' | 'PROMOTEUR' | 'FONCIERE') => 
                                  setNewProprietaire(prev => ({ ...prev, type: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PARTICULIER">Particulier</SelectItem>
                                  <SelectItem value="PROMOTEUR">Promoteur</SelectItem>
                                  <SelectItem value="FONCIERE">Foncière</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              type="button" 
                              onClick={handleAddProprietaire} 
                              disabled={addingProprietaire}
                              className="w-full"
                            >
                              {addingProprietaire ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Création...</>
                              ) : (
                                'Créer et associer'
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ) : proprietaire ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Nom complet</span>
                    <p className="font-medium">{proprietaire.nom} {proprietaire.prenom || ''}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Téléphone</span>
                    <p className="font-medium">{proprietaire.telephone}</p>
                  </div>
                  {proprietaire.email && (
                    <div>
                      <span className="text-sm text-muted-foreground">Email</span>
                      <p className="font-medium">{proprietaire.email}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">Type</span>
                    <p className="font-medium">{proprietaire.type}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun propriétaire associé</p>
                </div>
              )}
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
                <div className="flex items-center gap-2">
                  <EditButtons section="general" isEditing={editMode.general} />
                  {openSections.general ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {editMode.general ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input
                      value={formData.titre || ''}
                      onChange={(e) => handleInputChange('titre', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: BienType) => handleInputChange('type', value)}
                    >
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
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: BienStatus) => handleInputChange('status', value)}
                    >
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
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Titre</span>
                      <p className="font-medium">{bien.titre}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Type</span>
                      <p className="font-medium">{getTypeBadge(bien.type)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Statut</span>
                      <p className="font-medium">{getStatusBadge(bien.status)}</p>
                    </div>
                  </div>
                  {bien.description && (
                    <div>
                      <span className="text-sm text-muted-foreground">Description</span>
                      <p className="whitespace-pre-wrap">{bien.description}</p>
                    </div>
                  )}
                </>
              )}
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
                <div className="flex items-center gap-2">
                  <EditButtons section="location" isEditing={editMode.location} />
                  {openSections.location ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {editMode.location ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      value={formData.adresse || ''}
                      onChange={(e) => handleInputChange('adresse', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      value={formData.ville || ''}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quartier</Label>
                    <Input
                      value={formData.quartier || ''}
                      onChange={(e) => handleInputChange('quartier', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input
                      value={formData.code_postal || ''}
                      onChange={(e) => handleInputChange('code_postal', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Adresse</span>
                      <p className="font-medium">{bien.adresse}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Ville</span>
                      <p className="font-medium">{bien.ville}</p>
                    </div>
                    {bien.quartier && (
                      <div>
                        <span className="text-sm text-muted-foreground">Quartier</span>
                        <p className="font-medium">{bien.quartier}</p>
                      </div>
                    )}
                    {bien.code_postal && (
                      <div>
                        <span className="text-sm text-muted-foreground">Code postal</span>
                        <p className="font-medium">{bien.code_postal}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Google Maps Directions Button */}
                  <div className="flex justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={openGoogleMapsDirections}
                      className="flex items-center gap-2"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Ouvrir dans Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
              
              {/* Map */}
              <div className="h-[300px] rounded-lg overflow-hidden border">
                <PropertyMap 
                  address={bien.adresse}
                  city={bien.ville}
                  region={bien.quartier || ''}
                  initialCoordinates={coordinates || undefined}
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
                <div className="flex items-center gap-2">
                  <EditButtons section="characteristics" isEditing={editMode.characteristics} />
                  {openSections.characteristics ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {editMode.characteristics ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Surface habitable (m²)</Label>
                      <Input
                        type="number"
                        value={formData.surface_habitable || ''}
                        onChange={(e) => handleInputChange('surface_habitable', e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Surface terrain (m²)</Label>
                      <Input
                        type="number"
                        value={formData.surface_terrain || ''}
                        onChange={(e) => handleInputChange('surface_terrain', e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chambres</Label>
                      <Input
                        type="number"
                        value={formData.nombre_chambres || ''}
                        onChange={(e) => handleInputChange('nombre_chambres', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Salles de bain</Label>
                      <Input
                        type="number"
                        value={formData.nombre_salles_bain || ''}
                        onChange={(e) => handleInputChange('nombre_salles_bain', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Étages</Label>
                      <Input
                        type="number"
                        value={formData.nombre_etages || ''}
                        onChange={(e) => handleInputChange('nombre_etages', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Année de construction</Label>
                      <Input
                        type="number"
                        value={formData.annee_construction || ''}
                        onChange={(e) => handleInputChange('annee_construction', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="block mb-2">Équipements</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { key: 'meuble', label: 'Meublé' },
                        { key: 'parking', label: 'Parking' },
                        { key: 'jardin', label: 'Jardin' },
                        { key: 'piscine', label: 'Piscine' },
                        { key: 'ascenseur', label: 'Ascenseur' },
                        { key: 'climatisation', label: 'Climatisation' },
                        { key: 'chauffage', label: 'Chauffage' },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Checkbox
                            id={key}
                            checked={formData[key as keyof Bien] as boolean || false}
                            onCheckedChange={(checked) => handleInputChange(key as keyof Bien, checked)}
                          />
                          <Label htmlFor={key}>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {bien.surface_habitable && (
                      <div>
                        <span className="text-sm text-muted-foreground">Surface habitable</span>
                        <p className="font-medium">{bien.surface_habitable} m²</p>
                      </div>
                    )}
                    {bien.surface_terrain && (
                      <div>
                        <span className="text-sm text-muted-foreground">Surface terrain</span>
                        <p className="font-medium">{bien.surface_terrain} m²</p>
                      </div>
                    )}
                    {bien.nombre_chambres && (
                      <div>
                        <span className="text-sm text-muted-foreground">Chambres</span>
                        <p className="font-medium">{bien.nombre_chambres}</p>
                      </div>
                    )}
                    {bien.nombre_salles_bain && (
                      <div>
                        <span className="text-sm text-muted-foreground">Salles de bain</span>
                        <p className="font-medium">{bien.nombre_salles_bain}</p>
                      </div>
                    )}
                    {bien.nombre_etages && (
                      <div>
                        <span className="text-sm text-muted-foreground">Étages</span>
                        <p className="font-medium">{bien.nombre_etages}</p>
                      </div>
                    )}
                    {bien.annee_construction && (
                      <div>
                        <span className="text-sm text-muted-foreground">Année de construction</span>
                        <p className="font-medium">{bien.annee_construction}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Équipements</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <BooleanDisplay value={bien.meuble} label="Meublé" />
                      <BooleanDisplay value={bien.parking} label="Parking" />
                      <BooleanDisplay value={bien.jardin} label="Jardin" />
                      <BooleanDisplay value={bien.piscine} label="Piscine" />
                      <BooleanDisplay value={bien.ascenseur} label="Ascenseur" />
                      <BooleanDisplay value={bien.climatisation} label="Climatisation" />
                      <BooleanDisplay value={bien.chauffage} label="Chauffage" />
                    </div>
                  </div>
                </>
              )}
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
                  Informations tarifaires
                </span>
                <div className="flex items-center gap-2">
                  <EditButtons section="price" isEditing={editMode.price} />
                  {openSections.price ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {editMode.price ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Prix de vente (DH)</Label>
                    <Input
                      type="number"
                      value={formData.prix_vente || ''}
                      onChange={(e) => handleInputChange('prix_vente', e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Loyer mensuel (DH)</Label>
                    <Input
                      type="number"
                      value={formData.prix_location || ''}
                      onChange={(e) => handleInputChange('prix_location', e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Charges mensuelles (DH)</Label>
                    <Input
                      type="number"
                      value={formData.charges_mensuelles || ''}
                      onChange={(e) => handleInputChange('charges_mensuelles', e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bien.prix_vente && (
                    <div>
                      <span className="text-sm text-muted-foreground">Prix de vente</span>
                      <p className="text-2xl font-bold text-primary">{bien.prix_vente.toLocaleString()} DH</p>
                    </div>
                  )}
                  {bien.prix_location && (
                    <div>
                      <span className="text-sm text-muted-foreground">Loyer mensuel</span>
                      <p className="text-2xl font-bold text-primary">{bien.prix_location.toLocaleString()} DH/mois</p>
                    </div>
                  )}
                  {bien.charges_mensuelles && (
                    <div>
                      <span className="text-sm text-muted-foreground">Charges mensuelles</span>
                      <p className="font-medium">{bien.charges_mensuelles.toLocaleString()} DH/mois</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Photos */}
      <Collapsible open={openSections.images} onOpenChange={() => toggleSection('images')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Photos ({images.length})
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={uploadingImages}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('image-upload')?.click();
                      }}
                    >
                      {uploadingImages ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Upload...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter des photos
                        </>
                      )}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>
                  {openSections.images ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((media, index) => (
                    <div 
                      key={media.id} 
                      className="aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity hover:ring-2 hover:ring-primary relative group"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={`https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/bien-media/${media.file_path}`}
                        alt={media.file_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="mb-4">Aucune photo disponible</p>
                  <label htmlFor="image-upload-empty">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingImages}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('image-upload-empty')?.click();
                      }}
                    >
                      {uploadingImages ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Upload...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter des photos
                        </>
                      )}
                    </Button>
                    <input
                      id="image-upload-empty"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                  </label>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Image Lightbox */}
      <ImageLightbox
        images={images.map(media => ({
          id: media.id,
          url: `https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/bien-media/${media.file_path}`,
          alt: media.file_name
        }))}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />

      {/* Dates */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Créé le: {new Date(bien.created_at).toLocaleDateString('fr-FR')}</span>
            <span>Modifié le: {new Date(bien.updated_at).toLocaleDateString('fr-FR')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailBien;
