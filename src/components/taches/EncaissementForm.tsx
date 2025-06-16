
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EncaissementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EncaissementForm: React.FC<EncaissementFormProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white border-b border-slate-200 pb-4">
          <DialogTitle className="text-slate-800">Encaissement & suivi post-transaction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Facturation */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Facturation et encaissement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prix_vente" className="text-slate-700">Prix de vente (MAD)</Label>
                  <Input id="prix_vente" type="number" placeholder="Montant de la transaction" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="taux_commission" className="text-slate-700">Taux commission (%)</Label>
                  <Input id="taux_commission" type="number" step="0.1" placeholder="Ex: 3.5" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="montant_honoraires" className="text-slate-700">Montant honoraires (MAD)</Label>
                  <Input id="montant_honoraires" type="number" placeholder="Calculé automatiquement" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="numero_facture" className="text-slate-700">Numéro facture</Label>
                  <Input id="numero_facture" placeholder="FAC-XXXX" className="bg-white border-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="retenue_source" className="text-slate-700">Retenue à la source (%)</Label>
                  <Input id="retenue_source" type="number" step="0.1" placeholder="Ex: 10" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="tva" className="text-slate-700">TVA applicable (%)</Label>
                  <Input id="tva" type="number" step="0.1" placeholder="Ex: 20" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="montant_net" className="text-slate-700">Montant net à recevoir</Label>
                  <Input id="montant_net" type="number" placeholder="Calculé" className="bg-white border-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_emission" className="text-slate-700">Date émission facture</Label>
                  <Input id="date_emission" type="date" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="statut_reglement" className="text-slate-700">Statut règlement</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="attente">En attente</SelectItem>
                      <SelectItem value="partiel">Partiel</SelectItem>
                      <SelectItem value="complet">Complet</SelectItem>
                      <SelectItem value="retard">En retard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remise des clés */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Remise des clés / État des lieux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_remise" className="text-slate-700">Date de remise</Label>
                  <Input id="date_remise" type="datetime-local" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="personne_presente" className="text-slate-700">Personne présente</Label>
                  <Input id="personne_presente" placeholder="Nom du responsable" className="bg-white border-slate-200" />
                </div>
              </div>
              <div>
                <Label className="text-slate-700">Éléments remis</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cles_remises" />
                    <Label htmlFor="cles_remises" className="text-slate-600">Jeu de clés complet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="carnet_entretien" />
                    <Label htmlFor="carnet_entretien" className="text-slate-600">Carnet d'entretien</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manuels" />
                    <Label htmlFor="manuels" className="text-slate-600">Manuels équipements</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="garanties" />
                    <Label htmlFor="garanties" className="text-slate-600">Certificats de garantie</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="releves_compteurs" className="text-slate-700">Relevés compteurs</Label>
                <Textarea id="releves_compteurs" placeholder="Électricité, eau, gaz..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="etat_lieux_sortie" className="text-slate-700">État des lieux de sortie</Label>
                <Textarea id="etat_lieux_sortie" placeholder="Observations, photos prises..." className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          {/* After-sale service */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">After-sale service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label htmlFor="enquete_satisfaction" className="text-slate-700">Enquête de satisfaction</Label>
                <Select>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="envoyee">Envoyée</SelectItem>
                    <SelectItem value="completee">Complétée</SelectItem>
                    <SelectItem value="a_envoyer">À envoyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="note_satisfaction" className="text-slate-700">Note de satisfaction (/10)</Label>
                <Input id="note_satisfaction" type="number" min="0" max="10" placeholder="Note client" className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="commentaires_client" className="text-slate-700">Commentaires client</Label>
                <Textarea id="commentaires_client" placeholder="Retours du client sur la prestation..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label className="text-slate-700">Actions de fidélisation</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="invitation_parrainage" />
                    <Label htmlFor="invitation_parrainage" className="text-slate-600">Invitation parrainage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter" />
                    <Label htmlFor="newsletter" className="text-slate-600">Inscription newsletter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="alerte_anniversaire" />
                    <Label htmlFor="alerte_anniversaire" className="text-slate-600">Alerte anniversaire</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="invitation_events" />
                    <Label htmlFor="invitation_events" className="text-slate-600">Invitations événements</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="prochains_contacts" className="text-slate-700">Prochains contacts planifiés</Label>
                <Textarea id="prochains_contacts" placeholder="Suivi prévu, dates importantes..." className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          {/* Bilan de la transaction */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Bilan de la transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duree_totale" className="text-slate-700">Durée totale (jours)</Label>
                  <Input id="duree_totale" type="number" placeholder="Du mandat à la signature" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="nombre_visites" className="text-slate-700">Nombre de visites</Label>
                  <Input id="nombre_visites" type="number" placeholder="Total des visites" className="bg-white border-slate-200" />
                </div>
              </div>
              <div>
                <Label htmlFor="points_amelioration" className="text-slate-700">Points d'amélioration</Label>
                <Textarea id="points_amelioration" placeholder="Leçons apprises, améliorations possibles..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="recommandations" className="text-slate-700">Recommandations futures</Label>
                <Textarea id="recommandations" placeholder="Conseils pour transactions similaires..." className="bg-white border-slate-200" />
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

export default EncaissementForm;
