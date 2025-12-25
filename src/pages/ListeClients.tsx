import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Phone, Mail, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Client {
  id: string;
  client_nom_complet: string;
  telephone: string | null;
  email: string;
  budget: number | null;
  type_bien: string | null;
  status: string | null;
  created_at: string;
}

const ListeClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('demandes')
        .select('id, client_nom_complet, telephone, email, budget, type_bien, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.client_nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutColor = (statut: string | null) => {
    switch (statut) {
      case 'NOUVELLE':
        return 'bg-green-100 text-green-800';
      case 'EN_COURS':
        return 'bg-orange-100 text-orange-800';
      case 'TRAITEE':
        return 'bg-blue-100 text-blue-800';
      case 'ANNULEE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">Gérez vos clients et prospects</p>
        </div>
        <Link to="/demandes/ajouter">
          <Button className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un client
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                  {client.client_nom_complet}
                </CardTitle>
                <Badge className={getStatutColor(client.status)}>
                  {client.status || 'Nouveau'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                {client.telephone || 'Non renseigné'}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                {client.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Heart className="h-4 w-4 mr-2" />
                {client.type_bien || 'Non spécifié'} - Budget: {client.budget ? client.budget.toLocaleString('fr-FR') : 'Non défini'} DH
              </div>
              <div className="text-xs text-muted-foreground">
                Ajouté le {new Date(client.created_at).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex gap-2 pt-2">
                <Link to={`/demandes/${client.id}`} className="flex-1">
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
          <div className="text-muted-foreground mb-4">
            <Heart className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Aucun client trouvé</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Aucun client ne correspond à votre recherche.' : 'Commencez par ajouter votre premier client.'}
          </p>
          <Link to="/demandes/ajouter">
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
