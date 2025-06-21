
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Calendar, User, Clock } from 'lucide-react';

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
}

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [conseillers, setConseillers] = useState<Conseiller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'NORMAL' as 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL',
    status: 'EN_FILE' as 'EN_FILE' | 'ASSIGNEE' | 'EN_COURS' | 'TERMINEE' | 'EN_RETARD' | 'REAFFECTEE',
    due_date: '',
    sla_hours: 24,
    progress: 0,
    owner_id: '',
    score: 0
  });

  useEffect(() => {
    if (id) {
      fetchTaskAndConseillers();
    }
  }, [id]);

  const fetchTaskAndConseillers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (taskError) throw taskError;

      // Fetch conseillers
      const { data: conseillersData, error: conseillersError } = await supabase
        .from('conseillers')
        .select('id, prenom, nom, email');

      if (conseillersError) throw conseillersError;

      setTask(taskData);
      setConseillers(conseillersData || []);
      
      // Set form data
      setFormData({
        title: taskData.title,
        description: taskData.description || '',
        category: taskData.category,
        status: taskData.status,
        due_date: taskData.due_date ? new Date(taskData.due_date).toISOString().slice(0, 16) : '',
        sla_hours: taskData.sla_hours || 24,
        progress: taskData.progress || 0,
        owner_id: taskData.owner_id || '',
        score: taskData.score || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la tâche.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        status: formData.status,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        sla_hours: formData.sla_hours,
        progress: formData.progress,
        owner_id: formData.owner_id || null,
        score: formData.score,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tâche mise à jour avec succès.",
      });
      
      navigate('/conseillers/pilotage');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la tâche.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement de la tâche...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">Tâche non trouvée</p>
          <Button onClick={() => navigate('/conseillers/pilotage')} className="mt-4">
            Retour au pilotage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/conseillers/pilotage')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Détail de la tâche</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200">
              <CardTitle className="text-slate-800">Informations de la tâche</CardTitle>
            </CardHeader>
            <CardContent className="bg-white space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Titre de la tâche"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description de la tâche"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                      <SelectItem value="IMPORTANT">Important</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="AUTO_GOAL">Objectif auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EN_FILE">En file</SelectItem>
                      <SelectItem value="ASSIGNEE">Assignée</SelectItem>
                      <SelectItem value="EN_COURS">En cours</SelectItem>
                      <SelectItem value="TERMINEE">Terminée</SelectItem>
                      <SelectItem value="EN_RETARD">En retard</SelectItem>
                      <SelectItem value="REAFFECTEE">Réaffectée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sla_hours">SLA (heures)</Label>
                  <Input
                    id="sla_hours"
                    type="number"
                    value={formData.sla_hours}
                    onChange={(e) => handleInputChange('sla_hours', parseInt(e.target.value) || 24)}
                    min="1"
                    max="720"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress">Progrès (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    value={formData.progress}
                    onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Date d'échéance</Label>
                  <Input
                    id="due_date"
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score">Score</Label>
                  <Input
                    id="score"
                    type="number"
                    value={formData.score}
                    onChange={(e) => handleInputChange('score', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_id">Conseiller assigné</Label>
                <Select value={formData.owner_id} onValueChange={(value) => handleInputChange('owner_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un conseiller" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun conseiller</SelectItem>
                    {conseillers.map((conseiller) => (
                      <SelectItem key={conseiller.id} value={conseiller.id}>
                        {conseiller.prenom} {conseiller.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations système */}
        <div className="space-y-6">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200">
              <CardTitle className="text-slate-800">État actuel</CardTitle>
            </CardHeader>
            <CardContent className="bg-white space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Catégorie</span>
                <Badge variant={getCategoryBadgeColor(task.category)}>
                  {task.category}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Statut</span>
                <Badge variant={getStatusBadgeColor(task.status)}>
                  {task.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>Créée le {new Date(task.created_at).toLocaleDateString('fr-FR')}</span>
              </div>

              {task.due_date && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}</span>
                </div>
              )}

              {task.owner_id && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="h-4 w-4" />
                  <span>Assignée</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
