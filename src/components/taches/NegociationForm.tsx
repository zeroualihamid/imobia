
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NegociationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NegociationForm: React.FC<NegociationFormProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Négociation & Closing</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de la négociation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bien_negocie">Bien concerné</Label>
                  <Input id="bien_negocie" placeholder="Référence du bien" />
                </div>
                <div>
                  <Label htmlFor="prix_demande">Prix demandé (MAD)</Label>
                  <Input id="prix_demande" type="number" placeholder="Prix initial" />
                </div>
                <div>
                  <Label htmlFor="acheteur">Acheteur</Label>
                  <Input id="acheteur" placeholder="Nom de l'acheteur" />
                </div>
                <div>
                  <Label htmlFor="vendeur">Vendeur</Label>
                  <Input id="vendeur" placeholder="Nom du vendeur" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stratégie de prix */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stratégie de prix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="etude_comparative">Étude comparative de marché (CMA)</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="prix_m2_marche">Prix/m² marché</Label>
                    <Input id="prix_m2_marche" type="number" placeholder="MAD/m²" />
                  </div>
                  <div>
                    <Label htmlFor="biens_comparables">Biens comparables</Label>
                    <Input id="biens_comparables" type="number" placeholder="Nombre" />
                  </div>
                  <div>
                    <Label htmlFor="ecart_marche">Écart avec marché (%)</Label>
                    <Input id="ecart_marche" type="number" placeholder="%" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="argumentaire_valeur">Argumentaire valeur</Label>
                <Textarea id="argumentaire_valeur" placeholder="Points de valeur à mettre en avant..." />
              </div>
              <div>
                <Label htmlFor="potentiel_futur">Potentiel futur</Label>
                <Textarea id="potentiel_futur" placeholder="Évolution du secteur, projets d'aménagement..." />
              </div>
            </CardContent>
          </Card>

          {/* Gestion des offres */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gestion des offres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="premiere_offre">Première offre (MAD)</Label>
                  <Input id="premiere_offre" type="number" placeholder="Montant proposé" />
                </div>
                <div>
                  <Label htmlFor="type_offre">Type d'offre</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="achat">Offre d'achat</SelectItem>
                      <SelectItem value="loi_commerciale">LOI commerciale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Conditions suspensives</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="condition_credit" />
                    <Label htmlFor="condition_credit">Obtention crédit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="condition_autorisations" />
                    <Label htmlFor="condition_autorisations">Autorisations d'activité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="condition_travaux" />
                    <Label htmlFor="condition_travaux">Faisabilité travaux</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="condition_diagnostic" />
                    <Label htmlFor="condition_diagnostic">Diagnostics techniques</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="delai_reponse">Délai de réponse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 heures</SelectItem>
                    <SelectItem value="48h">48 heures</SelectItem>
                    <SelectItem value="72h">72 heures</SelectItem>
                    <SelectItem value="1_semaine">1 semaine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Techniques de négociation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Techniques de négociation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batna">BATNA (Best Alternative)</Label>
                <Textarea id="batna" placeholder="Meilleure alternative si échec négociation..." />
              </div>
              <div>
                <Label htmlFor="concessions">Concessions proposées</Label>
                <Textarea id="concessions" placeholder="Points de négociation possibles..." />
              </div>
              <div>
                <Label htmlFor="urgence">Éléments d'urgence</Label>
                <Textarea id="urgence" placeholder="Facteurs de pression temporelle..." />
              </div>
              <div>
                <Label htmlFor="mediation">Actions de médiation</Label>
                <Textarea id="mediation" placeholder="Solutions pour rapprocher les parties..." />
              </div>
            </CardContent>
          </Card>

          {/* Résultat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résultat de la négociation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prix_final">Prix final accordé (MAD)</Label>
                  <Input id="prix_final" type="number" placeholder="Prix convenu" />
                </div>
                <div>
                  <Label htmlFor="statut_negociation">Statut</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accord">Accord trouvé</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="contre_offre">Contre-offre</SelectItem>
                      <SelectItem value="echec">Échec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes_finales">Notes finales</Label>
                <Textarea id="notes_finales" placeholder="Résumé de la négociation, prochaines étapes..." />
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

export default NegociationForm;
