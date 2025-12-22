import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Phone, Mail, Building, User, Building2, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProprietaires } from '@/hooks/useProprietaires';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const ListeProprietaires = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { proprietaires, loading } = useProprietaires();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const filteredProprietaires = proprietaires.filter(proprietaire => {
    const searchableText = `${proprietaire.prenom || ''} ${proprietaire.nom} ${proprietaire.raison_sociale || ''} ${proprietaire.email || ''}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PARTICULIER':
        return <User className={cn("h-3 w-3", isRTL ? "ml-1" : "mr-1")} />;
      case 'PROMOTEUR':
        return <Building2 className={cn("h-3 w-3", isRTL ? "ml-1" : "mr-1")} />;
      case 'FONCIERE':
        return <Landmark className={cn("h-3 w-3", isRTL ? "ml-1" : "mr-1")} />;
      default:
        return <User className={cn("h-3 w-3", isRTL ? "ml-1" : "mr-1")} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PARTICULIER':
        return t('owner.individual');
      case 'PROMOTEUR':
        return t('owner.developer');
      case 'FONCIERE':
        return t('owner.realEstate');
      default:
        return type;
    }
  };

  const getDisplayName = (proprietaire: any) => {
    if (proprietaire.type === 'PARTICULIER') {
      return `${proprietaire.prenom || ''} ${proprietaire.nom}`.trim();
    } else {
      return proprietaire.raison_sociale || proprietaire.nom;
    }
  };

  const maskPhoneNumber = (phone: string, createdBy: string) => {
    if (user?.id === createdBy) {
      return phone;
    }
    return phone.replace(/(.{2})(.*)(.{2})/, '$1****$3');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">{t('owner.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL && "text-right")}>
          <h1 className="text-3xl font-bold text-slate-900">{t('owner.title')}</h1>
          <p className="text-slate-600 mt-1">{t('owner.subtitle')}</p>
        </div>
        <Link to="/proprietaire/ajouter">
          <Button className="bg-blue-600">
            <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {t('owner.add')}
          </Button>
        </Link>
      </div>

      <div className={cn("flex items-center space-x-4", isRTL && "flex-row-reverse space-x-reverse")}>
        <div className="relative flex-1 max-w-sm">
          <Search className={cn("absolute top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4", isRTL ? "right-3" : "left-3")} />
          <Input
            placeholder={t('owner.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(isRTL ? "pr-10" : "pl-10")}
          />
        </div>
        <Badge variant="secondary" className="text-sm">
          {t('owner.count').replace('{count}', String(filteredProprietaires.length))}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProprietaires.map((proprietaire) => (
          <Card key={proprietaire.id} className="transition-shadow">
            <CardHeader className="pb-3">
              <div className={cn("flex justify-between items-start", isRTL && "flex-row-reverse")}>
                <CardTitle className={cn("text-lg", isRTL && "text-right")}>
                  {getDisplayName(proprietaire)}
                </CardTitle>
                <Badge variant="outline" className={cn("text-xs flex items-center", isRTL && "flex-row-reverse")}>
                  {getTypeIcon(proprietaire.type)}
                  {getTypeLabel(proprietaire.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={cn("flex items-center text-sm text-slate-600", isRTL && "flex-row-reverse")}>
                <Phone className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {maskPhoneNumber(proprietaire.telephone, proprietaire.created_by)}
              </div>
              {proprietaire.email && (
                <div className={cn("flex items-center text-sm text-slate-600", isRTL && "flex-row-reverse")}>
                  <Mail className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {proprietaire.email}
                </div>
              )}
              {proprietaire.ville && (
                <div className={cn("flex items-center text-sm text-slate-600", isRTL && "flex-row-reverse")}>
                  <Building className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {proprietaire.ville}
                </div>
              )}
              <div className={cn("text-xs text-slate-500", isRTL && "text-right")}>
                {t('owner.addedOn')} {new Date(proprietaire.created_at).toLocaleDateString(isRTL ? 'ar-MA' : 'fr-FR')}
              </div>
              <div className="flex gap-2 pt-2">
                <Link to={`/proprietaire/${proprietaire.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t('owner.viewDetails')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProprietaires.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Building className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">{t('owner.noOwners')}</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm ? t('owner.noOwnersSearch') : t('owner.addFirst')}
          </p>
          <Link to="/proprietaire/ajouter">
            <Button>
              <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('owner.add')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ListeProprietaires;
