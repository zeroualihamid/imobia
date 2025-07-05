import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Save, MapPin, User, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import NumberInput from '@/components/ui/NumberInput';
import FileUpload, { UploadedFile } from '@/components/ui/FileUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const AjouterBien = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [category, setCategory] = useState('sale');
  const [propertyType, setPropertyType] = useState('apartment');
  const [condition, setCondition] = useState('good');
  const [bedrooms, setBedrooms] = useState(1);
  const [rooms, setRooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Owner state
  const [ownerFirstName, setOwnerFirstName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerProperties, setOwnerProperties] = useState<any[]>([]);
  const [ownerTasks, setOwnerTasks] = useState<any[]>([]);

  const features = [
    'terrace', 'elevator', 'seaView', 'parking', 
    'garden', 'pool', 'aircon', 'heating', 
    'fireplace', 'security'
  ];

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    }
  };

  const searchOwnerProperties = async () => {
    if (!ownerEmail) {
      toast.error('Veuillez saisir l\'email du propriétaire');
      return;
    }

    try {
      // Recherche des propriétés par email du propriétaire dans les métadonnées
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .or(`metadata->owner->email.eq.${ownerEmail},metadata->>owner_email.eq.${ownerEmail}`);

      if (error) {
        console.error('Erreur lors de la recherche des propriétés:', error);
        toast.error('Erreur lors de la recherche des propriétés');
        return;
      }

      setOwnerProperties(properties || []);
      
      // Recherche des tâches liées à ce propriétaire
      if (properties && properties.length > 0) {
        const propertyIds = properties.map(p => p.id);
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select(`
            *,
            task_conseillers (
              conseiller_id,
              conseillers (nom, prenom)
            )
          `)
          .in('property_id', propertyIds);

        if (tasksError) {
          console.error('Erreur lors de la recherche des tâches:', tasksError);
        } else {
          setOwnerTasks(tasks || []);
        }
      }

      toast.success(`${properties?.length || 0} bien(s) trouvé(s) pour ce propriétaire`);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la recherche');
    }
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

  const saveProperty = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour ajouter un bien');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare metadata object with owner information
      const metadata = {
        category,
        propertyType,
        condition,
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
        },
        owner: {
          firstName: ownerFirstName,
          lastName: ownerLastName,
          phone: ownerPhone,
          email: ownerEmail
        }
      };

      console.log('Saving property with metadata:', metadata);

      // Insert property record using the standard table method
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          metadata
        })
        .select()
        .single();

      if (propertyError) {
        console.error('Property creation error:', propertyError);
        throw propertyError;
      }

      console.log('Property created:', property);

      // Upload files if any
      if (uploadedFiles.length > 0) {
        console.log('Uploading files:', uploadedFiles.length);
        
        for (const uploadedFile of uploadedFiles) {
          const filePath = await uploadFileToStorage(uploadedFile.file, property.id);
          
          if (filePath) {
            // Insert media record using the standard table method
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

      toast.success('Bien ajouté avec succès !');
      navigate('/biens');
      
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Erreur lors de la sauvegarde du bien');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EN_FILE':
        return <Badge className="bg-blue-100 text-blue-800">En file</Badge>;
      case 'EN_COURS':
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case 'TERMINEE':
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'ANNULEE':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'URGENT':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'IMPORTANT':
        return <Badge className="bg-orange-100 text-orange-800">Important</Badge>;
      case 'NORMAL':
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      default:
        return <Badge variant="secondary">{category}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          {t('property.add')}
        </h1>
        <p className="text-slate-600">
          {t('nav.addProperty')}
        </p>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <Tabs defaultValue="category" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-slate-100 border border-slate-200 p-1">
              <TabsTrigger 
                value="category" 
                className="text-xs md:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium"
              >
                {t('property.category')}
              </TabsTrigger>
              <TabsTrigger 
                value="location" 
                className="text-xs md:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium"
              >
                {t('property.location')}
              </TabsTrigger>
              <TabsTrigger 
                value="surface" 
                className="text-xs md:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium"
              >
                {t('property.surface')}
              </TabsTrigger>
              <TabsTrigger 
                value="composition" 
                className="text-xs md:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium"
              >
                {t('property.composition')}
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                className="text-xs md:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium"
              >
                {t('property.gallery')}
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="text-xs md:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium"
              >
                {t('property.features')}
              </TabsTrigger>
              <TabsTrigger 
                value="proprietaire" 
                className="text-xs md:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium"
              >
                Propriétaire
              </TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="space-y-6 mt-6">
              <div className="space-y-4">
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

                <div>
                  <Label className="text-base font-medium text-slate-900">{t('property.type')}</Label>
                  <RadioGroup value={propertyType} onValueChange={setPropertyType} className="mt-2 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="apartment" id="apartment" />
                      <Label htmlFor="apartment" className="text-slate-700">{t('property.apartment')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="villa" id="villa" />
                      <Label htmlFor="villa" className="text-slate-700">{t('property.villa')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="commercial" id="commercial" />
                      <Label htmlFor="commercial" className="text-slate-700">{t('property.commercial')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="land" id="land" />
                      <Label htmlFor="land" className="text-slate-700">{t('property.land')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="house" id="house" />
                      <Label htmlFor="house" className="text-slate-700">{t('property.house')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="riad" id="riad" />
                      <Label htmlFor="riad" className="text-slate-700">{t('property.riad')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="office" id="office" />
                      <Label htmlFor="office" className="text-slate-700">{t('property.office')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="farm" id="farm" />
                      <Label htmlFor="farm" className="text-slate-700">{t('property.farm')}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <Label className="text-base font-medium flex items-center gap-2 text-slate-900">
                    <MapPin className="h-4 w-4" />
                    Carte de localisation
                  </Label>
                  <div className="mt-2 h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200">
                    Google Map sera intégré ici
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-900">{t('property.address')}</Label>
                  <Input 
                    id="address" 
                    placeholder={t('property.address')} 
                    className="bg-white border-slate-300"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-slate-900">{t('property.region')}</Label>
                  <Input 
                    id="region" 
                    placeholder={t('property.region')} 
                    className="bg-white border-slate-300"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-900">{t('property.city')}</Label>
                  <Input 
                    id="city" 
                    placeholder={t('property.city')} 
                    className="bg-white border-slate-300"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-slate-900">{t('property.district')}</Label>
                  <Input 
                    id="district" 
                    placeholder={t('property.district')} 
                    className="bg-white border-slate-300"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="neighborhood" className="text-slate-900">{t('property.neighborhood')}</Label>
                  <Input 
                    id="neighborhood" 
                    placeholder={t('property.neighborhood')} 
                    className="bg-white border-slate-300"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="surface" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="builtArea" className="text-slate-900">{t('property.builtArea')} (m²)</Label>
                  <Input 
                    id="builtArea" 
                    type="number" 
                    placeholder="120" 
                    className="bg-white border-slate-300"
                    value={builtArea}
                    onChange={(e) => setBuiltArea(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="livingArea" className="text-slate-900">{t('property.livingArea')} (m²)</Label>
                  <Input 
                    id="livingArea" 
                    type="number" 
                    placeholder="100" 
                    className="bg-white border-slate-300"
                    value={livingArea}
                    onChange={(e) => setLivingArea(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outdoorArea" className="text-slate-900">{t('property.outdoorArea')} (m²)</Label>
                  <Input 
                    id="outdoorArea" 
                    type="number" 
                    placeholder="20" 
                    className="bg-white border-slate-300"
                    value={outdoorArea}
                    onChange={(e) => setOutdoorArea(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Label className="text-base font-medium text-slate-900">{t('property.condition')}</Label>
                <RadioGroup value={condition} onValueChange={setCondition} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new" className="text-slate-700">{t('property.new')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good" className="text-slate-700">{t('property.good')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="renovate" id="renovate" />
                    <Label htmlFor="renovate" className="text-slate-700">{t('property.renovate')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="composition" className="space-y-6 mt-6">
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
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4 mt-6">
              <div className="space-y-4">
                <Label className="text-base font-medium text-slate-900">{t('property.gallery')}</Label>
                <FileUpload
                  onFilesChange={setUploadedFiles}
                  maxFiles={20}
                  acceptedTypes={['image/*', 'video/*']}
                />
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 mt-6">
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
            </TabsContent>

            <TabsContent value="proprietaire" className="space-y-6 mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Informations du propriétaire</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerFirstName" className="text-slate-900">Prénom</Label>
                    <Input 
                      id="ownerFirstName" 
                      placeholder="Prénom du propriétaire" 
                      className="bg-white border-slate-300"
                      value={ownerFirstName}
                      onChange={(e) => setOwnerFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerLastName" className="text-slate-900">Nom</Label>
                    <Input 
                      id="ownerLastName" 
                      placeholder="Nom du propriétaire" 
                      className="bg-white border-slate-300"
                      value={ownerLastName}
                      onChange={(e) => setOwnerLastName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone" className="text-slate-900 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </Label>
                    <Input 
                      id="ownerPhone" 
                      placeholder="+212 6 XX XX XX XX" 
                      className="bg-white border-slate-300"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail" className="text-slate-900 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id="ownerEmail" 
                        placeholder="proprietaire@email.com" 
                        className="bg-white border-slate-300"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        onClick={searchOwnerProperties}
                        variant="outline"
                        className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        Chercher
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Liste des biens du propriétaire */}
                {ownerProperties.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-base font-medium text-slate-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Biens du propriétaire ({ownerProperties.length})
                    </h4>
                    <div className="bg-slate-50 rounded-lg border border-slate-200">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                              <th className="text-left p-3 font-medium text-slate-700">Type</th>
                              <th className="text-left p-3 font-medium text-slate-700">Localisation</th>
                              <th className="text-left p-3 font-medium text-slate-700">Catégorie</th>
                              <th className="text-left p-3 font-medium text-slate-700">Créé le</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ownerProperties.map((property) => (
                              <tr key={property.id} className="border-b border-slate-200 hover:bg-white">
                                <td className="p-3 text-slate-900 capitalize">
                                  {property.metadata?.propertyType || 'Non défini'}
                                </td>
                                <td className="p-3 text-slate-700">
                                  {property.metadata?.location?.city || 'Non défini'}
                                </td>
                                <td className="p-3">
                                  <Badge variant="outline" className="capitalize">
                                    {property.metadata?.category || 'Non défini'}
                                  </Badge>
                                </td>
                                <td className="p-3 text-slate-700">
                                  {new Date(property.created_at).toLocaleDateString('fr-FR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Liste des tâches liées */}
                {ownerTasks.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-base font-medium text-slate-900">
                      Tâches en relation ({ownerTasks.length})
                    </h4>
                    <div className="bg-slate-50 rounded-lg border border-slate-200">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                              <th className="text-left p-3 font-medium text-slate-700">Titre</th>
                              <th className="text-left p-3 font-medium text-slate-700">Description</th>
                              <th className="text-left p-3 font-medium text-slate-700">Catégorie</th>
                              <th className="text-left p-3 font-medium text-slate-700">Statut</th>
                              <th className="text-left p-3 font-medium text-slate-700">Conseiller</th>
                              <th className="text-left p-3 font-medium text-slate-700">Créée le</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ownerTasks.map((task) => (
                              <tr key={task.id} className="border-b border-slate-200 hover:bg-white">
                                <td className="p-3 text-slate-900 font-medium">{task.title}</td>
                                <td className="p-3 text-slate-700 max-w-xs truncate">
                                  {task.description || 'Aucune description'}
                                </td>
                                <td className="p-3">{getCategoryBadge(task.category)}</td>
                                <td className="p-3">{getStatusBadge(task.status)}</td>
                                <td className="p-3 text-slate-700">
                                  {task.task_conseillers?.[0]?.conseillers ? 
                                    `${task.task_conseillers[0].conseillers.prenom} ${task.task_conseillers[0].conseillers.nom}` : 
                                    'Non assigné'
                                  }
                                </td>
                                <td className="p-3 text-slate-700">
                                  {new Date(task.created_at).toLocaleDateString('fr-FR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {ownerEmail && ownerProperties.length === 0 && (
                  <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600">Aucun bien trouvé pour cet email.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200">
            <Button 
              onClick={saveProperty}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Sauvegarde...' : t('common.save')}
            </Button>
            <Button 
              variant="outline" 
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
              onClick={() => navigate('/biens')}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterBien;
