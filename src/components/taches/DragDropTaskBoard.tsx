
import React, { useState, useEffect } from 'react';
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
}

interface TaskAssignment {
  task_id: string;
  conseiller_count: number;
}

interface DragDropTaskBoardProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  onTaskClick: (task: Task) => void;
}

const DragDropTaskBoard = ({ tasks, onTaskUpdate, onTaskClick }: DragDropTaskBoardProps) => {
  const { toast } = useToast();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchTaskAssignments();
  }, [tasks]);

  const fetchTaskAssignments = async () => {
    try {
      const taskIds = tasks.map(task => task.id);
      if (taskIds.length === 0) return;

      const { data, error } = await supabase
        .from('task_conseillers')
        .select('task_id')
        .in('task_id', taskIds);

      if (error) throw error;

      const assignmentCounts: Record<string, number> = {};
      data?.forEach(assignment => {
        assignmentCounts[assignment.task_id] = (assignmentCounts[assignment.task_id] || 0) + 1;
      });

      setTaskAssignments(assignmentCounts);
    } catch (error) {
      console.error('Erreur lors du chargement des assignations:', error);
    }
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category && task.status === 'EN_FILE');
  };

  const urgentTasks = getTasksByCategory('URGENT');
  const importantTasks = getTasksByCategory('IMPORTANT');
  const normalTasks = getTasksByCategory('NORMAL');

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    console.log('Drag start:', taskId);
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('Drag end');
    setDraggedTask(null);
    setDragOverCategory(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    setDragOverCategory(category);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCategory(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetCategory: 'URGENT' | 'IMPORTANT' | 'NORMAL') => {
    e.preventDefault();
    e.stopPropagation();
    
    const taskId = e.dataTransfer.getData('text/plain');
    
    console.log('Drop:', taskId, 'to', targetCategory);
    
    if (!taskId) {
      console.log('No task ID found');
      return;
    }

    // Find the task to check if it's already in the target category
    const task = tasks.find(t => t.id === taskId);
    if (task && task.category === targetCategory) {
      console.log('Task already in target category');
      setDraggedTask(null);
      setDragOverCategory(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          category: targetCategory,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Tâche déplacée vers ${targetCategory.toLowerCase()}.`,
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
      setDragOverCategory(null);
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const assignedCount = taskAssignments[task.id] || 0;
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          // Only trigger click if we're not in the middle of a drag operation
          if (!draggedTask) {
            onTaskClick(task);
          }
        }}
        className={`p-3 border rounded-lg transition-all duration-200 bg-white select-none ${
          draggedTask === task.id 
            ? 'opacity-60 scale-95 rotate-3 cursor-grabbing shadow-lg' 
            : 'opacity-100 scale-100 cursor-grab hover:shadow-md'
        }`}
        style={{
          borderColor: task.category === 'URGENT' ? '#ef4444' : 
                      task.category === 'IMPORTANT' ? '#f97316' : '#3b82f6'
        }}
      >
        <h4 className="font-medium text-sm mb-2 pointer-events-none">{task.title}</h4>
        <div className="flex items-center justify-between pointer-events-none">
          <Badge 
            variant={task.category === 'URGENT' ? 'destructive' : 
                    task.category === 'IMPORTANT' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {task.status}
          </Badge>
          {assignedCount > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-slate-600" />
              <span className="text-xs text-slate-600">{assignedCount}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tâches urgentes */}
      <Card 
        className={`bg-white border border-slate-200 shadow-sm transition-all duration-200 ${
          dragOverCategory === 'URGENT' ? 'ring-2 ring-red-400 bg-red-50 scale-102' : ''
        }`}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, 'URGENT')}
        onDragLeave={handleDragLeave}
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
              <div className="flex items-center justify-center h-full text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg p-8">
                Glissez ici les tâches urgentes
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tâches importantes */}
      <Card 
        className={`bg-white border border-slate-200 shadow-sm transition-all duration-200 ${
          dragOverCategory === 'IMPORTANT' ? 'ring-2 ring-orange-400 bg-orange-50 scale-102' : ''
        }`}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, 'IMPORTANT')}
        onDragLeave={handleDragLeave}
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
              <div className="flex items-center justify-center h-full text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg p-8">
                Glissez ici les tâches importantes
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tâches normales */}
      <Card 
        className={`bg-white border border-slate-200 shadow-sm transition-all duration-200 ${
          dragOverCategory === 'NORMAL' ? 'ring-2 ring-blue-400 bg-blue-50 scale-102' : ''
        }`}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, 'NORMAL')}
        onDragLeave={handleDragLeave}
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
              <div className="flex items-center justify-center h-full text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg p-8">
                Glissez ici les tâches normales
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DragDropTaskBoard;
