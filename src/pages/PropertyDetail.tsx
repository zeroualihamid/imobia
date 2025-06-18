import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Edit, 
  Save, 
  Trash2, 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  X,
  AlertTriangle,
  FileText,
  Upload
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import NumberInput from '@/components/ui/NumberInput';
import FileUpload, { UploadedFile } from '@/components/ui/FileUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Property, PropertyMetadata, PropertyMedia } from '@/types/property';
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingMandate, setIsUploadingMandate] = useState(false);
  const [mandateDialogOpen, setMandateDialogOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('sale');
  const [propertyType, setPropertyType] = useState('apartment');
  const [condition, setCondition] = useState('good');
  const [status, setStatus] = useState('available');
  const [bedrooms, setBedrooms] = useState(1);
  const [rooms, setRooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [mandateFiles, setMandateFiles] = useState<UploadedFile[]>([]);
  
  // Location state
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  // Surface state
  const [builtArea, setBuiltArea] = useState('');
  const [livingArea, setLivingArea] = useState('');
  const [outdoorArea, setOutdoorArea] = useState('');

  const features = [
    'terrace', 'elevator', 'seaView', 'parking', 
    'garden', 'pool', 'aircon', 'heating', 
    'fireplace', 'security'
  ];

  // Default descriptive text for properties
  const defaultDescription = `CASABLANCA CIL LOUE LUXUEUX
3 chambres
ensoleillé de 117 m²
SANS VIS-A-VIS

Confortable appartement épuré et semi-meuble de 117 m² habitable à louer.

Ce logement très confortable se trouve au 4e étage d'une résidence calme et bien gérée.

Il est très ensoleillé et se distribue de la façon suivante :

• Double salon avec cheminé
• Chambre avec placard
• SDB complete
• Suite Parentale + SDB avec son dressing et balcon
• Salle d'eau
• Cuisine équipée avec entrée de service
• Buanderie de 10 m²

Ce Logement avec marbre au sol et boiserie haut de gamme dispose d'une place de parking privée et gardée 24/24 7/7 par ouverture exclusive de vigile.

Cet appartement offre d'excellentes prestations collective (ménage, concierge) ainsi qu'un box fermé en terrasse.

La résidence à proximité du nouveau projet Casa Finance City et de son magnifique Parc, permet cet immense espace vert de créer une véritable barrière contre la pollution.

Le quartier bien réputé contribue à la qualité de vie des riverains en leur permettant de pratiquer des activités physiques en plein air.

Ce quartier résidentiel avec un emplacement idéal à mi-chemin entre le centre-ville et le sud de Casablanca, la localisation de cette résidence est idéale avec ses nombreux commerces de proximité, notamment ACIMA, BIM, la pâtisserie AMOUD mais également le marché du CIL avec tous ses commerces et restaurants.

De nombreuses écoles sont également proches (écoles LOUIS BERTRAND, Georges BIZET, LA PRAIRIE, BENNIS, l'école INTERNATIONALE)

Location avec la fibre internet (500 dhs), parking (500 dhs) Charges syndicales (500 dhs) et taxes comprises

7500 DHS brut
Soit 9000 DHS TTC`;

  // Fetch property data
  const { data: property, isLoading: isLoadingProperty, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id || !user?.id) return null;
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_media (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }

      return data as Property;
    },
    enabled: !!id && !!user?.id,
  });

  // Initialize form with property data
  useEffect(() => {
    if (property) {
      const metadata = property.metadata as PropertyMetadata;
      
      setTitle(metadata?.title || '');
      // Use the default description if no description exists
      setDescription(metadata?.description || defaultDescription);
      setPrice(metadata?.price?.toString() || '');
      setCategory(metadata?.category || 'sale');
      setPropertyType(metadata?.propertyType || 'apartment');
      setCondition(metadata?.condition || 'good');
      setStatus(metadata?.status || 'available');
      setBedrooms(metadata?.bedrooms || 1);
      setRooms(metadata?.rooms || 3);
      setBathrooms(metadata?.bathrooms || 1);
      setSelectedFeatures(metadata?.features || []);
      
      // Location
      const location = metadata?.location;
      if (typeof location === 'object' && location) {
        setAddress(location.address || '');
        setRegion(location.region || '');
        setCity(location.city || '');
        setDistrict(location.district || '');
        setNeighborhood(location.neighborhood || '');
      }
      
      // Surface
      const surface = metadata?.surface;
      if (typeof surface === 'object' && surface) {
        setBuiltArea(surface.builtArea?.toString() || '');
        setLivingArea(surface.livingArea?.toString() || '');
        setOutdoorArea(surface.outdoorArea?.toString() || '');
      }
    }
  }, [property]);

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    }
  };

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

  const getPropertyImages = (property: Property) => {
    return property.property_media?.map(media => {
      const { data } = supabase.storage.from('property-media').getPublicUrl(media.file_path);
      return {
        url: data.publicUrl,
        media
      };
    }) || [];
  };

  const formatLocation = (location: PropertyMetadata['location']): string => {
    if (!location) return 'Localisation non définie';
    
    if (typeof location === 'string') {
      return location;
    }
    
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.neighborhood) parts.push(location.neighborhood);
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    
    return parts.length > 0 ? parts.join(', ') : 'Localisation non définie';
  };

  const uploadFileToStorage = async (file: File, propertyId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('property-media')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    return fileName;
  };

  const deleteFileFromStorage = async (filePath: string) => {
    const { error } = await supabase.storage
      .from('property-media')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleMandateUpload = async () => {
    if (!property || !user || mandateFiles.length === 0) {
      toast.error('Veuillez sélectionner un fichier de mandat');
      return;
    }

    setIsUploadingMandate(true);

    try {
      for (const mandateFile of mandateFiles) {
        const filePath = await uploadFileToStorage(mandateFile.file, property.id);
        
        if (filePath) {
          const { error: mediaError } = await supabase
            .from('property_media')
            .insert({
              property_id: property.id,
              file_name: `MANDAT_${mandateFile.file.name}`,
              file_path: filePath,
              file_type: mandateFile.type,
              file_size: mandateFile.file.size,
              mime_type: mandateFile.file.type
            });

          if (mediaError) {
            console.error('Media creation error:', mediaError);
          }
        }
      }

      // Refresh the query
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      
      toast.success('Mandat uploadé avec succès !');
      setMandateDialogOpen(false);
      setMandateFiles([]);
      
    } catch (error) {
      console.error('Error uploading mandate:', error);
      toast.error('Erreur lors de l\'upload du mandat');
    } finally {
      setIsUploadingMandate(false);
    }
  };

  const handleSave = async () => {
    if (!property || !user) {
      toast.error('Erreur: propriété ou utilisateur non trouvé');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare metadata object
      const metadata = {
        title,
        description,
        price: price ? parseFloat(price) : null,
        category,
        propertyType,
        condition,
        status,
        bedrooms,
        rooms,
        bathrooms,
        features: selectedFeatures,
        location: {
          address,
          region,
          city,
          district,
          neighborhood
        },
        surface: {
          builtArea: builtArea ? parseInt(builtArea) : null,
          livingArea: livingArea ? parseInt(livingArea) : null,
          outdoorArea: outdoorArea ? parseInt(outdoorArea) : null
        }
      };

      // Update property
      const { error: propertyError } = await supabase
        .from('properties')
        .update({ metadata })
        .eq('id', property.id)
        .eq('user_id', user.id);

      if (propertyError) {
        console.error('Property update error:', propertyError);
        throw propertyError;
      }

      // Upload new files if any
      if (uploadedFiles.length > 0) {
        for (const uploadedFile of uploadedFiles) {
          const filePath = await uploadFileToStorage(uploadedFile.file, property.id);
          
          if (filePath) {
            const { error: mediaError } = await supabase
              .from('property_media')
              .insert({
                property_id: property.id,
                file_name: uploadedFile.file.name,
                file_path: filePath,
                file_type: uploadedFile.type,
                file_size: uploadedFile.file.size,
                mime_type: uploadedFile.file.type
              });

            if (mediaError) {
              console.error('Media creation error:', mediaError);
            }
          }
        }
      }

      // Refresh the query
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      
      toast.success('Bien mis à jour avec succès !');
      setIsEditing(false);
      setUploadedFiles([]);
      
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Erreur lors de la mise à jour du bien');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!property || !user) {
      toast.error('Erreur: propriété ou utilisateur non trouvé');
      return;
    }

    setIsDeleting(true);

    try {
      // Delete all media files from storage
      if (property.property_media && property.property_media.length > 0) {
        for (const media of property.property_media) {
          await deleteFileFromStorage(media.file_path);
        }
      }

      // Delete property media records
      const { error: mediaError } = await supabase
        .from('property_media')
        .delete()
        .eq('property_id', property.id);

      if (mediaError) {
        console.error('Error deleting media records:', mediaError);
      }

      // Delete property
      const { error: propertyError } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id)
        .eq('user_id', user.id);

      if (propertyError) {
        console.error('Property deletion error:', propertyError);
        throw propertyError;
      }

      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      
      toast.success('Bien supprimé avec succès !');
      navigate('/biens');
      
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Erreur lors de la suppression du bien');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveImage = async (media: PropertyMedia) => {
    try {
      // Delete from storage
      await deleteFileFromStorage(media.file_path);
      
      // Delete from database
      const { error } = await supabase
        .from('property_media')
        .delete()
        .eq('id', media.id);

      if (error) {
        console.error('Error deleting media:', error);
        throw error;
      }

      // Refresh the query
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      
      toast.success('Image supprimée avec succès !');
      
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Erreur lors de la suppression de l\'image');
    }
  };

  if (isLoadingProperty) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du bien...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Bien introuvable
          </h1>
        </div>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur</h3>
            <p className="text-red-600 mb-4">
              Le bien demandé n'existe pas ou vous n'avez pas les droits pour y accéder.
            </p>
            <Button onClick={() => navigate('/biens')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const metadata = property.metadata as PropertyMetadata;
  const images = getPropertyImages(property);
  const locationStr = formatLocation(metadata?.location);
  const displayDescription = metadata?.description || defaultDescription;

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/biens')}
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                {metadata?.title || 'Sans titre'}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {locationStr}
                </div>
                {getStatusBadge(metadata?.status || 'available')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Dialog open={mandateDialogOpen} onOpenChange={setMandateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Mandat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border border-slate-200 sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-slate-900">Télécharger un mandat</DialogTitle>
                      <DialogDescription className="text-slate-600">
                        Sélectionnez un fichier de mandat (image ou PDF) à associer à ce bien.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <FileUpload
                        onFilesChange={setMandateFiles}
                        maxFiles={1}
                        acceptedTypes={['image/*', 'application/pdf']}
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setMandateDialogOpen(false);
                            setMandateFiles([]);
                          }}
                          className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          Annuler
                        </Button>
                        <Button 
                          onClick={handleMandateUpload}
                          disabled={isUploadingMandate || mandateFiles.length === 0}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploadingMandate ? 'Upload...' : 'Télécharger'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border border-slate-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-slate-900">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Confirmer la suppression
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-600">
                        Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible et supprimera également toutes les images associées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="bg-white">
                      <AlertDialogCancel className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50">
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeleting ? 'Suppression...' : 'Supprimer'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setUploadedFiles([]);
                  }}
                  className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Property Details */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-8">
          {!isEditing ? (
            /* View Mode */
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium text-slate-900">Prix</Label>
                  <div className="text-2xl font-bold text-blue-600">
                    {metadata?.price ? `${metadata.price} €` : 'Prix non défini'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium text-slate-900">Type</Label>
                  <div className="text-slate-700 capitalize">
                    {t(`property.${metadata?.propertyType || 'apartment'}`)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium text-slate-900">Catégorie</Label>
                  <div className="text-slate-700 capitalize">
                    {t(`property.${metadata?.category || 'sale'}`)}
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {metadata?.surface ? 
                    (typeof metadata.surface === 'number' ? `${metadata.surface} m²` : 
                     metadata.surface.builtArea ? `${metadata.surface.builtArea} m²` : '-') 
                    : '-'}
                </div>
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  {metadata?.bedrooms || '-'} chambres
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  {metadata?.bathrooms || '-'} sdb
                </div>
                <div className="text-slate-700">
                  {metadata?.rooms || '-'} pièces
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-base font-medium text-slate-900">Description</Label>
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <pre className="text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{displayDescription}</pre>
                </div>
              </div>

              {/* Images */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium text-slate-900">Galerie ({images.length} images)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={image.media.id} className="relative group bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <div className="aspect-video bg-slate-100 flex items-center justify-center">
                          <img 
                            src={image.url} 
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-slate-100"><Building2 class="h-12 w-12 text-slate-400" /></div>';
                            }}
                          />
                        </div>
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleRemoveImage(image.media)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {selectedFeatures.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium text-slate-900">Caractéristiques</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2 text-slate-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {t(`property.${feature}`)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Edit Mode - Simplified version with key fields */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-900">Titre</Label>
                  <Input 
                    id="title" 
                    placeholder="Titre du bien" 
                    className="bg-white border-slate-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-900">Prix (€)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="250000" 
                    className="bg-white border-slate-300"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-900">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Description détaillée du bien..." 
                  className="bg-white border-slate-300 min-h-[300px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium text-slate-900">Statut</Label>
                  <RadioGroup value={status} onValueChange={setStatus} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="available" id="available" />
                      <Label htmlFor="available" className="text-slate-700">Disponible</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="pending" />
                      <Label htmlFor="pending" className="text-slate-700">En cours</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sold" id="sold" />
                      <Label htmlFor="sold" className="text-slate-700">Vendu</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium text-slate-900">{t('property.category')}</Label>
                  <RadioGroup value={category} onValueChange={setCategory} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sale" id="sale" />
                      <Label htmlFor="sale" className="text-slate-700">{t('property.sale')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rent" id="rent" />
                      <Label htmlFor="rent" className="text-slate-700">{t('property.rent')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vacation" id="vacation" />
                      <Label htmlFor="vacation" className="text-slate-700">{t('property.vacation')}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-900 block">{t('property.bedrooms')}</Label>
                  <div className="flex justify-center">
                    <NumberInput 
                      value={bedrooms} 
                      onChange={setBedrooms} 
                      min={0} 
                      max={20} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-900 block">{t('property.rooms')}</Label>
                  <div className="flex justify-center">
                    <NumberInput 
                      value={rooms} 
                      onChange={setRooms} 
                      min={1} 
                      max={50} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-900 block">{t('property.bathrooms')}</Label>
                  <div className="flex justify-center">
                    <NumberInput 
                      value={bathrooms} 
                      onChange={setBathrooms} 
                      min={0} 
                      max={10} 
                    />
                  </div>
                </div>
              </div>

              {/* Images Management */}
              <div className="space-y-4">
                <Label className="text-base font-medium text-slate-900">Images actuelles</Label>
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={image.media.id} className="relative group bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <div className="aspect-video bg-slate-100 flex items-center justify-center">
                          <img 
                            src={image.url} 
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-slate-100"><Building2 class="h-12 w-12 text-slate-400" /></div>';
                            }}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleRemoveImage(image.media)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-200">Aucune image pour ce bien</p>
                )}
                
                <div className="mt-6">
                  <Label className="text-base font-medium text-slate-900">Ajouter de nouvelles images</Label>
                  <div className="mt-2">
                    <FileUpload
                      onFilesChange={setUploadedFiles}
                      maxFiles={20}
                      acceptedTypes={['image/*', 'video/*']}
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <Label className="text-base font-medium text-slate-900">{t('property.features')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => 
                          handleFeatureChange(feature, checked as boolean)
                        }
                      />
                      <Label htmlFor={feature} className="text-slate-700">{t(`property.${feature}`)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetail;
