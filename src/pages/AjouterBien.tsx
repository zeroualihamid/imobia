
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Save, Upload, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NumberInput from '@/components/ui/NumberInput';

const AjouterBien = () => {
  const { t } = useLanguage();
  
  // Form state
  const [category, setCategory] = useState('sale');
  const [propertyType, setPropertyType] = useState('apartment');
  const [condition, setCondition] = useState('good');
  const [bedrooms, setBedrooms] = useState(1);
  const [rooms, setRooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Building2 className="h-8 w-8 text-slate-600" />
          {t('property.add')}
        </h1>
        <p className="text-muted-foreground">
          {t('nav.addProperty')}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="category" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="category">{t('property.category')}</TabsTrigger>
              <TabsTrigger value="location">{t('property.location')}</TabsTrigger>
              <TabsTrigger value="surface">{t('property.surface')}</TabsTrigger>
              <TabsTrigger value="composition">{t('property.composition')}</TabsTrigger>
              <TabsTrigger value="gallery">{t('property.gallery')}</TabsTrigger>
              <TabsTrigger value="features">{t('property.features')}</TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">{t('property.category')}</Label>
                  <RadioGroup value={category} onValueChange={setCategory} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sale" id="sale" />
                      <Label htmlFor="sale">{t('property.sale')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rent" id="rent" />
                      <Label htmlFor="rent">{t('property.rent')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vacation" id="vacation" />
                      <Label htmlFor="vacation">{t('property.vacation')}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">{t('property.type')}</Label>
                  <RadioGroup value={propertyType} onValueChange={setPropertyType} className="mt-2 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="apartment" id="apartment" />
                      <Label htmlFor="apartment">{t('property.apartment')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="villa" id="villa" />
                      <Label htmlFor="villa">{t('property.villa')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="commercial" id="commercial" />
                      <Label htmlFor="commercial">{t('property.commercial')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="land" id="land" />
                      <Label htmlFor="land">{t('property.land')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="house" id="house" />
                      <Label htmlFor="house">{t('property.house')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="riad" id="riad" />
                      <Label htmlFor="riad">{t('property.riad')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="office" id="office" />
                      <Label htmlFor="office">{t('property.office')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="farm" id="farm" />
                      <Label htmlFor="farm">{t('property.farm')}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Carte de localisation
                  </Label>
                  <div className="mt-2 h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    Google Map sera intégré ici
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">{t('property.address')}</Label>
                  <Input id="address" placeholder={t('property.address')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">{t('property.region')}</Label>
                  <Input id="region" placeholder={t('property.region')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{t('property.city')}</Label>
                  <Input id="city" placeholder={t('property.city')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">{t('property.district')}</Label>
                  <Input id="district" placeholder={t('property.district')} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="neighborhood">{t('property.neighborhood')}</Label>
                  <Input id="neighborhood" placeholder={t('property.neighborhood')} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="surface" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="builtArea">{t('property.builtArea')} (m²)</Label>
                  <Input id="builtArea" type="number" placeholder="120" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="livingArea">{t('property.livingArea')} (m²)</Label>
                  <Input id="livingArea" type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outdoorArea">{t('property.outdoorArea')} (m²)</Label>
                  <Input id="outdoorArea" type="number" placeholder="20" />
                </div>
              </div>
              
              <div className="mt-6">
                <Label className="text-base font-medium">{t('property.condition')}</Label>
                <RadioGroup value={condition} onValueChange={setCondition} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">{t('property.new')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">{t('property.good')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="renovate" id="renovate" />
                    <Label htmlFor="renovate">{t('property.renovate')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="composition" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">{t('property.bedrooms')}</Label>
                  <NumberInput 
                    value={bedrooms} 
                    onChange={setBedrooms} 
                    min={0} 
                    max={20} 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">{t('property.rooms')}</Label>
                  <NumberInput 
                    value={rooms} 
                    onChange={setRooms} 
                    min={1} 
                    max={50} 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">{t('property.bathrooms')}</Label>
                  <NumberInput 
                    value={bathrooms} 
                    onChange={setBathrooms} 
                    min={0} 
                    max={10} 
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4 mt-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">{t('property.gallery')}</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Glissez-déposez vos photos et vidéos ici ou cliquez pour sélectionner
                  </p>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Sélectionner des fichiers
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 mt-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">{t('property.features')}</Label>
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
                      <Label htmlFor={feature}>{t(`property.${feature}`)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-6 mt-6 border-t">
            <Button className="bg-slate-600 hover:bg-slate-700">
              <Save className="h-4 w-4 mr-2" />
              {t('common.save')}
            </Button>
            <Button variant="outline">
              {t('common.cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterBien;
