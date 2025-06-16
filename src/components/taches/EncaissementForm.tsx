
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Encaissement & suivi post-transaction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Facturation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Facturation et encaissement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prix_vente">Prix de vente (MAD)</Label>
                  <Input id="prix_vente" type="number" placeholder="Montant de la transaction" />
                </div>
                <div>
                  <Label htmlFor="taux_commission">Taux commission (%)</Label>
                  <Input id="taux_commission" type="number" step="0.1" placeholder="Ex: 3.5" />
                </div>
                <div>
                  <Label htmlFor="montant_honoraires">Montant honoraires (MAD)</Label>
                  <Input id="montant_honoraires" type="number" placeholder="Calculé automatiquement" />
                </div>
                <div>
                  <Label htmlFor="numero_facture">Numéro facture</Label>
                  <Input id="numero_facture" placeholder="FAC-XXXX" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="retenue_source">Retenue à la source (%)</Label>
                  <Input id="retenue_source" type="number" step="0.1" placeholder="Ex: 10" />
                </div>
                <div>
                  <Label htmlFor="tva">TVA applicable (%)</Label>
                  <Input id="tva" type="number" step="0.1" placeholder="Ex: 20" />
                </div>
                <div>
                  <Label htmlFor="montant_net">Montant net à recevoir</Label>
                  <Input id="montant_net" type="number" placeholder="Calculé" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_emission">Date émission facture</Label>
                  <Input id="date_emission" type="date" />
                </div>
                <div>
                  <Label htmlFor="statut_reglement">Statut règlement</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Remise des clés / État des lieux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_remise">Date de remise</Label>
                  <Input id="date_remise" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="personne_presente">Personne présente</Label>
                  <Input id="personne_presente" placeholder="Nom du responsable" />
                </div>
              </div>
              <div>
                <Label>Éléments remis</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cles_remises" />
                    <Label htmlFor="cles_remises">Jeu de clés complet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="carnet_entretien" />
                    <Label htmlFor="carnet_entretien">Carnet d'entretien</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manuels" />
                    <Label htmlFor="manuels">Manuels équipements</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="garanties" />
                    <Label htmlFor="garanties">Certificats de garantie</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="releves_compteurs">Relevés compteurs</Label>
                <Textarea id="releves_compteurs" placeholder="Électricité, eau, gaz..." />
              </div>
              <div>
                <Label htmlFor="etat_lieux_sortie">État des lieux de sortie</Label>
                <Textarea id="etat_lieux_sortie" placeholder="Observations, photos prises..." />
              </div>
            </CardContent>
          </Card>

          {/* After-sale service */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">After-sale service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="enquete_satisfaction">Enquête de satisfaction</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="envoyee">Envoyée</SelectItem>
                    <SelectItem value="completee">Complétée</SelectItem>
                    <SelectItem value="a_envoyer">À envoyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="note_satisfaction">Note de satisfaction (/10)</Label>
                <Input id="note_satisfaction" type="number" min="0" max="10" placeholder="Note client" />
              </div>
              <div>
                <Label htmlFor="commentaires_client">Commentaires client</Label>
                <Textarea id="commentaires_client" placeholder="Retours du client sur la prestation..." />
              </div>
              <div>
                <Label>Actions de fidélisation</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="invitation_parrainage" />
                    <Label htmlFor="invitation_parrainage">Invitation parrainage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter" />
                    <Label htmlFor="newsletter">Inscription newsletter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="alerte_anniversaire" />
                    <Label htmlFor="alerte_anniversaire">Alerte anniversaire</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="invitation_events" />
                    <Label htmlFor="invitation_events">Invitations événements</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="prochains_contacts">Prochains contacts planifiés</Label>
                <Textarea id="prochains_contacts" placeholder="Suivi prévu, dates importantes..." />
              </div>
            </CardContent>
          </Card>

          {/* Bilan de la transaction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bilan de la transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duree_totale">Durée totale (jours)</Label>
                  <Input id="duree_totale" type="number" placeholder="Du mandat à la signature" />
                </div>
                <div>
                  <Label htmlFor="nombre_visites">Nombre de visites</Label>
                  <Input id="nombre_visites" type="number" placeholder="Total des visites" />
                </div>
              </div>
              <div>
                <Label htmlFor="points_amelioration">Points d'amélioration</Label>
                <Textarea id="points_amelioration" placeholder="Leçons apprises, améliorations possibles..." />
              </div>
              <div>
                <Label htmlFor="recommandations">Recommandations futures</Label>
                <Textarea id="recommandations" placeholder="Conseils pour transactions similaires..." />
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

export default EncaissementForm;
