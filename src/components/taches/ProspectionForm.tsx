
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProspectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProspectionForm: React.FC<ProspectionFormProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white border-b border-slate-200 pb-4">
          <DialogTitle className="text-slate-800">Prospection de biens selon les besoins clients</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Analyse de la demande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typologie" className="text-slate-700">Typologie recherchée</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="bureau">Bureau</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget" className="text-slate-700">Budget (MAD)</Label>
                  <Input id="budget" type="number" placeholder="Ex: 1500000" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="localisation" className="text-slate-700">Localisation</Label>
                  <Input id="localisation" placeholder="Ex: Casablanca, Ain Diab" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="delai" className="text-slate-700">Délai souhaité</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="urgent">Urgent (&lt; 1 mois)</SelectItem>
                      <SelectItem value="court">Court terme (1-3 mois)</SelectItem>
                      <SelectItem value="moyen">Moyen terme (3-6 mois)</SelectItem>
                      <SelectItem value="long">Long terme (&gt; 6 mois)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="segmentation" className="text-slate-700">Segmentation</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="residentiel" />
                    <Label htmlFor="residentiel" className="text-slate-600">Résidentiel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bureaux" />
                    <Label htmlFor="bureaux" className="text-slate-600">Bureaux</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="commerces" />
                    <Label htmlFor="commerces" className="text-slate-600">Commerces</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="investissement" />
                    <Label htmlFor="investissement" className="text-slate-600">Investissement</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Veille et sourcing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label htmlFor="portails" className="text-slate-700">Portails consultés</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="avito" />
                    <Label htmlFor="avito" className="text-slate-600">Avito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sarouty" />
                    <Label htmlFor="sarouty" className="text-slate-600">Sarouty</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mubawab" />
                    <Label htmlFor="mubawab" className="text-slate-600">Mubawab</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="autres" />
                    <Label htmlFor="autres" className="text-slate-600">Autres</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="contacts_reseau" className="text-slate-700">Contacts réseau activés</Label>
                <Textarea id="contacts_reseau" placeholder="Gardiens, syndics, promoteurs contactés..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="campagnes" className="text-slate-700">Campagnes de chasse de mandat</Label>
                <Input id="campagnes" placeholder="Zone ciblée, type de campagne..." className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Prise de mandat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimation" className="text-slate-700">Pré-estimation (MAD)</Label>
                  <Input id="estimation" type="number" placeholder="Prix estimé" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="type_mandat" className="text-slate-700">Type de mandat</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="exclusif">Exclusif</SelectItem>
                      <SelectItem value="simple">Simple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="verifications" className="text-slate-700">Vérifications réglementaires</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="titre_propriete" />
                    <Label htmlFor="titre_propriete" className="text-slate-600">Titre de propriété</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="plans" />
                    <Label htmlFor="plans" className="text-slate-600">Plans</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="conformite" />
                    <Label htmlFor="conformite" className="text-slate-600">Conformité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cnss" />
                    <Label htmlFor="cnss" className="text-slate-600">Certificat CNSS</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="points_forts" className="text-slate-700">Points forts du bien</Label>
                <Textarea id="points_forts" placeholder="Avantages à mettre en avant..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="points_faibles" className="text-slate-700">Points faibles / améliorations</Label>
                <Textarea id="points_faibles" placeholder="Points d'attention, travaux nécessaires..." className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
              Annuler
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectionForm;
