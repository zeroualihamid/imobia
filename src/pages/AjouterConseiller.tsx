
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  GraduationCap,
  Award,
  FileText
} from 'lucide-react';

const AjouterConseiller = () => {
  const [formData, setFormData] = useState({
    // Informations personnelles
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    nationalite: '',
    
    // Informations professionnelles
    numeroLicence: '',
    dateEmbauche: '',
    salaire: '',
    commission: '',
    secteur: '',
    
    // Formation et expérience
    formation: '',
    experience: '',
    specialisations: [] as string[],
    langues: [] as string[],
    
    // Compétences par tâche
    prospection: {
      analyseDemande: false,
      veilleSourcing: false,
      priseMandat: false,
      notes: ''
    },
    leads: {
      reactivite: false,
      qualification: false,
      scoring: false,
      rdv: false,
      notes: ''
    },
    visites: {
      preVisite: false,
      parcoursScenarise: false,
      feedback: false,
      notes: ''
    },
    negociation: {
      strategiePrix: false,
      gestionOffres: false,
      techniques: false,
      notes: ''
    },
    actes: {
      preparationDossier: false,
      compromis: false,
      accompagnement: false,
      notes: ''
    },
    encaissement: {
      facturation: false,
      remiseCles: false,
      afterSale: false,
      notes: ''
    }
  });

  const specialisationsOptions = [
    'Résidentiel',
    'Commercial',
    'Bureaux',
    'Terrain',
    'Investissement locatif',
    'Luxe',
    'Neuf',
    'Ancien'
  ];

  const languesOptions = [
    'Français',
    'Arabe',
    'Anglais',
    'Espagnol',
    'Allemand',
    'Italien'
  ];

  const handleSpecialisationChange = (specialisation: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialisations: checked 
        ? [...prev.specialisations, specialisation]
        : prev.specialisations.filter(s => s !== specialisation)
    }));
  };

  const handleLangueChange = (langue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      langues: checked 
        ? [...prev.langues, langue]
        : prev.langues.filter(l => l !== langue)
    }));
  };

  const handleCompetenceChange = (section: string, competence: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [competence]: checked
      }
    }));
  };

  const handleNotesChange = (section: string, notes: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        notes
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données du conseiller:', formData);
    // Ici, vous pouvez ajouter la logique pour sauvegarder les données
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-500 p-3 rounded-lg">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Ajouter un conseiller
            </h1>
            <p className="text-slate-600">
              Fiche de renseignement complète pour un nouveau conseiller immobilier
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom" className="text-slate-700">Prénom *</Label>
                <Input 
                  id="prenom" 
                  value={formData.prenom}
                  onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                  className="bg-white border-slate-200" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="nom" className="text-slate-700">Nom *</Label>
                <Input 
                  id="nom" 
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="bg-white border-slate-200" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-700">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-slate-200" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="telephone" className="text-slate-700">Téléphone *</Label>
                <Input 
                  id="telephone" 
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  className="bg-white border-slate-200" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="dateNaissance" className="text-slate-700">Date de naissance</Label>
                <Input 
                  id="dateNaissance" 
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                  className="bg-white border-slate-200" 
                />
              </div>
              <div>
                <Label htmlFor="nationalite" className="text-slate-700">Nationalité</Label>
                <Input 
                  id="nationalite" 
                  value={formData.nationalite}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationalite: e.target.value }))}
                  className="bg-white border-slate-200" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="adresse" className="text-slate-700">Adresse complète</Label>
              <Textarea 
                id="adresse" 
                value={formData.adresse}
                onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                className="bg-white border-slate-200" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations professionnelles */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Building className="h-5 w-5" />
              Informations professionnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numeroLicence" className="text-slate-700">Numéro de licence</Label>
                <Input 
                  id="numeroLicence" 
                  value={formData.numeroLicence}
                  onChange={(e) => setFormData(prev => ({ ...prev, numeroLicence: e.target.value }))}
                  className="bg-white border-slate-200" 
                />
              </div>
              <div>
                <Label htmlFor="dateEmbauche" className="text-slate-700">Date d'embauche</Label>
                <Input 
                  id="dateEmbauche" 
                  type="date"
                  value={formData.dateEmbauche}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateEmbauche: e.target.value }))}
                  className="bg-white border-slate-200" 
                />
              </div>
              <div>
                <Label htmlFor="salaire" className="text-slate-700">Salaire de base (MAD)</Label>
                <Input 
                  id="salaire" 
                  type="number"
                  value={formData.salaire}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaire: e.target.value }))}
                  className="bg-white border-slate-200" 
                />
              </div>
              <div>
                <Label htmlFor="commission" className="text-slate-700">Taux de commission (%)</Label>
                <Input 
                  id="commission" 
                  type="number"
                  value={formData.commission}
                  onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                  className="bg-white border-slate-200" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secteur" className="text-slate-700">Secteur géographique assigné</Label>
              <Input 
                id="secteur" 
                value={formData.secteur}
                onChange={(e) => setFormData(prev => ({ ...prev, secteur: e.target.value }))}
                className="bg-white border-slate-200" 
                placeholder="Ex: Casablanca Centre, Rabat Agdal..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Formation et spécialisations */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <GraduationCap className="h-5 w-5" />
              Formation et spécialisations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-white">
            <div>
              <Label htmlFor="formation" className="text-slate-700">Formation et diplômes</Label>
              <Textarea 
                id="formation" 
                value={formData.formation}
                onChange={(e) => setFormData(prev => ({ ...prev, formation: e.target.value }))}
                className="bg-white border-slate-200" 
                placeholder="Diplômes, certifications, formations suivies..."
              />
            </div>
            <div>
              <Label htmlFor="experience" className="text-slate-700">Expérience professionnelle</Label>
              <Textarea 
                id="experience" 
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="bg-white border-slate-200" 
                placeholder="Postes précédents, années d'expérience..."
              />
            </div>
            
            <div>
              <Label className="text-slate-700 mb-3 block">Spécialisations immobilières</Label>
              <div className="grid grid-cols-2 gap-2">
                {specialisationsOptions.map((spec) => (
                  <div key={spec} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`spec-${spec}`}
                      checked={formData.specialisations.includes(spec)}
                      onCheckedChange={(checked) => handleSpecialisationChange(spec, !!checked)}
                    />
                    <Label htmlFor={`spec-${spec}`} className="text-sm text-slate-600">{spec}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-slate-700 mb-3 block">Langues parlées</Label>
              <div className="grid grid-cols-3 gap-2">
                {languesOptions.map((langue) => (
                  <div key={langue} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`langue-${langue}`}
                      checked={formData.langues.includes(langue)}
                      onCheckedChange={(checked) => handleLangueChange(langue, !!checked)}
                    />
                    <Label htmlFor={`langue-${langue}`} className="text-sm text-slate-600">{langue}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compétences par tâche */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Award className="h-5 w-5" />
              Évaluation des compétences par tâche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 bg-white">
            {/* Prospection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Prospection de biens
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prospection-analyse"
                      checked={formData.prospection.analyseDemande}
                      onCheckedChange={(checked) => handleCompetenceChange('prospection', 'analyseDemande', !!checked)}
                    />
                    <Label htmlFor="prospection-analyse" className="text-sm text-slate-600">Analyse de la demande</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prospection-veille"
                      checked={formData.prospection.veilleSourcing}
                      onCheckedChange={(checked) => handleCompetenceChange('prospection', 'veilleSourcing', !!checked)}
                    />
                    <Label htmlFor="prospection-veille" className="text-sm text-slate-600">Veille et sourcing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prospection-mandat"
                      checked={formData.prospection.priseMandat}
                      onCheckedChange={(checked) => handleCompetenceChange('prospection', 'priseMandat', !!checked)}
                    />
                    <Label htmlFor="prospection-mandat" className="text-sm text-slate-600">Prise de mandat</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="prospection-notes" className="text-sm text-slate-700">Notes</Label>
                  <Textarea 
                    id="prospection-notes"
                    value={formData.prospection.notes}
                    onChange={(e) => handleNotesChange('prospection', e.target.value)}
                    className="bg-white border-slate-200 text-sm" 
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Traitement des leads */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Traitement des leads
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="leads-reactivite"
                      checked={formData.leads.reactivite}
                      onCheckedChange={(checked) => handleCompetenceChange('leads', 'reactivite', !!checked)}
                    />
                    <Label htmlFor="leads-reactivite" className="text-sm text-slate-600">Réactivité (SLA &lt; 30 min)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="leads-qualification"
                      checked={formData.leads.qualification}
                      onCheckedChange={(checked) => handleCompetenceChange('leads', 'qualification', !!checked)}
                    />
                    <Label htmlFor="leads-qualification" className="text-sm text-slate-600">Qualification BANT</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="leads-scoring"
                      checked={formData.leads.scoring}
                      onCheckedChange={(checked) => handleCompetenceChange('leads', 'scoring', !!checked)}
                    />
                    <Label htmlFor="leads-scoring" className="text-sm text-slate-600">Scoring & CRM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="leads-rdv"
                      checked={formData.leads.rdv}
                      onCheckedChange={(checked) => handleCompetenceChange('leads', 'rdv', !!checked)}
                    />
                    <Label htmlFor="leads-rdv" className="text-sm text-slate-600">Prise de rendez-vous</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="leads-notes" className="text-sm text-slate-700">Notes</Label>
                  <Textarea 
                    id="leads-notes"
                    value={formData.leads.notes}
                    onChange={(e) => handleNotesChange('leads', e.target.value)}
                    className="bg-white border-slate-200 text-sm" 
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Organisation des visites */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Organisation des visites
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="visites-pre"
                      checked={formData.visites.preVisite}
                      onCheckedChange={(checked) => handleCompetenceChange('visites', 'preVisite', !!checked)}
                    />
                    <Label htmlFor="visites-pre" className="text-sm text-slate-600">Pré-visite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="visites-parcours"
                      checked={formData.visites.parcoursScenarise}
                      onCheckedChange={(checked) => handleCompetenceChange('visites', 'parcoursScenarise', !!checked)}
                    />
                    <Label htmlFor="visites-parcours" className="text-sm text-slate-600">Parcours scénarisé</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="visites-feedback"
                      checked={formData.visites.feedback}
                      onCheckedChange={(checked) => handleCompetenceChange('visites', 'feedback', !!checked)}
                    />
                    <Label htmlFor="visites-feedback" className="text-sm text-slate-600">Recueil feedback</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="visites-notes" className="text-sm text-slate-700">Notes</Label>
                  <Textarea 
                    id="visites-notes"
                    value={formData.visites.notes}
                    onChange={(e) => handleNotesChange('visites', e.target.value)}
                    className="bg-white border-slate-200 text-sm" 
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Négociation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Négociation & closing
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="negociation-strategie"
                      checked={formData.negociation.strategiePrix}
                      onCheckedChange={(checked) => handleCompetenceChange('negociation', 'strategiePrix', !!checked)}
                    />
                    <Label htmlFor="negociation-strategie" className="text-sm text-slate-600">Stratégie de prix</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="negociation-offres"
                      checked={formData.negociation.gestionOffres}
                      onCheckedChange={(checked) => handleCompetenceChange('negociation', 'gestionOffres', !!checked)}
                    />
                    <Label htmlFor="negociation-offres" className="text-sm text-slate-600">Gestion des offres</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="negociation-techniques"
                      checked={formData.negociation.techniques}
                      onCheckedChange={(checked) => handleCompetenceChange('negociation', 'techniques', !!checked)}
                    />
                    <Label htmlFor="negociation-techniques" className="text-sm text-slate-600">Techniques de négociation</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="negociation-notes" className="text-sm text-slate-700">Notes</Label>
                  <Textarea 
                    id="negociation-notes"
                    value={formData.negociation.notes}
                    onChange={(e) => handleNotesChange('negociation', e.target.value)}
                    className="bg-white border-slate-200 text-sm" 
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Signature des actes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                  Signature des actes
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="actes-preparation"
                      checked={formData.actes.preparationDossier}
                      onCheckedChange={(checked) => handleCompetenceChange('actes', 'preparationDossier', !!checked)}
                    />
                    <Label htmlFor="actes-preparation" className="text-sm text-slate-600">Préparation du dossier</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="actes-compromis"
                      checked={formData.actes.compromis}
                      onCheckedChange={(checked) => handleCompetenceChange('actes', 'compromis', !!checked)}
                    />
                    <Label htmlFor="actes-compromis" className="text-sm text-slate-600">Compromis & contrats</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="actes-accompagnement"
                      checked={formData.actes.accompagnement}
                      onCheckedChange={(checked) => handleCompetenceChange('actes', 'accompagnement', !!checked)}
                    />
                    <Label htmlFor="actes-accompagnement" className="text-sm text-slate-600">Accompagnement jusqu'à l'acte</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="actes-notes" className="text-sm text-slate-700">Notes</Label>
                  <Textarea 
                    id="actes-notes"
                    value={formData.actes.notes}
                    onChange={(e) => handleNotesChange('actes', e.target.value)}
                    className="bg-white border-slate-200 text-sm" 
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Encaissement */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                  Encaissement & suivi post-transaction
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="encaissement-facturation"
                      checked={formData.encaissement.facturation}
                      onCheckedChange={(checked) => handleCompetenceChange('encaissement', 'facturation', !!checked)}
                    />
                    <Label htmlFor="encaissement-facturation" className="text-sm text-slate-600">Facturation et encaissement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="encaissement-cles"
                      checked={formData.encaissement.remiseCles}
                      onCheckedChange={(checked) => handleCompetenceChange('encaissement', 'remiseCles', !!checked)}
                    />
                    <Label htmlFor="encaissement-cles" className="text-sm text-slate-600">Remise des clés</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="encaissement-after"
                      checked={formData.encaissement.afterSale}
                      onCheckedChange={(checked) => handleCompetenceChange('encaissement', 'afterSale', !!checked)}
                    />
                    <Label htmlFor="encaissement-after" className="text-sm text-slate-600">After-sale service</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="encaissement-notes" className="text-sm text-slate-700">Notes</Label>
                  <Textarea 
                    id="encaissement-notes"
                    value={formData.encaissement.notes}
                    onChange={(e) => handleNotesChange('encaissement', e.target.value)}
                    className="bg-white border-slate-200 text-sm" 
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
          <Button variant="outline" type="button" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
            Annuler
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
            Ajouter le conseiller
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AjouterConseiller;
