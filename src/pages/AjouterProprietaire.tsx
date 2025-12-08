
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useProprietaires } from '@/hooks/useProprietaires';
import { toast } from 'sonner';
import type { Proprietaire } from '@/types/proprietaire';

const AjouterProprietaire = () => {
  const navigate = useNavigate();
  const { addProprietaire } = useProprietaires();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<Proprietaire, 'id' | 'created_at' | 'updated_at' | 'created_by'>>({
    type: 'PARTICULIER',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addProprietaire(formData);
      toast.success('Propriétaire ajouté avec succès');
      navigate('/proprietaire');
    } catch (error) {
      console.error('Error adding proprietaire:', error);
      toast.error('Erreur lors de l\'ajout du propriétaire');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

      <Card>
        <CardHeader>
          <CardTitle>Informations du propriétaire</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select onValueChange={(value) => handleChange('type', value)} defaultValue={formData.type}>
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

              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>

              {formData.type === 'PARTICULIER' && (
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                  />
                </div>
              )}

              {(formData.type === 'PROMOTEUR' || formData.type === 'FONCIERE') && (
                <div className="space-y-2">
                  <Label htmlFor="raison_sociale">Raison sociale</Label>
                  <Input
                    id="raison_sociale"
                    value={formData.raison_sociale}
                    onChange={(e) => handleChange('raison_sociale', e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleChange('ville', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  value={formData.code_postal}
                  onChange={(e) => handleChange('code_postal', e.target.value)}
                />
              </div>

              {formData.type === 'PARTICULIER' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="date_naissance">Date de naissance</Label>
                    <Input
                      id="date_naissance"
                      type="date"
                      value={formData.date_naissance}
                      onChange={(e) => handleChange('date_naissance', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cin">CIN</Label>
                    <Input
                      id="cin"
                      value={formData.cin}
                      onChange={(e) => handleChange('cin', e.target.value)}
                    />
                  </div>
                </>
              )}

              {(formData.type === 'PROMOTEUR' || formData.type === 'FONCIERE') && (
                <div className="space-y-2">
                  <Label htmlFor="ice">ICE</Label>
                  <Input
                    id="ice"
                    value={formData.ice}
                    onChange={(e) => handleChange('ice', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/proprietaire')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterProprietaire;
