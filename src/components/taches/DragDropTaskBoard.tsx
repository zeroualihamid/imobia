
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Target, Users } from 'lucide-react';

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
}

interface DragDropTaskBoardProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  onTaskClick: (task: Task) => void;
}

const DragDropTaskBoard = ({ tasks, onTaskUpdate, onTaskClick }: DragDropTaskBoardProps) => {
  const { toast } = useToast();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category && task.status === 'EN_FILE');
  };

  const urgentTasks = getTasksByCategory('URGENT');
  const importantTasks = getTasksByCategory('IMPORTANT');
  const normalTasks = getTasksByCategory('NORMAL');

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetCategory: 'URGENT' | 'IMPORTANT' | 'NORMAL') => {
    e.preventDefault();
    
    if (!draggedTask) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          category: targetCategory,
          updated_at: new Date().toISOString()
        })
        .eq('id', draggedTask);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tâche déplacée avec succès.",
      });
      
      onTaskUpdate();
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déplacer la tâche.",
        variant: "destructive",
      });
    } finally {
      setDraggedTask(null);
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onClick={() => onTaskClick(task)}
      className="p-3 border rounded-lg cursor-move hover:shadow-md transition-shadow bg-white"
      style={{
        opacity: draggedTask === task.id ? 0.5 : 1,
        borderColor: task.category === 'URGENT' ? '#ef4444' : 
                    task.category === 'IMPORTANT' ? '#f97316' : '#3b82f6'
      }}
    >
      <h4 className="font-medium text-sm mb-2">{task.title}</h4>
      <div className="flex items-center justify-between">
        <Badge 
          variant={task.category === 'URGENT' ? 'destructive' : 
                  task.category === 'IMPORTANT' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {task.status}
        </Badge>
        {task.owner_id && (
          <span className="text-xs text-slate-600">Assignée</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tâches urgentes */}
      <Card 
        className="bg-white border border-slate-200 shadow-sm"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'URGENT')}
      >
        <CardHeader className="bg-red-50 border-b border-red-200">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Urgent ({urgentTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-4">
          <div className="space-y-3 min-h-[200px]">
            {urgentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {urgentTasks.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Déposez ici les tâches urgentes
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tâches importantes */}
      <Card 
        className="bg-white border border-slate-200 shadow-sm"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'IMPORTANT')}
      >
        <CardHeader className="bg-orange-50 border-b border-orange-200">
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Target className="h-5 w-5" />
            Important ({importantTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-4">
          <div className="space-y-3 min-h-[200px]">
            {importantTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {importantTasks.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Déposez ici les tâches importantes
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tâches normales */}
      <Card 
        className="bg-white border border-slate-200 shadow-sm"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'NORMAL')}
      >
        <CardHeader className="bg-blue-50 border-b border-blue-200">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Users className="h-5 w-5" />
            Normal ({normalTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-4">
          <div className="space-y-3 min-h-[200px]">
            {normalTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {normalTasks.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Déposez ici les tâches normales
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DragDropTaskBoard;
