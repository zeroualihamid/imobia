
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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

const CreateTaskDialog = ({ onTaskCreated }: CreateTaskDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conseillers, setConseillers] = useState<Conseiller[]>([]);
  const [selectedConseillers, setSelectedConseillers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'NORMAL' as 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL',
    due_date: ''
  });

  useEffect(() => {
    if (open) {
      fetchConseillers();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-600 hover:text-white">
          <Plus className="h-4 w-4" />
          Ajouter une tâche
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white border border-slate-200">
        <DialogHeader className="bg-white">
          <DialogTitle className="text-slate-900">Créer une nouvelle tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-900 font-medium">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Titre de la tâche"
              required
              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-900 font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de la tâche"
              rows={3}
              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-900 font-medium">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200">
                <SelectItem value="URGENT" className="text-slate-900 hover:bg-slate-50">Urgent</SelectItem>
                <SelectItem value="IMPORTANT" className="text-slate-900 hover:bg-slate-50">Important</SelectItem>
                <SelectItem value="NORMAL" className="text-slate-900 hover:bg-slate-50">Normal</SelectItem>
                <SelectItem value="AUTO_GOAL" className="text-slate-900 hover:bg-slate-50">Objectif auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date" className="text-slate-900 font-medium">Date d'échéance</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              className="bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-900 font-medium">Conseillers assignés</Label>
            <div className="max-h-40 overflow-y-auto space-y-2 border border-slate-300 rounded-md p-3 bg-white">
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

          <div className="flex justify-end gap-2 pt-4 bg-white">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.title.trim()}
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
