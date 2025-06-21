
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface Conseiller {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string | null;
  formation: string | null;
  specialisations: string[] | null;
  langues: string[] | null;
  salaire: number | null;
  commission: number | null;
  date_embauche: string | null;
  created_at: string;
}

const ListeConseillers = () => {
  const { toast } = useToast();
  const [conseillers, setConseillers] = useState<Conseiller[]>([]);
  const [filteredConseillers, setFilteredConseillers] = useState<Conseiller[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulation d'indicateurs de performance
  const generatePerformanceIndicator = () => {
    const performance = Math.random();
    if (performance > 0.7) {
      return { label: 'Excellent', color: 'bg-green-500', trend: 'up' };
    } else if (performance > 0.4) {
      return { label: 'Bon', color: 'bg-blue-500', trend: 'stable' };
    } else {
      return { label: 'À améliorer', color: 'bg-orange-500', trend: 'down' };
    }
  };

  const generateRandomScore = () => Math.floor(Math.random() * 40) + 60; // Score entre 60 et 100

  useEffect(() => {
    fetchConseillers();
  }, []);

  useEffect(() => {
    // Filtrer les conseillers selon le terme de recherche
    const filtered = conseillers.filter((conseiller) =>
      `${conseiller.prenom} ${conseiller.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conseiller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conseiller.ville && conseiller.ville.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredConseillers(filtered);
  }, [conseillers, searchTerm]);

  const fetchConseillers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour voir les conseillers.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('conseillers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setConseillers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des conseillers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des conseillers.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateAnciennete = (dateEmbauche: string | null) => {
    if (!dateEmbauche) return 'N/A';
    const embauche = new Date(dateEmbauche);
    const maintenant = new Date();
    const diffTime = Math.abs(maintenant.getTime() - embauche.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const mois = Math.floor(diffDays / 30);
    return mois > 0 ? `${mois} mois` : `${diffDays} jours`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement des conseillers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Liste des conseillers
              </h1>
              <p className="text-slate-600">
                {conseillers.length} conseiller{conseillers.length > 1 ? 's' : ''} enregistré{conseillers.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un conseiller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total conseillers</p>
                <p className="text-2xl font-bold text-slate-900">{conseillers.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Performance moyenne</p>
                <p className="text-2xl font-bold text-green-600">78%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Top performer</p>
                <p className="text-2xl font-bold text-blue-600">92%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Nouveaux (30j)</p>
                <p className="text-2xl font-bold text-purple-600">
                  {conseillers.filter(c => {
                    const created = new Date(c.created_at);
                    const now = new Date();
                    const diffTime = now.getTime() - created.getTime();
                    const diffDays = diffTime / (1000 * 3600 * 24);
                    return diffDays <= 30;
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des conseillers */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Conseillers et indicateurs de performance</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredConseillers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchTerm ? 'Aucun conseiller trouvé pour cette recherche.' : 'Aucun conseiller enregistré.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conseiller</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Villes</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead>Spécialisations</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Ancienneté</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConseillers.map((conseiller) => {
                  const performance = generatePerformanceIndicator();
                  const score = generateRandomScore();
                  
                  return (
                    <TableRow key={conseiller.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">
                            {conseiller.prenom} {conseiller.nom}
                          </p>
                          <p className="text-sm text-slate-500">
                            Ajouté le {formatDate(conseiller.created_at)}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-600">{conseiller.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-600">{conseiller.telephone}</span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {conseiller.ville ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span className="text-sm text-slate-600">{conseiller.ville}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Non définie</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {conseiller.formation ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {conseiller.formation}
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Non définie</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {conseiller.specialisations && conseiller.specialisations.length > 0 ? (
                            conseiller.specialisations.slice(0, 2).map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-slate-400">Aucune</span>
                          )}
                          {conseiller.specialisations && conseiller.specialisations.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{conseiller.specialisations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${performance.color}`}></div>
                          <span className="text-sm font-medium">{performance.label}</span>
                          {performance.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                          {performance.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-center">
                          <span className={`text-lg font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {score}
                          </span>
                          <span className="text-sm text-slate-500">/100</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {calculateAnciennete(conseiller.date_embauche)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeConseillers;
