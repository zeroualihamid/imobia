import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, MapPin, Phone, Mail, Calendar, Share2, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ListeDemandes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      'NOUVELLE': { label: 'Nouvelle', variant: 'default' },
      'EN_COURS': { label: 'En cours', variant: 'secondary' },
      'TRAITEE': { label: 'Traitée', variant: 'outline' },
      'ANNULEE': { label: 'Annulée', variant: 'destructive' },
    };
    
    const config = statusConfig[status || 'NOUVELLE'] || statusConfig['NOUVELLE'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return '-';
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 0 
    }).format(budget);
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Veuillez vous connecter pour voir les demandes.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Demandes</h1>
            <p className="text-muted-foreground">Gérez toutes les demandes clients</p>
          </div>
          <Button asChild>
            <Link to="/demandes/ajouter">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demandes?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nouvelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {demandes?.filter(d => d.status === 'NOUVELLE').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {demandes?.filter(d => d.status === 'EN_COURS').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Traitées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
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
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-destructive">Erreur lors du chargement des demandes</p>
              </div>
            ) : demandes && demandes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type de bien</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demandes.map((demande) => {
                    const isOwner = user?.id === demande.user_id;
                    return (
                      <TableRow key={demande.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {demande.client_nom_complet}
                            {!isOwner && (
                              <span title="Partagée avec vous">
                                <Share2 className="h-3 w-3 text-muted-foreground" />
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isOwner ? (
                            <div className="flex flex-col gap-1">
                              {demande.email && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate max-w-[150px]">{demande.email}</span>
                                </div>
                              )}
                              {demande.telephone && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  <span>{demande.telephone}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1">
                              <Lock className="h-3 w-3" />
                              <span className="italic">Masqué</span>
                            </div>
                          )}
                        </TableCell>
                      <TableCell>{demande.type_bien || '-'}</TableCell>
                      <TableCell>{formatBudget(demande.budget)}</TableCell>
                      <TableCell>
                        {demande.adresse_complete ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{demande.adresse_complete}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(demande.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(demande.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
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
                <p className="text-muted-foreground">Aucune demande trouvée</p>
                <Button asChild>
                  <Link to="/demandes/ajouter">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une demande
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
