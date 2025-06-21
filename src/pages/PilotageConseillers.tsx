import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreateTaskDialog from '@/components/taches/CreateTaskDialog';
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  category: 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL';
  status: 'EN_FILE' | 'ASSIGNEE' | 'EN_COURS' | 'TERMINEE' | 'EN_RETARD' | 'REAFFECTEE';
  created_at: string;
  due_date: string | null;
  sla_hours: number | null;
  progress: number | null;
  owner_id: string | null;
  previous_owner_id: string | null;
  auto_goal: boolean | null;
  score: number | null;
}

interface WeeklyPerformance {
  id: string;
  user_id: string;
  week_start: string;
  score_prospection: number | null;
  score_visites: number | null;
  score_contrats: number | null;
  created_at: string;
}

interface Conseiller {
  id: string;
  prenom: string;
  nom: string;
  email: string;
}

const PilotageConseillers = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [conseillers, setConseillers] = useState<Conseiller[]>([]);
  const [weeklyPerformances, setWeeklyPerformances] = useState<WeeklyPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('file-attente');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Charger les tâches
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Charger les conseillers
      const { data: conseillersData, error: conseillersError } = await supabase
        .from('conseillers')
        .select('id, prenom, nom, email');

      if (conseillersError) throw conseillersError;

      // Charger les performances hebdomadaires
      const { data: performancesData, error: performancesError } = await supabase
        .from('weekly_performance')
        .select('*')
        .order('week_start', { ascending: false });

      if (performancesError) throw performancesError;

      setTasks(tasksData || []);
      setConseillers(conseillersData || []);
      setWeeklyPerformances(performancesData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de pilotage.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'URGENT':
        return 'destructive';
      case 'IMPORTANT':
        return 'default';
      case 'NORMAL':
        return 'secondary';
      case 'AUTO_GOAL':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'EN_FILE':
        return 'outline';
      case 'ASSIGNEE':
        return 'default';
      case 'EN_COURS':
        return 'default';
      case 'TERMINEE':
        return 'default';
      case 'EN_RETARD':
        return 'destructive';
      case 'REAFFECTEE':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category);
  };

  const assignTask = async (taskId: string, conseillerId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          owner_id: conseillerId, 
          status: 'ASSIGNEE',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tâche assignée avec succès.",
      });
      
      fetchData();
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner la tâche.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement du pilotage...</p>
        </div>
      </div>
    );
  }

  const urgentTasks = getTasksByCategory('URGENT');
  const importantTasks = getTasksByCategory('IMPORTANT');
  const normalTasks = getTasksByCategory('NORMAL');
  const tasksEnFile = getTasksByStatus('EN_FILE');
  const tasksEnCours = getTasksByStatus('EN_COURS');
  const tasksTerminees = getTasksByStatus('TERMINEE');
  const tasksEnRetard = getTasksByStatus('EN_RETARD');

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout et statistiques */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Pilotage des conseillers</h1>
        <CreateTaskDialog onTaskCreated={fetchData} />
      </div>

      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En file</p>
                <p className="text-2xl font-bold text-slate-800">{tasksEnFile.length}</p>
              </div>
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{tasksEnCours.length}</p>
              </div>
              <ArrowRight className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{tasksTerminees.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En retard</p>
                <p className="text-2xl font-bold text-red-600">{tasksEnRetard.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file-attente">File d'attente</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs hebdo</TabsTrigger>
          <TabsTrigger value="performances">Performances</TabsTrigger>
        </TabsList>

        {/* File d'attente */}
        <TabsContent value="file-attente" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tâches urgentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Urgent ({urgentTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgentTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="destructive" className="text-xs">
                          {task.status}
                        </Badge>
                        {task.owner_id && (
                          <span className="text-xs text-slate-600">Assignée</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tâches importantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Target className="h-5 w-5" />
                  Important ({importantTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {importantTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="default" className="text-xs">
                          {task.status}
                        </Badge>
                        {task.owner_id && (
                          <span className="text-xs text-slate-600">Assignée</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tâches normales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Users className="h-5 w-5" />
                  Normal ({normalTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {normalTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {task.status}
                        </Badge>
                        {task.owner_id && (
                          <span className="text-xs text-slate-600">Assignée</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table détaillée des tâches en file */}
          <Card>
            <CardHeader>
              <CardTitle>Tâches en file d'attente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Créée le</TableHead>
                    <TableHead>SLA (h)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasksEnFile.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
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
                      <TableCell>
                        {new Date(task.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{task.sla_hours || 24}</TableCell>
                      <TableCell>
                        <select
                          className="text-sm border rounded px-2 py-1"
                          onChange={(e) => {
                            if (e.target.value) {
                              assignTask(task.id, e.target.value);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">Assigner à...</option>
                          {conseillers.map((conseiller) => (
                            <option key={conseiller.id} value={conseiller.id}>
                              {conseiller.prenom} {conseiller.nom}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectifs hebdomadaires */}
        <TabsContent value="objectifs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Prospection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conseillers.map((conseiller) => {
                    const performance = weeklyPerformances.find(p => p.user_id === conseiller.id);
                    const score = performance?.score_prospection || 0;
                    const objectif = 10; // Objectif fixe pour l'exemple
                    const pourcentage = Math.min((score / objectif) * 100, 100);
                    
                    return (
                      <div key={conseiller.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{conseiller.prenom} {conseiller.nom}</span>
                          <span>{score}/{objectif}</span>
                        </div>
                        <Progress value={pourcentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Visites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conseillers.map((conseiller) => {
                    const performance = weeklyPerformances.find(p => p.user_id === conseiller.id);
                    const score = performance?.score_visites || 0;
                    const objectif = 15; // Objectif fixe pour l'exemple
                    const pourcentage = Math.min((score / objectif) * 100, 100);
                    
                    return (
                      <div key={conseiller.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{conseiller.prenom} {conseiller.nom}</span>
                          <span>{score}/{objectif}</span>
                        </div>
                        <Progress value={pourcentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Contrats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conseillers.map((conseiller) => {
                    const performance = weeklyPerformances.find(p => p.user_id === conseiller.id);
                    const score = performance?.score_contrats || 0;
                    const objectif = 5; // Objectif fixe pour l'exemple
                    const pourcentage = Math.min((score / objectif) * 100, 100);
                    
                    return (
                      <div key={conseiller.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{conseiller.prenom} {conseiller.nom}</span>
                          <span>{score}/{objectif}</span>
                        </div>
                        <Progress value={pourcentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performances */}
        <TabsContent value="performances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tableau de bord des performances</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conseiller</TableHead>
                    <TableHead>Semaine</TableHead>
                    <TableHead>Prospection</TableHead>
                    <TableHead>Visites</TableHead>
                    <TableHead>Contrats</TableHead>
                    <TableHead>Score global</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyPerformances.map((performance) => {
                    const conseiller = conseillers.find(c => c.id === performance.user_id);
                    const scoreGlobal = (performance.score_prospection || 0) + 
                                      (performance.score_visites || 0) + 
                                      (performance.score_contrats || 0);
                    
                    return (
                      <TableRow key={performance.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {conseiller ? `${conseiller.prenom} ${conseiller.nom}` : 'Inconnu'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(performance.week_start).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {performance.score_prospection || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {performance.score_visites || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {performance.score_contrats || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={scoreGlobal > 20 ? "default" : "secondary"}>
                            {scoreGlobal}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PilotageConseillers;
