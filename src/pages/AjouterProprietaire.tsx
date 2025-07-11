
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Building2, FileText } from 'lucide-react';
import { useProprietaires } from '@/hooks/useProprietaires';
import { useToast } from '@/hooks/use-toast';
import type { ProprietaireType } from '@/types/proprietaire';

const AjouterProprietaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProprietaire } = useProprietaires();
  
  const [formData, setFormData] = useState({
    type: 'PARTICULIER' as ProprietaireType,
    nom: '',
    prenom: '',
    raison_sociale: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'Maroc',
    date_naissance: '',
    cin: '',
    ice: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (value: ProprietaireType) => {
    setFormData(prev => ({
      ...prev,
      type: value,
      // Reset fields specific to other types
      prenom: value !== 'PARTICULIER' ? '' : prev.prenom,
      raison_sociale: value === 'PARTICULIER' ? '' : prev.raison_sociale,
      date_naissance: value !== 'PARTICULIER' ? '' : prev.date_naissance,
      cin: value !== 'PARTICULIER' ? '' : prev.cin,
      ice: value === 'PARTICULIER' ? '' : prev.ice
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nom || !formData.telephone) {
      toast({
        title: "Erreur",
        description: "Nom et téléphone sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Type-specific validation
    if (formData.type === 'PARTICULIER' && !formData.prenom) {
      toast({
        title: "Erreur",
        description: "Le prénom est obligatoire pour un particulier",
        variant: "destructive"
      });
      return;
    }

    if ((formData.type === 'PROMOTEUR' || formData.type === 'FONCIERE') && !formData.raison_sociale) {
      toast({
        title: "Erreur",
        description: "La raison sociale est obligatoire pour une entreprise",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const proprietaireData = {
        ...formData,
        date_naissance: formData.date_naissance || null
      };
      
      await addProprietaire(proprietaireData);
      
      toast({
        title: "Succès",
        description: "Propriétaire ajouté avec succès"
      });
      
      navigate('/proprietaire');
    } catch (error) {
      console.error('Error adding proprietaire:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du propriétaire",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/proprietaire')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">Ajouter un propriétaire</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations générales */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type de propriétaire *</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PARTICULIER">Particulier</SelectItem>
                    <SelectItem value="PROMOTEUR">Promoteur</SelectItem>
                    <SelectItem value="FONCIERE">Foncière</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nom">
                  {formData.type === 'PARTICULIER' ? 'Nom' : 'Nom de l\'entreprise'} *
                </Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  required
                />
              </div>

              {formData.type === 'PARTICULIER' && (
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    required
                  />
                </div>
              )}

              {(formData.type === 'PROMOTEUR' || formData.type === 'FONCIERE') && (
                <div>
                  <Label htmlFor="raison_sociale">Raison sociale *</Label>
                  <Input
                    id="raison_sociale"
                    value={formData.raison_sociale}
                    onChange={(e) => handleInputChange('raison_sociale', e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              {formData.type === 'PARTICULIER' && (
                <>
                  <div>
                    <Label htmlFor="date_naissance">Date de naissance</Label>
                    <Input
                      id="date_naissance"
                      type="date"
                      value={formData.date_naissance}
                      onChange={(e) => handleInputChange('date_naissance', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cin">CIN</Label>
                    <Input
                      id="cin"
                      value={formData.cin}
                      onChange={(e) => handleInputChange('cin', e.target.value)}
                    />
                  </div>
                </>
              )}

              {(formData.type === 'PROMOTEUR' || formData.type === 'FONCIERE') && (
                <div>
                  <Label htmlFor="ice">ICE</Label>
                  <Input
                    id="ice"
                    value={formData.ice}
                    onChange={(e) => handleInputChange('ice', e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Adresse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                value={formData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                value={formData.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="code_postal">Code postal</Label>
              <Input
                id="code_postal"
                value={formData.code_postal}
                onChange={(e) => handleInputChange('code_postal', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pays">Pays</Label>
              <Input
                id="pays"
                value={formData.pays}
                onChange={(e) => handleInputChange('pays', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Notes supplémentaires..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="lg:col-span-3 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/proprietaire')}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Ajout en cours...' : 'Ajouter le propriétaire'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AjouterProprietaire;
