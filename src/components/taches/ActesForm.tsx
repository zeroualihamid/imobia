
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActesForm: React.FC<ActesFormProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white border-b border-slate-200 pb-4">
          <DialogTitle className="text-slate-800">Signature des actes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de base */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Informations de la transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference_transaction" className="text-slate-700">Référence transaction</Label>
                  <Input id="reference_transaction" placeholder="REF-XXXX" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="notaire" className="text-slate-700">Notaire/Avocat</Label>
                  <Input id="notaire" placeholder="Nom du notaire" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="type_acte" className="text-slate-700">Type d'acte</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="vente">Vente</SelectItem>
                      <SelectItem value="bail">Bail</SelectItem>
                      <SelectItem value="commercial">Contrat commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date_compromis" className="text-slate-700">Date compromis</Label>
                  <Input id="date_compromis" type="date" className="bg-white border-slate-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Préparation du dossier */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Préparation du dossier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label className="text-slate-700">Documents réunis</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="diagnostics" />
                    <Label htmlFor="diagnostics" className="text-slate-600">Diagnostics obligatoires</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pv_ag" />
                    <Label htmlFor="pv_ag" className="text-slate-600">PV d'AG</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="reglement_copro" />
                    <Label htmlFor="reglement_copro" className="text-slate-600">Règlement copropriété</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="quittances" />
                    <Label htmlFor="quittances" className="text-slate-600">Quittances taxe foncière</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="certificat_urbanisme" />
                    <Label htmlFor="certificat_urbanisme" className="text-slate-600">Certificat d'urbanisme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="plans_cadastraux" />
                    <Label htmlFor="plans_cadastraux" className="text-slate-600">Plans cadastraux</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="documents_manquants" className="text-slate-700">Documents manquants</Label>
                <Textarea id="documents_manquants" placeholder="Liste des documents à obtenir..." className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          {/* Clauses spécifiques */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Clauses spécifiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label htmlFor="penalites" className="text-slate-700">Pénalités de retard</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input id="penalites_taux" placeholder="Taux %" className="bg-white border-slate-200" />
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="jour">Par jour</SelectItem>
                      <SelectItem value="semaine">Par semaine</SelectItem>
                      <SelectItem value="mois">Par mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="resiliation" className="text-slate-700">Conditions de résiliation</Label>
                <Textarea id="resiliation" placeholder="Cas de résiliation, préavis..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="indexation" className="text-slate-700">Indexation (si bail)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Type d'indexation" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="fixe">Augmentation fixe</SelectItem>
                      <SelectItem value="indice">Indice des prix</SelectItem>
                      <SelectItem value="negociable">Négociable</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Pourcentage/base" className="bg-white border-slate-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordination */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Coordination des intervenants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banque_acheteur" className="text-slate-700">Banque acheteur</Label>
                  <Input id="banque_acheteur" placeholder="Nom de la banque" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="statut_credit" className="text-slate-700">Statut crédit</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="pre_accord">Pré-accord</SelectItem>
                      <SelectItem value="accord_definitif">Accord définitif</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="refuse">Refusé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="preemption" className="text-slate-700">Droits de préemption</Label>
                <Select>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="purge">Purgé</SelectItem>
                    <SelectItem value="en_cours">En cours de purge</SelectItem>
                    <SelectItem value="non_applicable">Non applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date_acte_definitif" className="text-slate-700">Date acte authentique prévue</Label>
                <Input id="date_acte_definitif" type="date" className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          {/* Suivi final */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Suivi final</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label htmlFor="points_attention" className="text-slate-700">Points d'attention</Label>
                <Textarea id="points_attention" placeholder="Éléments à surveiller jusqu'à la signature..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="presence_jour_j" className="text-slate-700">Présence jour J</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="presence_confirmee" />
                  <Label htmlFor="presence_confirmee" className="text-slate-600">Présence confirmée</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="notes_signature" className="text-slate-700">Notes sur la signature</Label>
                <Textarea id="notes_signature" placeholder="Déroulement, incidents, remarques..." className="bg-white border-slate-200" />
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

export default ActesForm;
