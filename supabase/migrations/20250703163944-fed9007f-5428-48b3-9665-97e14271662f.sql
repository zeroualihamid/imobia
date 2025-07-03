
-- Enable real-time updates for the tasks table
ALTER TABLE public.tasks REPLICA IDENTITY FULL;

-- Add the tasks table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- Enable real-time updates for the task_conseillers table
ALTER TABLE public.task_conseillers REPLICA IDENTITY FULL;

-- Add the task_conseillers table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_conseillers;
