
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prospection de biens selon les besoins clients</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analyse de la demande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typologie">Typologie recherchée</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="bureau">Bureau</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget (MAD)</Label>
                  <Input id="budget" type="number" placeholder="Ex: 1500000" />
                </div>
                <div>
                  <Label htmlFor="localisation">Localisation</Label>
                  <Input id="localisation" placeholder="Ex: Casablanca, Ain Diab" />
                </div>
                <div>
                  <Label htmlFor="delai">Délai souhaité</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (&lt; 1 mois)</SelectItem>
                      <SelectItem value="court">Court terme (1-3 mois)</SelectItem>
                      <SelectItem value="moyen">Moyen terme (3-6 mois)</SelectItem>
                      <SelectItem value="long">Long terme (&gt; 6 mois)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="segmentation">Segmentation</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="residentiel" />
                    <Label htmlFor="residentiel">Résidentiel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bureaux" />
                    <Label htmlFor="bureaux">Bureaux</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="commerces" />
                    <Label htmlFor="commerces">Commerces</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="investissement" />
                    <Label htmlFor="investissement">Investissement</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Veille et sourcing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="portails">Portails consultés</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="avito" />
                    <Label htmlFor="avito">Avito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sarouty" />
                    <Label htmlFor="sarouty">Sarouty</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mubawab" />
                    <Label htmlFor="mubawab">Mubawab</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="autres" />
                    <Label htmlFor="autres">Autres</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="contacts_reseau">Contacts réseau activés</Label>
                <Textarea id="contacts_reseau" placeholder="Gardiens, syndics, promoteurs contactés..." />
              </div>
              <div>
                <Label htmlFor="campagnes">Campagnes de chasse de mandat</Label>
                <Input id="campagnes" placeholder="Zone ciblée, type de campagne..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prise de mandat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimation">Pré-estimation (MAD)</Label>
                  <Input id="estimation" type="number" placeholder="Prix estimé" />
                </div>
                <div>
                  <Label htmlFor="type_mandat">Type de mandat</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusif">Exclusif</SelectItem>
                      <SelectItem value="simple">Simple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="verifications">Vérifications réglementaires</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="titre_propriete" />
                    <Label htmlFor="titre_propriete">Titre de propriété</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="plans" />
                    <Label htmlFor="plans">Plans</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="conformite" />
                    <Label htmlFor="conformite">Conformité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cnss" />
                    <Label htmlFor="cnss">Certificat CNSS</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="points_forts">Points forts du bien</Label>
                <Textarea id="points_forts" placeholder="Avantages à mettre en avant..." />
              </div>
              <div>
                <Label htmlFor="points_faibles">Points faibles / améliorations</Label>
                <Textarea id="points_faibles" placeholder="Points d&apos;attention, travaux nécessaires..." />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button>
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectionForm;
