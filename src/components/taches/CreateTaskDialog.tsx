
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface CreateTaskDialogProps {
  onTaskCreated: () => void;
}

const CreateTaskDialog = ({ onTaskCreated }: CreateTaskDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'NORMAL' as 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'AUTO_GOAL',
    sla_hours: 24,
    due_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        sla_hours: formData.sla_hours,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        status: 'EN_FILE' as const
      };

      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tâche créée avec succès.",
      });

      setFormData({
        title: '',
        description: '',
        category: 'NORMAL',
        sla_hours: 24,
        due_date: ''
      });
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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une tâche
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Titre de la tâche"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de la tâche"
              rows={3}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Date d'échéance</Label>
            <Input
              id="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? 'Création...' : 'Créer la tâche'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
