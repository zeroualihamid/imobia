
-- Créer les énumérations pour les tâches
CREATE TYPE public.task_category AS ENUM ('URGENT', 'IMPORTANT', 'NORMAL', 'AUTO_GOAL');
CREATE TYPE public.task_status AS ENUM ('EN_FILE', 'ASSIGNEE', 'EN_COURS', 'TERMINEE', 'EN_RETARD', 'REAFFECTEE');

-- Créer la table des tâches
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category task_category NOT NULL DEFAULT 'NORMAL',
  status task_status NOT NULL DEFAULT 'EN_FILE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  sla_hours INTEGER DEFAULT 24,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner_id UUID REFERENCES auth.users,
  previous_owner_id UUID REFERENCES auth.users,
  auto_goal BOOLEAN DEFAULT false,
  score INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des performances hebdomadaires
CREATE TABLE public.weekly_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  week_start DATE NOT NULL,
  score_prospection INTEGER DEFAULT 0,
  score_visites INTEGER DEFAULT 0,
  score_contrats INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Activer RLS sur les tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_performance ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les tâches (tous les utilisateurs authentifiés peuvent voir toutes les tâches)
CREATE POLICY "Users can view all tasks" 
  ON public.tasks 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tasks" 
  ON public.tasks 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update tasks" 
  ON public.tasks 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Politiques RLS pour les performances hebdomadaires
CREATE POLICY "Users can view all weekly performance" 
  ON public.weekly_performance 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create weekly performance" 
  ON public.weekly_performance 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update weekly performance" 
  ON public.weekly_performance 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Créer des index pour optimiser les requêtes
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_category ON public.tasks(category);
CREATE INDEX idx_tasks_owner_id ON public.tasks(owner_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_weekly_performance_user_week ON public.weekly_performance(user_id, week_start);
