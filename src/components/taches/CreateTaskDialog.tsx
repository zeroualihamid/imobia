
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface CreateTaskDialogProps {
  onTaskCreated: () => void;
}

interface Conseiller {
  id: string;
  prenom: string;
  nom: string;
  email: string;
}

interface TaskType {
  id: string;
  name: string;
  category: 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL';
}

const CreateTaskDialog = ({ onTaskCreated }: CreateTaskDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conseillers, setConseillers] = useState<Conseiller[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [selectedConseillers, setSelectedConseillers] = useState<string[]>([]);
  const [selectedTaskType, setSelectedTaskType] = useState<string>('');
  const [showNewTaskTypeForm, setShowNewTaskTypeForm] = useState(false);
  const [newTaskType, setNewTaskType] = useState({
    name: '',
    category: 'NORMAL' as 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL'
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'NORMAL' as 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL',
    due_date: ''
  });

  useEffect(() => {
    if (open) {
      fetchConseillers();
      fetchTaskTypes();
    }
  }, [open]);

  const fetchConseillers = async () => {
    try {
      const { data, error } = await supabase
        .from('conseillers')
        .select('id, prenom, nom, email');

      if (error) throw error;
      setConseillers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des conseillers:', error);
    }
  };

  const fetchTaskTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('task_types')
        .select('id, name, category')
        .order('name');

      if (error) throw error;
      setTaskTypes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des types de tâches:', error);
    }
  };

  const handleCreateTaskType = async () => {
    if (!newTaskType.name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour le type de tâche.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('task_types')
        .insert([{
          name: newTaskType.name.trim(),
          category: newTaskType.category
        }])
        .select()
        .single();

      if (error) throw error;

      setTaskTypes(prev => [...prev, data]);
      setNewTaskType({ name: '', category: 'NORMAL' });
      setShowNewTaskTypeForm(false);
      
      toast({
        title: "Succès",
        description: "Type de tâche créé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la création du type de tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le type de tâche.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de tâche.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const selectedType = taskTypes.find(type => type.id === selectedTaskType);
      const taskData = {
        title: selectedType?.name || formData.title,
        description: formData.description || null,
        category: selectedType?.category || formData.category,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        status: 'EN_FILE' as const
      };

      const { data: taskResult, error: taskError } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (taskError) throw taskError;

      // Assign selected conseillers to the task
      if (selectedConseillers.length > 0) {
        const assignments = selectedConseillers.map(conseillerId => ({
          task_id: taskResult.id,
          conseiller_id: conseillerId
        }));

        const { error: assignmentError } = await supabase
          .from('task_conseillers')
          .insert(assignments);

        if (assignmentError) throw assignmentError;
      }

      toast({
        title: "Succès",
        description: "Tâche créée avec succès.",
      });

      setFormData({
        title: '',
        description: '',
        category: 'NORMAL',
        due_date: ''
      });
      setSelectedConseillers([]);
      setSelectedTaskType('');
      setOpen(false);
      onTaskCreated();
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la tâche.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConseillerToggle = (conseillerId: string) => {
    setSelectedConseillers(prev => 
      prev.includes(conseillerId)
        ? prev.filter(id => id !== conseillerId)
        : [...prev, conseillerId]
    );
  };

  const handleTaskTypeSelect = (taskTypeId: string) => {
    setSelectedTaskType(taskTypeId);
    const selectedType = taskTypes.find(type => type.id === taskTypeId);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        title: selectedType.name,
        category: selectedType.category
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] !bg-white !border-slate-200 hover:!bg-white">
        <DialogHeader className="!bg-white hover:!bg-white">
          <DialogTitle className="text-slate-900">Créer une nouvelle tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 !bg-white hover:!bg-white">
          <div className="space-y-3">
            <Label className="text-slate-900 font-medium text-red-600">Type de tâche</Label>
            <div className="space-y-2">
              <Select value={selectedTaskType} onValueChange={handleTaskTypeSelect}>
                <SelectTrigger className="!bg-white !border-slate-300 text-slate-900 hover:!bg-white focus:!bg-white">
                  <SelectValue placeholder="Sélectionner un type de tâche" />
                </SelectTrigger>
                <SelectContent className="!bg-white !border-slate-300 z-50">
                  {taskTypes.map((taskType) => (
                    <SelectItem key={taskType.id} value={taskType.id} className="text-slate-900 hover:!bg-slate-50">
                      {taskType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {!showNewTaskTypeForm ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewTaskTypeForm(true)}
                  className="!bg-white !border-slate-300 text-slate-700 hover:!bg-slate-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un nouveau type
                </Button>
              ) : (
                <div className="space-y-2 p-3 border border-slate-300 rounded-md !bg-white">
                  <Input
                    placeholder="Nom du nouveau type de tâche"
                    value={newTaskType.name}
                    onChange={(e) => setNewTaskType(prev => ({ ...prev, name: e.target.value }))}
                    className="!bg-white !border-slate-300 text-slate-900"
                  />
                  <Select 
                    value={newTaskType.category} 
                    onValueChange={(value: 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL') => 
                      setNewTaskType(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="!bg-white !border-slate-300 text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="!bg-white !border-slate-300 z-50">
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="IMPORTANT">Important</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                      <SelectItem value="AUTO_GOAL">Auto Goal</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateTaskType}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Créer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewTaskTypeForm(false)}
                      className="!bg-white !border-slate-300 text-slate-700 hover:!bg-slate-50"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-900 font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de la tâche"
              rows={3}
              className="!bg-white !border-slate-300 text-slate-900 placeholder:text-slate-500 hover:!bg-white focus:!bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-900 font-medium">Catégorie</Label>
            <div className="p-3 bg-slate-50 rounded-md">
              <span className="text-sm text-slate-700">
                {selectedTaskType 
                  ? taskTypes.find(type => type.id === selectedTaskType)?.category || 'Normal'
                  : 'Normal'
                }
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date" className="text-slate-900 font-medium">Date d'échéance</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              className="!bg-white !border-slate-300 text-slate-900 hover:!bg-white focus:!bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-900 font-medium">Conseillers assignés</Label>
            <div className="max-h-40 overflow-y-auto space-y-2 border border-slate-300 rounded-md p-3 !bg-white hover:!bg-white">
              {conseillers.map((conseiller) => (
                <div key={conseiller.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={conseiller.id}
                    checked={selectedConseillers.includes(conseiller.id)}
                    onCheckedChange={() => handleConseillerToggle(conseiller.id)}
                    className="border-slate-300"
                  />
                  <Label htmlFor={conseiller.id} className="text-sm text-slate-900">
                    {conseiller.prenom} {conseiller.nom}
                  </Label>
                </div>
              ))}
              {conseillers.length === 0 && (
                <p className="text-sm text-slate-500">Aucun conseiller disponible</p>
              )}
            </div>
            {selectedConseillers.length > 0 && (
              <p className="text-xs text-slate-600">
                {selectedConseillers.length} conseiller(s) sélectionné(s)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 !bg-white hover:!bg-white">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="!bg-white !border-slate-300 text-slate-700 hover:!bg-slate-50"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !selectedTaskType}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Création...' : 'Créer la tâche'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
