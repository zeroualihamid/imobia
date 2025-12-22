import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, MapPin, Phone, Mail, Calendar, Share2, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { ar as arLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ListeDemandes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();

  const { data: demandes, isLoading, error } = useQuery({
    queryKey: ['demandes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getStatusBadge = (status: string | null) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      'NOUVELLE': { label: t('request.new'), variant: 'default' },
      'EN_COURS': { label: t('request.inProgress'), variant: 'secondary' },
      'TRAITEE': { label: t('request.processed'), variant: 'outline' },
      'ANNULEE': { label: t('request.cancelled'), variant: 'destructive' },
    };
    
    const config = statusConfig[status || 'NOUVELLE'] || statusConfig['NOUVELLE'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return '-';
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 0 
    }).format(budget);
  };

  const dateLocale = language === 'ar' ? arLocale : frLocale;

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t('request.loginRequired')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", isRTL && "sm:flex-row-reverse")}>
          <div className={cn(isRTL && "text-right")}>
            <h1 className="text-2xl font-bold text-foreground">{t('request.title')}</h1>
            <p className="text-muted-foreground">{t('request.subtitle')}</p>
          </div>
          <Button asChild>
            <Link to="/demandes/ajouter">
              <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('request.add')}
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-sm font-medium text-muted-foreground", isRTL && "text-right")}>{t('request.total')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", isRTL && "text-right")}>{demandes?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-sm font-medium text-muted-foreground", isRTL && "text-right")}>{t('request.new')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold text-blue-600", isRTL && "text-right")}>
                {demandes?.filter(d => d.status === 'NOUVELLE').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-sm font-medium text-muted-foreground", isRTL && "text-right")}>{t('request.inProgress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold text-orange-600", isRTL && "text-right")}>
                {demandes?.filter(d => d.status === 'EN_COURS').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-sm font-medium text-muted-foreground", isRTL && "text-right")}>{t('request.processed')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold text-green-600", isRTL && "text-right")}>
                {demandes?.filter(d => d.status === 'TRAITEE').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">{t('request.loading')}</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-destructive">{t('request.loadError')}</p>
              </div>
            ) : demandes && demandes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn(isRTL && "text-right")}>{t('request.client')}</TableHead>
                    <TableHead className={cn(isRTL && "text-right")}>{t('request.contact')}</TableHead>
                    <TableHead className={cn(isRTL && "text-right")}>{t('request.propertyType')}</TableHead>
                    <TableHead className={cn(isRTL && "text-right")}>{t('request.budget')}</TableHead>
                    <TableHead className={cn(isRTL && "text-right")}>{t('request.location')}</TableHead>
                    <TableHead className={cn(isRTL && "text-right")}>{t('request.status')}</TableHead>
                    <TableHead className={cn(isRTL && "text-right")}>{t('request.date')}</TableHead>
                    <TableHead className={cn(isRTL ? "text-left" : "text-right")}>{t('request.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demandes.map((demande) => {
                    const isOwner = user?.id === demande.user_id;
                    return (
                      <TableRow key={demande.id}>
                        <TableCell className={cn("font-medium", isRTL && "text-right")}>
                          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse justify-end")}>
                            {demande.client_nom_complet}
                            {!isOwner && (
                              <span title={t('request.sharedWithYou')}>
                                <Share2 className="h-3 w-3 text-muted-foreground" />
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={cn(isRTL && "text-right")}>
                          {isOwner ? (
                            <div className="flex flex-col gap-1">
                              {demande.email && (
                                <div className={cn("flex items-center gap-1 text-sm text-muted-foreground", isRTL && "flex-row-reverse justify-end")}>
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate max-w-[150px]">{demande.email}</span>
                                </div>
                              )}
                              {demande.telephone && (
                                <div className={cn("flex items-center gap-1 text-sm text-muted-foreground", isRTL && "flex-row-reverse justify-end")}>
                                  <Phone className="h-3 w-3" />
                                  <span>{demande.telephone}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={cn("flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1", isRTL && "flex-row-reverse")}>
                              <Lock className="h-3 w-3" />
                              <span className="italic">{t('request.masked')}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className={cn(isRTL && "text-right")}>{demande.type_bien || '-'}</TableCell>
                        <TableCell className={cn(isRTL && "text-right")}>{formatBudget(demande.budget)}</TableCell>
                        <TableCell className={cn(isRTL && "text-right")}>
                          {demande.adresse_complete ? (
                            <div className={cn("flex items-center gap-1 text-sm", isRTL && "flex-row-reverse justify-end")}>
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{demande.adresse_complete}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell className={cn(isRTL && "text-right")}>{getStatusBadge(demande.status)}</TableCell>
                        <TableCell className={cn(isRTL && "text-right")}>
                          <div className={cn("flex items-center gap-1 text-sm text-muted-foreground", isRTL && "flex-row-reverse justify-end")}>
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(demande.created_at), 'dd MMM yyyy', { locale: dateLocale })}</span>
                          </div>
                        </TableCell>
                        <TableCell className={cn(isRTL ? "text-left" : "text-right")}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/demandes/${demande.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-muted-foreground">{t('request.noRequests')}</p>
                <Button asChild>
                  <Link to="/demandes/ajouter">
                    <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t('request.create')}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ListeDemandes;
