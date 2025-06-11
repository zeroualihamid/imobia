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
            <TabsList className="grid w-full grid-cols-6 bg-slate-100 border border-slate-200 p-1">
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
                  <Input id="address" placeholder={t('property.address')} className="bg-white border-slate-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-slate-900">{t('property.region')}</Label>
                  <Input id="region" placeholder={t('property.region')} className="bg-white border-slate-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-900">{t('property.city')}</Label>
                  <Input id="city" placeholder={t('property.city')} className="bg-white border-slate-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-slate-900">{t('property.district')}</Label>
                  <Input id="district" placeholder={t('property.district')} className="bg-white border-slate-300" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="neighborhood" className="text-slate-900">{t('property.neighborhood')}</Label>
                  <Input id="neighborhood" placeholder={t('property.neighborhood')} className="bg-white border-slate-300" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="surface" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="builtArea" className="text-slate-900">{t('property.builtArea')} (m²)</Label>
                  <Input id="builtArea" type="number" placeholder="120" className="bg-white border-slate-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="livingArea" className="text-slate-900">{t('property.livingArea')} (m²)</Label>
                  <Input id="livingArea" type="number" placeholder="100" className="bg-white border-slate-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outdoorArea" className="text-slate-900">{t('property.outdoorArea')} (m²)</Label>
                  <Input id="outdoorArea" type="number" placeholder="20" className="bg-white border-slate-300" />
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
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    Glissez-déposez vos photos et vidéos ici ou cliquez pour sélectionner
                  </p>
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                    <Upload className="h-4 w-4 mr-2" />
                    Sélectionner des fichiers
                  </Button>
                </div>
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
          </Tabs>

          <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Save className="h-4 w-4 mr-2" />
              {t('common.save')}
            </Button>
            <Button variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm">
              {t('common.cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterBien;
