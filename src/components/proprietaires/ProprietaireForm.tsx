
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { useProprietaires } from '@/hooks/useProprietaires';
import { Proprietaire, ProprietaireType } from '@/types/proprietaire';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const proprietaireSchema = z.object({
  type: z.enum(['PARTICULIER', 'PROMOTEUR', 'FONCIERE']),
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  telephone: z.string().min(1, 'Le téléphone est requis'),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  code_postal: z.string().optional(),
  pays: z.string().optional(),
  date_naissance: z.string().optional(),
  numero_cin: z.string().optional(),
  numero_rc: z.string().optional(),
  notes: z.string().optional()
});

type ProprietaireFormData = z.infer<typeof proprietaireSchema>;

interface ProprietaireFormProps {
  mode: 'create' | 'edit';
}

const ProprietaireForm: React.FC<ProprietaireFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { proprietaires, createProprietaire, updateProprietaire } = useProprietaires();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProprietaireFormData>({
    resolver: zodResolver(proprietaireSchema),
    defaultValues: {
      type: 'PARTICULIER',
      pays: 'Maroc'
    }
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (mode === 'edit' && id) {
      const proprietaire = proprietaires.find(p => p.id === id);
      if (proprietaire) {
        Object.keys(proprietaire).forEach(key => {
          if (key !== 'id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at') {
            setValue(key as keyof ProprietaireFormData, proprietaire[key as keyof Proprietaire] as any);
          }
        });
      }
    }
  }, [mode, id, proprietaires, setValue]);

  const onSubmit = async (data: ProprietaireFormData) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        const result = await createProprietaire(data as any);
        if (result) {
          navigate(`/proprietaire/${result.id}`);
        }
      } else if (mode === 'edit' && id) {
        const result = await updateProprietaire(id, data as any);
        if (result) {
          navigate(`/proprietaire/${id}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/proprietaires')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">
          {mode === 'create' ? 'Ajouter un propriétaire' : 'Modifier le propriétaire'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du propriétaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type de propriétaire */}
            <div className="space-y-2">
              <Label htmlFor="type">Type de propriétaire *</Label>
              <Select 
                value={selectedType} 
                onValueChange={(value: ProprietaireType) => setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARTICULIER">Particulier</SelectItem>
                  <SelectItem value="PROMOTEUR">Promoteur</SelectItem>
                  <SelectItem value="FONCIERE">Foncière</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
            </div>

            {/* Informations personnelles */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  {...register('prenom')}
                  placeholder="Prénom"
                />
                {errors.prenom && <p className="text-sm text-red-600">{errors.prenom.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  {...register('nom')}
                  placeholder="Nom"
                />
                {errors.nom && <p className="text-sm text-red-600">{errors.nom.message}</p>}
              </div>
            </div>

            {/* Contact */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  {...register('telephone')}
                  placeholder="+212 6 XX XX XX XX"
                />
                {errors.telephone && <p className="text-sm text-red-600">{errors.telephone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="email@exemple.com"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  {...register('adresse')}
                  placeholder="Adresse complète"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    {...register('ville')}
                    placeholder="Ville"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code_postal">Code postal</Label>
                  <Input
                    id="code_postal"
                    {...register('code_postal')}
                    placeholder="Code postal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pays">Pays</Label>
                  <Input
                    id="pays"
                    {...register('pays')}
                    placeholder="Pays"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_naissance">Date de naissance</Label>
                <Input
                  id="date_naissance"
                  type="date"
                  {...register('date_naissance')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero_cin">Numéro CIN</Label>
                <Input
                  id="numero_cin"
                  {...register('numero_cin')}
                  placeholder="CIN"
                />
              </div>
              {(selectedType === 'PROMOTEUR' || selectedType === 'FONCIERE') && (
                <div className="space-y-2">
                  <Label htmlFor="numero_rc">Registre de commerce</Label>
                  <Input
                    id="numero_rc"
                    {...register('numero_rc')}
                    placeholder="RC"
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Notes et commentaires..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/proprietaires')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProprietaireForm;
