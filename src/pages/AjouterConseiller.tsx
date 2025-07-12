
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  User, 
  Building,
  GraduationCap,
  Loader2,
  X
} from 'lucide-react';

const AjouterConseiller = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
    numeroCin: '',
    dateEmbauche: '',
    salaire: '',
    commission: '',
    villes: [] as string[],
    
    // Formation et spécialisations
    formation: '',
    specialisations: [] as string[],
    langues: [] as string[],
  });

  const villesMaroc = [
    'Casablanca',
    'Rabat',
    'Fès',
    'Marrakech',
    'Agadir',
    'Tanger',
    'Meknès',
    'Oujda',
    'Kenitra',
    'Tétouan',
    'Safi',
    'El Jadida',
    'Beni Mellal',
    'Errachidia',
    'Taza',
    'Essaouira',
    'Khouribga',
    'Ouarzazate',
    'Settat',
    'Larache'
  ];

  const formationsOptions = [
    'Bac+2',
    'Bac+3',
    'Bac+4',
    'Bac+5'
  ];

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

  const handleVilleChange = (ville: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      villes: checked 
        ? [...prev.villes, ville]
        : prev.villes.filter(v => v !== ville)
    }));
  };

  const removeVille = (villeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      villes: prev.villes.filter(v => v !== villeToRemove)
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérifier que l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour ajouter un conseiller.",
          variant: "destructive",
        });
        return;
      }

      // Préparer les données pour l'insertion
      const conseillerData = {
        user_id: user.id,
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse || null,
        date_naissance: formData.dateNaissance || null,
        nationalite: formData.nationalite || null,
        numero_cin: formData.numeroCin || null,
        date_embauche: formData.dateEmbauche || null,
        salaire: formData.salaire ? parseFloat(formData.salaire) : null,
        commission: formData.commission ? parseFloat(formData.commission) : null,
        ville: formData.villes.join(', ') || null,
        formation: formData.formation || null,
        specialisations: formData.specialisations.length > 0 ? formData.specialisations : null,
        langues: formData.langues.length > 0 ? formData.langues : null,
      };

      // Insérer les données dans Supabase
      const { error } = await supabase
        .from('conseillers')
        .insert([conseillerData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Conseiller ajouté avec succès",
        description: `${formData.prenom} ${formData.nom} a été ajouté à votre équipe.`,
      });

      // Réinitialiser le formulaire
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        dateNaissance: '',
        nationalite: '',
        numeroCin: '',
        dateEmbauche: '',
        salaire: '',
        commission: '',
        villes: [],
        formation: '',
        specialisations: [],
        langues: [],
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout du conseiller:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du conseiller. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              Fiche de renseignement pour un nouveau conseiller immobilier
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
                <Label htmlFor="numeroCin" className="text-slate-700">Numéro de CIN</Label>
                <Input 
                  id="numeroCin" 
                  value={formData.numeroCin}
                  onChange={(e) => setFormData(prev => ({ ...prev, numeroCin: e.target.value }))}
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
              <Label className="text-slate-700 mb-3 block">Villes d'affectation</Label>
              <div className="space-y-3">
                {/* Affichage des villes sélectionnées */}
                {formData.villes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.villes.map((ville) => (
                      <Badge key={ville} variant="secondary" className="bg-purple-100 text-purple-800">
                        {ville}
                        <button
                          type="button"
                          onClick={() => removeVille(ville)}
                          className="ml-2 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Sélection des villes */}
                <div className="grid grid-cols-3 gap-2">
                  {villesMaroc.map((ville) => (
                    <div key={ville} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`ville-${ville}`}
                        checked={formData.villes.includes(ville)}
                        onCheckedChange={(checked) => handleVilleChange(ville, !!checked)}
                      />
                      <Label htmlFor={`ville-${ville}`} className="text-sm text-slate-600">{ville}</Label>
                    </div>
                  ))}
                </div>
              </div>
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
              <Select value={formData.formation} onValueChange={(value) => setFormData(prev => ({ ...prev, formation: value }))}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent>
                  {formationsOptions.map((formation) => (
                    <SelectItem key={formation} value={formation}>{formation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
          <Button variant="outline" type="button" className="bg-white border-slate-200 text-slate-700">
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-purple-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              'Ajouter le conseiller'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AjouterConseiller;
