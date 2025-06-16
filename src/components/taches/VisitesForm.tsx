
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VisitesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VisitesForm: React.FC<VisitesFormProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Organisation et conduite des visites</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de la visite */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de la visite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bien_visite">Bien à visiter</Label>
                  <Input id="bien_visite" placeholder="Adresse du bien" />
                </div>
                <div>
                  <Label htmlFor="date_visite">Date et heure</Label>
                  <Input id="date_visite" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="client_visiteur">Client visiteur</Label>
                  <Input id="client_visiteur" placeholder="Nom du client" />
                </div>
                <div>
                  <Label htmlFor="accompagnants">Nombre d'accompagnants</Label>
                  <Input id="accompagnants" type="number" placeholder="0" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pré-visite */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Check-list pré-visite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Vérifications effectuées</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="etat_bien" />
                    <Label htmlFor="etat_bien">État général du bien</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="odeurs" />
                    <Label htmlFor="odeurs">Odeurs neutralisées</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="eclairage" />
                    <Label htmlFor="eclairage">Éclairage optimisé</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cles" />
                    <Label htmlFor="cles">Clés disponibles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="vendeur_brief" />
                    <Label htmlFor="vendeur_brief">Vendeur briefé</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dossier_complet" />
                    <Label htmlFor="dossier_complet">Dossier complet</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="notes_preparation">Notes de préparation</Label>
                <Textarea id="notes_preparation" placeholder="Points particuliers à retenir..." />
              </div>
            </CardContent>
          </Card>

          {/* Déroulement de la visite */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Déroulement de la visite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="parcours">Parcours de visite</Label>
                <Textarea id="parcours" placeholder="Description du parcours optimal..." />
              </div>
              <div>
                <Label htmlFor="points_forts_presentes">Points forts présentés</Label>
                <Textarea id="points_forts_presentes" placeholder="Volumes, luminosité, aménagements..." />
              </div>
              <div>
                <Label htmlFor="outils_utilises">Outils de projection utilisés</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="plans_3d" />
                    <Label htmlFor="plans_3d">Plans 3D</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="home_staging" />
                    <Label htmlFor="home_staging">Chiffrage home-staging</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rentabilite" />
                    <Label htmlFor="rentabilite">Étude de rentabilité</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback client */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feedback client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reaction_generale">Réaction générale</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tres_interesse">Très intéressé</SelectItem>
                    <SelectItem value="interesse">Intéressé</SelectItem>
                    <SelectItem value="reserve">Réservé</SelectItem>
                    <SelectItem value="pas_interesse">Pas intéressé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="points_positifs">Points positifs relevés</Label>
                <Textarea id="points_positifs" placeholder="Ce qui a plu au client..." />
              </div>
              <div>
                <Label htmlFor="objections">Objections/réticences</Label>
                <Textarea id="objections" placeholder="Points négatifs, hésitations..." />
              </div>
              <div>
                <Label htmlFor="suite_donnee">Suite à donner</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offre_preparation">Préparation d'offre</SelectItem>
                    <SelectItem value="reflexion">Temps de réflexion</SelectItem>
                    <SelectItem value="nouvelles_recherches">Nouvelles recherches</SelectItem>
                    <SelectItem value="abandon">Abandon du projet</SelectItem>
                  </SelectContent>
                </Select>
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

export default VisitesForm;
