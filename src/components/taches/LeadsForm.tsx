
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeadsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeadsForm: React.FC<LeadsFormProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Traitement des leads entrants</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations du lead */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations du lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom_lead">Nom complet</Label>
                  <Input id="nom_lead" placeholder="Nom et prénom" />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" placeholder="06 XX XX XX XX" />
                </div>
                <div>
                  <Label htmlFor="email_lead">Email</Label>
                  <Input id="email_lead" type="email" placeholder="email@exemple.com" />
                </div>
                <div>
                  <Label htmlFor="source">Source du lead</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Formulaire web</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="appel">Appel direct</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="referral">Parrainage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="heure_contact">Heure de premier contact</Label>
                <Input id="heure_contact" type="datetime-local" />
              </div>
            </CardContent>
          </Card>

          {/* Qualification BANT */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qualification BANT + Situation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_lead">Budget (MAD)</Label>
                  <Input id="budget_lead" type="number" placeholder="Budget disponible" />
                </div>
                <div>
                  <Label htmlFor="autorite">Autorité de décision</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="decideur">Décideur final</SelectItem>
                      <SelectItem value="influenceur">Influenceur</SelectItem>
                      <SelectItem value="prescripteur">Prescripteur</SelectItem>
                      <SelectItem value="utilisateur">Utilisateur final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="besoin">Besoin précis</Label>
                <Textarea id="besoin" placeholder="Description détaillée du besoin..." />
              </div>
              <div>
                <Label htmlFor="timing">Timing du projet</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediat">Immédiat (< 1 mois)</SelectItem>
                    <SelectItem value="court">1-3 mois</SelectItem>
                    <SelectItem value="moyen">3-6 mois</SelectItem>
                    <SelectItem value="long">6-12 mois</SelectItem>
                    <SelectItem value="indefini">Pas de timing précis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="financement">Situation de financement</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre_approuve">Pré-approuvé banque</SelectItem>
                    <SelectItem value="en_cours">Demande en cours</SelectItem>
                    <SelectItem value="cash">Paiement cash</SelectItem>
                    <SelectItem value="pas_commence">Pas encore commencé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Expérience immobilière</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premier">Premier achat</SelectItem>
                    <SelectItem value="experimente">Expérimenté</SelectItem>
                    <SelectItem value="investisseur">Investisseur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Scoring et suivi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scoring et suivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="score">Score du lead</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chaud">Chaud (prêt à acheter)</SelectItem>
                    <SelectItem value="tiede">Tiède (intéressé mais pas urgent)</SelectItem>
                    <SelectItem value="froid">Froid (simple recherche d'info)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rdv_programme">Rendez-vous programmé</Label>
                <Input id="rdv_programme" type="datetime-local" />
              </div>
              <div>
                <Label htmlFor="notes">Notes et observations</Label>
                <Textarea id="notes" placeholder="Remarques importantes sur le lead..." />
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

export default LeadsForm;
