
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Languages,
  DollarSign,
  Briefcase,
  CreditCard,
  Eye,
  BarChart3
} from 'lucide-react';

interface Conseiller {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string | null;
  ville: string | null;
  nationalite: string | null;
  numero_cin: string | null;
  date_naissance: string | null;
  formation: string | null;
  specialisations: string[] | null;
  langues: string[] | null;
  salaire: number | null;
  commission: number | null;
  date_embauche: string | null;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  category: 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL';
  status: 'EN_FILE' | 'ASSIGNEE' | 'EN_COURS' | 'TERMINEE' | 'EN_RETARD' | 'REAFFECTEE';
  created_at: string;
  due_date: string | null;
}

interface KPI {
  indicateur: string;
  definition: string;
  valeur: number | string;
  periodicite: string;
  commentaires: string;
}

const DetailConseiller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conseiller, setConseiller] = useState<Conseiller | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'jour' | 'semaine' | 'mois' | 'realtime'>('semaine');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (id) {
      fetchConseiller();
    }
  }, [id]);

  useEffect(() => {
    if (id && activeTab === 'taches') {
      fetchTasks();
    }
  }, [id, activeTab]);

  useEffect(() => {
    if (id && activeTab === 'indicateurs') {
      fetchKPIs();
    }
  }, [id, activeTab, selectedPeriod]);

  const fetchConseiller = async () => {
    try {
      const { data, error } = await supabase
        .from('conseillers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setConseiller(data);
    } catch (error) {
      console.error('Erreur lors du chargement du conseiller:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du conseiller.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('task_conseillers')
        .select(`
          tasks (
            id,
            title,
            description,
            category,
            status,
            created_at,
            due_date
          )
        `)
        .eq('conseiller_id', id);

      if (error) {
        throw error;
      }

      const taskData = data?.map(item => item.tasks).filter(Boolean) || [];
      setTasks(taskData as Task[]);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches du conseiller.",
        variant: "destructive",
      });
    }
  };

  const fetchKPIs = async () => {
    try {
      // Fetch real KPI data from weekly_performance table
      const { data: performanceData, error: perfError } = await supabase
        .from('weekly_performance')
        .select('*')
        .eq('user_id', id)
        .order('week_start', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (perfError) throw perfError;

      // Fetch task counts for the conseiller
      const { data: taskData, error: taskError } = await supabase
        .from('task_conseillers')
        .select('task_id')
        .eq('conseiller_id', id);

      if (taskError) throw taskError;

      const completedTasks = tasks.filter(t => t.status === 'TERMINEE').length;
      const totalTasks = tasks.length;
      const conversionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const realKPIs: KPI[] = [
        {
          indicateur: "Nombre de visites réalisées",
          definition: "Score visites de la semaine",
          valeur: performanceData?.score_visites || 0,
          periodicite: selectedPeriod,
          commentaires: "Visites effectuées durant la période sélectionnée"
        },
        {
          indicateur: "Nombre de contrats signés",
          definition: "Score contrats de la semaine",
          valeur: performanceData?.score_contrats || 0,
          periodicite: selectedPeriod,
          commentaires: "Contrats signés"
        },
        {
          indicateur: "Score prospection",
          definition: "Score prospection hebdomadaire",
          valeur: performanceData?.score_prospection || 0,
          periodicite: selectedPeriod,
          commentaires: "Activité de prospection"
        },
        {
          indicateur: "Tâches assignées",
          definition: "Nombre total de tâches assignées",
          valeur: taskData?.length || 0,
          periodicite: selectedPeriod,
          commentaires: "Tâches en cours et terminées"
        },
        {
          indicateur: "Tâches terminées",
          definition: "Nombre de tâches complétées",
          valeur: completedTasks,
          periodicite: selectedPeriod,
          commentaires: "Tâches accomplies"
        },
        {
          indicateur: "Taux de concrétisation",
          definition: "Tâches terminées ÷ Tâches totales",
          valeur: `${conversionRate}%`,
          periodicite: selectedPeriod,
          commentaires: "Ratio de conversion tâches"
        }
      ];

      setKpis(realKPIs);
    } catch (error) {
      console.error('Erreur lors du chargement des KPIs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les indicateurs.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateAge = (dateNaissance: string | null) => {
    if (!dateNaissance) return 'Non défini';
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} ans`;
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'URGENT':
        return 'destructive';
      case 'IMPORTANT':
        return 'default';
      case 'NORMAL':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ASSIGNEE':
        return 'default';
      case 'EN_COURS':
        return 'secondary';
      case 'TERMINEE':
        return 'outline';
      case 'EN_RETARD':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!conseiller) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Conseiller non trouvé.</p>
        <Button onClick={() => navigate('/conseillers')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/conseillers')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {conseiller.prenom} {conseiller.nom}
              </h1>
              <p className="text-slate-600">
                Ajouté le {formatDate(conseiller.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="taches">Tâches</TabsTrigger>
          <TabsTrigger value="indicateurs">Indicateurs</TabsTrigger>
        </TabsList>

        {/* Informations Tab */}
        <TabsContent value="info" className="space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Prénom</label>
                    <p className="text-slate-900">{conseiller.prenom}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Nom</label>
                    <p className="text-slate-900">{conseiller.nom}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Date de naissance</label>
                  <p className="text-slate-900">{calculateAge(conseiller.date_naissance)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Nationalité</label>
                  <p className="text-slate-900">{conseiller.nationalite || 'Non définie'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">N° CIN</label>
                  <p className="text-slate-900">{conseiller.numero_cin || 'Non défini'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{conseiller.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{conseiller.telephone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{conseiller.adresse || 'Non définie'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{conseiller.ville || 'Non définie'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formation et compétences */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Formation et compétences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Formation</label>
                  {conseiller.formation ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-1">
                      {conseiller.formation}
                    </Badge>
                  ) : (
                    <p className="text-slate-400">Non définie</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Spécialisations</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {conseiller.specialisations && conseiller.specialisations.length > 0 ? (
                      conseiller.specialisations.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-slate-400">Aucune</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Langues</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {conseiller.langues && conseiller.langues.length > 0 ? (
                      conseiller.langues.map((langue, index) => (
                        <Badge key={index} variant="outline">
                          <Languages className="h-3 w-3 mr-1" />
                          {langue}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-slate-400">Aucune</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informations professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <label className="text-sm font-medium text-slate-600">Date d'embauche</label>
                    <p className="text-slate-900">{formatDate(conseiller.date_embauche)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <div>
                    <label className="text-sm font-medium text-slate-600">Salaire</label>
                    <p className="text-slate-900">
                      {conseiller.salaire ? `${conseiller.salaire.toLocaleString('fr-FR')} €` : 'Non défini'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <div>
                    <label className="text-sm font-medium text-slate-600">Commission</label>
                    <p className="text-slate-900">
                      {conseiller.commission ? `${conseiller.commission}%` : 'Non définie'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tâches Tab */}
        <TabsContent value="taches">
          <Card>
            <CardHeader>
              <CardTitle>Tâches assignées</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">Aucune tâche assignée à ce conseiller.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Créée le</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.description || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={getCategoryBadgeColor(task.category)}>
                            {task.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeColor(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(task.created_at)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTask(task.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Indicateurs Tab */}
        <TabsContent value="indicateurs">
          <div className="space-y-6">
            {/* Period Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Indicateurs de performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-slate-600">Période:</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="border border-slate-200 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="jour">Jour</option>
                    <option value="semaine">Semaine</option>
                    <option value="mois">Mois</option>
                    <option value="realtime">Temps réel</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* KPI Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Indicateur</TableHead>
                      <TableHead>Définition précise</TableHead>
                      <TableHead>Valeur calculée</TableHead>
                      <TableHead>Périodicité</TableHead>
                      <TableHead>Commentaires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kpis.map((kpi, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{kpi.indicateur}</TableCell>
                        <TableCell className="text-sm text-slate-600">{kpi.definition}</TableCell>
                        <TableCell className="font-semibold">{kpi.valeur}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{kpi.periodicite}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{kpi.commentaires}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailConseiller;
