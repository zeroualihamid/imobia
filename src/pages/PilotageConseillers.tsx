import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreateTaskDialog from '@/components/taches/CreateTaskDialog';
import DragDropTaskBoard from '@/components/taches/DragDropTaskBoard';
import { useRealtimeTasks } from '@/hooks/useRealtimeTasks';
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
  ArrowRight,
  ChevronDown
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

interface Conseiller {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  statut?: string;
}

interface WeeklyPerformance {
  user_id: string;
  score_visites: number;
  score_contrats: number;
  score_total: number;
}

const PilotageConseillers = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [conseillers, setConseillers] = useState<Conseiller[]>([]);
  const [weeklyPerformances, setWeeklyPerformances] = useState<WeeklyPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Fetch conseillers
      const { data: conseillersData, error: conseillersError } = await supabase
        .from('conseillers')
        .select('id, prenom, nom, email');

      if (conseillersError) throw conseillersError;

      // Fetch weekly performances (mock data for now)
      const mockPerformances: WeeklyPerformance[] = conseillersData?.map((c: Conseiller) => ({
        user_id: c.id,
        score_visites: Math.floor(Math.random() * 20),
        score_contrats: Math.floor(Math.random() * 8),
        score_total: Math.floor(Math.random() * 100)
      })) || [];

      setTasks(tasksData || []);
      setConseillers(conseillersData || []);
      setWeeklyPerformances(mockPerformances);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Setup real-time subscriptions
  useRealtimeTasks(fetchData);

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

  const assignTaskToMultipleConseillers = async (taskId: string, conseillerIds: string[]) => {
    try {
      // First, insert assignments in task_conseillers table
      const assignments = conseillerIds.map(conseillerId => ({
        task_id: taskId,
        conseiller_id: conseillerId,
        assigned_by: null
      }));

      const { error: assignmentError } = await supabase
        .from('task_conseillers')
        .insert(assignments);

      if (assignmentError) throw assignmentError;

      // Then update task status to ASSIGNEE
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          status: 'ASSIGNEE',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      const conseillerNames = conseillerIds.map(id => {
        const conseiller = conseillers.find(c => c.id === id);
        return `${conseiller?.prenom} ${conseiller?.nom}`;
      }).join(', ');

      toast({
        title: "Succès",
        description: `Tâche assignée à ${conseillerNames}.`,
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

  const handleTaskClick = (task: Task) => {
    navigate(`/tasks/${task.id}/edit`);
  };

  const truncateDescription = (description: string | null, maxLength: number = 50) => {
    if (!description) return 'Aucune description';
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...' 
      : description;
  };

  // Multi-select assignment component
  const MultiSelectAssignmentDropdown = ({ taskId }: { taskId: string }) => {
    const [selectedConseillers, setSelectedConseillers] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleConseillerToggle = (conseillerId: string) => {
      setSelectedConseillers(prev => 
        prev.includes(conseillerId) 
          ? prev.filter(id => id !== conseillerId)
          : [...prev, conseillerId]
      );
    };

    const handleAssign = async () => {
      if (selectedConseillers.length === 0) {
        toast({
          title: "Attention",
          description: "Veuillez sélectionner au moins un conseiller.",
          variant: "destructive",
        });
        return;
      }

      await assignTaskToMultipleConseillers(taskId, selectedConseillers);
      setSelectedConseillers([]);
      setIsOpen(false);
    };

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm" 
            variant="outline"
            className="bg-white border-slate-300 text-slate-900 hover:bg-slate-50"
            onClick={(e) => e.stopPropagation()}
          >
            Assigner
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border-slate-300 z-50 w-64">
          <div className="p-2">
            <div className="text-sm font-medium text-slate-900 mb-2">
              Sélectionner les conseillers:
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {conseillers.map((conseiller) => (
                <div 
                  key={conseiller.id}
                  className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded cursor-pointer"
                  onClick={() => handleConseillerToggle(conseiller.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedConseillers.includes(conseiller.id)}
                    onChange={() => handleConseillerToggle(conseiller.id)}
                    className="rounded border-slate-300"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm text-slate-900">
                    {conseiller.prenom} {conseiller.nom}
                  </span>
                </div>
              ))}
            </div>
            {conseillers.length === 0 && (
              <div className="text-sm text-slate-500 py-2">
                Aucun conseiller disponible
              </div>
            )}
            <div className="mt-3 pt-2 border-t border-slate-200">
              <Button 
                size="sm" 
                onClick={handleAssign}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={selectedConseillers.length === 0}
              >
                Assigner ({selectedConseillers.length})
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement du pilotage...</p>
        </div>
      </div>
    );
  }

  const urgentTasks = getTasksByCategory('URGENT');
  const importantTasks = getTasksByCategory('IMPORTANT');
  const normalTasks = getTasksByCategory('NORMAL');
  const tasksEnFile = getTasksByStatus('EN_FILE');
  const tasksAssignees = getTasksByStatus('ASSIGNEE');
  const tasksEnCours = getTasksByStatus('EN_COURS');
  const tasksTerminees = getTasksByStatus('TERMINEE');
  const tasksEnRetard = getTasksByStatus('EN_RETARD');

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      {/* En-tête avec bouton d'ajout et statistiques */}
      <div className="flex justify-between items-center bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Pilotage des conseillers</h1>
        <CreateTaskDialog onTaskCreated={fetchData} />
      </div>

      {/* En-tête avec statistiques - Updated to include assigned tasks */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En file</p>
                <p className="text-2xl font-bold text-slate-900">{tasksEnFile.length}</p>
              </div>
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Assignées</p>
                <p className="text-2xl font-bold text-orange-600">{tasksAssignees.length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{tasksEnCours.length}</p>
              </div>
              <ArrowRight className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{tasksTerminees.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-4 bg-white">
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
      <Tabs defaultValue="file-attente" className="w-full bg-white rounded-lg border border-slate-200 shadow-sm">
        <TabsList className="grid w-full grid-cols-3 bg-white border-b border-slate-200">
          <TabsTrigger value="file-attente" className="bg-white data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-900">File d'attente</TabsTrigger>
          <TabsTrigger value="objectifs" className="bg-white data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-900">Objectifs hebdo</TabsTrigger>
          <TabsTrigger value="performances" className="bg-white data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-900">Performances</TabsTrigger>
        </TabsList>

        {/* File d'attente */}
        <TabsContent value="file-attente" className="space-y-4 mt-6 p-6 bg-white">
          {/* Drag and Drop Task Board */}
          <DragDropTaskBoard 
            tasks={tasks} 
            onTaskUpdate={fetchData} 
            onTaskClick={handleTaskClick} 
          />

          {/* Table détaillée des tâches en file */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200">
              <CardTitle className="text-slate-900">Tâches en file d'attente</CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-slate-900">Titre</TableHead>
                    <TableHead className="text-slate-900">Description</TableHead>
                    <TableHead className="text-slate-900">Catégorie</TableHead>
                    <TableHead className="text-slate-900">Status</TableHead>
                    <TableHead className="text-slate-900">Créée le</TableHead>
                    <TableHead className="text-slate-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {tasksEnFile.map((task) => (
                    <TableRow 
                      key={task.id} 
                      className="bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      <TableCell className="font-medium text-slate-900">{task.title}</TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {truncateDescription(task.description)}
                      </TableCell>
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
                      <TableCell className="text-slate-900">
                        {new Date(task.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <MultiSelectAssignmentDropdown taskId={task.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Table des tâches assignées */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-orange-50 border-b border-orange-200">
              <CardTitle className="text-orange-800">Tâches assignées</CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-slate-900">Titre</TableHead>
                    <TableHead className="text-slate-900">Description</TableHead>
                    <TableHead className="text-slate-900">Catégorie</TableHead>
                    <TableHead className="text-slate-900">Status</TableHead>
                    <TableHead className="text-slate-900">Créée le</TableHead>
                    <TableHead className="text-slate-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {tasksAssignees.map((task) => (
                    <TableRow 
                      key={task.id} 
                      className="bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      <TableCell className="font-medium text-slate-900">{task.title}</TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {truncateDescription(task.description)}
                      </TableCell>
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
                      <TableCell className="text-slate-900">
                        {new Date(task.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white border-slate-300 text-slate-900 hover:bg-slate-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
                        >
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tasksAssignees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8 bg-white">
                        Aucune tâche assignée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectifs hebdo */}
        <TabsContent value="objectifs" className="space-y-4 mt-6 p-6 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="bg-white border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Calendar className="h-5 w-5" />
                  Visites
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {conseillers.map((conseiller) => {
                    const performance = weeklyPerformances.find(p => p.user_id === conseiller.id);
                    const score = performance?.score_visites || 0;
                    const objectif = 15; // Objectif fixe pour l'exemple
                    const pourcentage = Math.min((score / objectif) * 100, 100);
                    
                    return (
                      <div key={conseiller.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-900">{conseiller.prenom} {conseiller.nom}</span>
                          <span className="text-slate-900">{score}/{objectif}</span>
                        </div>
                        <Progress value={pourcentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="bg-white border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5" />
                  Contrats
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  {conseillers.map((conseiller) => {
                    const performance = weeklyPerformances.find(p => p.user_id === conseiller.id);
                    const score = performance?.score_contrats || 0;
                    const objectif = 5; // Objectif fixe pour l'exemple
                    const pourcentage = Math.min((score / objectif) * 100, 100);
                    
                    return (
                      <div key={conseiller.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-900">{conseiller.prenom} {conseiller.nom}</span>
                          <span className="text-slate-900">{score}/{objectif}</span>
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
        <TabsContent value="performances" className="space-y-4 mt-6 p-6 bg-white">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <TrendingUp className="h-5 w-5" />
                Performance globale
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-slate-900">Conseiller</TableHead>
                    <TableHead className="text-slate-900">Visites</TableHead>
                    <TableHead className="text-slate-900">Contrats</TableHead>
                    <TableHead className="text-slate-900">Score Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {conseillers.map((conseiller) => {
                    const performance = weeklyPerformances.find(p => p.user_id === conseiller.id);
                    return (
                      <TableRow 
                        key={conseiller.id} 
                        className="bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => {
                          toast({
                            title: `Conseiller: ${conseiller.prenom} ${conseiller.nom}`,
                            description: `Email: ${conseiller.email}`,
                          });
                        }}
                      >
                        <TableCell className="font-medium text-slate-900">
                          {conseiller.prenom} {conseiller.nom}
                        </TableCell>
                        <TableCell className="text-slate-900">{performance?.score_visites || 0}</TableCell>
                        <TableCell className="text-slate-900">{performance?.score_contrats || 0}</TableCell>
                        <TableCell className="text-slate-900">{performance?.score_total || 0}</TableCell>
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
