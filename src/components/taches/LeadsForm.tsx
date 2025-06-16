
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white border-b border-slate-200 pb-4">
          <DialogTitle className="text-slate-800">Traitement des leads entrants</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Informations du lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom_lead" className="text-slate-700">Nom complet</Label>
                  <Input id="nom_lead" placeholder="Nom et prénom" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="telephone" className="text-slate-700">Téléphone</Label>
                  <Input id="telephone" placeholder="06 XX XX XX XX" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="email_lead" className="text-slate-700">Email</Label>
                  <Input id="email_lead" type="email" placeholder="email@exemple.com" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="source" className="text-slate-700">Source du lead</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
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
                <Label htmlFor="heure_contact" className="text-slate-700">Heure de premier contact</Label>
                <Input id="heure_contact" type="datetime-local" className="bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Qualification BANT + Situation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_lead" className="text-slate-700">Budget (MAD)</Label>
                  <Input id="budget_lead" type="number" placeholder="Budget disponible" className="bg-white border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="autorite" className="text-slate-700">Autorité de décision</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="decideur">Décideur final</SelectItem>
                      <SelectItem value="influenceur">Influenceur</SelectItem>
                      <SelectItem value="prescripteur">Prescripteur</SelectItem>
                      <SelectItem value="utilisateur">Utilisateur final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="besoin" className="text-slate-700">Besoin précis</Label>
                <Textarea id="besoin" placeholder="Description détaillée du besoin..." className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="timing" className="text-slate-700">Timing du projet</Label>
                <Select>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="immediat">Immédiat (moins de 1 mois)</SelectItem>
                    <SelectItem value="court">1-3 mois</SelectItem>
                    <SelectItem value="moyen">3-6 mois</SelectItem>
                    <SelectItem value="long">6-12 mois</SelectItem>
                    <SelectItem value="indefini">Pas de timing précis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="financement" className="text-slate-700">Situation de financement</Label>
                <Select>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="pre_approuve">Pré-approuvé banque</SelectItem>
                    <SelectItem value="en_cours">Demande en cours</SelectItem>
                    <SelectItem value="cash">Paiement cash</SelectItem>
                    <SelectItem value="pas_commence">Pas encore commencé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience" className="text-slate-700">Expérience immobilière</Label>
                <Select>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="premier">Premier achat</SelectItem>
                    <SelectItem value="experimente">Expérimenté</SelectItem>
                    <SelectItem value="investisseur">Investisseur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-700">Scoring et suivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label htmlFor="score" className="text-slate-700">Score du lead</Label>
                <Select>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="chaud">Chaud (prêt à acheter)</SelectItem>
                    <SelectItem value="tiede">Tiède (intéressé mais pas urgent)</SelectItem>
                    <SelectItem value="froid">Froid (simple recherche d'info)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rdv_programme" className="text-slate-700">Rendez-vous programmé</Label>
                <Input id="rdv_programme" type="datetime-local" className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="notes" className="text-slate-700">Notes et observations</Label>
                <Textarea id="notes" placeholder="Remarques importantes sur le lead..." className="bg-white border-slate-200" />
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

export default LeadsForm;
