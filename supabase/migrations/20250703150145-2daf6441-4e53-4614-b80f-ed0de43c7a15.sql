
-- Create a junction table for task-conseiller assignments
CREATE TABLE public.task_conseillers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  conseiller_id UUID NOT NULL REFERENCES public.conseillers(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(task_id, conseiller_id)
);

-- Enable RLS on the junction table
ALTER TABLE public.task_conseillers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_conseillers
CREATE POLICY "Users can view all task assignments" 
  ON public.task_conseillers 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create task assignments" 
  ON public.task_conseillers 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete task assignments" 
  ON public.task_conseillers 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX idx_task_conseillers_task_id ON public.task_conseillers(task_id);
CREATE INDEX idx_task_conseillers_conseiller_id ON public.task_conseillers(conseiller_id);
