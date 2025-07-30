
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Target, 
  Users, 
  Clock, 
  Calendar,
  GripVertical,
  Plus,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  onTaskUpdate: (taskId: string, newCategory: 'URGENT' | 'IMPORTANT' | 'NORMAL') => void;
  onTaskClick: (task: Task) => void;
}

const DragDropTaskBoard = ({ tasks, onTaskUpdate, onTaskClick }: DragDropTaskBoardProps) => {
  const { toast } = useToast();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTaskAssignments();
  }, [tasks]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && draggedTask) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging && draggedTask && dragOverCategory) {
        handleDrop(draggedTask, dragOverCategory as 'URGENT' | 'IMPORTANT' | 'NORMAL');
      }
      setIsDragging(false);
      setDraggedTask(null);
      setDragOverCategory(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, draggedTask, dragOverCategory, onTaskUpdate]);

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

  const handleDragStart = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setDraggedTask(task);
    setIsDragging(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragOver = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    if (isDragging) {
      setDragOverCategory(category);
    }
  };

  const handleDragLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging) {
      setDragOverCategory(null);
    }
  };

  const handleDrop = (task: Task, targetCategory: 'URGENT' | 'IMPORTANT' | 'NORMAL') => {
    if (task.category === targetCategory) {
      return;
    }

    onTaskUpdate(task.id, targetCategory);
  };

  const handleTaskClick = (e: React.MouseEvent, task: Task) => {
    if (!isDragging) {
      onTaskClick(task);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Aucune date';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'URGENT':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          ringColor: 'ring-red-400',
          titleColor: 'text-red-700'
        };
      case 'IMPORTANT':
        return {
          icon: Target,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          ringColor: 'ring-orange-400',
          titleColor: 'text-orange-700'
        };
      case 'NORMAL':
        return {
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          ringColor: 'ring-blue-400',
          titleColor: 'text-blue-700'
        };
      default:
        return {
          icon: Users,
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          ringColor: 'ring-slate-400',
          titleColor: 'text-slate-700'
        };
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const assignedCount = taskAssignments[task.id] || 0;
    const config = getCategoryConfig(task.category);
    const IconComponent = config.icon;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onMouseDown={(e) => handleDragStart(e, task)}
              onClick={(e) => handleTaskClick(e, task)}
              className={cn(
                "group relative p-4 border rounded-lg transition-all duration-200 bg-white select-none",
                "hover:shadow-md hover:scale-[1.02] cursor-pointer",
                draggedTask?.id === task.id 
                  ? "opacity-60 scale-95 rotate-1 cursor-grabbing shadow-lg z-50" 
                  : "opacity-100 scale-100",
                "border-l-4",
                task.category === 'URGENT' ? 'border-l-red-500' : 
                task.category === 'IMPORTANT' ? 'border-l-orange-500' : 'border-l-blue-500'
              )}
            >
              {/* Prominent Drag Handle */}
              <div 
                className="absolute top-2 right-2 opacity-60 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1.5 rounded-md hover:bg-slate-100 bg-slate-50 border border-slate-200"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleDragStart(e, task);
                }}
                title="Glisser pour déplacer"
              >
                <GripVertical className="h-4 w-4 text-slate-500" />
              </div>

              {/* Task Title */}
              <h4 className="font-medium text-sm mb-2 pr-12 line-clamp-2">{task.title}</h4>
              
              {/* Task Description */}
              {task.description && (
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Task Meta */}
              <div className="space-y-2">
                {/* Status and Assignment */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={task.category === 'URGENT' ? 'destructive' : 
                            task.category === 'IMPORTANT' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.status}
                  </Badge>
                  {assignedCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Users className="h-3 w-3" />
                      <span>{assignedCount}</span>
                    </div>
                  )}
                </div>

                {/* Due Date */}
                {task.due_date && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.due_date)}</span>
                  </div>
                )}

                {/* Created Date */}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>Créé le {formatDate(task.created_at)}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">{task.title}</p>
              {task.description && <p className="text-xs">{task.description}</p>}
              <p className="text-xs text-slate-500">
                Assigné à {assignedCount} conseiller{assignedCount > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-slate-400">Cliquez pour voir les détails</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const CategoryColumn = ({ 
    category, 
    tasks, 
    title, 
    icon: Icon 
  }: { 
    category: 'URGENT' | 'IMPORTANT' | 'NORMAL';
    tasks: Task[];
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const config = getCategoryConfig(category);
    
    return (
      <Card 
        className={cn(
          "bg-white border border-slate-200 shadow-sm transition-all duration-200 h-full",
          dragOverCategory === category && "ring-2 ring-offset-2 scale-[1.02]",
          dragOverCategory === category && config.ringColor
        )}
        onMouseOver={(e) => handleDragOver(e, category)}
        onMouseLeave={handleDragLeave}
      >
        <CardHeader className={cn("border-b", config.bgColor, config.borderColor)}>
          <CardTitle className={cn("flex items-center justify-between", config.titleColor)}>
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {title}
            </div>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasks.length === 0 && (
                <div className={cn(
                  "flex flex-col items-center justify-center h-32 text-slate-400 text-sm border-2 border-dashed rounded-lg p-6",
                  config.borderColor
                )}>
                  <Icon className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-center">
                    Glissez ici les tâches {title.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  // Dragged task overlay
  const DraggedTaskOverlay = () => {
    if (!isDragging || !draggedTask) return null;

    return (
      <div
        ref={dragRef}
        className="fixed pointer-events-none z-[9999] opacity-80"
        style={{
          left: mousePosition.x - dragOffset.x,
          top: mousePosition.y - dragOffset.y,
          transform: 'rotate(5deg) scale(0.95)',
        }}
      >
        <TaskCard task={draggedTask} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tableau Kanban</h2>
          <p className="text-slate-600">Organisez vos tâches par priorité</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Urgent</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Important</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Normal</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategoryColumn 
          category="URGENT" 
          tasks={urgentTasks} 
          title="Urgent" 
          icon={AlertTriangle} 
        />
        <CategoryColumn 
          category="IMPORTANT" 
          tasks={importantTasks} 
          title="Important" 
          icon={Target} 
        />
        <CategoryColumn 
          category="NORMAL" 
          tasks={normalTasks} 
          title="Normal" 
          icon={Users} 
        />
      </div>

      {/* Dragged Task Overlay */}
      <DraggedTaskOverlay />

      {/* Instructions */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <GripVertical className="h-4 w-4" />
            <span>Utilisez l'icône de poignée pour glisser-déposer les tâches entre les colonnes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DragDropTaskBoard;
