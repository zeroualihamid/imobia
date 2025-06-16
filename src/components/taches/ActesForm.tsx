
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Signature des actes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de la transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference_transaction">Référence transaction</Label>
                  <Input id="reference_transaction" placeholder="REF-XXXX" />
                </div>
                <div>
                  <Label htmlFor="notaire">Notaire/Avocat</Label>
                  <Input id="notaire" placeholder="Nom du notaire" />
                </div>
                <div>
                  <Label htmlFor="type_acte">Type d'acte</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vente">Vente</SelectItem>
                      <SelectItem value="bail">Bail</SelectItem>
                      <SelectItem value="commercial">Contrat commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date_compromis">Date compromis</Label>
                  <Input id="date_compromis" type="date" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Préparation du dossier */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Préparation du dossier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Documents réunis</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="diagnostics" />
                    <Label htmlFor="diagnostics">Diagnostics obligatoires</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pv_ag" />
                    <Label htmlFor="pv_ag">PV d'AG</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="reglement_copro" />
                    <Label htmlFor="reglement_copro">Règlement copropriété</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="quittances" />
                    <Label htmlFor="quittances">Quittances taxe foncière</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="certificat_urbanisme" />
                    <Label htmlFor="certificat_urbanisme">Certificat d'urbanisme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="plans_cadastraux" />
                    <Label htmlFor="plans_cadastraux">Plans cadastraux</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="documents_manquants">Documents manquants</Label>
                <Textarea id="documents_manquants" placeholder="Liste des documents à obtenir..." />
              </div>
            </CardContent>
          </Card>

          {/* Clauses spécifiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clauses spécifiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="penalites">Pénalités de retard</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input id="penalites_taux" placeholder="Taux %" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jour">Par jour</SelectItem>
                      <SelectItem value="semaine">Par semaine</SelectItem>
                      <SelectItem value="mois">Par mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="resiliation">Conditions de résiliation</Label>
                <Textarea id="resiliation" placeholder="Cas de résiliation, préavis..." />
              </div>
              <div>
                <Label htmlFor="indexation">Indexation (si bail)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'indexation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixe">Augmentation fixe</SelectItem>
                      <SelectItem value="indice">Indice des prix</SelectItem>
                      <SelectItem value="negociable">Négociable</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Pourcentage/base" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordination */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coordination des intervenants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banque_acheteur">Banque acheteur</Label>
                  <Input id="banque_acheteur" placeholder="Nom de la banque" />
                </div>
                <div>
                  <Label htmlFor="statut_credit">Statut crédit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre_accord">Pré-accord</SelectItem>
                      <SelectItem value="accord_definitif">Accord définitif</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="refuse">Refusé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="preemption">Droits de préemption</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purge">Purgé</SelectItem>
                    <SelectItem value="en_cours">En cours de purge</SelectItem>
                    <SelectItem value="non_applicable">Non applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date_acte_definitif">Date acte authentique prévue</Label>
                <Input id="date_acte_definitif" type="date" />
              </div>
            </CardContent>
          </Card>

          {/* Suivi final */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suivi final</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="points_attention">Points d'attention</Label>
                <Textarea id="points_attention" placeholder="Éléments à surveiller jusqu'à la signature..." />
              </div>
              <div>
                <Label htmlFor="presence_jour_j">Présence jour J</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="presence_confirmee" />
                  <Label htmlFor="presence_confirmee">Présence confirmée</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="notes_signature">Notes sur la signature</Label>
                <Textarea id="notes_signature" placeholder="Déroulement, incidents, remarques..." />
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

export default ActesForm;
