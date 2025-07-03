
-- Create a table for task types
CREATE TABLE public.task_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category task_category NOT NULL DEFAULT 'NORMAL',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the task_types table
ALTER TABLE public.task_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_types
CREATE POLICY "Users can view all task types" 
  ON public.task_types 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create task types" 
  ON public.task_types 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update task types" 
  ON public.task_types 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete task types" 
  ON public.task_types 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Insert the default task types
INSERT INTO public.task_types (name, category) VALUES
  ('Visite', 'IMPORTANT'),
  ('Recherche de bien', 'NORMAL'),
  ('Prospection', 'NORMAL'),
  ('Négociation', 'IMPORTANT'),
  ('Signature contrat', 'URGENT');
