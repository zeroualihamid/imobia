
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Phone, Mail, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Proprietaire {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  nombreBiens: number;
  dateCreation: string;
}

const ListeProprietaires = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - remplacer par des données réelles de Supabase
  const proprietaires: Proprietaire[] = [
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      telephone: '+33 6 12 34 56 78',
      email: 'jean.dupont@email.com',
      nombreBiens: 3,
      dateCreation: '2024-01-15'
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Marie',
      telephone: '+33 6 98 76 54 32',
      email: 'marie.martin@email.com',
      nombreBiens: 1,
      dateCreation: '2024-02-20'
    }
  ];

  const filteredProprietaires = proprietaires.filter(proprietaire =>
    `${proprietaire.prenom} ${proprietaire.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proprietaire.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Propriétaires</h1>
          <p className="text-slate-600 mt-1">Gérez vos propriétaires de biens immobiliers</p>
        </div>
        <Link to="/proprietaire/ajouter">
          <Button className="bg-blue-600 hover:bg-blue-700">
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
          <Card key={proprietaire.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {proprietaire.prenom} {proprietaire.nom}
                </CardTitle>
                <Badge variant="outline">
                  <Building className="h-3 w-3 mr-1" />
                  {proprietaire.nombreBiens} bien{proprietaire.nombreBiens > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-2" />
                {proprietaire.telephone}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-4 w-4 mr-2" />
                {proprietaire.email}
              </div>
              <div className="text-xs text-slate-500">
                Ajouté le {new Date(proprietaire.dateCreation).toLocaleDateString('fr-FR')}
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
