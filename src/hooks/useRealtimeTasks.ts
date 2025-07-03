
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  property_id: string | null;
}

export const useRealtimeTasks = (onTasksUpdate: () => void) => {
  const { toast } = useToast();

  const handleTaskChange = useCallback((payload: any) => {
    console.log('Real-time task change:', payload);
    
    const eventType = payload.eventType;
    const newRecord = payload.new as Task;
    const oldRecord = payload.old as Task;
    
    let message = '';
    
    switch (eventType) {
      case 'INSERT':
        message = `Nouvelle tâche créée: ${newRecord.title}`;
        break;
      case 'UPDATE':
        if (oldRecord && newRecord) {
          if (oldRecord.status !== newRecord.status) {
            const statusLabels: Record<string, string> = {
              'EN_FILE': 'En file',
              'ASSIGNEE': 'Assignée',
              'EN_COURS': 'En cours',
              'TERMINEE': 'Terminée',
              'EN_RETARD': 'En retard',
              'REAFFECTEE': 'Réaffectée'
            };
            message = `Statut de "${newRecord.title}" changé: ${statusLabels[oldRecord.status]} → ${statusLabels[newRecord.status]}`;
          } else if (oldRecord.category !== newRecord.category) {
            message = `Catégorie de "${newRecord.title}" changée: ${oldRecord.category} → ${newRecord.category}`;
          } else {
            message = `Tâche "${newRecord.title}" mise à jour`;
          }
        }
        break;
      case 'DELETE':
        if (oldRecord) {
          message = `Tâche "${oldRecord.title}" supprimée`;
        }
        break;
    }
    
    if (message) {
      toast({
        title: "Mise à jour en temps réel",
        description: message,
      });
    }
    
    // Trigger data refresh
    onTasksUpdate();
  }, [toast, onTasksUpdate]);

  const handleTaskAssignmentChange = useCallback((payload: any) => {
    console.log('Real-time task assignment change:', payload);
    
    const eventType = payload.eventType;
    
    let message = '';
    
    switch (eventType) {
      case 'INSERT':
        message = 'Nouvelle assignation de tâche';
        break;
      case 'DELETE':
        message = 'Assignation de tâche supprimée';
        break;
    }
    
    if (message) {
      toast({
        title: "Assignation mise à jour",
        description: message,
      });
    }
    
    // Trigger data refresh
    onTasksUpdate();
  }, [toast, onTasksUpdate]);

  useEffect(() => {
    // Subscribe to tasks table changes
    const tasksChannel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        handleTaskChange
      )
      .subscribe();

    // Subscribe to task_conseillers table changes
    const assignmentsChannel = supabase
      .channel('task-assignments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_conseillers'
        },
        handleTaskAssignmentChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(assignmentsChannel);
    };
  }, [handleTaskChange, handleTaskAssignmentChange]);
};
