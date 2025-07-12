
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Phone, Mail, Building, User, Building2, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProprietaires } from '@/hooks/useProprietaires';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ListeProprietaires = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { proprietaires, loading } = useProprietaires();
  const { user } = useAuth();

  const filteredProprietaires = proprietaires.filter(proprietaire => {
    const searchableText = `${proprietaire.prenom || ''} ${proprietaire.nom} ${proprietaire.raison_sociale || ''} ${proprietaire.email || ''}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PARTICULIER':
        return <User className="h-3 w-3 mr-1" />;
      case 'PROMOTEUR':
        return <Building2 className="h-3 w-3 mr-1" />;
      case 'FONCIERE':
        return <Landmark className="h-3 w-3 mr-1" />;
      default:
        return <User className="h-3 w-3 mr-1" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PARTICULIER':
        return 'Particulier';
      case 'PROMOTEUR':
        return 'Promoteur';
      case 'FONCIERE':
        return 'Foncière';
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
    // Si c'est le créateur ou un admin, montrer le numéro complet
    if (user?.id === createdBy) {
      return phone;
    }
    // Sinon masquer partiellement
    return phone.replace(/(.{2})(.*)(.{2})/, '$1****$3');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Chargement des propriétaires...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Propriétaires test</h1>
          <p className="text-slate-600 mt-1">Gérez vos propriétaires de biens immobiliers</p>
        </div>
        <Link to="/proprietaire/ajouter">
          <Button className="bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un propriétaire
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un propriétaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredProprietaires.length} propriétaires
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProprietaires.map((proprietaire) => (
          <Card key={proprietaire.id} className="transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {getDisplayName(proprietaire)}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {getTypeIcon(proprietaire.type)}
                  {getTypeLabel(proprietaire.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-2" />
                {maskPhoneNumber(proprietaire.telephone, proprietaire.created_by)}
              </div>
              {proprietaire.email && (
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {proprietaire.email}
                </div>
              )}
              {proprietaire.ville && (
                <div className="flex items-center text-sm text-slate-600">
                  <Building className="h-4 w-4 mr-2" />
                  {proprietaire.ville}
                </div>
              )}
              <div className="text-xs text-slate-500">
                Ajouté le {new Date(proprietaire.created_at).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex gap-2 pt-2">
                <Link to={`/proprietaire/${proprietaire.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
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
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun propriétaire trouvé</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm ? 'Aucun propriétaire ne correspond à votre recherche.' : 'Commencez par ajouter votre premier propriétaire.'}
          </p>
          <Link to="/proprietaire/ajouter">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un propriétaire
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ListeProprietaires;
