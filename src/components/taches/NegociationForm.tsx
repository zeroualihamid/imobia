
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white border-b border-slate-200 pb-4">
          <DialogTitle className="text-slate-800">Négociation & Closing</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de base */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Informations de la négociation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bien_negocie" className="text-slate-700">Bien concerné</Label>
                  <Input id="bien_negocie" placeholder="Référence du bien" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="prix_demande" className="text-slate-700">Prix demandé (MAD)</Label>
                  <Input id="prix_demande" type="number" placeholder="Prix initial" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="acheteur" className="text-slate-700">Acheteur</Label>
                  <Input id="acheteur" placeholder="Nom de l'acheteur" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="vendeur" className="text-slate-700">Vendeur</Label>
                  <Input id="vendeur" placeholder="Nom du vendeur" className="bg-white border-slate-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stratégie de prix */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Stratégie de prix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label htmlFor="etude_comparative" className="text-slate-700">Étude comparative de marché (CMA)</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="prix_m2_marche" className="text-slate-600">Prix/m² marché</Label>
                    <Input id="prix_m2_marche" type="number" placeholder="MAD/m²" className="bg-white border-slate-200" />
                  </div>
                  <div>
                    <Label htmlFor="biens_comparables" className="text-slate-600">Biens comparables</Label>
                    <Input id="biens_comparables" type="number" placeholder="Nombre" className="bg-white border-slate-200" />
                  </div>
                  <div>
                    <Label htmlFor="ecart_marche" className="text-slate-600">Écart avec marché (%)</Label>
                    <Input id="ecart_marche" type="number" placeholder="%" className="bg-white border-slate-200" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="argumentaire_valeur" className="text-slate-700">Argumentaire valeur</Label>
                <Textarea id="argumentaire_valeur" placeholder="Points de valeur à mettre en avant..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="potentiel_futur" className="text-slate-700">Potentiel futur</Label>
                <Textarea id="potentiel_futur" placeholder="Évolution du secteur, projets d'aménagement..." className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          {/* Gestion des offres */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Gestion des offres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="premiere_offre" className="text-slate-700">Première offre (MAD)</Label>
                  <Input id="premiere_offre" type="number" placeholder="Montant proposé" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="type_offre" className="text-slate-700">Type d'offre</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="achat">Offre d'achat</SelectItem>
                      <SelectItem value="loi_commerciale">LOI commerciale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-slate-700">Conditions suspensives</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="condition_credit" />
                    <Label htmlFor="condition_credit" className="text-slate-600">Obtention crédit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="condition_autorisations" />
                    <Label htmlFor="condition_autorisations" className="text-slate-600">Autorisations d'activité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="condition_travaux" />
                    <Label htmlFor="condition_travaux" className="text-slate-600">Faisabilité travaux</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="condition_diagnostic" />
                    <Label htmlFor="condition_diagnostic" className="text-slate-600">Diagnostics techniques</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="delai_reponse" className="text-slate-700">Délai de réponse</Label>
                <Select>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
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
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Techniques de négociation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label htmlFor="batna" className="text-slate-700">BATNA (Best Alternative)</Label>
                <Textarea id="batna" placeholder="Meilleure alternative si échec négociation..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="concessions" className="text-slate-700">Concessions proposées</Label>
                <Textarea id="concessions" placeholder="Points de négociation possibles..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="urgence" className="text-slate-700">Éléments d'urgence</Label>
                <Textarea id="urgence" placeholder="Facteurs de pression temporelle..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="mediation" className="text-slate-700">Actions de médiation</Label>
                <Textarea id="mediation" placeholder="Solutions pour rapprocher les parties..." className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          {/* Résultat */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Résultat de la négociation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prix_final" className="text-slate-700">Prix final accordé (MAD)</Label>
                  <Input id="prix_final" type="number" placeholder="Prix convenu" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="statut_negociation" className="text-slate-700">Statut</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="accord">Accord trouvé</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="contre_offre">Contre-offre</SelectItem>
                      <SelectItem value="echec">Échec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes_finales" className="text-slate-700">Notes finales</Label>
                <Textarea id="notes_finales" placeholder="Résumé de la négociation, prochaines étapes..." className="bg-white border-slate-200" />
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

export default NegociationForm;
