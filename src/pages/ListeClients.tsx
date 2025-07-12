
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Phone, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  budget: number;
  typeRecherche: string;
  statut: 'Actif' | 'En négociation' | 'Converti' | 'Inactif';
  dateCreation: string;
}

const ListeClients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - remplacer par des données réelles de Supabase
  const clients: Client[] = [
    {
      id: '1',
      nom: 'Dubois',
      prenom: 'Pierre',
      telephone: '+33 6 11 22 33 44',
      email: 'pierre.dubois@email.com',
      budget: 250000,
      typeRecherche: 'Appartement',
      statut: 'Actif',
      dateCreation: '2024-01-10'
    },
    {
      id: '2',
      nom: 'Leroy',
      prenom: 'Sophie',
      telephone: '+33 6 55 66 77 88',
      email: 'sophie.leroy@email.com',
      budget: 350000,
      typeRecherche: 'Maison',
      statut: 'En négociation',
      dateCreation: '2024-02-15'
    }
  ];

  const filteredClients = clients.filter(client =>
    `${client.prenom} ${client.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'En négociation':
        return 'bg-orange-100 text-orange-800';
      case 'Converti':
        return 'bg-blue-100 text-blue-800';
      case 'Inactif':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-600 mt-1">Gérez vos clients et prospects</p>
        </div>
        <Link to="/clients/ajouter">
          <Button className="bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un client
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredClients.length} clients
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {client.prenom} {client.nom}
                </CardTitle>
                <Badge className={getStatutColor(client.statut)}>
                  {client.statut}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-2" />
                {client.telephone}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-4 w-4 mr-2" />
                {client.email}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Heart className="h-4 w-4 mr-2" />
                {client.typeRecherche} - Budget: {client.budget.toLocaleString('fr-FR')} €
              </div>
              <div className="text-xs text-slate-500">
                Ajouté le {new Date(client.dateCreation).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex gap-2 pt-2">
                <Link to={`/clients/${client.id}`} className="flex-1">
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

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Heart className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun client trouvé</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm ? 'Aucun client ne correspond à votre recherche.' : 'Commencez par ajouter votre premier client.'}
          </p>
          <Link to="/clients/ajouter">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un client
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ListeClients;
