
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Phone, Mail, Building, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProprietaires } from '@/hooks/useProprietaires';
import { useRBAC } from '@/hooks/useRBAC';
import { ProprietaireType } from '@/types/proprietaire';

const ListeProprietaires = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { proprietaires, loading } = useProprietaires();
  const { hasPermission } = useRBAC();

  const getTypeColor = (type: ProprietaireType) => {
    switch (type) {
      case 'PARTICULIER':
        return 'bg-blue-100 text-blue-800';
      case 'PROMOTEUR':
        return 'bg-green-100 text-green-800';
      case 'FONCIERE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: ProprietaireType) => {
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

  const filteredProprietaires = proprietaires.filter(proprietaire =>
    `${proprietaire.prenom} ${proprietaire.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proprietaire.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proprietaire.ville?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Propriétaires</h1>
          <p className="text-slate-600 mt-1">Gérez vos propriétaires de biens immobiliers</p>
        </div>
        {hasPermission('CREATE_CONSEILLER') && (
          <Link to="/proprietaire/ajouter">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un propriétaire
            </Button>
          </Link>
        )}
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

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Particuliers</p>
                <p className="text-xl font-bold">
                  {proprietaires.filter(p => p.type === 'PARTICULIER').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">Promoteurs</p>
                <p className="text-xl font-bold">
                  {proprietaires.filter(p => p.type === 'PROMOTEUR').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">Foncières</p>
                <p className="text-xl font-bold">
                  {proprietaires.filter(p => p.type === 'FONCIERE').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProprietaires.map((proprietaire) => (
          <Card key={proprietaire.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {proprietaire.prenom} {proprietaire.nom}
                </CardTitle>
                <Badge className={getTypeColor(proprietaire.type)}>
                  {getTypeLabel(proprietaire.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-2" />
                {proprietaire.telephone}
              </div>
              {proprietaire.email && (
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {proprietaire.email}
                </div>
              )}
              {proprietaire.ville && (
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2" />
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
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun propriétaire trouvé</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm ? 'Aucun propriétaire ne correspond à votre recherche.' : 'Commencez par ajouter votre premier propriétaire.'}
          </p>
          {hasPermission('CREATE_CONSEILLER') && (
            <Link to="/proprietaire/ajouter">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un propriétaire
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ListeProprietaires;
