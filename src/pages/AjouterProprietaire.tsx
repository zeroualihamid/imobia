
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProprietaires } from '@/hooks/useProprietaires';
import type { Proprietaire } from '@/types/proprietaire';

const AjouterProprietaire = () => {
  const navigate = useNavigate();
  const { createProprietaire } = useProprietaires();
  const [formData, setFormData] = useState({
    type: 'PARTICULIER' as const,
    nom: '',
    prenom: '',
    raison_sociale: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'Maroc',
    date_naissance: '',
    cin: '',
    ice: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nom || !formData.telephone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.type === 'PARTICULIER' && !formData.prenom) {
      toast.error('Le prénom est obligatoire pour un particulier');
      return;
    }

    if ((formData.type === 'PROMOTEUR' || formData.type === 'FONCIERE') && !formData.raison_sociale) {
      toast.error('La raison sociale est obligatoire pour ce type');
      return;
    }

    try {
      const proprietaireData = {
        ...formData,
        date_naissance: formData.date_naissance || undefined
      };

      const result = await createProprietaire(proprietaireData);
      
      if (result) {
        toast.success('Propriétaire ajouté avec succès!');
        navigate('/proprietaire');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du propriétaire:', error);
      toast.error('Erreur lors de l\'ajout du propriétaire');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/proprietaire">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ajouter un propriétaire</h1>
          <p className="text-slate-600 mt-1">Enregistrez les informations d'un nouveau propriétaire</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations du propriétaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Type de propriétaire *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARTICULIER">Particulier</SelectItem>
                  <SelectItem value="PROMOTEUR">Promoteur</SelectItem>
                  <SelectItem value="FONCIERE">Foncière</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'PARTICULIER' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="raison_sociale">Raison sociale *</Label>
                  <Input
                    id="raison_sociale"
                    name="raison_sociale"
                    value={formData.raison_sociale}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de contact</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {formData.type === 'PARTICULIER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_naissance">Date de naissance</Label>
                  <Input
                    id="date_naissance"
                    name="date_naissance"
                    type="date"
                    value={formData.date_naissance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cin">CIN</Label>
                  <Input
                    id="cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {(formData.type === 'PROMOTEUR' || formData.type === 'FONCIERE') && (
              <div className="space-y-2">
                <Label htmlFor="ice">ICE</Label>
                <Input
                  id="ice"
                  name="ice"
                  value={formData.ice}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pays">Pays</Label>
                <Input
                  id="pays"
                  name="pays"
                  value={formData.pays}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Notes additionnelles sur le propriétaire..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Link to="/proprietaire">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterProprietaire;
