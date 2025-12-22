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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Demandes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
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
        toast.error(t('request.requiredFields'));
        setLoading(false);
        return;
      }

      if (!user) {
        toast.error(t('request.loginRequired'));
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('demandes')
        .insert({
          user_id: user.id,
          client_nom_complet: formData.client_nom_complet,
          telephone: formData.telephone || null,
          email: formData.email,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          type_bien: formData.type_bien || null,
          superficie: formData.superficie ? parseFloat(formData.superficie) : null,
          adresse_complete: formData.adresse_complete || null,
          latitude: coordinates ? coordinates[1] : null,
          longitude: coordinates ? coordinates[0] : null,
          description: formData.description || null
        });

      if (error) throw error;
      
      toast.success(t('request.createSuccess'));
      navigate('/demandes');
    } catch (error) {
      console.error('Error creating demande:', error);
      toast.error(t('request.createError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
        <Button variant="outline" size="sm" onClick={() => navigate('/demandes')}>
          <ArrowLeft className={cn("h-4 w-4", isRTL ? "ml-2 rotate-180" : "mr-2")} />
          {t('common.back')}
        </Button>
        <div className={isRTL ? "text-right" : ""}>
          <h1 className="text-3xl font-bold text-foreground">{t('request.addTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('request.addSubtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <ClipboardList className="h-5 w-5" />
              {t('request.clientInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_nom_complet">{t('request.clientFullName')} *</Label>
                <Input
                  id="client_nom_complet"
                  value={formData.client_nom_complet}
                  onChange={(e) => handleChange('client_nom_complet', e.target.value)}
                  placeholder={t('request.clientPlaceholder')}
                  required
                  className={isRTL ? "text-right" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">{t('common.phone')}</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder={t('request.phonePlaceholder')}
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('common.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={t('request.emailPlaceholder')}
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">{t('request.budgetLabel')}</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="250000"
                  min="0"
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('request.propertyCharacteristics')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type_bien">{t('request.propertyType')}</Label>
                <Select
                  value={formData.type_bien || 'all'}
                  onValueChange={(value) => handleChange('type_bien', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('request.selectPropertyType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('request.select')}</SelectItem>
                    {typesBien.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="superficie">{t('request.areaLabel')}</Label>
                <Input
                  id="superficie"
                  type="number"
                  value={formData.superficie}
                  onChange={(e) => handleChange('superficie', e.target.value)}
                  placeholder="100"
                  min="0"
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('request.locationTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adresse_complete">{t('request.fullAddress')}</Label>
              <Textarea
                id="adresse_complete"
                value={formData.adresse_complete}
                onChange={(e) => handleChange('adresse_complete', e.target.value)}
                placeholder={t('request.addressPlaceholder')}
                rows={3}
                className={isRTL ? "text-right" : ""}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">{t('request.mapLocation')}</Label>
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
            <CardTitle>{t('request.descriptionTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">{t('request.descriptionLabel')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={t('request.descriptionPlaceholder')}
                rows={6}
                className={isRTL ? "text-right" : ""}
              />
            </div>
          </CardContent>
        </Card>

        <div className={cn("flex gap-4", isRTL ? "justify-start flex-row-reverse" : "justify-end")}>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/demandes')}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {loading ? t('request.saving') : t('request.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Demandes;

