import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useProprietaires } from '@/hooks/useProprietaires';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Proprietaire } from '@/types/proprietaire';

const AjouterProprietaire = () => {
  const navigate = useNavigate();
  const { addProprietaire } = useProprietaires();
  const { t, isRTL } = useLanguage();
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
      toast.success(t('owner.addSuccess'));
      navigate('/proprietaire');
    } catch (error) {
      console.error('Error adding proprietaire:', error);
      toast.error(t('owner.addError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
        <Button variant="outline" size="sm" onClick={() => navigate('/proprietaire')}>
          <BackIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t('common.back')}
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">{t('owner.addTitle')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('owner.ownerInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">{t('owner.type')} *</Label>
                <Select onValueChange={(value) => handleChange('type', value)} defaultValue={formData.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PARTICULIER">{t('owner.individual')}</SelectItem>
                    <SelectItem value="PROMOTEUR">{t('owner.developer')}</SelectItem>
                    <SelectItem value="FONCIERE">{t('owner.realEstate')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">{t('owner.lastName')} *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>

              {formData.type === 'PARTICULIER' && (
                <div className="space-y-2">
                  <Label htmlFor="prenom">{t('owner.firstName')}</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                  />
                </div>
              )}

              {(formData.type === 'PROMOTEUR' || formData.type === 'FONCIERE') && (
                <div className="space-y-2">
                  <Label htmlFor="raison_sociale">{t('owner.companyName')}</Label>
                  <Input
                    id="raison_sociale"
                    value={formData.raison_sociale}
                    onChange={(e) => handleChange('raison_sociale', e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="telephone">{t('owner.phone')} *</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('owner.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">{t('owner.address')}</Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ville">{t('owner.city')}</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleChange('ville', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code_postal">{t('owner.postalCode')}</Label>
                <Input
                  id="code_postal"
                  value={formData.code_postal}
                  onChange={(e) => handleChange('code_postal', e.target.value)}
                />
              </div>

              {formData.type === 'PARTICULIER' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="date_naissance">{t('owner.birthDate')}</Label>
                    <Input
                      id="date_naissance"
                      type="date"
                      value={formData.date_naissance}
                      onChange={(e) => handleChange('date_naissance', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cin">{t('owner.cin')}</Label>
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
                  <Label htmlFor="ice">{t('owner.ice')}</Label>
                  <Input
                    id="ice"
                    value={formData.ice}
                    onChange={(e) => handleChange('ice', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('owner.notes')}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            <div className={cn("flex justify-end gap-4", isRTL && "flex-row-reverse")}>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/proprietaire')}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {loading ? t('owner.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterProprietaire;
